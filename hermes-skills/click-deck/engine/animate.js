// Adds native PowerPoint click-by-click animations to a pptxgenjs deck.
// pptxgenjs can't write animations, so after the deck is written we open it,
// find each shape by name, and insert <p:transition> + <p:timing> into its slide.
//
// A step is { name, click, fx, delay, dur }:
//   click 0 = plays by itself when the slide appears; 1, 2, 3… = on each click.
//   fx: pop | rise | fade | wipe | type | exit
//   delay (ms) staggers effects that share a click.
const JSZip = require("jszip");
const fs = require("fs");

const esc = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;");

function behaviors(fx, spid, dur, next) {
  const tgt = `<p:tgtEl><p:spTgt spid="${spid}"/></p:tgtEl>`;
  const show = `<p:set><p:cBhvr><p:cTn id="${next()}" dur="1" fill="hold"><p:stCondLst><p:cond delay="0"/></p:stCondLst></p:cTn>${tgt}<p:attrNameLst><p:attrName>style.visibility</p:attrName></p:attrNameLst></p:cBhvr><p:to><p:strVal val="visible"/></p:to></p:set>`;
  const fade = (d, dir = "in") =>
    `<p:animEffect transition="${dir}" filter="fade"><p:cBhvr><p:cTn id="${next()}" dur="${d}"/>${tgt}</p:cBhvr></p:animEffect>`;
  const anim = (attr, vals, d) =>
    `<p:anim calcmode="lin" valueType="num"><p:cBhvr><p:cTn id="${next()}" dur="${d}" fill="hold"/>${tgt}<p:attrNameLst><p:attrName>${attr}</p:attrName></p:attrNameLst></p:cBhvr><p:tavLst>${vals
      .map(([tm, v]) => `<p:tav tm="${tm}"><p:val><p:strVal val="${v}"/></p:val></p:tav>`)
      .join("")}</p:tavLst></p:anim>`;
  switch (fx) {
    case "pop": { // zoom in, overshoot, settle back: the "spring" of the video style
      const spring = (a) => [[0, "0"], [60000, `#${a}*1.14`], [82000, `#${a}*0.97`], [100000, `#${a}`]];
      return show + anim("ppt_w", spring("ppt_w"), dur) + anim("ppt_h", spring("ppt_h"), dur) + fade(Math.round(dur * 0.4));
    }
    case "pulse": // quick grow-and-back on something already on screen
      return `<p:animScale><p:cBhvr><p:cTn id="${next()}" dur="${dur}" autoRev="1" fill="hold"/>${tgt}</p:cBhvr><p:by x="112000" y="112000"/></p:animScale>`;
    case "rise":
      return (
        show +
        anim("ppt_x", [[0, "#ppt_x"], [100000, "#ppt_x"]], dur) +
        anim("ppt_y", [[0, "#ppt_y+0.08"], [80000, "#ppt_y-0.006"], [100000, "#ppt_y"]], dur) +
        fade(dur)
      );
    case "fade":
    case "type":
      return show + fade(dur);
    case "wipe":
      return (
        show +
        `<p:animEffect transition="in" filter="wipe(left)"><p:cBhvr><p:cTn id="${next()}" dur="${dur}"/>${tgt}</p:cBhvr></p:animEffect>`
      );
    case "exit":
      return (
        fade(dur, "out") +
        `<p:set><p:cBhvr><p:cTn id="${next()}" dur="1" fill="hold"><p:stCondLst><p:cond delay="${dur - 1}"/></p:stCondLst></p:cTn>${tgt}<p:attrNameLst><p:attrName>style.visibility</p:attrName></p:attrNameLst></p:cBhvr><p:to><p:strVal val="hidden"/></p:to></p:set>`
      );
    default:
      throw new Error(`unknown fx ${fx}`);
  }
}

// PowerPoint preset ids, so the Animation Pane shows a sensible effect name.
const PRESET = {
  pop: ["entr", 53, 16],
  rise: ["entr", 42, 0],
  fade: ["entr", 10, 0],
  type: ["entr", 10, 0],
  wipe: ["entr", 22, 8],
  exit: ["exit", 10, 0],
  pulse: ["emph", 6, 0],
};
const DUR = { pulse: 180, pop: 550, rise: 500, fade: 400, type: 40, wipe: 500, exit: 250 };

function timingXml(steps, idOf) {
  let n = 2;
  const next = () => ++n;
  const clicks = [...new Set(steps.map((s) => s.click))].sort((a, b) => a - b);
  const groups = clicks.map((click) => {
    const effects = steps
      .filter((s) => s.click === click)
      .map((s, i) => {
        const spid = idOf(s.name);
        const [cls, preset, sub] = PRESET[s.fx];
        const dur = s.dur ?? DUR[s.fx];
        const node = i === 0 ? (click === 0 ? "afterEffect" : "clickEffect") : "withEffect";
        const grp = s.fx === "exit" ? 1 : 0;
        const id = next();
        // Type-on: the same fade, run letter by letter.
        const iterate = s.fx === "type" ? `<p:iterate type="lt"><p:tmAbs val="${s.perLetter ?? 45}"/></p:iterate>` : "";
        return `<p:par><p:cTn id="${id}" presetID="${preset}" presetClass="${cls}" presetSubtype="${sub}" fill="hold" grpId="${grp}" nodeType="${node}"><p:stCondLst><p:cond delay="${s.delay ?? 0}"/></p:stCondLst>${iterate}<p:childTnLst>${behaviors(s.fx, spid, dur, next)}</p:childTnLst></p:cTn></p:par>`;
      });
    const outerCond =
      click === 0
        ? `<p:cond delay="indefinite"/><p:cond evt="onBegin" delay="0"><p:tn val="2"/></p:cond>`
        : `<p:cond delay="indefinite"/>`;
    return `<p:par><p:cTn id="${next()}" fill="hold"><p:stCondLst>${outerCond}</p:stCondLst><p:childTnLst><p:par><p:cTn id="${next()}" fill="hold"><p:stCondLst><p:cond delay="0"/></p:stCondLst><p:childTnLst>${effects.join("")}</p:childTnLst></p:cTn></p:par></p:childTnLst></p:cTn></p:par>`;
  });
  const bld = [...new Map(steps.map((s) => [`${idOf(s.name)}-${s.fx === "exit" ? 1 : 0}`, s])).values()]
    .filter((s) => s.fx !== "pulse" && idOf.isSp(s.name))
    .map((s) => `<p:bldP spid="${idOf(s.name)}" grpId="${s.fx === "exit" ? 1 : 0}" animBg="1"/>`)
    .join("");
  return (
    `<p:timing><p:tnLst><p:par><p:cTn id="1" dur="indefinite" restart="never" nodeType="tmRoot"><p:childTnLst>` +
    `<p:seq concurrent="1" nextAc="seek"><p:cTn id="2" dur="indefinite" nodeType="mainSeq"><p:childTnLst>${groups.join("")}</p:childTnLst></p:cTn>` +
    `<p:prevCondLst><p:cond evt="onPrev" delay="0"><p:tgtEl><p:sldTgt/></p:tgtEl></p:cond></p:prevCondLst>` +
    `<p:nextCondLst><p:cond evt="onNext" delay="0"><p:tgtEl><p:sldTgt/></p:tgtEl></p:cond></p:nextCondLst></p:seq>` +
    `</p:childTnLst></p:cTn></p:par></p:tnLst>${bld ? `<p:bldLst>${bld}</p:bldLst>` : ""}</p:timing>`
  );
}

async function animate(file, plan, transition = `<p:transition spd="med"><p:push dir="u"/></p:transition>`) {
  const zip = await JSZip.loadAsync(fs.readFileSync(file));
  for (const [slideNo, steps] of Object.entries(plan)) {
    const path = `ppt/slides/slide${slideNo}.xml`;
    let xml = await zip.file(path).async("string");
    // name → shape id, and whether it is a <p:sp> (only those get build entries)
    const ids = new Map();
    const sp = new Set();
    for (const m of xml.matchAll(/<p:(sp|pic|cxnSp)>\s*<p:nv\w+Pr>\s*<p:cNvPr id="(\d+)" name="([^"]*)"/g)) {
      ids.set(m[3], m[2]);
      if (m[1] === "sp") sp.add(m[3]);
    }
    // The title placeholder is addressed as "@title" (pptxgenjs gives it a generic name).
    const ph = xml.match(/<p:nvSpPr><p:cNvPr id="(\d+)"(?:(?!<\/p:nvSpPr>)[\s\S])*<p:ph[^>]*type="title"/);
    if (ph) {
      ids.set("@title", ph[1]);
      sp.add("@title");
    }
    const idOf = (name) => {
      const key = esc(name);
      if (!ids.has(key)) throw new Error(`slide ${slideNo}: no shape named "${name}"`);
      return ids.get(key);
    };
    idOf.isSp = (name) => sp.has(esc(name));
    const add = transition + (steps.length ? timingXml(steps, idOf) : "");
    xml = xml.includes("<p:extLst>") && xml.lastIndexOf("<p:extLst>") > xml.lastIndexOf("</p:cSld>")
      ? xml.replace(/(<p:extLst>(?:(?!<p:extLst>)[\s\S])*<\/p:sld>)$/, `${add}$1`)
      : xml.replace("</p:sld>", `${add}</p:sld>`);
    zip.file(path, xml);
  }
  fs.writeFileSync(file, await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" }));
}

module.exports = { animate };
