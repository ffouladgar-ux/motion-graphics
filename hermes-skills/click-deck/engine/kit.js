// click-deck kit: 16:9 PowerPoint decks in the bold card style, where every point
// builds on the presenter's click. A deck file calls slide types in order:
//
//   const { Deck } = require("./engine/kit");
//   const deck = new Deck({ title: "My talk", out: "my-talk.pptx" });
//   deck.stat({ bg: "coral", tag: "The 157 dollar customer", value: "$157", line: "to get *one* customer." });
//   await deck.build();
//
// Each slide's tag and title play as the slide arrives; every other element gets
// its own click, in reading order. Speaker notes list what each click reveals.
// Text with *stars* highlights the starred words.
const pptxgen = require("pptxgenjs");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const { animate } = require("./animate");
const METRICS = require("./metrics.json");

const W = 13.333;
const H = 7.5;
const X = 0.75; // side margin
const CONTENT_W = W - 2 * X;
const TITLE_PT = 50;
const TITLE_Y = 1.15;

const COL = {
  ink: "16131F",
  paper: "FFFAF2",
  yellow: "FFC93C",
  green: "22C55E",
  red: "EF4444",
  white: "FFFFFF",
  muted: "6B6578",
  faint: "BDB8C8",
};
const BG = {
  coral: ["FF7A59", "E8453C"],
  blue: ["4F6BFF", "2B3FD6"],
  purple: ["8B5CF6", "C026D3"],
  amber: ["FFB648", "FF8A3D"],
  green: ["1FAE6B", "0F7A63"],
  teal: ["3A6DF0", "1FA5A0"],
};
const LIGHT = new Set(["amber"]); // backgrounds that take a dark headline
const HEAD = "Arial";
const MONO = "Consolas";

// ── text measuring (Arial metrics), used for underlines, tag widths and fit warnings
const plain = (t) => t.replace(/\*/g, "");
function textWidth(text, pt, kind = "bold") {
  const table = METRICS[kind];
  const avg = table.n;
  let em = 0;
  for (const ch of plain(text)) em += table[ch] ?? avg;
  return (em * pt) / 72; // inches
}
function lineCount(text, pt, width, kind = "bold") {
  let lines = 1;
  let cur = 0;
  const space = textWidth(" ", pt, kind);
  for (const word of plain(text).split(/\s+/)) {
    const w = textWidth(word, pt, kind);
    if (cur > 0 && cur + space + w > width) {
      lines += 1;
      cur = w;
    } else cur += (cur > 0 ? space : 0) + w;
  }
  return lines;
}

// Text that would wrap to two lines, split at the word that balances them
// (no single word left alone on the second line).
function balanced(text, pt, width, kind = "bold") {
  if (lineCount(text, pt, width, kind) !== 2) return text;
  const words = text.split(" ");
  let best = null;
  for (let i = 1; i < words.length; i++) {
    const a = words.slice(0, i).join(" ");
    const b = words.slice(i).join(" ");
    if (textWidth(a, pt, kind) > width || textWidth(b, pt, kind) > width) continue;
    const diff = Math.abs(textWidth(a, pt, kind) - textWidth(b, pt, kind));
    if (!best || diff < best.diff) best = { a, b, diff };
  }
  return best ? `${best.a}\n${best.b}` : text;
}

// "Three *fixes.*" → runs with the starred words in the highlight colour
const rich = (text, color, hi = COL.yellow, extra = {}) => {
  const runs = [];
  text.split("*").forEach((part, i) => {
    if (part) runs.push({ text: part, options: { color: i % 2 ? hi : color, ...extra } });
  });
  return runs;
};
const shadow = () => ({ type: "outer", blur: 14, offset: 5, angle: 90, color: "000000", opacity: 0.28 });

// Pixel size of a PNG or JPEG, read from its header (no dependencies, synchronous).
function imageSize(file) {
  const b = fs.readFileSync(file);
  if (b.readUInt32BE(0) === 0x89504e47) return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
  if (b[0] === 0xff && b[1] === 0xd8) {
    let i = 2;
    while (i < b.length) {
      const marker = b[i + 1];
      const len = b.readUInt16BE(i + 2);
      if ([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf].includes(marker))
        return { h: b.readUInt16BE(i + 5), w: b.readUInt16BE(i + 7) };
      i += 2 + len;
    }
  }
  throw new Error(`${file}: only PNG and JPEG images are supported`);
}
// Largest box with the image's proportions that fits inside (x, y, w, h), centred.
function contain(file, x, y, w, h) {
  const { w: iw, h: ih } = imageSize(file);
  const s = Math.min(w / iw, h / ih);
  const cw = iw * s;
  const ch = ih * s;
  return { x: x + (w - cw) / 2, y: y + (h - ch) / 2, w: cw, h: ch };
}
// Light tint of a hex colour, for highlight backgrounds.
const tint = (hex, k = 0.75) =>
  [0, 2, 4]
    .map((i) => Math.round(parseInt(hex.slice(i, i + 2), 16) + (255 - parseInt(hex.slice(i, i + 2), 16)) * k).toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();

class Deck {
  constructor({ title = "Presentation", out = "deck.pptx", author } = {}) {
    this.out = out;
    this.pres = new pptxgen();
    this.pres.layout = "LAYOUT_WIDE";
    this.pres.title = title;
    if (author) this.pres.author = author;
    this.pres.theme = { headFontFace: HEAD, bodyFontFace: HEAD };
    this.plan = {};
    this.warnings = [];
    this.n = 0;
    this.layoutsReady = false;
    this.assets = path.join(path.dirname(path.resolve(out)), ".deck-assets");
  }

  async layouts() {
    fs.mkdirSync(this.assets, { recursive: true });
    for (const [name, [a, b]] of Object.entries(BG)) {
      const file = path.join(this.assets, `${name}.png`);
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080"><defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#${a}"/><stop offset="1" stop-color="#${b}"/></linearGradient>
        <radialGradient id="r" cx="0.28" cy="0.2" r="0.6"><stop offset="0" stop-color="#fff" stop-opacity="0.24"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
        </defs><rect width="1920" height="1080" fill="url(#g)"/><rect width="1920" height="1080" fill="url(#r)"/></svg>`;
      await sharp(Buffer.from(svg)).png().toFile(file);
      this.pres.defineSlideMaster({ title: name, background: { path: file }, objects: [] });
      this.pres.defineSlideMaster({
        title: `${name}-title`,
        background: { path: file },
        objects: [
          {
            placeholder: {
              options: {
                name: "title",
                type: "title",
                x: X,
                y: TITLE_Y,
                w: CONTENT_W,
                h: 1.7,
                fontFace: HEAD,
                fontSize: TITLE_PT,
                bold: true,
                color: LIGHT.has(name) ? COL.ink : COL.white,
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
  }

  // Queue slides now, build them in build() (layouts need an async step first).
  queue(fn) {
    (this.q ??= []).push(fn);
    return this;
  }

  _slide(bg, { title, notes = "" } = {}) {
    if (!BG[bg]) throw new Error(`unknown bg "${bg}" (use ${Object.keys(BG).join(", ")})`);
    const pres = this.pres;
    const s = pres.addSlide({ masterName: title ? `${bg}-title` : bg });
    const no = ++this.n;
    const steps = (this.plan[no] = []);
    const said = [];
    const dark = LIGHT.has(bg);
    const ink = dark ? COL.ink : COL.white;
    const hi = dark ? COL.white : COL.yellow;
    let click = 0;
    let names = 0;
    const deck = this;

    const ctx = {
      s,
      bg,
      ink,
      hi,
      top: 1.15, // where content starts; moves down under a title
      // Start a new click; `say` goes into the speaker notes for that click.
      click(say) {
        click += 1;
        if (say) said.push(`Click ${click}: ${plain(say)}`);
        return click;
      },
      anim(name, fx = "pop", delay = 0, extra = {}) {
        steps.push({ name, click, fx, delay, ...extra });
      },
      name(prefix) {
        names += 1;
        return `${prefix} ${names}`;
      },
      warn(msg) {
        deck.warnings.push(`slide ${no}: ${msg}`);
      },
      fit(text, pt, w, h, kind = "bold", label = text) {
        const long = plain(text).split(/\s+/).find((word) => textWidth(word, pt, kind) > w);
        if (long) ctx.warn(`"${long}" is too wide for its box at ${pt}pt and will break mid-word; use a shorter word or fewer cards`);
        const lines = lineCount(text, pt, w, kind);
        if (lines * pt * 1.2 / 72 > h + 0.05) ctx.warn(`"${plain(label).slice(0, 40)}" needs ${lines} lines at ${pt}pt and may overflow; shorten it`);
        return lines;
      },
      tag(text, y, opts = {}) {
        const name = opts.name ?? ctx.name("Tag");
        const w = 0.6 + textWidth(text.toUpperCase(), 13, "mono") + text.length * 0.04;
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
        return name;
      },
      title(text) {
        const lines = ctx.fit(text, TITLE_PT, CONTENT_W, 1.7);
        s.addText(rich(text, ink, hi), { placeholder: "title" });
        steps.push({ name: "@title", click: 0, fx: "pop", delay: 0 });
        ctx.top = TITLE_Y + lines * 0.72 + 0.5;
        return lines;
      },
      text(runsOrText, o) {
        const name = o.name ?? ctx.name("Text");
        const runs = typeof runsOrText === "string" ? rich(runsOrText, o.color ?? ink, o.hi ?? hi) : runsOrText;
        const { name: _n, hi: _h, ...opts } = o;
        s.addText(runs, { objectName: name, isTextBox: true, fontFace: HEAD, bold: true, color: ink, margin: 0, valign: "top", ...opts });
        return name;
      },
      card(runs, o) {
        const name = o.name ?? ctx.name("Card");
        const { r, fill, name: _n, ...rest } = o;
        s.addText(runs, {
          objectName: name,
          isTextBox: true,
          shape: pres.shapes.ROUNDED_RECTANGLE,
          rectRadius: r ?? 0.3,
          fill: { color: fill ?? COL.paper },
          color: COL.ink,
          fontFace: HEAD,
          shadow: shadow(),
          valign: "top",
          align: "left",
          margin: [18, 22, 18, 22], // pptxgenjs order: left, right, bottom, top
          ...rest,
        });
        return name;
      },
      image(file, x, y, w, h) {
        const name = ctx.name("Image");
        if (!fs.existsSync(file)) throw new Error(`slide ${no}: image not found: ${file}`);
        s.addImage({ path: file, objectName: name, ...contain(file, x, y, w, h) });
        return name;
      },
      badge(symbol, x, y, color, size = 0.75) {
        const name = ctx.name("Badge");
        s.addText(symbol, {
          objectName: name,
          isTextBox: true,
          shape: pres.shapes.OVAL,
          x,
          y,
          w: size,
          h: size,
          fill: { color },
          color: COL.white,
          fontSize: Math.round(size * 30),
          bold: true,
          align: "center",
          valign: "middle",
          margin: 0,
        });
        return name;
      },
      // A ticked row: card + green tick, both on the current click.
      tick(label, x, y, w, h = 0.86) {
        const pt = h > 0.84 ? 30 : 28;
        ctx.fit(label, pt, w - 1.3, h);
        const row = ctx.card([{ text: label, options: { fontSize: pt, bold: true } }], {
          x,
          y,
          w,
          h,
          valign: "middle",
          margin: [92, 0, 0, 0],
          r: 0.2,
        });
        const t = ctx.badge("✓", x + 0.22, y + (h - 0.56) / 2, COL.green, 0.56);
        ctx.anim(row, "pop");
        ctx.anim(t, "pop", 350);
      },
      done() {
        s.addNotes([notes, ...said].filter(Boolean).join("\n"));
      },
    };
    return ctx;
  }

  async build() {
    if (!this.layoutsReady) {
      await this.layouts();
      this.layoutsReady = true;
    }
    for (const fn of this.q ?? []) fn();
    await this.pres.writeFile({ fileName: this.out });
    await animate(this.out, this.plan);
    const clicks = Object.values(this.plan).reduce((n, s) => n + new Set(s.filter((x) => x.click > 0).map((x) => x.click)).size, 0);
    console.log(`${this.out}: ${this.n} slides, ${clicks} clicks`);
    for (const w of this.warnings) console.warn(`WARN ${w}`);
    return { slides: this.n, clicks, warnings: this.warnings };
  }
}

// ── slide types ──────────────────────────────────────────────────────────────
const TYPES = {
  /** Opening slide: tag + headline, cards that get crossed out, the real answer, a subline. */
  cover(o) {
    const t = this._slide(o.bg ?? "coral", o);
    if (o.tag) t.anim(t.tag(o.tag, 0.55));
    t.fit(o.headline, 58, 6.6, 3.2);
    const head = t.text(o.headline, { x: X, y: 1.25, w: 6.6, h: 3.2, fontSize: 58 });
    t.anim(head, "pop", 150);
    const pos = [
      [7.75, 1.0, -6],
      [9.55, 1.55, 4],
    ];
    (o.crossed ?? []).slice(0, 2).forEach((c, i) => {
      const [x, y, rot] = pos[i];
      t.click(c.note ?? c.label);
      const card = t.card(
        [
          { text: c.label, options: { fontSize: 34, bold: true, breakLine: !!c.note } },
          ...(c.note ? [{ text: c.note, options: { fontSize: 16, color: COL.muted } }] : []),
        ],
        { x, y, w: 3.0, h: 1.9, rotate: rot },
      );
      const xb = t.badge("✕", x + 2.35, y - 0.25, COL.red);
      t.anim(card);
      t.anim(xb, "pop", 300);
    });
    if (o.answer) {
      t.click(o.answer.label);
      t.fit(o.answer.label, 36, 4.3, 1.3);
      const a = t.card(
        [
          { text: o.answer.label, options: { fontSize: 36, bold: true, breakLine: !!o.answer.note } },
          ...(o.answer.note ? [{ text: o.answer.note, options: { fontSize: 18 } }] : []),
        ],
        { x: 7.9, y: 4.0, w: 4.7, h: 1.75, fill: COL.yellow, rotate: -2, valign: "middle" },
      );
      t.anim(a);
      t.anim(a, "pulse", 650);
    }
    if (o.sub) {
      t.click(o.sub);
      t.anim(t.text(balanced(o.sub, 24, 6.4, "regular"), { x: X, y: 4.85, w: 6.4, h: 1.2, fontSize: 24, bold: false }));
    }
    t.done();
  },

  /** One big number with a line under it. */
  stat(o) {
    const t = this._slide(o.bg ?? "coral", o);
    if (o.tag) t.anim(t.tag(o.tag, 1.0));
    t.click(o.value);
    const pt = o.value.length > 5 ? 190 : 250;
    const num = t.text(o.value, { x: X - 0.1, y: 1.65, w: 11, h: 3.4, fontSize: pt, charSpacing: -6, valign: "middle", hi: COL.yellow });
    t.anim(num, "pop", 0, { dur: 650 });
    if (o.line) {
      t.click(o.line);
      t.fit(o.line, 48, 11, 1.0);
      t.anim(t.text(o.line, { x: X, y: 5.15, w: 11, h: 1.0, fontSize: 48 }));
      t.anim(num, "pulse", 450);
    }
    t.done();
  },

  /** Title + 2–4 cards, one per click, + optional footer pill. `stress` = index of the card to pulse at the end. */
  cards(o) {
    const t = this._slide(o.bg ?? "blue", o);
    t.title(o.title);
    const n = o.cards.length;
    if (n < 2 || n > 4) t.warn("cards works best with 2–4 cards");
    const gap = 0.4;
    const cw = (CONTENT_W - gap * (n - 1)) / n;
    const valuePt = n === 4 ? 52 : 66;
    const hasValues = o.cards.some((c) => c.value);
    const wordsFit = (pt) => o.cards.every((c) => plain(c.label).split(/\s+/).every((w) => textWidth(w, pt) <= cw - 0.7));
    const sizes = hasValues ? (n === 4 ? [22] : [28]) : n === 4 ? [32, 28, 24, 22] : [40, 34, 28];
    const labelPt = sizes.find(wordsFit) ?? sizes[sizes.length - 1];
    const notePt = hasValues ? 16 : 18;
    const cardH = hasValues ? 3.0 : 2.5;
    const names = o.cards.map((c, i) => {
      t.click([c.label, c.note, c.value].filter(Boolean).join(" "));
      t.fit(c.label, labelPt, cw - 0.7, hasValues ? 0.9 : 1.4);
      const name = t.card(
        [
          ...(c.kicker ? [{ text: c.kicker, options: { fontFace: MONO, fontSize: 13, color: COL.muted, charSpacing: 3, breakLine: true } }] : []),
          { text: c.label, options: { fontSize: labelPt, bold: true, breakLine: true } },
          ...(c.note ? [{ text: c.note, options: { fontSize: notePt, color: COL.muted, breakLine: !!c.value } }] : []),
          ...(c.value ? [{ text: c.value, options: { fontSize: valuePt, bold: true } }] : []),
        ],
        { x: X + i * (cw + gap), y: t.top + 0.15, w: cw, h: cardH, rotate: [-2, 1, -1, 2][i], valign: hasValues ? "top" : "middle" },
      );
      t.anim(name);
      return name;
    });
    if (o.footer) {
      t.click(o.footer);
      t.anim(t.tag(o.footer, Math.min(6.4, t.top + cardH + 0.75), { bg: COL.yellow, color: COL.ink }));
      if (o.stress != null) t.anim(names[o.stress], "pulse", 450);
    }
    t.done();
  },

  /** Title with one word underlined, a tag, then a question that types itself into a dark card. */
  question(o) {
    const t = this._slide(o.bg ?? "purple", o);
    t.title(o.title);
    if (o.underline) {
      const at = plain(o.title).indexOf(o.underline);
      if (at < 0) throw new Error(`question: "${o.underline}" is not in the title`);
      const before = plain(o.title).slice(0, at);
      if (lineCount(o.title, TITLE_PT, CONTENT_W) > 1) t.warn("underline assumes a one-line title");
      t.click(o.underline);
      t.s.addShape(this.pres.shapes.ROUNDED_RECTANGLE, {
        objectName: "Underline",
        x: X + textWidth(before, TITLE_PT),
        y: TITLE_Y + 0.8,
        w: textWidth(o.underline, TITLE_PT),
        h: 0.12,
        rectRadius: 0.06,
        fill: { color: COL.yellow },
      });
      t.anim("Underline", "wipe");
    }
    let y = t.top + 0.1;
    if (o.tag) {
      t.click(o.tag);
      t.anim(t.tag(o.tag, y, { bg: COL.white, color: COL.ink }));
      y += 0.6;
    }
    t.click(o.question);
    t.fit(o.question, 50, 8.3, 1.9);
    t.s.addShape(this.pres.shapes.ROUNDED_RECTANGLE, { objectName: "Question card", x: X, y, w: 9.2, h: 2.75, rectRadius: 0.3, fill: { color: COL.ink }, shadow: shadow() });
    t.anim("Question card");
    ["FF5F57", "FEBC2E", "28C840"].forEach((c, i) => {
      t.s.addShape(this.pres.shapes.OVAL, { objectName: `Dot ${i + 1}`, x: X + 0.4 + i * 0.32, y: y + 0.25, w: 0.2, h: 0.2, fill: { color: c } });
      t.anim(`Dot ${i + 1}`, "pop", 350 + i * 80);
    });
    t.anim(t.text(o.question, { name: "Question", x: X + 0.45, y: y + 0.6, w: 8.3, h: 1.9, fontSize: 50, color: COL.white, hi: COL.yellow }), "type", 650);
    t.done();
  },

  /** Title, optional lead line, ticked rows (one per click), optional side card that lands last. */
  checklist(o) {
    const t = this._slide(o.bg ?? "amber", o);
    t.title(o.title);
    let y = t.top + 0.05;
    if (o.lead) {
      t.click(o.lead);
      t.anim(t.text(o.lead, { x: X, y: y - 0.2, w: 6.5, h: 0.6, fontSize: 26 }));
      y += 0.55;
    }
    const rowH = o.items.length > 3 ? 0.78 : 0.86;
    const step = rowH + 0.2;
    o.items.forEach((label, i) => {
      t.click(label);
      t.tick(label, X, y + i * step, 6.6, rowH);
    });
    if (o.items.length * step + y > 6.9) t.warn("too many checklist rows for the slide; split it");
    if (o.side) {
      t.click([o.side.big, o.side.small].filter(Boolean).join(" "));
      const runs = o.side.small
        ? [
            { text: o.side.big, options: { fontSize: o.side.big.length <= 3 ? 150 : 54, bold: true, color: COL.yellow, breakLine: true } },
            { text: o.side.small, options: { fontSize: 26, bold: true } },
          ]
        : [{ text: o.side.big, options: { fontSize: [44, 38, 32, 28].find((p) => (lineCount(o.side.big, p, 3.7) * p * 1.2) / 72 <= 2.9) ?? 28, bold: true } }];
      const side = t.card(runs, { x: 8.15, y: t.top - 0.05, w: 4.4, h: 3.5, fill: COL.ink, color: COL.white, align: "center", valign: "middle", rotate: 3 });
      t.anim(side, "pop", 0, { dur: 650 });
      t.anim(side, "pulse", 750);
    }
    t.done();
  },

  /** One big number stepping through values (one per click), old values crossed out, footer last. */
  steps(o) {
    const t = this._slide(o.bg ?? "green", o);
    if (o.tag) t.anim(t.tag(o.tag, 0.9));
    const vals = o.values;
    vals.forEach((v, i) => {
      t.click(v);
      t.text(v, { name: `Value ${i}`, x: X - 0.1, y: 1.45, w: 11, h: 3.0, fontSize: 210, charSpacing: -5, valign: "middle" });
      const cx = X + i * 1.75;
      const last = i === vals.length - 1;
      t.s.addText(v, {
        objectName: `Chip ${i}`,
        isTextBox: true,
        shape: this.pres.shapes.ROUNDED_RECTANGLE,
        rectRadius: 0.18,
        x: cx,
        y: 4.75,
        w: 1.55,
        h: 0.7,
        fill: { color: last ? COL.yellow : COL.white, transparency: last ? 0 : 75 },
        color: last ? COL.ink : COL.white,
        fontFace: HEAD,
        fontSize: 24,
        bold: true,
        align: "center",
        valign: "middle",
        margin: 0,
      });
      if (!last) t.s.addShape(this.pres.shapes.LINE, { objectName: `Strike ${i}`, x: cx + 0.2, y: 5.1, w: 1.15, h: 0, line: { color: COL.white, width: 3 } });
      if (i > 0) {
        t.anim(`Value ${i - 1}`, "exit");
        t.anim(`Strike ${i - 1}`, "wipe", 0, { dur: 300 });
      }
      t.anim(`Value ${i}`, "pop", i ? 120 : 0, { dur: 650 });
      t.anim(`Chip ${i}`, "pop", 300);
    });
    if (vals.length > 6) t.warn("steps fits up to 6 values");
    if (o.footer) {
      t.click(o.footer);
      t.anim(t.text(o.footer, { x: X, y: 5.85, w: 11, h: 0.9, fontSize: 44 }));
      t.anim(`Value ${vals.length - 1}`, "pulse", 450);
    }
    t.done();
  },

  /** Title + dark "?" cards (the unknown options), one per click, + footer pill that pulses them. */
  mystery(o) {
    const t = this._slide(o.bg ?? "blue", o);
    t.title(o.title);
    const labels = o.labels ?? Array.from({ length: o.count ?? 3 }, (_, i) => `Option ${i + 1}`);
    const n = labels.length;
    const gap = 0.45;
    const cw = Math.min(3.4, (CONTENT_W - gap * (n - 1)) / n);
    const names = labels.map((label, i) => {
      t.click(label);
      const name = t.card(
        [
          { text: o.symbol ?? "?", options: { fontSize: 110, bold: true, color: COL.yellow, breakLine: true } },
          { text: label.toUpperCase(), options: { fontFace: MONO, fontSize: 14, charSpacing: 3, color: COL.faint } },
        ],
        { x: X + i * (cw + gap), y: t.top + 0.25, w: cw, h: 3.2, fill: COL.ink, color: COL.white, align: "center", valign: "middle", rotate: [-3, 2, -1, 3][i % 4] },
      );
      t.anim(name);
      return name;
    });
    if (o.footer) {
      t.click(o.footer);
      t.anim(t.tag(o.footer, Math.min(6.4, t.top + 3.85), { bg: COL.yellow, color: COL.ink }));
      names.forEach((nm, i) => t.anim(nm, "pulse", 300 + i * 120));
    }
    t.done();
  },

  /** Title, a light card (the surface answer), a line, then a dark card (the real answer). */
  pair(o) {
    const t = this._slide(o.bg ?? "purple", o);
    t.title(o.title);
    const y = t.top + 0.2;
    t.click(o.left.text);
    const leftPt = lineCount(o.left.text, 52, 4.8) > 1 ? 44 : 52;
    t.fit(o.left.text, leftPt, 4.8, 1.6);
    t.anim(
      t.card(
        [
          ...(o.left.kicker ? [{ text: o.left.kicker.toUpperCase(), options: { fontFace: MONO, fontSize: 14, charSpacing: 3, color: COL.muted, breakLine: true } }] : []),
          ...rich(o.left.text, COL.ink, COL.red, { fontSize: leftPt, bold: true }),
        ],
        { x: X, y, w: 5.5, h: 2.6, valign: "middle", rotate: -2, margin: [34, 34, 24, 24] },
      ),
    );
    let ry = y;
    if (o.line) {
      t.click(o.line);
      t.fit(o.line, 24, 5.85, 0.95, "bold");
      t.anim(t.text(balanced(o.line, 24, 5.85), { x: 6.75, y: y - 0.3, w: 5.85, h: 0.95, fontSize: 24 }));
      ry = y + 0.85;
    }
    t.click(o.right.text);
    t.fit(o.right.text, 36, 5.2, 2.0);
    const right = t.card(rich(o.right.text, COL.white, COL.yellow, { fontSize: 36, bold: true }), {
      x: 6.75,
      y: ry,
      w: 5.85,
      h: 2.3,
      fill: COL.ink,
      color: COL.white,
      valign: "middle",
      rotate: 2,
      margin: [34, 34, 24, 24],
    });
    t.anim(right);
    t.anim(right, "pulse", 650);
    t.done();
  },

  /** Title, a dark tile (big + small), the wrong move (crossed out on its own click), the right move. */
  contrast(o) {
    const t = this._slide(o.bg ?? "coral", o);
    t.title(o.title);
    const y = t.top + 0.05;
    t.click([o.tile.big, o.tile.small].filter(Boolean).join(" "));
    t.anim(
      t.card(
        [
          { text: o.tile.big, options: { fontSize: o.tile.big.length <= 3 ? 120 : 64, bold: true, color: COL.yellow, breakLine: !!o.tile.small } },
          ...(o.tile.small ? [{ text: o.tile.small, options: { fontSize: 26, bold: true } }] : []),
        ],
        { x: X, y, w: 3.6, h: 3.4, fill: COL.ink, color: COL.white, align: "center", valign: "middle", rotate: -3 },
      ),
    );
    t.click(o.wrong.text);
    t.fit(o.wrong.text, 30, 7.2, 1.0);
    t.anim(
      t.card(
        [
          ...(o.wrong.kicker ? [{ text: o.wrong.kicker.toUpperCase(), options: { fontFace: MONO, fontSize: 13, charSpacing: 2, color: COL.muted, breakLine: true } }] : []),
          ...rich(o.wrong.text, COL.ink, COL.red, { fontSize: 30, bold: true }),
        ],
        { x: 4.85, y, w: 7.75, h: 1.55, valign: "middle", r: 0.25 },
      ),
    );
    t.click("not that");
    t.anim(t.badge("✕", 12.05, y - 0.25, COL.red));
    t.click(o.right.text);
    t.fit(o.right.text, 28, 7.2, 1.2);
    const right = t.card(
      [
        ...(o.right.kicker ? [{ text: o.right.kicker.toUpperCase(), options: { fontFace: MONO, fontSize: 13, charSpacing: 2, color: COL.ink, breakLine: true } }] : []),
        ...rich(o.right.text, COL.ink, COL.white, { fontSize: 28, bold: true }),
      ],
      { x: 4.85, y: y + 1.8, w: 7.75, h: 1.75, fill: COL.yellow, valign: "middle", r: 0.25 },
    );
    t.anim(right);
    t.anim(right, "pulse", 650);
    t.done();
  },

  /** Title, then numbered points (01, 02, 03…) each with an optional note, one per click. */
  points(o) {
    const t = this._slide(o.bg ?? "teal", o);
    t.title(o.title);
    const n = o.items.length;
    if (n > 8) t.warn("points fits up to 8 items; split the slide");
    // Up to 5 items: big rows with the note under the label. 6–8: compact rows, note on the same line.
    const compact = n > 5;
    const gap = compact ? 0.1 : 0.18;
    const avail = 6.95 - t.top;
    const rowH = Math.min(1.05, avail / n - gap);
    const pt = compact ? (rowH < 0.5 ? 18 : 20) : 26;
    o.items.forEach((it, i) => {
      const item = typeof it === "string" ? { label: it } : it;
      t.click([item.label, item.note].filter(Boolean).join(" — "));
      const y = t.top + i * (rowH + gap);
      const link = item.url ? { hyperlink: { url: item.url, tooltip: item.url } } : {};
      let runs;
      if (compact) {
        const line = item.note ? `${item.label}  ${item.note}` : item.label;
        if (lineCount(line, pt, CONTENT_W - 1.6) > 1) t.warn(`"${plain(item.label).slice(0, 40)}" and its note need two lines in a compact list; shorten one of them`);
        runs = [
          { text: item.label, options: { fontSize: pt, bold: true } },
          ...(item.note ? [{ text: `  ${item.note}`, options: { fontSize: pt - 4, bold: false, color: COL.muted, ...link } }] : []),
        ];
      } else {
        const labelLines = t.fit(item.label, pt, 9.8, rowH);
        if (item.note) {
          const noteLines = lineCount(item.note, 16, 9.8, "regular");
          if ((labelLines * pt + noteLines * 16) * 1.2 / 72 > rowH + 0.05)
            t.warn(`"${plain(item.label).slice(0, 40)}" plus its note may overflow its row; shorten one of them`);
        }
        runs = [
          { text: item.label, options: { fontSize: pt, bold: true, breakLine: !!item.note } },
          ...(item.note ? [{ text: item.note, options: { fontSize: 16, color: COL.muted, ...link } }] : []),
        ];
      }
      const numW = compact ? 0.8 : 1.05;
      const row = t.card(runs, { x: X + numW + 0.2, y, w: CONTENT_W - numW - 0.2, h: rowH, valign: "middle", r: 0.2, margin: [28, 22, 4, 4] });
      const num = t.card([{ text: String(i + 1).padStart(2, "0"), options: { fontSize: compact ? 22 : 30, bold: true } }], {
        x: X,
        y,
        w: numW,
        h: rowH,
        fill: COL.yellow,
        align: "center",
        valign: "middle",
        r: 0.2,
        margin: 0,
      });
      t.anim(num);
      t.anim(row, "pop", 150);
    });
    t.done();
  },

  /** Up to three short lines, one per click (a claim, a turn). Use it only when nothing more active fits. */
  statement(o) {
    const t = this._slide(o.bg ?? "purple", o);
    const pt = o.size ?? 64;
    const heights = o.lines.map((line) => (lineCount(line, pt, CONTENT_W) * pt * 1.15) / 72);
    const block = heights.reduce((a, b) => a + b, 0) + 0.35 * (o.lines.length - 1);
    let y = Math.max(o.tag ? 1.75 : 1.5, (H - block) / 2);
    if (o.tag) t.anim(t.tag(o.tag, y - 0.75));
    o.lines.forEach((line, i) => {
      t.click(line);
      t.fit(line, pt, CONTENT_W, 2.4);
      const h = heights[i];
      t.anim(t.text(line, { x: X, y, w: CONTENT_W, h, fontSize: pt }));
      y += h + 0.35;
    });
    if (y > 7.0) t.warn("statement lines run off the slide; shorten or lower size");
    t.done();
  },

  /** Closing: title, lead line, chips (one per click), badge that lands last. */
  close(o) {
    const t = this._slide(o.bg ?? "teal", o);
    t.title(o.title);
    let y = t.top - 0.05;
    if (o.lead) {
      t.click(o.lead);
      t.anim(t.text(o.lead, { x: X, y, w: 8, h: 0.6, fontSize: 26 }));
      y += 0.75;
    }
    const chips = o.chips ?? [];
    const gap = 0.3;
    const cw = Math.min(3.7, (CONTENT_W - gap * (chips.length - 1)) / Math.max(1, chips.length));
    // the card's inner padding takes ~0.6 in, so measure against cw - 0.7
    const chipPt = [32, 28, 24].find((p) => chips.every((c) => lineCount(c, p, cw - 0.7) === 1)) ?? 24;
    chips.forEach((c, i) => {
      t.click(c);
      t.fit(c, chipPt, cw - 0.7, 1.0);
      t.anim(t.card([{ text: c, options: { fontSize: chipPt, bold: true } }], { x: X + i * (cw + gap), y, w: cw, h: 1.1, align: "center", valign: "middle", rotate: [-2, 1, -1, 2][i % 4], r: 0.25 }));
    });
    if (o.badge) {
      t.click(o.badge);
      const w = Math.max(3.5, textWidth(o.badge, 66) + 1.0);
      const b = t.card([{ text: o.badge, options: { fontSize: 66, bold: true } }], { x: X, y: Math.min(5.5, y + 1.55), w, h: 1.45, fill: COL.yellow, align: "center", valign: "middle", rotate: -3, r: 0.35 });
      t.anim(b, "pop", 0, { dur: 650 });
      t.anim(b, "pulse", 750);
    }
    t.done();
  },
};

/** 2–4 cards with a picture each (history, uses, case studies), one per click.
 *  items: [{ image?, kicker?, label, note? }] — an item without image shows its kicker large. */
TYPES.gallery = function (o) {
  const t = this._slide(o.bg ?? "blue", o);
  t.title(o.title);
  const n = o.items.length;
  if (n < 2 || n > 5) t.warn("gallery works best with 2–5 items");
  const gap = 0.35;
  const cw = (CONTENT_W - gap * (n - 1)) / n;
  const top = t.top + 0.1;
  const cardH = 6.95 - top - (o.footer ? 0.7 : 0);
  const imgH = cardH - 1.45;
  const textH = 1.25;
  const fitsAt = (p) =>
    o.items.every((it) => {
      if (!plain(it.label).split(/\s+/).every((w) => textWidth(w, p) <= cw - 0.4)) return false;
      const kick = it.image && it.kicker ? 0.25 : 0;
      const lab = (lineCount(it.label, p, cw - 0.4) * p * 1.2) / 72;
      const note = it.note ? (lineCount(it.note, 16, cw - 0.4, "regular") * 16 * 1.2) / 72 : 0;
      return kick + lab + note <= textH;
    });
  const labelPt = [26, 22, 20, 18, 16].find(fitsAt) ?? 16;
  const names = o.items.map((it, i) => {
    t.click([it.kicker, it.label, it.note].filter(Boolean).join(" "));
    const x = X + i * (cw + gap);
    const card = t.name("Card");
    t.s.addShape(this.pres.shapes.ROUNDED_RECTANGLE, { objectName: card, x, y: top, w: cw, h: cardH, rectRadius: 0.22, fill: { color: COL.paper }, shadow: shadow() });
    t.anim(card);
    if (it.image) {
      t.anim(t.image(it.image, x + 0.15, top + 0.15, cw - 0.3, imgH - 0.1), "pop", 120);
    } else if (it.kicker) {
      t.anim(t.text(it.kicker, { x: x + 0.15, y: top + 0.15, w: cw - 0.3, h: imgH - 0.1, fontSize: 60, color: COL.ink, align: "center", valign: "middle" }), "pop", 120);
    }
    const runs = [
      ...(it.image && it.kicker ? [{ text: it.kicker, options: { fontFace: MONO, fontSize: 13, color: COL.muted, charSpacing: 3, breakLine: true } }] : []),
      { text: it.label, options: { fontSize: labelPt, bold: true, color: COL.ink, breakLine: !!it.note } },
      ...(it.note ? [{ text: it.note, options: { fontSize: 16, color: COL.muted } }] : []),
    ];
    t.fit(it.label, labelPt, cw - 0.4, 0.9);
    t.anim(t.text(runs, { x: x + 0.2, y: top + imgH + 0.1, w: cw - 0.4, h: cardH - imgH - 0.2, valign: "top" }), "fade", 250);
    return card;
  });
  // Answers (item.answer) land together on one click, after every card is up: ask first, reveal later.
  if (o.items.some((it) => it.answer)) {
    t.click(o.reveal ?? `answers: ${o.items.map((it) => it.answer).filter(Boolean).join(", ")}`);
    o.items.forEach((it, i) => {
      if (!it.answer) return;
      const x = X + i * (cw + gap);
      const pt = [22, 20, 18, 16, 14].find((p) => textWidth(it.answer, p) <= cw - 0.6) ?? 14;
      const pill = t.card([{ text: it.answer, options: { fontSize: pt, bold: true, color: COL.ink } }], { x: x + 0.2, y: top + imgH - 0.55, w: cw - 0.4, h: 0.6, fill: it.answerColor ?? COL.yellow, align: "center", valign: "middle", r: 0.3, margin: 0, rotate: [-2, 2][i % 2] });
      t.anim(pill, "pop", i * 150);
    });
  }
  if (o.footer) {
    t.click(o.footer);
    t.anim(t.tag(o.footer, top + cardH + 0.22, { bg: COL.yellow, color: COL.ink }));
    if (o.stress != null) t.anim(names[o.stress], "pulse", 450);
  }
  t.done();
};

/** One large picture, with an optional caption and up to 4 points beside it, each on a click. */
TYPES.picture = function (o) {
  const t = this._slide(o.bg ?? "teal", o);
  t.title(o.title);
  const top = t.top + 0.05;
  const pts = o.points ?? [];
  const boxW = pts.length ? 6.3 : CONTENT_W;
  const boxH = 6.85 - top - (o.caption ? 0.6 : 0);
  t.click(o.say ?? "picture");
  const panel = t.name("Panel");
  const box = contain(o.image, X + 0.15, top + 0.15, boxW - 0.3, boxH - 0.3);
  t.s.addShape(this.pres.shapes.ROUNDED_RECTANGLE, { objectName: panel, x: box.x - 0.15, y: box.y - 0.15, w: box.w + 0.3, h: box.h + 0.3, rectRadius: 0.2, fill: { color: COL.white }, shadow: shadow() });
  t.anim(panel);
  t.anim(t.image(o.image, box.x, box.y, box.w, box.h), "pop", 120);
  if (o.caption) {
    t.click(o.caption);
    t.anim(t.tag(o.caption, box.y + box.h + 0.35, { x: box.x - 0.15, bg: COL.yellow, color: COL.ink }));
  }
  pts.forEach((p, i) => {
    t.click(p);
    t.fit(p, 26, CONTENT_W - boxW - 0.6, 1.2);
    t.anim(t.card([{ text: p, options: { fontSize: 24, bold: true } }], { x: X + boxW + 0.3, y: top + i * 1.15, w: CONTENT_W - boxW - 0.3, h: 0.95, valign: "middle", r: 0.2 }));
  });
  t.done();
};

/** Technologies nested inside each other: concentric circles, one per click, each with an example card.
 *  rings: [{ label, example }] from outermost to innermost (max 4). */
TYPES.nested = function (o) {
  const t = this._slide(o.bg ?? "blue", o);
  t.title(o.title);
  const top = t.top;
  const D = Math.min(4.6, 6.95 - top);
  const fills = ["FFFFFF", "FFE7A3", "FFC93C", "FF8A3D"];
  o.rings.forEach((r, i) => {
    t.click(`${r.label}: ${r.example}`);
    const d = D * (1 - i * 0.19);
    const cx = X + D / 2;
    const cy = top + D / 2 + (D - d) * 0.42;
    const ring = t.name("Ring");
    t.s.addShape(this.pres.shapes.OVAL, {
      objectName: ring, x: cx - d / 2, y: cy - d / 2, w: d, h: d,
      fill: { color: fills[i % 4] }, line: { color: COL.ink, width: 1 },
    });
    t.anim(ring);
    const label = t.text(r.label, { x: cx - d * 0.4, y: cy - d / 2 + 0.1, w: d * 0.8, h: 0.32, fontSize: 14, color: COL.ink, align: "center", valign: "middle" });
    t.anim(label, "fade", 150);
    t.anim(t.card([{ text: r.label.toUpperCase(), options: { fontFace: MONO, fontSize: 12, color: COL.muted, charSpacing: 2, breakLine: true } }, { text: r.example, options: { fontSize: 20, bold: true } }], { x: X + D + 0.6, y: top + i * 1.12, w: CONTENT_W - D - 0.6, h: 0.95, valign: "middle", r: 0.2, margin: [18, 18, 4, 4] }), "pop", 200);
  });
  t.done();
};

/** A prompt broken into its parts, one per click. parts: [{ tag, text, color }] (max 6). */
TYPES.decompose = function (o) {
  const t = this._slide(o.bg ?? "purple", o);
  t.title(o.title);
  const n = o.parts.length;
  const rowH = Math.min(0.8, (6.95 - t.top) / n - 0.12);
  o.parts.forEach((p, i) => {
    t.click(`${p.tag}: ${p.text}`);
    const y = t.top + i * (rowH + 0.12);
    t.fit(p.text, 18, CONTENT_W - 2.7, rowH);
    t.anim(t.card([{ text: p.tag, options: { fontSize: 18, bold: true, color: COL.ink } }], { x: X, y, w: 2.3, h: rowH, fill: p.color, align: "center", valign: "middle", r: 0.18, margin: 0 }));
    t.anim(t.card([{ text: p.text, options: { fontSize: 18 } }], { x: X + 2.45, y, w: CONTENT_W - 2.45, h: rowH, fill: tint(p.color, 0.7), valign: "middle", r: 0.18, margin: [18, 18, 4, 4] }), "wipe", 150);
  });
  t.done();
};

/** The whole prompt with each part highlighted in its colour, then the legend chips one per click. */
TYPES.colorText = function (o) {
  const t = this._slide(o.bg ?? "teal", o);
  t.title(o.title);
  const top = t.top;
  t.click("the full prompt");
  const runs = o.parts.map((p, i) => ({ text: p.text + (i < o.parts.length - 1 ? " " : ""), options: { fontSize: 20, bold: true, color: COL.ink, highlight: p.color } }));
  t.fit(o.parts.map((p) => p.text).join(" "), 20, CONTENT_W - 0.8, 3.6);
  t.anim(t.card(runs, { x: X, y: top, w: CONTENT_W, h: 3.7, valign: "middle", margin: [30, 30, 20, 20] }));
  const cw = (CONTENT_W - 0.2 * (o.parts.length - 1)) / o.parts.length;
  o.parts.forEach((p, i) => {
    t.click(p.tag);
    t.anim(t.card([{ text: p.tag, options: { fontSize: 15, bold: true, color: COL.ink } }], { x: X + i * (cw + 0.2), y: top + 3.95, w: cw, h: 0.6, fill: p.color, align: "center", valign: "middle", r: 0.3, margin: 0 }));
  });
  t.done();
};

// Pastel highlight colours for token rows (like the OpenAI tokenizer).
const TOKEN_COLORS = ["CDB8F5", "C4EBC1", "F9DDAE", "F4B2B2", "AFD8F2", "F7C6E4", "D9E7A8"];
// White text on these header colours, dark text otherwise.
const isDark = (hex) => {
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return 0.299 * r + 0.587 * g + 0.114 * b < 150;
};

/** Up to 4 columns: each header (title + sub) lands on a click, then each of its items on its own click.
 *  columns: [{ title, sub, color, items: ["…"] }] */
TYPES.columns = function (o) {
  const t = this._slide(o.bg ?? "blue", o);
  t.title(o.title);
  const n = o.columns.length;
  if (n > 4) t.warn("columns fits up to 4 columns");
  const gap = 0.25;
  const cw = (CONTENT_W - gap * (n - 1)) / n;
  const top = t.top - 0.1;
  const headH = o.columns.some((c) => c.sub) ? 1.0 : 0.7;
  const itemTop = top + headH + 0.15;
  const avail = 6.98 - itemTop;
  const iw = cw - 0.3;
  const itemGap = 0.07;
  const heightAt = (c, p) => c.items.reduce((h, it) => h + lineCount(it, p, iw, "regular") * p * 1.22 / 72 + 0.14 + itemGap, 0);
  const pt = [20, 18, 17, 16, 15, 14, 13, 12].find((p) => o.columns.every((c) => heightAt(c, p) <= avail)) ?? 12;
  if (o.columns.some((c) => heightAt(c, pt) > avail)) t.warn("columns: items overflow; shorten them or split the slide");
  o.columns.forEach((c, i) => {
    const x = X + i * (cw + gap);
    const ink = isDark(c.color) ? COL.white : COL.ink;
    t.click(c.sub ? `${c.title} (${c.sub})` : c.title);
    const titlePt = [24, 22, 20, 18].find((p) => textWidth(c.title, p) <= cw - 0.3) ?? 18;
    const runs = [
      { text: c.title, options: { fontSize: titlePt, bold: true, color: ink, breakLine: !!c.sub } },
      ...(c.sub ? [{ text: c.sub, options: { fontSize: 15, color: ink } }] : []),
    ];
    t.anim(t.card(runs, { x, y: top, w: cw, h: headH, fill: c.color, align: "center", valign: "middle", r: 0.2, margin: [8, 8, 4, 4] }));
    let y = itemTop;
    c.items.forEach((it) => {
      t.click(it);
      const h = lineCount(it, pt, iw, "regular") * pt * 1.22 / 72 + 0.14;
      t.anim(t.card([{ text: it, options: { fontSize: pt, bold: false, color: COL.ink } }], { x, y, w: cw, h, fill: tint(c.color, 0.82), valign: "middle", r: 0.12, margin: [10, 8, 2, 2], shadow: undefined }), "rise");
      y += h + itemGap;
    });
  });
  t.done();
};

/** A grid of small cards (up to 12): a number or picture plus a label. `by`: "item" (default),
 *  "row" or "all" decides how many land per click. Items with `answer` get it revealed on one last click. */
TYPES.grid = function (o) {
  const t = this._slide(o.bg ?? "teal", o);
  t.title(o.title);
  const n = o.items.length;
  const cols = o.cols ?? Math.min(4, n);
  const rows = Math.ceil(n / cols);
  const gap = 0.22;
  const top = t.top - 0.05;
  const bottom = 6.95 - (o.footer ? 0.7 : 0);
  const cw = (CONTENT_W - gap * (cols - 1)) / cols;
  const ch = (bottom - top - gap * (rows - 1)) / rows;
  const withImg = o.items.some((it) => it.image);
  const by = o.by ?? "item";
  const labelPt = [20, 18, 16, 15, 14].find((p) => o.items.every((it) => lineCount(it.label, p, withImg ? cw - 0.3 : cw - 1.0) <= (withImg ? 1 : 2))) ?? 14;
  const pos = [];
  o.items.forEach((it, i) => {
    const r = Math.floor(i / cols);
    const c = i % cols;
    const x = X + c * (cw + gap);
    const y = top + r * (ch + gap);
    pos.push({ x, y });
    const first = by === "item" || (by === "row" && c === 0) || (by === "all" && i === 0);
    if (first) t.click(by === "item" ? it.label : by === "row" ? o.items.slice(i, i + cols).map((x) => x.label).join(", ") : "all items");
    const delay = by === "item" ? 0 : (by === "row" ? c : i) * 120;
    if (withImg) {
      const card = t.name("Card");
      t.s.addShape(this.pres.shapes.ROUNDED_RECTANGLE, { objectName: card, x, y, w: cw, h: ch, rectRadius: 0.18, fill: { color: COL.paper }, shadow: shadow() });
      t.anim(card, "pop", delay);
      const labH = (it.note ? 0.62 : 0.42);
      if (it.image) t.anim(t.image(it.image, x + 0.1, y + 0.1, cw - 0.2, ch - labH - 0.2), "pop", delay + 80);
      const runs = [
        { text: it.label, options: { fontSize: labelPt, bold: true, color: COL.ink, breakLine: !!it.note } },
        ...(it.note ? [{ text: it.note, options: { fontSize: 12, color: COL.muted } }] : []),
      ];
      t.anim(t.text(runs, { x: x + 0.12, y: y + ch - labH - 0.08, w: cw - 0.24, h: labH, align: "center", valign: "middle" }), "fade", delay + 150);
    } else {
      const card = t.card([{ text: it.label, options: { fontSize: labelPt, bold: true, color: COL.ink, breakLine: !!it.note } }, ...(it.note ? [{ text: it.note, options: { fontSize: 13, color: COL.muted } }] : [])], { x, y, w: cw, h: ch, valign: "middle", r: 0.18, margin: [70, 12, 4, 4] });
      const num = t.badge(it.badge ?? String(i + 1), x + 0.15, y + (ch - 0.58) / 2, it.color ?? COL.ink, 0.58);
      t.anim(card, "pop", delay);
      t.anim(num, "pop", delay + 120);
    }
  });
  if (o.items.some((it) => it.answer)) {
    t.click(o.reveal ?? "answers");
    o.items.forEach((it, i) => {
      if (!it.answer) return;
      const w = Math.min(cw * 0.62, textWidth(it.answer, 14) + 0.45);
      const pill = t.card([{ text: it.answer, options: { fontSize: 14, bold: true, color: COL.ink } }], { x: pos[i].x + cw - w - 0.08, y: pos[i].y - 0.14, w, h: 0.4, fill: it.answerColor ?? COL.yellow, align: "center", valign: "middle", r: 0.2, margin: 0, rotate: 3 });
      t.anim(pill, "pop", i * 90);
    });
  }
  if (o.footer) {
    t.click(o.footer);
    t.anim(t.tag(o.footer, bottom + 0.22, { bg: COL.yellow, color: COL.ink }));
  }
  t.done();
};

/** Quote cards (up to 6, in a 3×2 grid), one per click: logo, the quote, who said it and when. */
TYPES.quotes = function (o) {
  const t = this._slide(o.bg ?? "purple", o);
  t.title(o.title);
  const n = o.items.length;
  const cols = n <= 4 ? 2 : 3;
  const rows = Math.ceil(n / cols);
  const gap = 0.25;
  const top = t.top - 0.1;
  const cw = (CONTENT_W - gap * (cols - 1)) / cols;
  const ch = (6.98 - top - gap * (rows - 1)) / rows;
  const qw = cw - 0.5;
  const qh = ch - 1.05;
  const qPt = [20, 18, 17, 16, 15, 14].find((p) => o.items.every((q) => lineCount(q.quote, p, qw) * p * 1.2 / 72 <= qh)) ?? 14;
  o.items.forEach((q, i) => {
    const x = X + (i % cols) * (cw + gap);
    const y = top + Math.floor(i / cols) * (ch + gap);
    t.click(`${q.who}: ${q.quote}`);
    const card = t.card([{ text: q.quote, options: { fontSize: qPt, bold: true, color: COL.ink } }], { x, y, w: cw, h: ch, valign: "middle", r: 0.2, margin: [24, 24, 50, 10] });
    t.anim(card);
    if (q.logo) t.anim(t.image(q.logo, x + 0.22, y + ch - 0.62, 0.45, 0.45), "pop", 150);
    t.anim(t.text([{ text: q.who, options: { fontSize: 14, bold: true, color: COL.ink, breakLine: true } }, { text: q.role, options: { fontSize: 11, bold: false, color: COL.muted } }], { x: x + (q.logo ? 0.8 : 0.25), y: y + ch - 0.7, w: cw - 1.0, h: 0.6, valign: "middle" }), "fade", 250);
    if (q.mark) t.anim(t.badge(q.mark, x + cw - 0.45, y - 0.18, q.markColor ?? COL.ink, 0.55), "pop", 300);
  });
  t.done();
};

/** A wall of logos on white tiles. A row lands per click, its tiles one after another.
 *  items: [{ image }] or [{ text }] for a brand with no picture. */
TYPES.logos = function (o) {
  const t = this._slide(o.bg ?? "blue", o);
  t.title(o.title);
  const n = o.items.length;
  const cols = o.cols ?? Math.min(4, n);
  const rows = Math.ceil(n / cols);
  const gap = 0.25;
  const top = t.top - 0.05;
  const bottom = 6.95 - (o.footer ? 0.7 : 0);
  const cw = (CONTENT_W - gap * (cols - 1)) / cols;
  const ch = Math.min(1.5, (bottom - top - gap * (rows - 1)) / rows);
  o.items.forEach((it, i) => {
    const c = i % cols;
    const x = X + c * (cw + gap);
    const y = top + Math.floor(i / cols) * (ch + gap);
    if (c === 0) t.click(o.items.slice(i, i + cols).map((x) => x.name ?? x.text ?? "logo").join(", "));
    const tile = t.name("Tile");
    t.s.addShape(this.pres.shapes.ROUNDED_RECTANGLE, { objectName: tile, x, y, w: cw, h: ch, rectRadius: 0.16, fill: { color: COL.white }, shadow: shadow() });
    t.anim(tile, "pop", c * 140);
    if (it.image) t.anim(t.image(it.image, x + 0.3, y + 0.2, cw - 0.6, ch - 0.4), "pop", c * 140 + 80);
    else {
      const pt = [26, 22, 20, 18].find((p) => lineCount(it.text, p, cw - 0.4) <= 2) ?? 18;
      t.anim(t.text(it.text, { x: x + 0.2, y, w: cw - 0.4, h: ch, fontSize: pt, color: it.color ?? COL.ink, align: "center", valign: "middle" }), "pop", c * 140 + 80);
    }
  });
  if (o.footer) {
    t.click(o.footer);
    t.anim(t.tag(o.footer, Math.min(6.4, top + rows * (ch + gap) + 0.05), { bg: COL.yellow, color: COL.ink }));
  }
  t.done();
};

/** Who I am: a dark ID card (name, role, lines), stat tiles (one per click), then a wide card (e.g. diplomas). */
TYPES.profile = function (o) {
  const t = this._slide(o.bg ?? "teal", o);
  t.title(o.title);
  const top = t.top - 0.05;
  const leftW = 4.5;
  t.click(o.name);
  const idRuns = [
    { text: o.name, options: { fontSize: 32, bold: true, color: COL.yellow, breakLine: true } },
    { text: o.role, options: { fontSize: 17, bold: true, color: COL.white, breakLine: true } },
    ...(o.lines ?? []).map((l, i, a) => ({ text: l, options: { fontSize: 16, bold: false, color: COL.faint, paraSpaceBefore: 10, breakLine: i < a.length - 1 } })),
  ];
  t.fit(o.role, 17, leftW - 0.6, 1.4);
  t.anim(t.card(idRuns, { x: X, y: top, w: leftW, h: 6.95 - top, fill: COL.ink, valign: "top", margin: [24, 24, 22, 26] }));
  const rx = X + leftW + 0.3;
  const rw = CONTENT_W - leftW - 0.3;
  const facts = o.facts ?? [];
  const tw = (rw - 0.25) / 2;
  const th = 1.3;
  facts.slice(0, 4).forEach((f, i) => {
    t.click(`${f.big} ${f.small}`);
    const x = rx + (i % 2) * (tw + 0.25);
    const y = top + Math.floor(i / 2) * (th + 0.22);
    t.fit(f.small, 15, tw - 0.5, 0.5, "regular");
    t.anim(t.card([{ text: f.big, options: { fontSize: 40, bold: true, breakLine: true } }, { text: f.small, options: { fontSize: 15, color: COL.muted } }], { x, y, w: tw, h: th, valign: "middle", r: 0.2, margin: [22, 14, 6, 6] }));
  });
  if (o.wide) {
    t.click(o.wide.label);
    const y = top + 2 * (th + 0.22);
    const h = 6.95 - y;
    t.anim(t.card([{ text: o.wide.label.toUpperCase(), options: { fontFace: MONO, fontSize: 12, color: COL.muted, charSpacing: 2, breakLine: true } }, ...o.wide.lines.map((l, i, a) => ({ text: l, options: { fontSize: 16, bold: true, breakLine: i < a.length - 1 } }))], { x: rx, y, w: rw, h, fill: COL.yellow, valign: "middle", r: 0.2, margin: [22, 18, 8, 8] }));
  }
  t.done();
};

/** Text split into tokens, one tokenizer panel per click (coloured like the OpenAI tokenizer), then a link.
 *  rows: [{ label, tokens: ["ici", " c", "'est", " Marseille"] }], link: { text, url } */
TYPES.tokens = function (o) {
  const t = this._slide(o.bg ?? "teal", o);
  t.title(o.title);
  const top = t.top - 0.05;
  const n = o.rows.length;
  const bottom = 6.95 - (o.link ? 0.75 : 0);
  const rowH = Math.min(1.45, (bottom - top - 0.18 * (n - 1)) / n);
  o.rows.forEach((r, i) => {
    const text = r.tokens.join("");
    t.click(`${r.label ?? text}: ${r.tokens.length} tokens, ${text.length} characters`);
    const y = top + i * (rowH + 0.18);
    const pt = [30, 26, 22, 20].find((p) => textWidth(text, p, "mono") <= CONTENT_W - 4.4) ?? 20;
    const runs = r.tokens.map((tok, k) => ({ text: tok.replace(/ /g, " "), options: { fontFace: MONO, fontSize: pt, bold: false, color: COL.ink, highlight: TOKEN_COLORS[k % TOKEN_COLORS.length] } }));
    t.anim(t.card(runs, { x: X + 3.6, y, w: CONTENT_W - 3.6, h: rowH, valign: "middle", r: 0.18, margin: [26, 18, 4, 4] }));
    const meta = [
      ...(r.label ? [{ text: r.label.toUpperCase(), options: { fontFace: MONO, fontSize: 12, color: COL.muted, charSpacing: 2, breakLine: true } }] : []),
      { text: `${r.tokens.length}`, options: { fontSize: 34, bold: true, color: COL.ink } },
      { text: " tokens   ", options: { fontSize: 15, color: COL.muted } },
      { text: `${text.length}`, options: { fontSize: 34, bold: true, color: COL.ink } },
      { text: " chars", options: { fontSize: 15, color: COL.muted } },
    ];
    t.anim(t.card(meta, { x: X, y, w: 3.4, h: rowH, fill: COL.yellow, valign: "middle", r: 0.18, margin: [20, 10, 4, 4] }), "pop", 150);
  });
  if (o.link) {
    t.click(`link: ${o.link.url}`);
    const w = Math.min(CONTENT_W, textWidth(o.link.text, 18) + 0.8);
    t.anim(t.card([{ text: o.link.text, options: { fontSize: 18, bold: true, color: "1D4ED8", underline: { style: "sng" }, hyperlink: { url: o.link.url, tooltip: o.link.url } } }], { x: X, y: bottom + 0.15, w, h: 0.55, align: "center", valign: "middle", r: 0.27, margin: 0 }));
  }
  t.done();
};

/** From words to numbers: the sentence, its tokens (one click), then each token's vector (one per click). */
TYPES.vectors = function (o) {
  const t = this._slide(o.bg ?? "blue", o);
  t.title(o.title);
  const top = t.top - 0.1;
  t.click(`the sentence: ${o.sentence}`);
  t.anim(t.card([{ text: `“${o.sentence}”`, options: { fontSize: 26, bold: true } }], { x: X, y: top, w: CONTENT_W, h: 0.8, valign: "middle", r: 0.2, margin: [24, 24, 4, 4] }));
  t.click(`1. words become tokens: ${o.rows.map((r) => r.token).join(", ")}`);
  const step1 = t.tag("1 · Words become tokens", top + 1.0, { bg: COL.ink });
  t.anim(step1);
  let x = X + 4.3;
  o.rows.forEach((r, k) => {
    const w = textWidth(r.token, 20) + 0.5;
    t.anim(t.card([{ text: r.token, options: { fontSize: 20, bold: true, color: COL.ink } }], { x, y: top + 0.93, w, h: 0.56, fill: TOKEN_COLORS[k % TOKEN_COLORS.length], align: "center", valign: "middle", r: 0.15, margin: 0 }), "pop", 120 + k * 120);
    x += w + 0.15;
  });
  const vTop = top + 1.75;
  const rowH = Math.min(0.62, (6.95 - vTop - 0.5) / o.rows.length - 0.1);
  t.click("2. tokens become vectors");
  t.anim(t.tag("2 · Tokens become vectors (lists of numbers)", vTop, { bg: COL.ink }));
  o.rows.forEach((r, k) => {
    t.click(`${r.token} → ${r.vector}`);
    const y = vTop + 0.55 + k * (rowH + 0.1);
    t.anim(t.card([{ text: r.token, options: { fontSize: 20, bold: true, color: COL.ink } }], { x: X, y, w: 2.6, h: rowH, fill: TOKEN_COLORS[k % TOKEN_COLORS.length], align: "center", valign: "middle", r: 0.15, margin: 0 }));
    t.anim(t.card([{ text: `→  ${r.vector}`, options: { fontFace: MONO, fontSize: 20, color: COL.ink } }], { x: X + 2.8, y, w: CONTENT_W - 2.8, h: rowH, valign: "middle", r: 0.15, margin: [20, 10, 2, 2] }), "wipe", 120);
  });
  t.done();
};

for (const [type, fn] of Object.entries(TYPES)) {
  Deck.prototype[type] = function (opts) {
    return this.queue(() => fn.call(this, opts));
  };
}

module.exports = { Deck, BG, COL, textWidth, lineCount };
