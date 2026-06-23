
from IPython.display import HTML, display
import uuid

uid = str(uuid.uuid4())[:8]

html_code = r"""
<div id="transfer-page-__UID__">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">

  <style>
    #transfer-page-__UID__ {
      --white: #ffffff;
      --black: #1d1d1f;
      --gray1: #f5f5f7;
      --gray2: #e8e8ed;
      --gray3: #6e6e73;
      --gray4: #aeaeb2;
      --blue: #0071e3;
      --blue2: #2b8cff;
      --blueLight: #e8f0fe;
      --green: #2d7c46;
      --greenSoft: #eaf6ef;
      --orange: #b25a17;
      --orangeSoft: #faeeda;
      --purple: #5d4fc4;
      --purpleSoft: #efedff;
      --shadow: 0 18px 40px rgba(0, 77, 163, 0.06);
      --radius: 20px;
      --panel: rgba(255,255,255,0.74);
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      -webkit-font-smoothing: antialiased;
      color: var(--black);
    }

    #transfer-page-__UID__ * { box-sizing: border-box; margin: 0; padding: 0; }

    #transfer-page-__UID__ .page {
      max-width: 1380px;
      margin: 18px auto;
      min-height: 100vh;
      background:
        radial-gradient(circle at top right, rgba(0,113,227,0.06), transparent 26%),
        linear-gradient(to bottom, #ffffff 0%, #fbfcff 100%);
      border: 1px solid rgba(0,0,0,0.04);
      border-radius: 28px;
      overflow: hidden;
      box-shadow: 0 18px 44px rgba(34, 62, 132, 0.08);
    }

    #transfer-page-__UID__ .nav {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 32px;
      border-bottom: 0.5px solid var(--gray2);
      background: rgba(255,255,255,0.9);
      backdrop-filter: blur(18px);
      position: sticky;
      top: 0;
      z-index: 10;
    }

    #transfer-page-__UID__ .nav-back {
      display: flex;
      align-items: center;
      gap: 6px;
      color: var(--blue);
      font-size: 13px;
      font-weight: 500;
    }

    #transfer-page-__UID__ .nav-brand { font-size: 13px; font-weight: 600; }
    #transfer-page-__UID__ .nav-status { font-size: 13px; color: var(--gray4); }

    #transfer-page-__UID__ .hero {
      padding: 42px 32px 28px;
      border-bottom: 0.5px solid var(--gray2);
    }

    #transfer-page-__UID__ .hero-shell {
      max-width: 1240px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: minmax(0, 1.25fr) minmax(320px, 0.75fr);
      gap: 18px;
      align-items: start;
    }

    #transfer-page-__UID__ .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: var(--blueLight);
      color: var(--blue);
      font-size: 11px;
      font-weight: 500;
      padding: 4px 12px;
      border-radius: 999px;
      margin-bottom: 14px;
      letter-spacing: .01em;
    }

    #transfer-page-__UID__ h1 {
      font-size: clamp(30px, 4vw, 42px);
      font-weight: 700;
      letter-spacing: -0.03em;
      line-height: 1.05;
      margin-bottom: 10px;
    }

    #transfer-page-__UID__ h1 span {
      background: linear-gradient(135deg, var(--blue), #58a6ff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    #transfer-page-__UID__ .desc {
      font-size: 15px;
      color: var(--gray3);
      line-height: 1.65;
      max-width: 760px;
      margin-bottom: 22px;
    }

    #transfer-page-__UID__ .meta { display: flex; flex-wrap: wrap; gap: 20px; }
    #transfer-page-__UID__ .meta-item { font-size: 12px; color: var(--gray4); }
    #transfer-page-__UID__ .meta-item span { color: var(--black); font-weight: 600; }

    #transfer-page-__UID__ .hero-panel {
      background: linear-gradient(180deg,#fbfdff 0%, #f4f8ff 100%);
      border: 1px solid rgba(0,113,227,0.08);
      border-radius: 20px;
      padding: 18px;
      box-shadow: var(--shadow);
    }

    #transfer-page-__UID__ .hero-panel-label {
      font-size: 10px;
      color: var(--gray4);
      letter-spacing: .08em;
      text-transform: uppercase;
      margin-bottom: 10px;
      font-weight: 600;
    }

    #transfer-page-__UID__ .hero-panel-title {
      font-size: 16px;
      font-weight: 600;
      letter-spacing: -.02em;
      margin-bottom: 14px;
    }

    #transfer-page-__UID__ .hero-points { display: flex; flex-direction: column; gap: 12px; }

    #transfer-page-__UID__ .hero-point {
      display: flex;
      gap: 10px;
      padding: 12px 14px;
      border-radius: 14px;
      background: rgba(255,255,255,0.72);
      border: 1px solid rgba(0,0,0,0.04);
    }

    #transfer-page-__UID__ .dot {
      width: 9px;
      height: 9px;
      border-radius: 50%;
      margin-top: 5px;
      flex: none;
    }

    #transfer-page-__UID__ .hero-point strong { display: block; font-size: 12px; margin-bottom: 2px; }
    #transfer-page-__UID__ .hero-point span { font-size: 12px; color: var(--gray3); line-height: 1.5; }

    #transfer-page-__UID__ .main {
      max-width: 1240px;
      margin: 0 auto;
      padding: 30px 32px 36px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    #transfer-page-__UID__ .section-label {
      font-size: 11px;
      font-weight: 500;
      color: var(--gray3);
      letter-spacing: .07em;
      text-transform: uppercase;
      margin-bottom: 2px;
    }

    #transfer-page-__UID__ .panel {
      background: var(--panel);
      border: 1px solid rgba(0,0,0,0.05);
      border-radius: var(--radius);
      box-shadow: var(--shadow);
      backdrop-filter: blur(18px);
    }

    #transfer-page-__UID__ .controls-shell {
      padding: 18px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    #transfer-page-__UID__ .controls-head h2 {
      font-size: 18px;
      font-weight: 600;
      letter-spacing: -0.02em;
      margin-bottom: 2px;
    }

    #transfer-page-__UID__ .controls-head .sub {
      font-size: 13px;
      color: var(--gray3);
      line-height: 1.55;
    }

    #transfer-page-__UID__ .controls-grid {
      display: grid;
      grid-template-columns: 1.25fr 1fr 1fr 1fr;
      gap: 14px;
      align-items: stretch;
    }

    #transfer-page-__UID__ .control-block {
      padding: 14px;
      border-radius: 16px;
      background: rgba(255,255,255,0.78);
      border: 1px solid rgba(0,0,0,0.04);
    }

    #transfer-page-__UID__ .control-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      margin-bottom: 8px;
    }

    #transfer-page-__UID__ .control-label {
      font-size: 12px;
      font-weight: 600;
      color: var(--black);
      letter-spacing: -0.01em;
    }

    #transfer-page-__UID__ .control-value {
      font-size: 12px;
      color: var(--gray4);
      font-weight: 600;
    }

    #transfer-page-__UID__ .control-help {
      font-size: 12px;
      color: var(--gray3);
      line-height: 1.45;
      margin-top: 8px;
    }

    #transfer-page-__UID__ input[type="range"] {
      width: 100%;
      accent-color: var(--blue);
      cursor: pointer;
    }

    #transfer-page-__UID__ .chip-row,
    #transfer-page-__UID__ .seg-row,
    #transfer-page-__UID__ .play-row {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    #transfer-page-__UID__ .chip,
    #transfer-page-__UID__ .seg-btn,
    #transfer-page-__UID__ .play-btn {
      border: 1px solid rgba(0,0,0,0.06);
      background: rgba(255,255,255,0.82);
      color: var(--black);
      border-radius: 999px;
      padding: 8px 14px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: .16s ease;
      font-family: inherit;
    }

    #transfer-page-__UID__ .chip:hover,
    #transfer-page-__UID__ .seg-btn:hover,
    #transfer-page-__UID__ .play-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    }

    #transfer-page-__UID__ .chip.active,
    #transfer-page-__UID__ .seg-btn.active,
    #transfer-page-__UID__ .play-btn.playing {
      background: var(--blue);
      color: #fff;
      border-color: transparent;
    }

    #transfer-page-__UID__ .check-row {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-top: 4px;
    }

    #transfer-page-__UID__ .toggle {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      color: var(--gray3);
      font-weight: 500;
    }

    #transfer-page-__UID__ .layout {
      display: grid;
      grid-template-columns: minmax(0, 1.22fr) minmax(320px, 0.78fr);
      gap: 16px;
      align-items: start;
    }

    #transfer-page-__UID__ .viz-shell,
    #transfer-page-__UID__ .side-shell {
      padding: 18px;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    #transfer-page-__UID__ .card {
      background: rgba(255,255,255,0.78);
      border: 1px solid rgba(0,0,0,0.05);
      border-radius: 18px;
      padding: 14px;
    }

    #transfer-page-__UID__ .card-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 10px;
    }

    #transfer-page-__UID__ .card-title { font-size: 13px; font-weight: 600; letter-spacing: -0.01em; }
    #transfer-page-__UID__ .card-sub { font-size: 11px; color: var(--gray4); }

    #transfer-page-__UID__ .step-strip {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 8px;
      margin-bottom: 12px;
    }

    #transfer-page-__UID__ .step-card {
      padding: 10px 12px;
      border-radius: 14px;
      background: var(--gray1);
      border: 1px solid rgba(0,0,0,0.04);
      transition: all .18s ease;
    }

    #transfer-page-__UID__ .step-card.active {
      background: #eef5ff;
      border-color: rgba(0,113,227,0.16);
      box-shadow: 0 0 0 2px rgba(0,113,227,0.08) inset;
    }

    #transfer-page-__UID__ .step-label {
      font-size: 10px;
      color: var(--gray4);
      letter-spacing: .07em;
      text-transform: uppercase;
      font-weight: 600;
      margin-bottom: 6px;
    }

    #transfer-page-__UID__ .step-name {
      font-size: 12px;
      font-weight: 600;
      color: var(--black);
      margin-bottom: 4px;
    }

    #transfer-page-__UID__ .step-note {
      font-size: 11px;
      color: var(--gray3);
      line-height: 1.45;
    }

    #transfer-page-__UID__ .network-board {
      border-radius: 16px;
      overflow: hidden;
      background: linear-gradient(to bottom, rgba(243,247,255,0.75), rgba(255,255,255,0.94));
      border: 1px solid rgba(0,0,0,0.04);
      padding: 18px;
      margin-bottom: 14px;
    }

    #transfer-page-__UID__ .stage-grid {
      display: grid;
      grid-template-columns: 220px 1fr 240px;
      gap: 16px;
      align-items: center;
    }

    #transfer-page-__UID__ .task-card {
      border-radius: 18px;
      background: rgba(255,255,255,0.88);
      border: 1px solid rgba(0,0,0,0.05);
      padding: 14px;
      min-height: 212px;
    }

    #transfer-page-__UID__ .task-title {
      font-size: 11px;
      color: var(--gray4);
      letter-spacing: .07em;
      text-transform: uppercase;
      font-weight: 600;
      margin-bottom: 8px;
    }

    #transfer-page-__UID__ .task-name {
      font-size: 16px;
      font-weight: 700;
      letter-spacing: -0.02em;
      margin-bottom: 8px;
    }

    #transfer-page-__UID__ .task-desc {
      font-size: 12px;
      color: var(--gray3);
      line-height: 1.6;
      margin-bottom: 12px;
      min-height: 56px;
    }

    #transfer-page-__UID__ .token-row {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 8px;
    }

    #transfer-page-__UID__ .token {
      display: inline-flex;
      align-items: center;
      border-radius: 999px;
      padding: 6px 10px;
      background: var(--blueLight);
      color: var(--blue);
      font-size: 11px;
      font-weight: 600;
    }

    #transfer-page-__UID__ .token.green { background: var(--greenSoft); color: var(--green); }
    #transfer-page-__UID__ .token.orange { background: var(--orangeSoft); color: var(--orange); }
    #transfer-page-__UID__ .token.purple { background: var(--purpleSoft); color: var(--purple); }

    #transfer-page-__UID__ .network-shell {
      min-height: 300px;
      position: relative;
    }

    #transfer-page-__UID__ svg {
      width: 100%;
      height: 300px;
      display: block;
    }

    #transfer-page-__UID__ .mini-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    #transfer-page-__UID__ .mini-card {
      border-radius: 16px;
      padding: 14px;
      background: rgba(255,255,255,0.86);
      border: 1px solid rgba(0,0,0,0.05);
    }

    #transfer-page-__UID__ .mini-label {
      font-size: 10px;
      color: var(--gray4);
      letter-spacing: .07em;
      text-transform: uppercase;
      font-weight: 600;
      margin-bottom: 8px;
    }

    #transfer-page-__UID__ .formula-line {
      font-size: 13px;
      color: var(--black);
      line-height: 1.7;
      font-weight: 500;
    }

    #transfer-page-__UID__ .formula-line strong { color: var(--blue); }

    #transfer-page-__UID__ .explain-body {
      font-size: 12.5px;
      color: var(--gray3);
      line-height: 1.65;
    }

    #transfer-page-__UID__ .status-pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 600;
      border: 1px solid transparent;
      margin-bottom: 10px;
    }

    #transfer-page-__UID__ .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }

    #transfer-page-__UID__ .strong-fit { background: #eaf6ef; color: var(--green); border-color: rgba(45,124,70,0.16); }
    #transfer-page-__UID__ .strong-fit .status-dot { background: var(--green); }

    #transfer-page-__UID__ .weak-fit { background: #faeeda; color: var(--orange); border-color: rgba(178,90,23,0.16); }
    #transfer-page-__UID__ .weak-fit .status-dot { background: var(--orange); }

    #transfer-page-__UID__ .poor-fit { background: #fdeceb; color: #b13c2d; border-color: rgba(177,60,45,0.16); }
    #transfer-page-__UID__ .poor-fit .status-dot { background: #b13c2d; }

    #transfer-page-__UID__ .metric-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-bottom: 10px;
    }

    #transfer-page-__UID__ .metric {
      border-radius: 14px;
      padding: 12px;
      background: var(--gray1);
    }

    #transfer-page-__UID__ .metric-label { font-size: 11px; color: var(--gray4); margin-bottom: 4px; }
    #transfer-page-__UID__ .metric-value { font-size: 20px; font-weight: 600; letter-spacing: -0.03em; }

    #transfer-page-__UID__ .list-rows {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    #transfer-page-__UID__ .list-row {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      padding: 10px 12px;
      border-radius: 14px;
      background: var(--gray1);
      font-size: 12px;
    }

    #transfer-page-__UID__ .list-row strong { color: var(--black); }
    #transfer-page-__UID__ .list-row span { color: var(--gray3); line-height: 1.5; text-align: right; }

    #transfer-page-__UID__ .formula-box,
    #transfer-page-__UID__ .takeaway-box {
      font-size: 12.5px;
      color: var(--black);
      background: var(--gray1);
      border-radius: 14px;
      padding: 14px 16px;
      line-height: 1.8;
    }

    #transfer-page-__UID__ .formula-box strong,
    #transfer-page-__UID__ .takeaway-box strong {
      color: var(--blue);
    }

    #transfer-page-__UID__ .footer-strip {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 18px 32px 24px;
      border-top: 0.5px solid var(--gray2);
      font-size: 12px;
      color: var(--gray4);
    }

    @media (max-width: 1120px) {
      #transfer-page-__UID__ .controls-grid { grid-template-columns: 1fr 1fr; }
      #transfer-page-__UID__ .hero-shell { grid-template-columns: 1fr; }
      #transfer-page-__UID__ .layout { grid-template-columns: 1fr; }
      #transfer-page-__UID__ .stage-grid { grid-template-columns: 1fr; }
    }

    @media (max-width: 760px) {
      #transfer-page-__UID__ .mini-grid,
      #transfer-page-__UID__ .metric-grid,
      #transfer-page-__UID__ .step-strip {
        grid-template-columns: 1fr;
      }
      #transfer-page-__UID__ .hero,
      #transfer-page-__UID__ .main {
        padding-left: 18px;
        padding-right: 18px;
      }
      #transfer-page-__UID__ svg { height: 340px; }
    }
  </style>

  <div class="page">
    <nav class="nav">
      <div class="nav-back">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8l4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        Deep Learning Strategy
      </div>
      <div class="nav-brand">Interactive Lab</div>
      <div class="nav-status" id="navStatus">Step 1 · pre-train on Task A</div>
    </nav>

    <section class="hero">
      <div class="hero-shell">
        <div>
          <div class="badge">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor"><circle cx="5" cy="5" r="5"/></svg>
            Module 3 · Reusing Learned Features
          </div>
          <h1>Transfer Learning<br><span>Intuition</span></h1>
          <p class="desc">
            A pretrained network has already learned useful low-level visual structure. Instead of starting from scratch, transfer learning keeps the reusable backbone, replaces the task-specific output head, and then fine-tunes on the new task.
          </p>
          <div class="meta">
            <div class="meta-item">Task A <span>More data</span></div>
            <div class="meta-item">Task B <span>Less data</span></div>
            <div class="meta-item">Backbone <span>Reusable features</span></div>
            <div class="meta-item">Head <span>Task-specific output</span></div>
          </div>
        </div>

        <div class="hero-panel">
          <div class="hero-panel-label">Key concepts</div>
          <div class="hero-panel-title">What to watch for</div>
          <div class="hero-points">
            <div class="hero-point">
              <div class="dot" style="background:#0071e3"></div>
              <div>
                <strong>Reuse the backbone</strong>
                <span>Early and middle layers often learn edges, textures, and shapes that can still help on a related task.</span>
              </div>
            </div>
            <div class="hero-point">
              <div class="dot" style="background:#2d7c46"></div>
              <div>
                <strong>Replace the old head</strong>
                <span>The final layer is usually tied to the original labels, so it is the part you most naturally remove and rebuild.</span>
              </div>
            </div>
            <div class="hero-point">
              <div class="dot" style="background:#b25a17"></div>
              <div>
                <strong>Fine-tune on new data</strong>
                <span>You then continue training on Task B so the reused features adapt to the new objective.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <main class="main">
      <div class="section-label">Interactive Playground</div>

      <section class="panel controls-shell">
        <div class="controls-head">
          <h2>Controls</h2>
          <p class="sub">Pick a task pair, move through the transfer-learning pipeline, and change the conditions that make transfer learning more or less appropriate.</p>
        </div>

        <div class="controls-grid">
          <div class="control-block">
            <div class="control-label" style="margin-bottom:10px;">Task pair</div>
            <div class="chip-row">
              <button class="chip active" data-pair="cat_radiology">Cats → Radiology</button>
              <button class="chip" data-pair="objects_leaf">Objects → Leaf disease</button>
              <button class="chip" data-pair="faces_masks">Faces → Mask detection</button>
            </div>
            <div class="control-help">Each pair keeps the same overall flow, but the data scale and feature reuse story can change.</div>
          </div>

          <div class="control-block">
            <div class="control-top">
              <div class="control-label">Data size for Task A</div>
              <div class="control-value" id="aDataValue">120k</div>
            </div>
            <input type="range" id="aDataSlider" min="20" max="200" step="5" value="120">
            <div class="control-help">Task A should usually have much more data than Task B if you want pretraining to be especially useful.</div>
          </div>

          <div class="control-block">
            <div class="control-top">
              <div class="control-label">Data size for Task B</div>
              <div class="control-value" id="bDataValue">8k</div>
            </div>
            <input type="range" id="bDataSlider" min="1" max="80" step="1" value="8">
            <div class="control-help">Smaller Task B datasets often benefit the most from a pretrained starting point.</div>
          </div>

          <div class="control-block">
            <div class="control-label" style="margin-bottom:10px;">Conditions</div>
            <div class="check-row">
              <label class="toggle"><input type="checkbox" id="sameInput" checked> Same input type</label>
              <label class="toggle"><input type="checkbox" id="reuseFeatures" checked> Low-level features reusable</label>
              <label class="toggle"><input type="checkbox" id="freezeBackbone"> Freeze most backbone layers</label>
            </div>
          </div>
        </div>
      </section>

      <div class="layout">
        <section class="panel viz-shell">
          <div class="card">
            <div class="card-head">
              <div>
                <div class="card-title">Transfer-learning pipeline</div>
                <div class="card-sub">Pre-train → remove old head → add new head → fine-tune</div>
              </div>
            </div>

            <div class="step-strip" id="stepStrip">
              <div class="step-card active" data-step-card="0">
                <div class="step-label">Step 1</div>
                <div class="step-name">Pre-train</div>
                <div class="step-note">Learn broad features on the large source task.</div>
              </div>
              <div class="step-card" data-step-card="1">
                <div class="step-label">Step 2</div>
                <div class="step-name">Remove old head</div>
                <div class="step-note">Detach the task-specific classifier from Task A.</div>
              </div>
              <div class="step-card" data-step-card="2">
                <div class="step-label">Step 3</div>
                <div class="step-name">Add new head</div>
                <div class="step-note">Attach a randomly initialized output layer for Task B.</div>
              </div>
              <div class="step-card" data-step-card="3">
                <div class="step-label">Step 4</div>
                <div class="step-name">Fine-tune</div>
                <div class="step-note">Update the new task model using Task B data.</div>
              </div>
            </div>

            <div class="play-row" style="margin-bottom:12px;">
              <button class="play-btn" id="prevBtn" type="button">← Prev</button>
              <button class="play-btn" id="nextBtn" type="button">Next →</button>
              <button class="play-btn" id="playBtn" type="button">Auto-play</button>
            </div>

            <div class="network-board">
              <div class="stage-grid">
                <div class="task-card">
                  <div class="task-title">Task A</div>
                  <div class="task-name" id="taskAName">Cat recognition</div>
                  <div class="task-desc" id="taskADesc">Large image dataset used to pre-train the backbone on general visual structure.</div>
                  <div class="token-row">
                    <div class="token" id="taskAInput">Input: images</div>
                    <div class="token orange" id="taskAOutput">Output: cat / not cat</div>
                    <div class="token purple" id="taskAData">Data: 120k</div>
                  </div>
                </div>

                <div class="network-shell">
                  <svg id="networkSvg" viewBox="0 0 760 300" preserveAspectRatio="none"></svg>
                </div>

                <div class="task-card">
                  <div class="task-title">Task B</div>
                  <div class="task-name" id="taskBName">Radiology diagnosis</div>
                  <div class="task-desc" id="taskBDesc">Smaller target dataset that reuses the backbone and receives a new prediction head.</div>
                  <div class="token-row">
                    <div class="token green" id="taskBInput">Input: radiology images</div>
                    <div class="token orange" id="taskBOutput">Output: benign / malignant</div>
                    <div class="token purple" id="taskBData">Data: 8k</div>
                  </div>
                </div>
              </div>
            </div>

            <div class="mini-grid">
              <div class="mini-card">
                <div class="mini-label">Current operation</div>
                <div class="formula-line" id="formulaLine">
                  <strong>Pre-train:</strong> task A input → backbone → old task head
                </div>
              </div>
              <div class="mini-card">
                <div class="mini-label">What is happening</div>
                <div class="explain-body" id="explainBody">
                  The network first learns broad visual patterns on the larger source task. At this stage, the old head is still attached because the model is solving Task A.
                </div>
              </div>
            </div>
          </div>
        </section>

        <aside class="panel side-shell">
          <div class="card">
            <div class="card-head">
              <div>
                <div class="card-title">Suitability check</div>
                <div class="card-sub">When transfer learning makes sense</div>
              </div>
            </div>

            <div id="fitPill" class="status-pill strong-fit">
              <span class="status-dot"></span>
              <span id="fitPillText">Strong fit for transfer learning</span>
            </div>

            <div class="metric-grid">
              <div class="metric">
                <div class="metric-label">Task A / B data ratio</div>
                <div class="metric-value" id="metricRatio">15×</div>
              </div>
              <div class="metric">
                <div class="metric-label">Feature reuse score</div>
                <div class="metric-value" id="metricReuse">3 / 3</div>
              </div>
              <div class="metric">
                <div class="metric-label">Current stage</div>
                <div class="metric-value" id="metricStage">Pre-train</div>
              </div>
              <div class="metric">
                <div class="metric-label">Backbone mode</div>
                <div class="metric-value" id="metricBackbone">Tune</div>
              </div>
            </div>

            <div class="list-rows">
              <div class="list-row">
                <strong>Main idea</strong>
                <span id="ideaText">Reuse learned features instead of relearning everything from scratch.</span>
              </div>
              <div class="list-row">
                <strong>What gets replaced</strong>
                <span id="replaceText">The old task-specific head gets removed and a new one is attached for Task B.</span>
              </div>
              <div class="list-row">
                <strong>Next action</strong>
                <span id="actionText">Keep the pretrained backbone and move to the head-replacement step.</span>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-head">
              <div>
                <div class="card-title">Core formula</div>
                <div class="card-sub">Keep the math light</div>
              </div>
            </div>
            <div class="formula-box" id="formulaBox">
              <strong>Before transfer</strong><br>
              input → backbone → old head<br><br>
              <strong>After transfer</strong><br>
              new input → same backbone → new head<br><br>
              <strong>Fine-tuning</strong><br>
              continue training on Task B so the reused features adapt to the new objective
            </div>
          </div>

          <div class="card">
            <div class="card-head">
              <div>
                <div class="card-title">Takeaway</div>
                <div class="card-sub">Teaching summary</div>
              </div>
            </div>
            <div class="takeaway-box" id="takeawayBox">
              Transfer learning works best when Task A has much more data than Task B, the input type is similar, and the low-level patterns learned on Task A still help the new task.
            </div>
          </div>
        </aside>
      </div>
    </main>

    <div class="footer-strip">Pre-training · Backbone reuse · Head replacement · Fine-tuning · Transfer learning</div>
  </div>

<script>
(function() {
  const TASKS = {
    cat_radiology: {
      aName: "Cat recognition",
      aDesc: "Large natural-image dataset used to pre-train a model on broad visual structure like edges, fur texture, and object shape.",
      aInput: "Input: images",
      aOutput: "Output: cat / not cat",
      bName: "Radiology diagnosis",
      bDesc: "Smaller medical-image dataset where the model keeps useful visual features but swaps to a new diagnostic output head.",
      bInput: "Input: radiology images",
      bOutput: "Output: benign / malignant",
      defaultA: 120,
      defaultB: 8
    },
    objects_leaf: {
      aName: "General object classification",
      aDesc: "A broad object dataset gives the network many examples of contours, textures, and visual parts.",
      aInput: "Input: plant / object images",
      aOutput: "Output: source classes",
      bName: "Leaf disease detection",
      bDesc: "A smaller agricultural dataset benefits from reusing earlier visual filters before specializing to disease labels.",
      bInput: "Input: leaf images",
      bOutput: "Output: healthy / diseased",
      defaultA: 150,
      defaultB: 12
    },
    faces_masks: {
      aName: "Face recognition",
      aDesc: "The model first learns structured face features from a large face dataset.",
      aInput: "Input: face images",
      aOutput: "Output: identity labels",
      bName: "Mask detection",
      bDesc: "A related target task can reuse face-sensitive features and then shift its head to a mask / no-mask decision.",
      bInput: "Input: face images",
      bOutput: "Output: mask / no mask",
      defaultA: 100,
      defaultB: 10
    }
  };

  const STEP_TEXT = [
    {
      nav: "Step 1 · pre-train on Task A",
      stage: "Pre-train",
      formula: "<strong>Pre-train:</strong> task A input → backbone → old task head",
      explain: "The network first learns broad visual patterns on the larger source task. At this stage, the old head is still attached because the model is solving Task A.",
      idea: "Learn broad reusable features on the larger source task.",
      replace: "Nothing is replaced yet. The original Task A head is still active.",
      action: "Finish source-task training so the backbone contains useful visual structure."
    },
    {
      nav: "Step 2 · remove the old head",
      stage: "Remove head",
      formula: "<strong>Remove old head:</strong> keep backbone, detach the source-task output layer",
      explain: "The old head is specific to the original labels. Once source training is done, you cut off that task-specific part and preserve the learned backbone.",
      idea: "Separate reusable feature extraction from source-task-specific prediction.",
      replace: "The old head is removed because its outputs are tied to Task A labels.",
      action: "Prepare the network so a new Task B prediction layer can be attached."
    },
    {
      nav: "Step 3 · attach a new head for Task B",
      stage: "Add new head",
      formula: "<strong>Add new head:</strong> same backbone → randomly initialized Task B head",
      explain: "A fresh output layer is attached for the target labels. This new head begins with random weights because it has not yet learned Task B.",
      idea: "Reuse the old body, rebuild only the task-specific output part.",
      replace: "A new head is added for the new target classes or outputs.",
      action: "Initialize the new Task B output layer and prepare to train on target data."
    },
    {
      nav: "Step 4 · fine-tune on Task B",
      stage: "Fine-tune",
      formula: "<strong>Fine-tune:</strong> Task B data updates the new head and possibly part or all of the backbone",
      explain: "The network now trains on Task B. If the backbone is unfrozen, its earlier features can adjust to the new domain instead of staying fixed.",
      idea: "Adapt reused features to the new task instead of relearning everything from scratch.",
      replace: "The new head learns fastest, while the backbone is either frozen or gently updated.",
      action: "Use Task B data to refine the reused representation toward the new objective."
    }
  ];

  const state = {
    pair: "cat_radiology",
    step: 0,
    aData: 120,
    bData: 8,
    sameInput: true,
    reuseFeatures: true,
    freezeBackbone: false,
    timer: null
  };

  const pairButtons = document.querySelectorAll("[data-pair]");
  const stepCards = document.querySelectorAll("[data-step-card]");
  const aDataSlider = document.getElementById("aDataSlider");
  const bDataSlider = document.getElementById("bDataSlider");
  const sameInputBox = document.getElementById("sameInput");
  const reuseFeaturesBox = document.getElementById("reuseFeatures");
  const freezeBackboneBox = document.getElementById("freezeBackbone");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const playBtn = document.getElementById("playBtn");
  const networkSvg = document.getElementById("networkSvg");

  function fmtK(v) {
    return v >= 100 ? Math.round(v) + "k" : v.toFixed(0) + "k";
  }

  function setPair(pairKey) {
    const cfg = TASKS[pairKey];
    state.pair = pairKey;
    state.aData = cfg.defaultA;
    state.bData = cfg.defaultB;
    aDataSlider.value = cfg.defaultA;
    bDataSlider.value = cfg.defaultB;

    document.getElementById("taskAName").textContent = cfg.aName;
    document.getElementById("taskADesc").textContent = cfg.aDesc;
    document.getElementById("taskAInput").textContent = cfg.aInput;
    document.getElementById("taskAOutput").textContent = cfg.aOutput;
    document.getElementById("taskBName").textContent = cfg.bName;
    document.getElementById("taskBDesc").textContent = cfg.bDesc;
    document.getElementById("taskBInput").textContent = cfg.bInput;
    document.getElementById("taskBOutput").textContent = cfg.bOutput;

    pairButtons.forEach(btn => btn.classList.toggle("active", btn.dataset.pair === pairKey));
    update();
  }

  function setStep(step) {
    state.step = Math.max(0, Math.min(3, step));
    stepCards.forEach((card, i) => card.classList.toggle("active", i === state.step));
    updateText();
    renderNetwork();
  }

  function computeFit() {
    let score = 0;
    if (state.sameInput) score += 1;
    if (state.reuseFeatures) score += 1;
    const ratio = state.aData / Math.max(1, state.bData);
    if (ratio >= 3) score += 1;
    return { score, ratio };
  }

  function updateText() {
    const stepInfo = STEP_TEXT[state.step];
    document.getElementById("navStatus").textContent = stepInfo.nav;
    document.getElementById("metricStage").textContent = stepInfo.stage;
    document.getElementById("formulaLine").innerHTML = stepInfo.formula;
    document.getElementById("explainBody").textContent = stepInfo.explain;
    document.getElementById("ideaText").textContent = stepInfo.idea;
    document.getElementById("replaceText").textContent = stepInfo.replace;
    document.getElementById("actionText").textContent = stepInfo.action;
    document.getElementById("aDataValue").textContent = fmtK(state.aData);
    document.getElementById("bDataValue").textContent = fmtK(state.bData);
    document.getElementById("taskAData").textContent = "Data: " + fmtK(state.aData);
    document.getElementById("taskBData").textContent = "Data: " + fmtK(state.bData);
    document.getElementById("metricBackbone").textContent = state.freezeBackbone ? "Freeze" : "Tune";

    const fit = computeFit();
    document.getElementById("metricRatio").textContent = fit.ratio.toFixed(1) + "×";
    document.getElementById("metricReuse").textContent = fit.score + " / 3";

    const pill = document.getElementById("fitPill");
    const pillText = document.getElementById("fitPillText");
    const takeaway = document.getElementById("takeawayBox");
    if (fit.score === 3) {
      pill.className = "status-pill strong-fit";
      pillText.textContent = "Strong fit for transfer learning";
      takeaway.innerHTML = "Transfer learning is a <strong>strong fit</strong> here because Task A has much more data, the input style is compatible, and the backbone's low-level features are likely to remain useful on Task B.";
    } else if (fit.score === 2) {
      pill.className = "status-pill weak-fit";
      pillText.textContent = "Possible, but not ideal";
      takeaway.innerHTML = "Transfer learning may still help, but one important condition is weak. The more the tasks disagree on input structure or reusable features, the less benefit you get from the pretrained backbone.";
    } else {
      pill.className = "status-pill poor-fit";
      pillText.textContent = "Weak case for transfer learning";
      takeaway.innerHTML = "This is a <strong>weak transfer-learning scenario</strong>. If the inputs differ too much or the old features are not reusable, it becomes harder to justify reusing the source backbone.";
    }
  }

  function renderNetwork() {
    const backboneFrozen = state.freezeBackbone && state.step === 3;
    const s = state.step;

    const oldHeadOpacity = s === 0 ? 1 : (s === 1 ? 0.18 : 0.06);
    const newHeadOpacity = s >= 2 ? 1 : 0.08;
    const oldWireOpacity = s === 0 ? 1 : 0.12;
    const newWireOpacity = s >= 2 ? 1 : 0.08;
    const bodyPulse = s === 0 || (s === 3 && !backboneFrozen);
    const headPulse = s >= 2;
    const sourceSideStrong = s < 2;
    const targetSideStrong = s >= 2;

    function block(x, y, w, h, fill, stroke, label, sub, locked, pulse, fillOpacity) {
      const lock = locked ? `
        <g transform="translate(${x+w-24},${y+10})">
          <rect x="0" y="8" width="14" height="10" rx="2" fill="#ffffff" stroke="#5d4fc4" stroke-width="1.2"></rect>
          <path d="M3 8V5.8c0-2 1.4-3.4 4-3.4s4 1.4 4 3.4V8" fill="none" stroke="#5d4fc4" stroke-width="1.2" stroke-linecap="round"></path>
        </g>` : "";
      const pulseClass = pulse ? "pulse" : "";
      return `
        <g class="${pulseClass}" transform="translate(${x},${y})">
          <rect width="${w}" height="${h}" rx="18" fill="${fill}" fill-opacity="${fillOpacity}" stroke="${stroke}" stroke-width="1.4"></rect>
          <text x="${w/2}" y="36" text-anchor="middle" font-size="16" font-weight="700" fill="#1d1d1f">${label}</text>
          <text x="${w/2}" y="58" text-anchor="middle" font-size="11.5" fill="#6e6e73">${sub}</text>
          ${lock}
        </g>`;
    }

    const srcCard = `
      <g transform="translate(20,74)">
        <rect width="118" height="126" rx="20" fill="${sourceSideStrong ? '#eef5ff' : '#f5f5f7'}" stroke="rgba(0,113,227,0.14)" stroke-width="1.4"></rect>
        <rect x="18" y="18" width="82" height="54" rx="14" fill="#ffffff" stroke="rgba(0,0,0,0.06)"></rect>
        <path d="M30 60 C40 32, 72 30, 86 56" fill="none" stroke="#0071e3" stroke-width="3" stroke-linecap="round"></path>
        <circle cx="48" cy="48" r="4" fill="#2b8cff"></circle>
        <text x="59" y="96" text-anchor="middle" font-size="13" font-weight="700" fill="#1d1d1f">Task A input</text>
        <text x="59" y="114" text-anchor="middle" font-size="11.5" fill="#6e6e73">${TASKS[state.pair].aName}</text>
      </g>`;

    const tgtCard = `
      <g transform="translate(622,74)">
        <rect width="118" height="126" rx="20" fill="${targetSideStrong ? '#eefbf5' : '#f5f5f7'}" stroke="rgba(45,124,70,0.14)" stroke-width="1.4"></rect>
        <rect x="18" y="18" width="82" height="54" rx="14" fill="#ffffff" stroke="rgba(0,0,0,0.06)"></rect>
        <path d="M30 58 C42 36, 72 34, 86 60" fill="none" stroke="#2d7c46" stroke-width="3" stroke-linecap="round"></path>
        <circle cx="48" cy="46" r="4" fill="#2d7c46"></circle>
        <text x="59" y="96" text-anchor="middle" font-size="13" font-weight="700" fill="#1d1d1f">Task B input</text>
        <text x="59" y="114" text-anchor="middle" font-size="11.5" fill="#6e6e73">${TASKS[state.pair].bName}</text>
      </g>`;

    const wires = `
      <path d="M138 137 L194 137" stroke="#9fb8e8" stroke-width="3.2" stroke-linecap="round" opacity="${sourceSideStrong ? 1 : 0.35}"></path>
      <path d="M598 206 L622 137" stroke="#a9d5b9" stroke-width="3.2" stroke-linecap="round" opacity="${targetSideStrong ? 1 : 0.35}"></path>
      <path d="M482 137 L508 137" stroke="#0071e3" stroke-width="3.6" stroke-linecap="round" opacity="${oldWireOpacity}"></path>
      <path d="M482 206 L508 206" stroke="#2d7c46" stroke-width="3.6" stroke-linecap="round" opacity="${newWireOpacity}"></path>
    `;

    const sourcePath = `
      <text x="254" y="40" text-anchor="middle" font-size="11.5" fill="#6e6e73">source task path</text>
      <text x="560" y="40" text-anchor="middle" font-size="11.5" fill="#6e6e73">target task path</text>
    `;

    networkSvg.innerHTML = `
      <defs>
        <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="rgba(15,23,42,0.12)"></feDropShadow>
        </filter>
      </defs>
      <style>
        #transfer-page-__UID__ .pulse rect {
          animation: pulseNode 1.7s ease-in-out infinite;
        }
        @keyframes pulseNode {
          0% { filter: none; }
          50% { filter: url(#softShadow); }
          100% { filter: none; }
        }
      </style>

      ${sourcePath}
      ${srcCard}
      ${tgtCard}
      ${wires}

      ${block(194, 88, 88, 98, "#eef5ff", "#0071e3", "Conv 1", "edges", backboneFrozen, bodyPulse, 1)}
      ${block(294, 88, 88, 98, "#eef5ff", "#0071e3", "Conv 2", "textures", backboneFrozen, bodyPulse, 1)}
      ${block(394, 88, 88, 98, "#eef5ff", "#0071e3", "Conv 3", "shapes", backboneFrozen, bodyPulse, 1)}

      <g opacity="${oldHeadOpacity}">
        ${block(508, 96, 90, 82, "#fff4ec", "#b25a17", "Old head", "Task A labels", false, s===0, 1)}
      </g>

      <g opacity="${newHeadOpacity}">
        ${block(508, 164, 90, 82, "#eefbf5", "#2d7c46", "New head", "Task B labels", false, headPulse, 1)}
      </g>

      <text x="338" y="232" text-anchor="middle" font-size="12" fill="#6e6e73">Reusable backbone</text>
      <text x="553" y="262" text-anchor="middle" font-size="11.5" fill="#6e6e73">${backboneFrozen ? "backbone frozen during fine-tuning" : "backbone can adapt during fine-tuning"}</text>

      ${s >= 1 ? `<text x="553" y="86" text-anchor="middle" font-size="11.5" fill="#b25a17" opacity="${oldHeadOpacity}">detach</text>` : ""}
      ${s >= 2 ? `<text x="553" y="154" text-anchor="middle" font-size="11.5" fill="#2d7c46">attach</text>` : ""}
    `;
  }

  function update() {
    updateText();
    renderNetwork();
  }

  aDataSlider.addEventListener("input", e => {
    state.aData = Number(e.target.value);
    update();
  });

  bDataSlider.addEventListener("input", e => {
    state.bData = Number(e.target.value);
    update();
  });

  sameInputBox.addEventListener("change", e => {
    state.sameInput = e.target.checked;
    update();
  });

  reuseFeaturesBox.addEventListener("change", e => {
    state.reuseFeatures = e.target.checked;
    update();
  });

  freezeBackboneBox.addEventListener("change", e => {
    state.freezeBackbone = e.target.checked;
    update();
  });

  pairButtons.forEach(btn => {
    btn.addEventListener("click", () => setPair(btn.dataset.pair));
  });

  prevBtn.addEventListener("click", () => setStep(state.step - 1));
  nextBtn.addEventListener("click", () => setStep(state.step + 1));

  playBtn.addEventListener("click", () => {
    if (state.timer) {
      clearInterval(state.timer);
      state.timer = null;
      playBtn.classList.remove("playing");
      return;
    }
    playBtn.classList.add("playing");
    state.timer = setInterval(() => {
      if (state.step >= 3) {
        setStep(0);
      } else {
        setStep(state.step + 1);
      }
    }, 1500);
  });

  setPair("cat_radiology");
  setStep(0);
})();
</script>
</div>
"""

display(HTML(html_code.replace("__UID__", uid)))
