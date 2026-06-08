import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const outDir = path.join(process.cwd(), "public", "blog", "siamese-network");
const coverDir = path.join(process.cwd(), "public", "edition-art");

fs.mkdirSync(outDir, { recursive: true });
fs.mkdirSync(coverDir, { recursive: true });

const W = 1491;
const H = 1055;

function esc(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function lines(text, max = 22) {
  const words = String(text).split(/\s+/);
  const result = [];
  let current = "";
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > max && current) {
      result.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) result.push(current);
  return result;
}

function textBlock(text, x, y, options = {}) {
  const {
    size = 32,
    color = "#0a1230",
    weight = 600,
    anchor = "start",
    max = 24,
    lineHeight = Math.round(size * 1.25),
    italic = false,
  } = options;
  const tspans = lines(text, max)
    .map((line, index) => `<tspan x="${x}" dy="${index === 0 ? 0 : lineHeight}">${esc(line)}</tspan>`)
    .join("");
  return `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="Inter, Arial, sans-serif" font-size="${size}" font-weight="${weight}" fill="${color}" font-style="${italic ? "italic" : "normal"}">${tspans}</text>`;
}

function title(text, subtitle) {
  return `
    <text x="${W / 2}" y="86" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="70" font-weight="700" fill="#07163f">${esc(text)}</text>
    <line x1="590" y1="118" x2="900" y2="118" stroke="#746bff" stroke-width="4" opacity="0.65"/>
    <circle cx="${W / 2}" cy="118" r="8" fill="#5f63f2"/>
    ${subtitle ? textBlock(subtitle, W / 2, 168, { size: 31, color: "#24375c", weight: 500, anchor: "middle", max: 86 }) : ""}
  `;
}

function defs() {
  return `
  <defs>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="10" stdDeviation="12" flood-color="#17203c" flood-opacity="0.12"/>
    </filter>
    <marker id="arrow" markerWidth="16" markerHeight="16" refX="13" refY="8" orient="auto" markerUnits="strokeWidth">
      <path d="M1,1 L15,8 L1,15 Z" fill="#16244d"/>
    </marker>
    <marker id="arrowBlue" markerWidth="16" markerHeight="16" refX="13" refY="8" orient="auto" markerUnits="strokeWidth">
      <path d="M1,1 L15,8 L1,15 Z" fill="#2563eb"/>
    </marker>
  </defs>`;
}

function frame(body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    ${defs()}
    <rect width="${W}" height="${H}" fill="#fffef9"/>
    <radialGradient id="bg" cx="50%" cy="45%" r="60%">
      <stop offset="0%" stop-color="#f4f7ff"/>
      <stop offset="100%" stop-color="#fffef9"/>
    </radialGradient>
    <rect width="${W}" height="${H}" fill="url(#bg)" opacity="0.75"/>
    ${body}
  </svg>`;
}

function card(x, y, w, h, label, tone = "blue") {
  const stroke = tone === "green" ? "#78b56c" : tone === "purple" ? "#a78bfa" : "#8bb7ef";
  const fill = tone === "green" ? "#fbfff7" : tone === "purple" ? "#fbf8ff" : "#f9fbff";
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="24" fill="${fill}" stroke="${stroke}" stroke-width="2" filter="url(#shadow)"/>
  ${label ? textBlock(label, x + w / 2, y + 48, { size: 28, color: "#0a1a4a", weight: 700, anchor: "middle", max: Math.floor(w / 16) }) : ""}`;
}

function inputIcon(x, y, tone = "blue") {
  const stroke = tone === "purple" ? "#a78bfa" : "#7aa8e8";
  const fill = tone === "green" ? "#d9f5ee" : tone === "purple" ? "#ebe7ff" : "#eaf4ff";
  return `<rect x="${x}" y="${y}" width="145" height="120" rx="12" fill="${fill}" stroke="${stroke}" stroke-width="2"/>
    <path d="M${x + 20} ${y + 93} L${x + 55} ${y + 54} L${x + 88} ${y + 84} L${x + 112} ${y + 63} L${x + 134} ${y + 93} Z" fill="#9ab3dc" opacity="0.85"/>
    <circle cx="${x + 108}" cy="${y + 33}" r="14" fill="${tone === "purple" ? "#8f82d8" : "#7aa0d8"}"/>`;
}

function encoder(x, y, label = "Shared Encoder") {
  return `<rect x="${x}" y="${y}" width="320" height="185" rx="18" fill="#f7fbff" stroke="#8bb7ef" stroke-width="2" filter="url(#shadow)"/>
    ${textBlock(label, x + 160, y + 42, { size: 28, color: "#102464", weight: 700, anchor: "middle", max: 18 })}
    <circle cx="${x + 65}" cy="${y + 90}" r="9" fill="#fff" stroke="#2563eb" stroke-width="3"/>
    <circle cx="${x + 65}" cy="${y + 125}" r="9" fill="#fff" stroke="#2563eb" stroke-width="3"/>
    <circle cx="${x + 108}" cy="${y + 107}" r="9" fill="#fff" stroke="#2563eb" stroke-width="3"/>
    <circle cx="${x + 150}" cy="${y + 88}" r="9" fill="#fff" stroke="#2563eb" stroke-width="3"/>
    <circle cx="${x + 150}" cy="${y + 126}" r="9" fill="#fff" stroke="#2563eb" stroke-width="3"/>
    <line x1="${x + 74}" y1="${y + 90}" x2="${x + 99}" y2="${y + 107}" stroke="#2563eb" stroke-width="2"/>
    <line x1="${x + 74}" y1="${y + 125}" x2="${x + 99}" y2="${y + 107}" stroke="#2563eb" stroke-width="2"/>
    <line x1="${x + 117}" y1="${y + 107}" x2="${x + 141}" y2="${y + 88}" stroke="#2563eb" stroke-width="2"/>
    <line x1="${x + 117}" y1="${y + 107}" x2="${x + 141}" y2="${y + 126}" stroke="#2563eb" stroke-width="2"/>
    <rect x="${x + 228}" y="${y + 82}" width="18" height="58" rx="5" fill="#dbeafe" stroke="#60a5fa" stroke-width="2"/>
    <rect x="${x + 260}" y="${y + 60}" width="18" height="80" rx="5" fill="#cfe1ff" stroke="#60a5fa" stroke-width="2"/>
    <rect x="${x + 292}" y="${y + 42}" width="18" height="98" rx="5" fill="#bed5ff" stroke="#60a5fa" stroke-width="2"/>
    <text x="${x + 160}" y="${y + 137}" text-anchor="middle" font-family="Georgia, serif" font-size="34" fill="#111827">f_theta</text>`;
}

function vector(x, y, label, tone = "blue") {
  const fill = tone === "purple" ? "#c4b5fd" : "#93c5fd";
  return `<rect x="${x}" y="${y}" width="74" height="200" rx="18" fill="#ffffff" stroke="${tone === "purple" ? "#a78bfa" : "#8bb7ef"}" stroke-width="2" filter="url(#shadow)"/>
    <circle cx="${x + 37}" cy="${y + 34}" r="15" fill="${fill}"/>
    <circle cx="${x + 37}" cy="${y + 72}" r="15" fill="${fill}" opacity="0.85"/>
    <circle cx="${x + 37}" cy="${y + 110}" r="15" fill="${fill}" opacity="0.72"/>
    <circle cx="${x + 37}" cy="${y + 148}" r="15" fill="${fill}" opacity="0.58"/>
    <text x="${x + 37}" y="${y - 20}" text-anchor="middle" font-family="Georgia, serif" font-size="31" fill="#0a1a4a">${label}</text>
    <text x="${x + 37}" y="${y + 188}" text-anchor="middle" font-family="Georgia, serif" font-size="34" fill="#0a1a4a">...</text>`;
}

function arrow(x1, y1, x2, y2, color = "#16244d", dashed = false) {
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="4" stroke-dasharray="${dashed ? "10 9" : "0"}" marker-end="url(#arrow)"/>`;
}

async function writePng(file, svg) {
  await sharp(Buffer.from(svg)).png().toFile(path.join(outDir, file));
}

const structure = frame(`
  ${title("Siamese Network Structure", "")}
  ${textBlock("Input A", 150, 202, { size: 30, color: "#2563eb", weight: 700, anchor: "middle" })}
  ${inputIcon(78, 230, "blue")}
  ${textBlock("Input B", 150, 626, { size: 30, color: "#6d5bd0", weight: 700, anchor: "middle" })}
  ${inputIcon(78, 654, "purple")}
  ${arrow(255, 292, 350, 292)}
  ${arrow(255, 716, 350, 716)}
  ${encoder(360, 220)}
  ${encoder(360, 644)}
  <path d="M520 420 C520 500,520 570,520 644" stroke="#2563eb" stroke-width="3" stroke-dasharray="9 8" fill="none"/>
  <circle cx="520" cy="532" r="46" fill="#fff" stroke="#8bb7ef" stroke-width="2" filter="url(#shadow)"/>
  <text x="520" y="544" text-anchor="middle" font-family="Arial, sans-serif" font-size="38" fill="#2563eb">link</text>
  ${textBlock("shared weights", 520, 605, { size: 22, color: "#2563eb", weight: 700, anchor: "middle" })}
  ${arrow(680, 292, 775, 292)}
  ${arrow(680, 716, 775, 716)}
  ${vector(810, 205, "z1", "blue")}
  ${vector(810, 629, "z2", "purple")}
  <path d="M884 305 H1110 Q1145 305 1145 340 V430" fill="none" stroke="#16244d" stroke-width="4" marker-end="url(#arrow)"/>
  <path d="M884 730 H1110 Q1145 730 1145 695 V590" fill="none" stroke="#16244d" stroke-width="4" marker-end="url(#arrow)"/>
  <rect x="1052" y="438" width="260" height="150" rx="22" fill="#fbf9ff" stroke="#b9a8ff" stroke-width="2" filter="url(#shadow)"/>
  ${textBlock("Distance", 1182, 492, { size: 30, color: "#5b3f96", weight: 700, anchor: "middle" })}
  <text x="1182" y="548" text-anchor="middle" font-family="Georgia, serif" font-size="33" fill="#111827">d = ||z1 - z2||2</text>
  ${arrow(1312, 513, 1400, 513)}
  <rect x="1408" y="420" width="148" height="190" rx="20" fill="#f4fffb" stroke="#70b7a6" stroke-width="2" filter="url(#shadow)" transform="translate(-80,0)"/>
  <circle cx="1402" cy="475" r="36" fill="#effdf8" stroke="#70b7a6" stroke-width="3"/>
  <path d="M1384 475 L1396 488 L1423 456" fill="none" stroke="#70b7a6" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
  ${textBlock("Same / Different", 1402, 545, { size: 29, color: "#0f766e", weight: 700, anchor: "middle", max: 10 })}
`);

const similarity = frame(`
  ${title("Learning a Similarity Space", "")}
  <rect x="70" y="210" width="315" height="175" rx="18" fill="#fff" stroke="#9bbcff" stroke-width="2" filter="url(#shadow)"/>
  <rect x="105" y="185" width="175" height="44" rx="12" fill="#f2f7ff" stroke="#8bb7ef" stroke-width="2"/>
  ${textBlock("Positive Pair", 192, 216, { size: 25, color: "#2563eb", weight: 700, anchor: "middle" })}
  ${inputIcon(105, 252, "blue")}
  ${inputIcon(222, 252, "blue")}
  ${textBlock("similar pair", 228, 418, { size: 24, color: "#2563eb", weight: 700, anchor: "middle" })}
  <rect x="70" y="510" width="315" height="175" rx="18" fill="#fff" stroke="#c4b5fd" stroke-width="2" filter="url(#shadow)"/>
  <rect x="102" y="485" width="175" height="44" rx="12" fill="#fbf8ff" stroke="#c4b5fd" stroke-width="2"/>
  ${textBlock("Negative Pair", 190, 516, { size: 25, color: "#6d5bd0", weight: 700, anchor: "middle" })}
  ${inputIcon(105, 552, "purple")}
  ${inputIcon(222, 552, "green")}
  ${textBlock("different pair", 228, 718, { size: 24, color: "#6d5bd0", weight: 700, anchor: "middle" })}
  ${arrow(405, 300, 485, 300)}
  ${arrow(405, 600, 485, 600)}
  ${encoder(500, 380)}
  <path d="M660 565 C660 620,660 665,660 710" stroke="#2563eb" stroke-width="3" stroke-dasharray="9 8" fill="none"/>
  <circle cx="660" cy="730" r="44" fill="#fff" stroke="#8bb7ef" stroke-width="2" filter="url(#shadow)"/>
  <text x="660" y="742" text-anchor="middle" font-family="Arial, sans-serif" font-size="36" fill="#2563eb">link</text>
  ${textBlock("shared weights", 660, 802, { size: 22, color: "#2563eb", weight: 700, anchor: "middle" })}
  ${arrow(820, 472, 900, 472)}
  <rect x="905" y="185" width="500" height="585" rx="18" fill="#ffffff" stroke="#8bb7ef" stroke-width="2" filter="url(#shadow)"/>
  ${textBlock("Embedding Space (2D)", 1155, 235, { size: 28, color: "#16244d", weight: 700, anchor: "middle" })}
  <line x1="975" y1="500" x2="1336" y2="500" stroke="#16244d" stroke-width="3" marker-end="url(#arrow)"/>
  <line x1="1155" y1="700" x2="1155" y2="300" stroke="#16244d" stroke-width="3" marker-end="url(#arrow)"/>
  <text x="1345" y="492" font-family="Georgia, serif" font-size="27" fill="#16244d">z1</text>
  <text x="1165" y="314" font-family="Georgia, serif" font-size="27" fill="#16244d">z2</text>
  <ellipse cx="1075" cy="395" rx="80" ry="65" fill="#eff6ff" stroke="#60a5fa" stroke-width="2" stroke-dasharray="6 6"/>
  <circle cx="1042" cy="380" r="16" fill="#3b82f6"/>
  <circle cx="1115" cy="425" r="16" fill="#60a5fa"/>
  <line x1="1042" y1="380" x2="1115" y2="425" stroke="#16244d" stroke-width="2" stroke-dasharray="7 6"/>
  <text x="1082" y="422" font-family="Georgia, serif" font-size="30" fill="#111827">d</text>
  ${textBlock("similar examples pull together", 990, 326, { size: 20, color: "#2563eb", weight: 700, max: 14 })}
  <ellipse cx="1265" cy="385" rx="80" ry="65" fill="#faf5ff" stroke="#8b5cf6" stroke-width="2" stroke-dasharray="6 6"/>
  <circle cx="1235" cy="405" r="15" fill="#8b5cf6"/>
  <circle cx="1288" cy="370" r="15" fill="#a78bfa"/>
  <line x1="1235" y1="405" x2="1288" y2="370" stroke="#16244d" stroke-width="2" stroke-dasharray="7 6"/>
  <text x="1260" y="402" font-family="Georgia, serif" font-size="30" fill="#111827">d</text>
  <ellipse cx="1020" cy="610" rx="70" ry="58" fill="#ecfdf5" stroke="#14b8a6" stroke-width="2" stroke-dasharray="6 6"/>
  <circle cx="1000" cy="604" r="14" fill="#14b8a6"/>
  <circle cx="1040" cy="632" r="14" fill="#5eead4"/>
  <ellipse cx="1320" cy="625" rx="62" ry="52" fill="#faf5ff" stroke="#8b5cf6" stroke-width="2" stroke-dasharray="6 6"/>
  <circle cx="1300" cy="625" r="14" fill="#8b5cf6"/>
  <circle cx="1340" cy="606" r="14" fill="#a78bfa"/>
  <line x1="1075" y1="606" x2="1260" y2="625" stroke="#16244d" stroke-width="3" stroke-dasharray="7 7" marker-end="url(#arrow)"/>
  <text x="1160" y="605" font-family="Georgia, serif" font-size="31" fill="#111827">m</text>
  ${textBlock("different examples push apart", 1185, 678, { size: 20, color: "#6d5bd0", weight: 700, max: 14 })}
  <rect x="430" y="850" width="640" height="90" rx="18" fill="#fbf9ff" stroke="#c4b5fd" stroke-width="2" filter="url(#shadow)"/>
  <text x="750" y="908" text-anchor="middle" font-family="Georgia, serif" font-size="34" fill="#111827">L = y d^2 + (1-y) max(0, m-d)^2</text>
`);

function stepCard(x, y, w, h, n, heading, body, tone = "blue") {
  const stroke = tone === "green" ? "#7ec7ad" : tone === "purple" ? "#b9a8ff" : "#8bb7ef";
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="18" fill="#fff" stroke="${stroke}" stroke-width="2" filter="url(#shadow)"/>
    <circle cx="${x + w / 2}" cy="${y + 48}" r="28" fill="${tone === "green" ? "#39a37f" : tone === "purple" ? "#7966db" : "#3577dc"}"/>
    <text x="${x + w / 2}" y="${y + 59}" text-anchor="middle" font-family="Inter, Arial" font-size="31" font-weight="800" fill="#fff">${n}</text>
    ${textBlock(heading, x + w / 2, y + 112, { size: 26, color: tone === "green" ? "#0f766e" : "#2563eb", weight: 700, anchor: "middle", max: Math.floor(w / 13) })}
    ${body}`;
}

const workflow = frame(`
  ${title("Siamese Network Workflow", "")}
  <path d="M80 185 H1200" stroke="#2563eb" stroke-width="3" fill="none"/>
  <path d="M80 185 C80 185,80 200,80 205" stroke="#2563eb" stroke-width="3" fill="none"/>
  <path d="M1200 185 C1200 185,1200 200,1200 205" stroke="#2563eb" stroke-width="3" fill="none"/>
  ${textBlock("Training", 640, 168, { size: 31, color: "#2563eb", weight: 700, anchor: "middle" })}
  <path d="M1240 185 H1420" stroke="#16a085" stroke-width="3" fill="none"/>
  ${textBlock("Inference", 1330, 168, { size: 31, color: "#0f766e", weight: 700, anchor: "middle" })}
  ${stepCard(55, 225, 205, 600, "1", "Create Pairs", `
    <rect x="85" y="350" width="145" height="115" rx="12" fill="#f4f8ff" stroke="#adc7ff"/>
    ${textBlock("Positive Pair", 157, 383, { size: 20, color: "#2563eb", weight: 700, anchor: "middle" })}
    ${inputIcon(90, 405, "blue")}
    <rect x="85" y="560" width="145" height="115" rx="12" fill="#fbf8ff" stroke="#c4b5fd"/>
    ${textBlock("Negative Pair", 157, 593, { size: 20, color: "#6d5bd0", weight: 700, anchor: "middle" })}
    ${inputIcon(90, 615, "purple")}
  `)}
  ${arrow(260, 520, 315, 520)}
  ${stepCard(320, 225, 320, 600, "2", "Shared Encoder", `
    <text x="480" y="385" text-anchor="middle" font-family="Georgia, serif" font-size="30" fill="#111827">same network</text>
    ${encoder(365, 430, "")}
    <path d="M525 625 C525 655,525 690,525 720" stroke="#2563eb" stroke-width="3" stroke-dasharray="8 7"/>
    ${textBlock("shared weights", 525, 755, { size: 20, color: "#2563eb", weight: 700, anchor: "middle" })}
  `)}
  ${arrow(640, 520, 690, 520)}
  ${stepCard(695, 225, 210, 600, "3", "Compute Distance", `
    ${vector(730, 420, "z1", "blue")}
    ${vector(810, 530, "z2", "purple")}
    <line x1="780" y1="565" x2="846" y2="565" stroke="#16244d" stroke-width="3" stroke-dasharray="7 6"/>
    <text x="810" y="550" text-anchor="middle" font-family="Georgia, serif" font-size="26" fill="#111827">d</text>
  `)}
  ${arrow(905, 520, 955, 520)}
  ${stepCard(960, 225, 260, 600, "4", "Contrastive Loss", `
    <rect x="995" y="350" width="190" height="250" rx="15" fill="#fbf9ff" stroke="#c4b5fd" stroke-width="2"/>
    <text x="1090" y="420" text-anchor="middle" font-family="Georgia, serif" font-size="31" fill="#111827">L = y d^2</text>
    <text x="1090" y="470" text-anchor="middle" font-family="Georgia, serif" font-size="26" fill="#111827">+ (1-y)</text>
    <text x="1090" y="515" text-anchor="middle" font-family="Georgia, serif" font-size="24" fill="#111827">max(0,m-d)^2</text>
    ${textBlock("same: pull closer", 1090, 650, { size: 20, color: "#2563eb", weight: 700, anchor: "middle", max: 18 })}
    ${textBlock("different: push apart", 1090, 715, { size: 20, color: "#6d5bd0", weight: 700, anchor: "middle", max: 18 })}
  `, "purple")}
  ${arrow(1220, 520, 1270, 520)}
  ${stepCard(1275, 225, 180, 600, "5", "Inference", `
    <rect x="1300" y="390" width="130" height="230" rx="15" fill="#f4fffb" stroke="#7ec7ad" stroke-width="2"/>
    ${textBlock("Threshold Decision", 1365, 430, { size: 20, color: "#0f766e", weight: 700, anchor: "middle", max: 13 })}
    <text x="1365" y="500" text-anchor="middle" font-family="Georgia, serif" font-size="30" fill="#111827">d &lt; t</text>
    ${textBlock("same", 1365, 540, { size: 22, color: "#0f766e", weight: 700, anchor: "middle" })}
    <line x1="1322" y1="575" x2="1408" y2="575" stroke="#0f766e" stroke-width="2" stroke-dasharray="7 6"/>
    <text x="1365" y="635" text-anchor="middle" font-family="Georgia, serif" font-size="30" fill="#111827">d &gt;= t</text>
    ${textBlock("different", 1365, 675, { size: 22, color: "#0f766e", weight: 700, anchor: "middle" })}
  `, "green")}
  <rect x="360" y="880" width="820" height="70" rx="13" fill="#fff" stroke="#cbd5e1" stroke-width="2" filter="url(#shadow)"/>
  ${textBlock("same class", 510, 924, { size: 22, color: "#1d4ed8", weight: 600, anchor: "middle" })}
  ${textBlock("different class", 720, 924, { size: 22, color: "#6d5bd0", weight: 600, anchor: "middle" })}
  ${textBlock("data flow", 930, 924, { size: 22, color: "#16244d", weight: 600, anchor: "middle" })}
  ${textBlock("weight sharing", 1090, 924, { size: 22, color: "#2563eb", weight: 600, anchor: "middle" })}
`);

await writePng("siamese-01-structure.png", structure);
await writePng("siamese-02-similarity-space.png", similarity);
await writePng("siamese-03-workflow.png", workflow);

const cover = `<svg viewBox="0 0 320 160" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="arrow-siamese" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7 Z" fill="#6c5ce7"/></marker>
    <marker id="arrow-siamese-teal" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7 Z" fill="#00b894"/></marker>
  </defs>
  <rect x="26" y="35" width="50" height="38" rx="8" fill="#f3f0ff" stroke="#6c5ce7" stroke-width="1.6"/>
  <path d="M35 63 L47 50 L58 60 L64 54 L70 64" stroke="#a29bfe" stroke-width="2" fill="none"/>
  <circle cx="61" cy="47" r="4" fill="#6c5ce7" opacity="0.7"/>
  <text x="51" y="89" text-anchor="middle" fill="#6c5ce7" font-size="10" font-family="Inter, Arial, sans-serif" font-weight="800">x1</text>
  <rect x="26" y="96" width="50" height="38" rx="8" fill="#eefbf8" stroke="#00b894" stroke-width="1.6"/>
  <path d="M35 124 L47 111 L58 121 L64 115 L70 125" stroke="#55d8c7" stroke-width="2" fill="none"/>
  <circle cx="61" cy="108" r="4" fill="#00b894" opacity="0.7"/>
  <text x="51" y="150" text-anchor="middle" fill="#00a98f" font-size="10" font-family="Inter, Arial, sans-serif" font-weight="800">x2</text>
  <rect x="118" y="48" width="78" height="72" rx="13" fill="#fbfbff" stroke="#b8b1ff" stroke-width="1.7"/>
  <text x="157" y="69" text-anchor="middle" fill="#332f57" font-size="10" font-family="Inter, Arial, sans-serif" font-weight="800">shared</text>
  <text x="157" y="83" text-anchor="middle" fill="#332f57" font-size="10" font-family="Inter, Arial, sans-serif" font-weight="800">encoder</text>
  <circle cx="141" cy="100" r="4.5" fill="#6c5ce7"/><circle cx="158" cy="100" r="4.5" fill="#00b894"/><circle cx="175" cy="100" r="4.5" fill="#a29bfe"/>
  <path d="M139 108 L175 108" stroke="#c9c3ff" stroke-width="1.6" stroke-dasharray="4 4"/>
  <path d="M77 54 C94 54, 99 66, 113 75" stroke="#6c5ce7" stroke-width="1.9" marker-end="url(#arrow-siamese)"/>
  <path d="M77 115 C94 115, 99 103, 113 94" stroke="#00b894" stroke-width="1.9" marker-end="url(#arrow-siamese-teal)"/>
  <path d="M104 38 C120 28, 191 28, 208 38" stroke="#9b95ff" stroke-width="1.6" stroke-dasharray="5 5"/>
  <text x="156" y="27" text-anchor="middle" fill="#8b84a6" font-size="9" font-family="Inter, Arial, sans-serif" font-weight="700">same weights</text>
  <rect x="224" y="40" width="18" height="72" rx="7" fill="#f3f0ff" stroke="#6c5ce7"/>
  <circle cx="233" cy="54" r="4" fill="#6c5ce7"/><circle cx="233" cy="72" r="4" fill="#a29bfe"/><circle cx="233" cy="90" r="4" fill="#c4b5fd"/>
  <text x="233" y="126" text-anchor="middle" fill="#6c5ce7" font-size="10" font-family="Inter, Arial, sans-serif" font-weight="800">z1</text>
  <rect x="255" y="40" width="18" height="72" rx="7" fill="#eefbf8" stroke="#00b894"/>
  <circle cx="264" cy="54" r="4" fill="#00b894"/><circle cx="264" cy="72" r="4" fill="#55d8c7"/><circle cx="264" cy="90" r="4" fill="#99f6e4"/>
  <text x="264" y="126" text-anchor="middle" fill="#00a98f" font-size="10" font-family="Inter, Arial, sans-serif" font-weight="800">z2</text>
  <path d="M196 84 H218" stroke="#6c5ce7" stroke-width="1.9" marker-end="url(#arrow-siamese)"/>
  <line x1="242" y1="78" x2="255" y2="78" stroke="#8b84a6" stroke-width="1.5" stroke-dasharray="3 3"/>
  <text x="248.5" y="73" text-anchor="middle" fill="#332f57" font-size="10" font-family="Georgia, serif" font-weight="700">d</text>
  <rect x="232" y="132" width="62" height="18" rx="9" fill="#f7f4ff" stroke="#d8d2ff"/>
  <text x="263" y="145" text-anchor="middle" fill="#6c5ce7" font-size="9" font-family="Inter, Arial, sans-serif" font-weight="800">compare</text>
</svg>`;
fs.writeFileSync(path.join(coverDir, "blog-siamese-network.svg"), cover);

console.log("Generated Siamese blog PNG assets.");
