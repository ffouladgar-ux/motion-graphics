// "Why the worse product keeps winning" — built from the WIN-WIN Shorts' own wording.
// Copy ../../engine next to this file as ./engine, then: node deck.js
const { Deck } = require("./engine/kit");

const deck = new Deck({ title: "Why the worse product keeps winning", out: "win-win.pptx" });

deck.cover({
  bg: "coral",
  tag: "Win-Win",
  headline: "Why the *worse product* keeps winning",
  crossed: [
    { label: "Price", note: "It is not price." },
    { label: "Quality", note: "It is not quality." },
  ],
  answer: { label: "The transformation", note: "your product really gives them" },
  sub: "People buy the transformation your product really gives them.",
  notes: "Most people never work out why the worse product keeps winning.",
});

deck.stat({
  bg: "coral",
  tag: "The 157 dollar customer",
  value: "$157",
  line: "to get *one* customer.",
  notes: "157 dollars to get one customer.",
});

deck.cards({
  bg: "blue",
  title: "Three *fixes.*",
  cards: [
    { kicker: "FIX 1", label: "New creative", note: "did not move it", value: "$157" },
    { kicker: "FIX 2", label: "Cheaper agency", note: "brought it to", value: "$120" },
    { kicker: "FIX 3", label: "More budget", note: "pushed it to", value: "$198" },
  ],
  footer: "Same customer, more money",
  stress: 2,
  notes: "Three fixes, three worse numbers.",
});

deck.question({
  bg: "purple",
  title: "The ads were never the problem.",
  underline: "never",
  tag: "The only question that matters",
  question: "What does the customer actually get?",
  notes: "Three fixes, three worse numbers, because the ads were never the problem.",
});

deck.checklist({
  bg: "amber",
  title: "So they changed *one sentence.*",
  items: ["Same product", "Same audience", "Same budget"],
  side: { big: "1", small: "sentence changed" },
});

deck.steps({
  bg: "green",
  tag: "Cost per customer",
  values: ["$157", "$42", "$18", "$3.58"],
  footer: "From *one sentence.*",
  notes:
    "Same product. Same audience. Same budget.\n" +
    "Note: the Short gives 42, 18, 3.58 without a label; 'cost per customer' is inferred from its title (157 dollars to 3.58).",
});

deck.mystery({
  bg: "blue",
  title: "Picture a man staring at *three drills.*",
  labels: ["Drill 1", "Drill 2", "Drill 3"],
  footer: "He is not reading the boxes",
  notes: "Picture a man in a hardware store staring at three drills.",
});

deck.checklist({
  bg: "amber",
  title: "He is not buying *the drill.*",
  lead: "He is buying:",
  items: ["His garage", "The shelf finally level", "The job done"],
  side: { big: "The drill is just the tool." },
});

deck.pair({
  bg: "purple",
  title: "Nobody buys a ride *in the taxi.*",
  left: { kicker: "They are buying", text: "a ride home." },
  line: "Nobody buys your service for the service.",
  right: { text: "They are buying the *identity* you hand them." },
});

deck.contrast({
  bg: "coral",
  title: "Someone asks *your price.*",
  tile: { big: "2s", small: "They go quiet." },
  wrong: { kicker: "What most people do", text: "Fill the silence with a *discount.*" },
  right: { kicker: "Instead", text: "Fill the pause with the transformation and the discount never comes up." },
  notes: "There is a two second pause that costs business owners more money than any competitor.",
});

deck.close({
  bg: "teal",
  title: "Name the transformation *they are buying.*",
  lead: "Then make it show in",
  chips: ["every page", "every price", "every word"],
  badge: "WIN-WIN",
});

deck.build();
