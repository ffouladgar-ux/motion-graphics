// "Why the worse product keeps winning" — a 16:9 talk built from the creator's Shorts,
// in the same card style as the Remotion Shorts, with click-by-click builds.
// Words are taken from the Shorts' descriptions. Run: node build.js
const pptxgen = require("pptxgenjs");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const { animate } = require("./animate");

const OUT = "win-win.pptx";
const W = 13.333;
const H = 7.5;
const X = 0.75; // left margin

const COL = {
  ink: "16131F",
  paper: "FFFAF2",
  yellow: "FFC93C",
  green: "22C55E",
  red: "EF4444",
  white: "FFFFFF",
  muted: "6B6578",
};
// One gradient per section, same as the video kit.
const BG = {
  coral: ["FF7A59", "E8453C"],
  blue: ["4F6BFF", "2B3FD6"],
  purple: ["8B5CF6", "C026D3"],
  amber: ["FFB648", "FF8A3D"],
  green: ["1FAE6B", "0F7A63"],
  teal: ["3A6DF0", "1FA5A0"],
};
const HEAD = "Arial";
const MONO = "Consolas";

async function backgrounds() {
  fs.mkdirSync("assets", { recursive: true });
  for (const [name, [a, b]] of Object.entries(BG)) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#${a}"/><stop offset="1" stop-color="#${b}"/></linearGradient>
        <radialGradient id="r" cx="0.28" cy="0.2" r="0.6"><stop offset="0" stop-color="#fff" stop-opacity="0.24"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
      </defs>
      <rect width="1920" height="1080" fill="url(#g)"/><rect width="1920" height="1080" fill="url(#r)"/>
    </svg>`;
    await sharp(Buffer.from(svg)).png().toFile(path.join("assets", `${name}.png`));
  }
}

// "Three *fixes.*" → runs with the starred word in the highlight colour.
const rich = (text, color, hi = COL.yellow, extra = {}) =>
  text
    .split("*")
    .filter((p) => p !== "")
    .map((p) => ({ text: p, options: { color: text.indexOf(`*${p}*`) >= 0 ? hi : color, ...extra } }));

const shadow = () => ({ type: "outer", blur: 14, offset: 5, angle: 90, color: "000000", opacity: 0.28 });

async function main() {
  await backgrounds();
  const pres = new pptxgen();
  pres.layout = "LAYOUT_WIDE";
  pres.title = "Why the worse product keeps winning";
  pres.theme = { headFontFace: HEAD, bodyFontFace: HEAD };

  // One layout per section colour; the headline is a real title placeholder.
  for (const name of Object.keys(BG)) {
    const dark = name === "amber"; // light background → dark headline
    pres.defineSlideMaster({
      title: name,
      background: { path: path.join("assets", `${name}.png`) },
      objects: [],
      placeholders: [],
    });
    pres.defineSlideMaster({
      title: `${name}-title`,
      background: { path: path.join("assets", `${name}.png`) },
      objects: [
        {
          placeholder: {
            options: {
              name: "title",
              type: "title",
              x: X,
              y: 1.15,
              w: W - 2 * X,
              h: 1.25,
              fontFace: HEAD,
              fontSize: 50,
              bold: true,
              color: dark ? COL.ink : COL.white,
              valign: "top",
              align: "left",
              margin: 0,
            },
            text: "",
          },
        },
      ],
    });
  }

  const plan = {};
  let slideNo = 0;
  const slide = (layout, notes) => {
    const s = pres.addSlide({ masterName: layout });
    slideNo += 1;
    const steps = (plan[slideNo] = []);
    s.addNotes(notes);
    const api = {
      s,
      anim: (name, click, fx, delay = 0, extra = {}) => steps.push({ name, click, fx, delay, ...extra }),
      title: (text, click = 0, fx = "pop") => {
        const dark = layout.startsWith("amber");
        s.addText(rich(text, dark ? COL.ink : COL.white, dark ? COL.white : COL.yellow), { placeholder: "title" });
        steps.push({ name: "@title", click, fx, delay: 0 });
      },
      tag: (name, text, y = 0.55, opts = {}) => {
        const w = 0.6 + text.length * 0.16;
        s.addText(text.toUpperCase(), {
          objectName: name,
          isTextBox: true,
          x: opts.x ?? X,
          y,
          w,
          h: 0.42,
          shape: pres.shapes.ROUNDED_RECTANGLE,
          rectRadius: 0.21,
          fill: { color: opts.bg ?? COL.ink },
          color: opts.color ?? COL.white,
          fontFace: MONO,
          fontSize: 13,
          charSpacing: 3,
          align: "center",
          valign: "middle",
          margin: 0,
        });
      },
      card: (name, runs, o) =>
        s.addText(runs, {
          objectName: name,
          isTextBox: true,
          shape: pres.shapes.ROUNDED_RECTANGLE,
          rectRadius: o.r ?? 0.3,
          fill: { color: o.fill ?? COL.paper },
          color: o.color ?? COL.ink,
          fontFace: HEAD,
          shadow: shadow(),
          valign: o.valign ?? "top",
          align: o.align ?? "left",
          margin: o.margin ?? [18, 22, 18, 22],
          ...o,
        }),
      big: (name, text, o) =>
        s.addText(text, {
          objectName: name,
          isTextBox: true,
          fontFace: HEAD,
          bold: true,
          color: COL.white,
          margin: 0,
          valign: "middle",
          ...o,
        }),
    };
    return api;
  };

  // 1 ── Title
  {
    const t = slide(
      "coral",
      "Most people never work out why the worse product keeps winning.\n" +
        "Click 1: It is not price.  Click 2: It is not quality.  Click 3: it's the transformation.\n" +
        "Click 4: People buy the transformation your product really gives them.",
    );
    t.tag("Tag", "Win-Win");
    t.big("Headline", rich("Why the *worse product* keeps winning", COL.white), {
      x: X,
      y: 1.25,
      w: 6.6,
      h: 3.2,
      fontSize: 58,
      valign: "top",
    });
    t.anim("Tag", 0, "pop");
    t.anim("Headline", 0, "pop", 150);
    const cards = [
      { n: "Price", label: "Price", note: "It is not price.", rot: -6, x: 7.75, y: 1.0, c: 1 },
      { n: "Quality", label: "Quality", note: "It is not quality.", rot: 4, x: 9.55, y: 1.55, c: 2 },
    ];
    for (const c of cards) {
      t.card(
        c.n,
        [
          { text: c.label, options: { fontSize: 34, bold: true, breakLine: true } },
          { text: c.note, options: { fontSize: 16, color: COL.muted } },
        ],
        { x: c.x, y: c.y, w: 3.0, h: 1.9, rotate: c.rot },
      );
      t.s.addText("✕", {
        objectName: `${c.n} X`,
        isTextBox: true,
        shape: pres.shapes.OVAL,
        x: c.x + 2.35,
        y: c.y - 0.25,
        w: 0.75,
        h: 0.75,
        fill: { color: COL.red },
        color: COL.white,
        fontSize: 24,
        bold: true,
        align: "center",
        valign: "middle",
        margin: 0,
      });
      t.anim(c.n, c.c, "pop");
      t.anim(`${c.n} X`, c.c, "pop", 300);
    }
    t.card(
      "Transformation",
      [
        { text: "The transformation", options: { fontSize: 36, bold: true, breakLine: true } },
        { text: "your product really gives them", options: { fontSize: 18 } },
      ],
      { x: 7.9, y: 4.0, w: 4.7, h: 1.75, fill: COL.yellow, rotate: -2, valign: "middle" },
    );
    t.anim("Transformation", 3, "pop");
    t.anim("Transformation", 3, "pulse", 650);
    t.big("Sub", "People buy the transformation your product really gives them.", {
      x: X,
      y: 4.85,
      w: 6.4,
      h: 1.2,
      fontSize: 24,
      bold: false,
      valign: "top",
    });
    t.anim("Sub", 4, "pop");
  }

  // 2 ── The 157 dollar customer
  {
    const t = slide("coral", "157 dollars to get one customer.\nClick 1: $157.  Click 2: to get one customer.");
    t.tag("Tag", "The 157 dollar customer", 1.0);
    t.big("Number", "$157", { x: X - 0.1, y: 1.65, w: 9, h: 3.4, fontSize: 250, charSpacing: -6 });
    t.big("Line", rich("to get *one* customer.", COL.white), { x: X, y: 5.15, w: 10, h: 1.0, fontSize: 48 });
    t.anim("Tag", 0, "pop");
    t.anim("Number", 1, "pop", 0, { dur: 650 });
    t.anim("Line", 2, "pop");
    t.anim("Number", 2, "pulse", 450);
  }

  // 3 ── Three fixes
  {
    const t = slide(
      "blue-title",
      "Three fixes, three worse numbers.\nClick 1: New creative did not move it.  Click 2: A cheaper agency brought it to 120.\n" +
        "Click 3: More budget pushed it to 198.  Click 4: Same customer, more money.",
    );
    t.title("Three *fixes.*");
    const fixes = [
      ["FIX 1", "New creative", "did not move it", "$157"],
      ["FIX 2", "Cheaper agency", "brought it to", "$120"],
      ["FIX 3", "More budget", "pushed it to", "$198"],
    ];
    const cw = 3.65;
    const gap = (W - 2 * X - 3 * cw) / 2;
    fixes.forEach(([k, label, note, value], i) => {
      t.card(
        `Fix ${i + 1}`,
        [
          { text: k, options: { fontFace: MONO, fontSize: 13, color: COL.muted, charSpacing: 3, breakLine: true } },
          { text: label, options: { fontSize: 28, bold: true, breakLine: true } },
          { text: note, options: { fontSize: 16, color: COL.muted, breakLine: true } },
          { text: value, options: { fontSize: 66, bold: true } },
        ],
        { x: X + i * (cw + gap), y: 2.55, w: cw, h: 3.0, rotate: [-2, 1, -1][i] },
      );
      t.anim(`Fix ${i + 1}`, i + 1, "pop");
    });
    t.tag("Footer", "Same customer, more money", 6.15, { bg: COL.yellow, color: COL.ink });
    t.anim("Footer", 4, "pop");
    t.anim("Fix 3", 4, "pulse", 450);
  }

  // 4 ── The question
  {
    const t = slide(
      "purple-title",
      "Three fixes, three worse numbers, because the ads were never the problem.\n" +
        "Click 1: never.  Click 2: Nobody asked the only question that matters.  Click 3: what does the customer actually get.",
    );
    t.title("The ads were never the problem.");
    // underline under "never": "The ads were " is 4.59in wide at 50pt Arial bold
    t.s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      objectName: "Underline",
      x: X + 4.59,
      y: 1.95,
      w: 1.85,
      h: 0.12,
      rectRadius: 0.06,
      fill: { color: COL.yellow },
    });
    t.anim("Underline", 1, "wipe");
    t.tag("Tag", "The only question that matters", 2.75, { bg: COL.white, color: COL.ink });
    t.s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      objectName: "Question card",
      x: X,
      y: 3.35,
      w: 9.2,
      h: 2.75,
      rectRadius: 0.3,
      fill: { color: COL.ink },
      shadow: shadow(),
    });
    t.big("Question", "What does the customer actually get?", {
      x: X + 0.45,
      y: 3.95,
      w: 8.3,
      h: 1.9,
      fontSize: 50,
      valign: "top",
    });
    ["FF5F57", "FEBC2E", "28C840"].forEach((c, i) =>
      t.s.addShape(pres.shapes.OVAL, {
        objectName: `Dot ${i + 1}`,
        x: X + 0.4 + i * 0.32,
        y: 3.6,
        w: 0.2,
        h: 0.2,
        fill: { color: c },
      }),
    );
    t.anim("Tag", 2, "pop");
    t.anim("Question card", 3, "pop");
    [1, 2, 3].forEach((i) => t.anim(`Dot ${i}`, 3, "pop", 350 + i * 80));
    t.anim("Question", 3, "type", 650); // types on letter by letter once the card lands
  }

  // 5 ── One sentence
  {
    const t = slide(
      "amber-title",
      "So they changed one sentence.\nClicks 1–3: Same product. Same audience. Same budget.\nClick 4: only the sentence changed.",
    );
    t.title("So they changed *one sentence.*");
    ["Same product", "Same audience", "Same budget"].forEach((label, i) => {
      const y = 2.75 + i * 1.08;
      t.card(`Row ${i + 1}`, [{ text: label, options: { fontSize: 30, bold: true } }], {
        x: X,
        y,
        w: 6.4,
        h: 0.86,
        valign: "middle",
        margin: [92, 0, 0, 0],
        r: 0.2,
      });
      t.s.addText("✓", {
        objectName: `Tick ${i + 1}`,
        isTextBox: true,
        shape: pres.shapes.OVAL,
        x: X + 0.22,
        y: y + 0.15,
        w: 0.56,
        h: 0.56,
        fill: { color: COL.green },
        color: COL.white,
        fontSize: 22,
        bold: true,
        align: "center",
        valign: "middle",
        margin: 0,
      });
      t.anim(`Row ${i + 1}`, i + 1, "pop");
      t.anim(`Tick ${i + 1}`, i + 1, "pop", 350);
    });
    t.card(
      "One",
      [
        { text: "1", options: { fontSize: 150, bold: true, color: COL.yellow, breakLine: true } },
        { text: "sentence changed", options: { fontSize: 26, bold: true } },
      ],
      { x: 8.15, y: 2.6, w: 4.4, h: 3.5, fill: COL.ink, color: COL.white, align: "center", valign: "middle", rotate: 3 },
    );
    t.anim("One", 4, "pop", 0, { dur: 650 });
    t.anim("One", 4, "pulse", 750);
  }

  // 6 ── 42. 18. 3.58.
  {
    const t = slide(
      "green",
      "Same product. Same audience. Same budget.\nClick 1: 157.  Click 2: 42.  Click 3: 18.  Click 4: 3.58.  Click 5: from one sentence.\n" +
        "Note: the Short gives these numbers without a label; 'cost per customer' is inferred from the title (157 dollars to 3.58).",
    );
    t.tag("Tag", "Cost per customer", 0.9);
    t.anim("Tag", 0, "pop");
    const vals = ["$157", "$42", "$18", "$3.58"];
    vals.forEach((v, i) => {
      t.big(`Value ${i}`, v, { x: X - 0.1, y: 1.45, w: 9, h: 3.0, fontSize: 210, charSpacing: -5 });
      const cx = X + i * 1.75;
      t.s.addText(v, {
        objectName: `Chip ${i}`,
        isTextBox: true,
        shape: pres.shapes.ROUNDED_RECTANGLE,
        rectRadius: 0.18,
        x: cx,
        y: 4.75,
        w: 1.55,
        h: 0.7,
        fill: { color: i === vals.length - 1 ? COL.yellow : COL.white, transparency: i === vals.length - 1 ? 0 : 75 },
        color: i === vals.length - 1 ? COL.ink : COL.white,
        fontFace: HEAD,
        fontSize: 24,
        bold: true,
        align: "center",
        valign: "middle",
        margin: 0,
      });
      if (i < vals.length - 1) {
        t.s.addShape(pres.shapes.LINE, {
          objectName: `Strike ${i}`,
          x: cx + 0.2,
          y: 5.1,
          w: 1.15,
          h: 0,
          line: { color: COL.white, width: 3 },
        });
      }
      if (i === 0) {
        t.anim("Value 0", 1, "pop", 0, { dur: 650 });
        t.anim("Chip 0", 1, "pop", 300);
      } else {
        t.anim(`Value ${i - 1}`, i + 1, "exit");
        t.anim(`Value ${i}`, i + 1, "pop", 120);
        t.anim(`Strike ${i - 1}`, i + 1, "wipe", 0, { dur: 300 });
        t.anim(`Chip ${i}`, i + 1, "pop", 250);
      }
    });
    t.big("Footer", rich("From *one sentence.*", COL.white), { x: X, y: 5.85, w: 10, h: 0.9, fontSize: 44 });
    t.anim("Footer", 5, "pop");
    t.anim("Value 3", 5, "pulse", 450);
  }

  // 7 ── Three drills
  {
    const t = slide(
      "blue-title",
      "Picture a man in a hardware store staring at three drills.\nClicks 1–3: the drills.  Click 4: He is not reading the boxes.",
    );
    t.title("Picture a man staring at *three drills.*");
    const cw = 3.4;
    const gap = (W - 2 * X - 3 * cw) / 2;
    [0, 1, 2].forEach((i) => {
      t.card(
        `Drill ${i + 1}`,
        [
          { text: "?", options: { fontSize: 110, bold: true, color: COL.yellow, breakLine: true } },
          { text: `DRILL ${i + 1}`, options: { fontFace: MONO, fontSize: 14, charSpacing: 3, color: "BDB8C8" } },
        ],
        { x: X + i * (cw + gap), y: 2.65, w: cw, h: 3.2, fill: COL.ink, color: COL.white, align: "center", valign: "middle", rotate: [-3, 2, -1][i] },
      );
      t.anim(`Drill ${i + 1}`, i + 1, "pop");
    });
    t.tag("Footer", "He is not reading the boxes", 6.3, { bg: COL.yellow, color: COL.ink });
    t.anim("Footer", 4, "pop");
    [1, 2, 3].forEach((i) => t.anim(`Drill ${i}`, 4, "pulse", 300 + i * 120));
  }

  // 8 ── He is buying
  {
    const t = slide(
      "amber-title",
      "He is not buying the drill.\nClick 1: He is buying:  Clicks 2–4: his garage, the shelf finally level, and the job done.\nClick 5: The drill is just the tool.",
    );
    t.title("He is not buying *the drill.*");
    t.big("Buying", "He is buying:", { x: X, y: 2.45, w: 6, h: 0.6, fontSize: 26, color: COL.ink });
    t.anim("Buying", 1, "pop");
    ["His garage", "The shelf finally level", "The job done"].forEach((label, i) => {
      const y = 3.2 + i * 1.02;
      t.card(`Row ${i + 1}`, [{ text: label, options: { fontSize: 28, bold: true } }], {
        x: X,
        y,
        w: 6.6,
        h: 0.82,
        valign: "middle",
        margin: [92, 0, 0, 0],
        r: 0.2,
      });
      t.s.addText("✓", {
        objectName: `Tick ${i + 1}`,
        isTextBox: true,
        shape: pres.shapes.OVAL,
        x: X + 0.22,
        y: y + 0.14,
        w: 0.54,
        h: 0.54,
        fill: { color: COL.green },
        color: COL.white,
        fontSize: 22,
        bold: true,
        align: "center",
        valign: "middle",
        margin: 0,
      });
      t.anim(`Row ${i + 1}`, i + 2, "pop");
      t.anim(`Tick ${i + 1}`, i + 2, "pop", 350);
    });
    t.card(
      "Tool",
      [
        { text: "The drill is just", options: { fontSize: 30, bold: true, breakLine: true } },
        { text: "the tool.", options: { fontSize: 54, bold: true, color: COL.yellow } },
      ],
      { x: 8.2, y: 3.0, w: 4.35, h: 2.6, fill: COL.ink, color: COL.white, valign: "middle", rotate: 3, margin: [24, 32, 24, 32] },
    );
    t.anim("Tool", 5, "pop", 0, { dur: 650 });
    t.anim("Tool", 5, "pulse", 750);
  }

  // 9 ── The taxi
  {
    const t = slide(
      "purple-title",
      "Nobody buys a ride in the taxi.\nClick 1: They are buying a ride home.\n" +
        "Click 2: Nobody buys your service for the service.  Click 3: They are buying the identity you hand them.",
    );
    t.title("Nobody buys a ride *in the taxi.*");
    t.card(
      "Home",
      [
        { text: "THEY ARE BUYING", options: { fontFace: MONO, fontSize: 14, charSpacing: 3, color: COL.muted, breakLine: true } },
        { text: "a ride home.", options: { fontSize: 52, bold: true } },
      ],
      { x: X, y: 2.75, w: 5.5, h: 2.6, valign: "middle", rotate: -2, margin: [24, 34, 24, 34] },
    );
    t.anim("Home", 1, "pop");
    t.card(
      "Identity",
      [
        { text: "They are buying the ", options: { fontSize: 36, bold: true } },
        { text: "identity", options: { fontSize: 36, bold: true, color: COL.yellow } },
        { text: " you hand them.", options: { fontSize: 36, bold: true } },
      ],
      { x: 6.75, y: 3.75, w: 5.85, h: 2.3, fill: COL.ink, color: COL.white, valign: "middle", rotate: 2, margin: [24, 34, 24, 34] },
    );
    t.big(
      "Service",
      [
        { text: "Nobody buys your service", options: { breakLine: true } },
        { text: "for the service.", options: {} },
      ],
      { x: 6.75, y: 2.45, w: 5.85, h: 0.95, fontSize: 24, valign: "top" },
    );
    t.anim("Service", 2, "pop");
    t.anim("Identity", 3, "pop");
    t.anim("Identity", 3, "pulse", 650);
  }

  // 10 ── The two second pause
  {
    const t = slide(
      "coral-title",
      "There is a two second pause that costs business owners more money than any competitor.\n" +
        "Click 1: They go quiet.  Click 2: And you fill the silence with a discount.  Click 3: not that.\n" +
        "Click 4: Fill the pause with the transformation and the discount never comes up.",
    );
    t.title("Someone asks *your price.*");
    t.card(
      "Pause",
      [
        { text: "2s", options: { fontSize: 120, bold: true, color: COL.yellow, breakLine: true } },
        { text: "They go quiet.", options: { fontSize: 26, bold: true } },
      ],
      { x: X, y: 2.6, w: 3.6, h: 3.4, fill: COL.ink, color: COL.white, align: "center", valign: "middle", rotate: -3 },
    );
    t.anim("Pause", 1, "pop");
    t.card(
      "Discount",
      [
        { text: "WHAT MOST PEOPLE DO", options: { fontFace: MONO, fontSize: 13, charSpacing: 2, color: COL.muted, breakLine: true } },
        { text: "Fill the silence with a ", options: { fontSize: 30, bold: true } },
        { text: "discount.", options: { fontSize: 30, bold: true, color: COL.red } },
      ],
      { x: 4.85, y: 2.6, w: 7.75, h: 1.55, valign: "middle", r: 0.25 },
    );
    t.anim("Discount", 2, "pop");
    t.s.addText("✕", {
      objectName: "Discount X",
      isTextBox: true,
      shape: pres.shapes.OVAL,
      x: 12.05,
      y: 2.35,
      w: 0.75,
      h: 0.75,
      fill: { color: COL.red },
      color: COL.white,
      fontSize: 24,
      bold: true,
      align: "center",
      valign: "middle",
      margin: 0,
    });
    t.anim("Discount X", 3, "pop");
    t.card(
      "Instead",
      [
        { text: "INSTEAD", options: { fontFace: MONO, fontSize: 13, charSpacing: 2, color: COL.ink, breakLine: true } },
        { text: "Fill the pause with the transformation and the discount never comes up.", options: { fontSize: 28, bold: true } },
      ],
      { x: 4.85, y: 4.4, w: 7.75, h: 1.75, fill: COL.yellow, valign: "middle", r: 0.25 },
    );
    t.anim("Instead", 4, "pop");
    t.anim("Instead", 4, "pulse", 650);
  }

  // 11 ── Close
  {
    const t = slide(
      "teal-title",
      "People buy the transformation your product really gives them.\n" +
        "Click 1: then make it show.  Clicks 2–4: every page, every price and every word.\nClick 5: WIN-WIN.",
    );
    t.title("Name the transformation *they are buying.*");
    t.big("Then", "Then make it show in", { x: X, y: 3.05, w: 8, h: 0.6, fontSize: 26 });
    t.anim("Then", 1, "pop");
    ["every page", "every price", "every word"].forEach((label, i) => {
      t.card(`Every ${i + 1}`, [{ text: label, options: { fontSize: 32, bold: true } }], {
        x: X + i * 3.55,
        y: 3.8,
        w: 3.25,
        h: 1.1,
        align: "center",
        valign: "middle",
        rotate: [-2, 1, -1][i],
        r: 0.25,
      });
      t.anim(`Every ${i + 1}`, i + 2, "pop");
    });
    t.card("Badge", [{ text: "WIN-WIN", options: { fontSize: 66, bold: true } }], {
      x: X,
      y: 5.4,
      w: 5.6,
      h: 1.45,
      fill: COL.yellow,
      align: "center",
      valign: "middle",
      rotate: -3,
      r: 0.35,
    });
    t.anim("Badge", 5, "pop", 0, { dur: 650 });
    t.anim("Badge", 5, "pulse", 750);
  }

  await pres.writeFile({ fileName: OUT });
  await animate(OUT, plan);
  console.log(`${OUT}: ${slideNo} slides, ${Object.values(plan).reduce((n, s) => n + new Set(s.filter((x) => x.click > 0).map((x) => x.click)).size, 0)} clicks`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
