from IPython.display import HTML, display

html_code = r'''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Pooling and Downsampling</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --white: #ffffff;
      --black: #1d1d1f;
      --gray1: #f5f5f7;
      --gray2: #e8e8ed;
      --gray3: #6e6e73;
      --gray4: #aeaeb2;
      --blue: #0071e3;
      --blue2: #2b8cff;
      --blueLight: #e8f0fe;
      --blueSoft: #f3f7ff;
      --line: rgba(0,0,0,0.08);
      --shadow: 0 18px 40px rgba(0, 77, 163, 0.06);
      --radius: 20px;
      --radiusSm: 14px;
      --green: #2d7c46;
      --orange: #b25a17;
      --red: #a33c1f;
      --panel: rgba(255,255,255,0.74);
      --teal: #0f6e56;
      --tealBg: #e9f7f2;
      --amber: #8a5410;
      --amberBg: #f9eddc;
      --purple: #5d4fc4;
      --purpleBg: #efedff;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      -webkit-font-smoothing: antialiased;
      background: #ffffff;
      color: var(--black);
      padding: 24px;
    }

    .page {
      max-width: 1380px;
      margin: 0 auto;
      min-height: 100vh;
      background:
        radial-gradient(circle at top right, rgba(0,113,227,0.06), transparent 26%),
        linear-gradient(to bottom, #ffffff 0%, #fbfcff 100%);
      border: 1px solid rgba(0,0,0,0.04);
      border-radius: 28px;
      overflow: hidden;
      box-shadow: 0 18px 44px rgba(34, 62, 132, 0.08);
    }

    .nav {
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
    .nav-back {
      display: flex;
      align-items: center;
      gap: 6px;
      color: var(--blue);
      font-size: 13px;
      font-weight: 500;
    }
    .nav-brand { font-size: 13px; font-weight: 600; }
    .nav-status { font-size: 13px; color: var(--gray4); }

    .hero {
      padding: 42px 32px 28px;
      border-bottom: 0.5px solid var(--gray2);
    }
    .hero-shell {
      max-width: 1240px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: minmax(0, 1.25fr) minmax(320px, 0.75fr);
      gap: 18px;
      align-items: start;
    }
    .badge {
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
    h1 {
      font-size: clamp(30px, 4vw, 42px);
      font-weight: 700;
      letter-spacing: -0.03em;
      line-height: 1.05;
      margin-bottom: 10px;
    }
    h1 span {
      background: linear-gradient(135deg, var(--blue), #58a6ff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .desc {
      font-size: 15px;
      color: var(--gray3);
      line-height: 1.65;
      max-width: 670px;
      margin-bottom: 22px;
    }
    .meta { display: flex; flex-wrap: wrap; gap: 20px; }
    .meta-item { font-size: 12px; color: var(--gray4); }
    .meta-item span { color: var(--black); font-weight: 600; }

    .hero-panel {
      background: linear-gradient(180deg,#fbfdff 0%, #f4f8ff 100%);
      border: 1px solid rgba(0,113,227,0.08);
      border-radius: 20px;
      padding: 18px;
      box-shadow: var(--shadow);
    }
    .hero-panel-label {
      font-size: 10px;
      color: var(--gray4);
      letter-spacing: .08em;
      text-transform: uppercase;
      margin-bottom: 10px;
      font-weight: 600;
    }
    .hero-panel-title {
      font-size: 16px;
      font-weight: 600;
      letter-spacing: -.02em;
      margin-bottom: 14px;
    }
    .hero-points { display: flex; flex-direction: column; gap: 10px; }
    .hero-point {
      display: flex;
      gap: 10px;
      padding: 10px 12px;
      border-radius: 14px;
      background: rgba(255,255,255,0.72);
      border: 1px solid rgba(0,0,0,0.04);
    }
    .dot {
      width: 8px; height: 8px; border-radius: 50%;
      margin-top: 5px; background: var(--blue); flex: none;
    }
    .hero-point strong { display: block; font-size: 12px; margin-bottom: 2px; }
    .hero-point span { font-size: 12px; color: var(--gray3); line-height: 1.45; }

    .main {
      max-width: 1240px;
      margin: 0 auto;
      padding: 30px 32px 36px;
    }
    .section-label {
      font-size: 11px;
      font-weight: 500;
      color: var(--gray3);
      letter-spacing: .07em;
      text-transform: uppercase;
      margin-bottom: 16px;
    }

    .panel {
      background: var(--panel);
      border: 1px solid rgba(0,0,0,0.05);
      border-radius: var(--radius);
      box-shadow: var(--shadow);
      backdrop-filter: blur(18px);
    }

    .controls-shell {
      padding: 18px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-bottom: 16px;
    }
    .controls-head h2 {
      font-size: 18px;
      font-weight: 600;
      letter-spacing: -0.02em;
      margin-bottom: 2px;
    }
    .controls-head .sub {
      font-size: 13px;
      color: var(--gray3);
      line-height: 1.55;
    }

    .controls-grid {
      display: grid;
      grid-template-columns: 1.1fr 1fr 1fr 1fr;
      gap: 14px;
      align-items: stretch;
    }

    .control-block {
      padding: 14px;
      border-radius: 16px;
      background: rgba(255,255,255,0.78);
      border: 1px solid rgba(0,0,0,0.04);
    }
    .control-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      margin-bottom: 8px;
    }
    .control-label { font-size: 12px; font-weight: 600; color: var(--black); letter-spacing: -0.01em; }
    .control-value { font-size: 12px; color: var(--gray4); font-weight: 600; }
    .control-help { font-size: 12px; color: var(--gray3); line-height: 1.45; margin-top: 8px; }

    input[type="range"] {
      width: 100%;
      accent-color: var(--blue);
      cursor: pointer;
    }

    .preset-row, .seg-row, .action-row {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }
    .chip, .seg-btn, .step-btn {
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
    .chip:hover, .seg-btn:hover, .step-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    }
    .chip.active, .seg-btn.active {
      background: var(--blue);
      color: #fff;
      border-color: transparent;
    }
    .chip.alt.active {
      background: var(--teal);
    }
    .step-btn.playing {
      background: var(--blue);
      color: #fff;
      border-color: transparent;
    }

    .layout {
      display: grid;
      grid-template-columns: minmax(0, 1.28fr) minmax(320px, 0.72fr);
      gap: 16px;
      align-items: start;
    }

    .viz-shell {
      padding: 18px;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .card {
      background: rgba(255,255,255,0.78);
      border: 1px solid rgba(0,0,0,0.05);
      border-radius: 18px;
      padding: 14px;
    }

    .card-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 10px;
    }
    .card-title { font-size: 13px; font-weight: 600; letter-spacing: -0.01em; }
    .card-sub { font-size: 11px; color: var(--gray4); }

    .step-indicator {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }
    .step-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--gray2);
      transition: .18s ease;
    }
    .step-dot.active { background: var(--blue); }

    .viz-board {
      background: linear-gradient(to bottom, rgba(243,247,255,0.75), rgba(255,255,255,0.94));
      border-radius: 16px;
      border: 1px solid rgba(0,0,0,0.04);
      padding: 18px;
    }

    .grid-stage {
      display: grid;
      grid-template-columns: minmax(0,1fr) 70px minmax(0,1fr);
      gap: 16px;
      align-items: center;
      margin-bottom: 16px;
    }

    .grid-wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
    }
    .grid-label {
      font-size: 11px;
      color: var(--gray3);
      font-weight: 600;
      letter-spacing: .03em;
      text-transform: uppercase;
    }

    .grid-table {
      border-collapse: separate;
      border-spacing: 6px;
      background: rgba(255,255,255,0.62);
      padding: 8px;
      border-radius: 16px;
      border: 1px solid rgba(0,0,0,0.04);
      box-shadow: inset 0 0 0 1px rgba(255,255,255,0.35);
    }
    .grid-table td {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      text-align: center;
      font-size: 14px;
      font-weight: 600;
      color: var(--black);
      background: rgba(255,255,255,0.82);
      border: 1px solid rgba(0,0,0,0.04);
      transition: background .18s ease, color .18s ease, transform .18s ease, box-shadow .18s ease;
    }
    .grid-table td.window {
      background: var(--tealBg);
      color: var(--teal);
      border-color: rgba(15,110,86,0.14);
      transform: translateY(-1px);
    }
    .grid-table td.maxpick {
      background: var(--blueLight);
      color: var(--blue);
      box-shadow: 0 0 0 2px rgba(0,113,227,0.12) inset;
    }
    .grid-table td.active-out {
      background: var(--amberBg);
      color: var(--amber);
      border-color: rgba(178,90,23,0.14);
      transform: translateY(-1px);
    }
    .grid-table td.filled-out {
      background: rgba(255,255,255,0.9);
    }
    .grid-table td.hidden-out {
      color: transparent;
      background: rgba(245,245,247,0.75);
      border-style: dashed;
    }

    .arrow-stack {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
      color: var(--gray4);
    }
    .arrow-stack .arrow {
      font-size: 30px;
      color: var(--blue);
      line-height: 1;
    }
    .arrow-stack span {
      font-size: 11px;
      font-weight: 600;
      letter-spacing: .05em;
      text-transform: uppercase;
    }

    .explain-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
    .mini-card {
      border-radius: 16px;
      padding: 14px;
      background: rgba(255,255,255,0.86);
      border: 1px solid rgba(0,0,0,0.05);
    }
    .mini-label {
      font-size: 10px;
      color: var(--gray4);
      letter-spacing: .07em;
      text-transform: uppercase;
      font-weight: 600;
      margin-bottom: 8px;
    }
    .formula-line {
      font-size: 13px;
      color: var(--black);
      line-height: 1.7;
      font-weight: 500;
    }
    .formula-line strong { color: var(--blue); }
    .explain-body {
      font-size: 12.5px;
      color: var(--gray3);
      line-height: 1.65;
    }

    .side-shell {
      padding: 18px;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .metric-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-bottom: 10px;
    }
    .metric {
      border-radius: 14px;
      padding: 12px;
      background: var(--gray1);
    }
    .metric-label { font-size: 11px; color: var(--gray4); margin-bottom: 4px; }
    .metric-value { font-size: 20px; font-weight: 600; letter-spacing: -0.03em; }

    .status-pill {
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
    .status-dot { width: 8px; height: 8px; border-radius: 50%; }

    .max-style { background: #e8f0fe; color: var(--blue); border-color: rgba(0,113,227,0.12); }
    .max-style .status-dot { background: var(--blue); }
    .avg-style { background: #e9f7f2; color: var(--teal); border-color: rgba(15,110,86,0.12); }
    .avg-style .status-dot { background: var(--teal); }

    .list-rows {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .list-row {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      padding: 10px 12px;
      border-radius: 14px;
      background: var(--gray1);
      font-size: 12px;
    }
    .list-row strong { color: var(--black); }
    .list-row span { color: var(--gray3); line-height: 1.5; text-align: right; }

    .token-row {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 4px;
    }
    .token {
      display: inline-flex;
      align-items: center;
      border-radius: 999px;
      padding: 6px 10px;
      background: var(--blueSoft);
      color: var(--blue);
      font-size: 11px;
      font-weight: 600;
    }
    .token.alt {
      background: var(--purpleBg);
      color: var(--purple);
    }

    .formula-box {
      font-size: 12.5px;
      color: var(--black);
      background: var(--gray1);
      border-radius: 14px;
      padding: 14px 16px;
      line-height: 1.8;
    }
    .formula-box strong { color: var(--blue); }

    .footer-strip {
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
      .controls-grid { grid-template-columns: 1fr 1fr; }
      .layout { grid-template-columns: 1fr; }
      .hero-shell { grid-template-columns: 1fr; }
    }
    @media (max-width: 820px) {
      .grid-stage { grid-template-columns: 1fr; }
      .arrow-stack { flex-direction: row; }
      .explain-grid { grid-template-columns: 1fr; }
    }
    @media (max-width: 700px) {
      body { padding: 12px; }
      .main, .hero { padding-left: 18px; padding-right: 18px; }
      .controls-grid { grid-template-columns: 1fr; }
      .metric-grid { grid-template-columns: 1fr 1fr; }
      .grid-table td { width: 38px; height: 38px; font-size: 13px; }
    }
  </style>
</head>
<body>
<div class="page">
  <nav class="nav">
    <div class="nav-back">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8l4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
      Convolutional Neural Networks
    </div>
    <div class="nav-brand">Interactive Lab</div>
    <div class="nav-status" id="navStatus">Max pool · 2×2 · stride 2</div>
  </nav>

  <section class="hero">
    <div class="hero-shell">
      <div>
        <div class="badge">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor"><circle cx="5" cy="5" r="5"/></svg>
          Module 4 · CNN Downsampling
        </div>
        <h1>Pooling and<br><span>Downsampling</span></h1>
        <p class="desc">
          See how a small window slides over a feature map, summarizes each local region, and produces a smaller output map. This is the part of CNNs that keeps the strongest local information while shrinking spatial size.
        </p>
        <div class="meta">
          <div class="meta-item">Pool type <span>Max or average</span></div>
          <div class="meta-item">Window <span>Local region size</span></div>
          <div class="meta-item">Stride <span>How far the window moves</span></div>
          <div class="meta-item">Goal <span>Compress spatial detail</span></div>
        </div>
      </div>
      <div class="hero-panel">
        <div class="hero-panel-label">Key concepts</div>
        <div class="hero-panel-title">What to watch for</div>
        <div class="hero-points">
          <div class="hero-point">
            <div class="dot" style="background:#0071e3"></div>
            <div>
              <strong>Local summary</strong>
              <span>Pooling looks at a small patch at a time and replaces it with one summary number.</span>
            </div>
          </div>
          <div class="hero-point">
            <div class="dot" style="background:#0f6e56"></div>
            <div>
              <strong>Max vs. average</strong>
              <span>Max pooling keeps the strongest activation. Average pooling keeps the average response.</span>
            </div>
          </div>
          <div class="hero-point">
            <div class="dot" style="background:#8a5410"></div>
            <div>
              <strong>Downsampling</strong>
              <span>Larger stride or window size gives a smaller output map and more compression.</span>
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
        <p class="sub">Keep your original pooling logic, but present it with the same visual language as your overfitting / underfitting page.</p>
      </div>

      <div class="controls-grid">
        <div class="control-block">
          <div class="control-label" style="margin-bottom:10px;">Quick presets</div>
          <div class="preset-row">
            <button class="chip active" data-preset="classic">Classic</button>
            <button class="chip" data-preset="detail">Dense scan</button>
            <button class="chip alt" data-preset="smooth">Average</button>
            <button class="chip" data-preset="wide">Wide window</button>
          </div>
          <div class="control-help">Fast ways to jump between the most useful teaching cases.</div>
        </div>

        <div class="control-block">
          <div class="control-top">
            <div class="control-label">Pool type</div>
            <div class="control-value" id="modeValue">Max pooling</div>
          </div>
          <div class="seg-row">
            <button class="seg-btn active" id="btnMax" type="button">Max pool</button>
            <button class="seg-btn" id="btnAvg" type="button">Avg pool</button>
          </div>
          <div class="control-help">Change the local summary rule without changing the sliding process.</div>
        </div>

        <div class="control-block">
          <div class="control-top">
            <div class="control-label">Window size</div>
            <div class="control-value" id="winValue">2×2</div>
          </div>
          <input type="range" id="winSize" min="2" max="3" step="1" value="2">
          <div class="control-help">The size of each local patch processed at one step.</div>
        </div>

        <div class="control-block">
          <div class="control-top">
            <div class="control-label">Stride</div>
            <div class="control-value" id="strideValue">2</div>
          </div>
          <input type="range" id="stride" min="1" max="3" step="1" value="2">
          <div class="control-help">How far the pooling window moves before the next output cell.</div>
        </div>
      </div>
    </section>

    <div class="layout">
      <section class="panel viz-shell">
        <div class="card">
          <div class="card-head">
            <div>
              <div class="card-title">Pooling walkthrough</div>
              <div class="card-sub">Input feature map → pooling window → output map</div>
            </div>
            <div class="step-indicator" id="stepDots"></div>
          </div>

          <div class="action-row" style="margin-bottom:12px;">
            <button class="step-btn" id="prevBtn" type="button">← Prev</button>
            <button class="step-btn" id="nextBtn" type="button">Next →</button>
            <button class="step-btn" id="playBtn" type="button">Auto-play</button>
          </div>

          <div class="viz-board">
            <div class="grid-stage">
              <div class="grid-wrap">
                <div class="grid-label">Input feature map</div>
                <table class="grid-table" id="inputGrid"></table>
              </div>

              <div class="arrow-stack">
                <span>Downsample</span>
                <div class="arrow">→</div>
                <span id="mapTag">step 1</span>
              </div>

              <div class="grid-wrap">
                <div class="grid-label">Output feature map</div>
                <table class="grid-table" id="outputGrid"></table>
              </div>
            </div>

            <div class="explain-grid">
              <div class="mini-card">
                <div class="mini-label">Current operation</div>
                <div class="formula-line" id="formulaLine">Output(1,1) = max(4, 2, 2, 3) = <strong>4</strong></div>
                <div class="token-row" id="windowTokens"></div>
              </div>

              <div class="mini-card">
                <div class="mini-label">Why this matters</div>
                <div class="explain-body" id="explainBody">
                  Max pooling keeps the strongest local activation. This is useful when you want the model to preserve whether an important feature appears anywhere inside the small region.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <aside class="panel side-shell">
        <div class="card">
          <div class="card-head">
            <div>
              <div class="card-title">Current summary</div>
              <div class="card-sub">Shape change and selected output</div>
            </div>
          </div>

          <div id="modePill" class="status-pill max-style">
            <span class="status-dot"></span><span>Max pooling</span>
          </div>

          <div class="metric-grid">
            <div class="metric">
              <div class="metric-label">Input size</div>
              <div class="metric-value" id="metricInput">6×6</div>
            </div>
            <div class="metric">
              <div class="metric-label">Output size</div>
              <div class="metric-value" id="metricOutput">3×3</div>
            </div>
            <div class="metric">
              <div class="metric-label">Compression</div>
              <div class="metric-value" id="metricCompression">75%</div>
            </div>
            <div class="metric">
              <div class="metric-label">Current value</div>
              <div class="metric-value" id="metricValue">4</div>
            </div>
          </div>

          <div class="list-rows">
            <div class="list-row">
              <strong>Current window</strong>
              <span id="currentWindow">rows 1–2, cols 1–2</span>
            </div>
            <div class="list-row">
              <strong>Mapped output cell</strong>
              <span id="currentOutputCell">row 1, col 1</span>
            </div>
            <div class="list-row">
              <strong>Completed steps</strong>
              <span id="stepCount">1 / 9</span>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-head">
            <div>
              <div class="card-title">Core formula</div>
              <div class="card-sub">What pooling computes</div>
            </div>
          </div>
          <div class="formula-box" id="formulaBox">
            <strong>Max pooling</strong><br>
            For each local window, keep the largest activation.<br><br>
            <strong>Average pooling</strong><br>
            For each local window, take the mean of all values.<br><br>
            Output size per side:<br>
            <strong>⌊(W − F) / S⌋ + 1</strong>
          </div>
        </div>

        <div class="card">
          <div class="card-head">
            <div>
              <div class="card-title">Takeaway</div>
              <div class="card-sub">Teaching summary</div>
            </div>
          </div>
          <div class="formula-box" id="takeawayBox">
            Pooling does not learn a new pattern like convolution. Instead, it <strong>compresses</strong> an existing feature map by summarizing small local regions. The current setup is preserving the <strong>strongest</strong> signal in each patch and shrinking the map from <strong>6×6</strong> to <strong>3×3</strong>.
          </div>
        </div>
      </aside>
    </div>
  </main>

  <div class="footer-strip">Pooling · Downsampling · Local summary · Spatial compression · CNN intuition</div>
</div>

<script>
  const INPUT = [
    [4,2,2,3,1,2],
    [2,3,4,2,1,0],
    [3,2,4,4,2,1],
    [2,2,5,3,1,2],
    [1,3,2,4,3,1],
    [2,1,3,2,4,2]
  ];

  const state = {
    mode: 'max',
    w: 2,
    s: 2,
    stepIdx: 0,
    timer: null,
    preset: 'classic'
  };

  const inputGrid = document.getElementById('inputGrid');
  const outputGrid = document.getElementById('outputGrid');
  const stepDots = document.getElementById('stepDots');
  const winSize = document.getElementById('winSize');
  const stride = document.getElementById('stride');
  const btnMax = document.getElementById('btnMax');
  const btnAvg = document.getElementById('btnAvg');
  const playBtn = document.getElementById('playBtn');

  function getOutputShape() {
    return {
      rows: Math.floor((INPUT.length - state.w) / state.s) + 1,
      cols: Math.floor((INPUT[0].length - state.w) / state.s) + 1
    };
  }

  function getSteps() {
    const shape = getOutputShape();
    const steps = [];
    for (let r = 0; r < shape.rows; r++) {
      for (let c = 0; c < shape.cols; c++) {
        steps.push({ r, c, startR: r * state.s, startC: c * state.s });
      }
    }
    return steps;
  }

  function getWindowValues(startR, startC) {
    const vals = [];
    for (let i = startR; i < startR + state.w; i++) {
      for (let j = startC; j < startC + state.w; j++) {
        vals.push({ value: INPUT[i][j], r: i, c: j });
      }
    }
    return vals;
  }

  function computeValue(startR, startC) {
    const vals = getWindowValues(startR, startC).map(v => v.value);
    if (state.mode === 'max') return Math.max(...vals);
    return Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10;
  }

  function computeOutput() {
    const { rows, cols } = getOutputShape();
    const out = [];
    for (let r = 0; r < rows; r++) {
      const row = [];
      for (let c = 0; c < cols; c++) {
        row.push(computeValue(r * state.s, c * state.s));
      }
      out.push(row);
    }
    return out;
  }

  function buildInputGrid(step) {
    inputGrid.innerHTML = '';
    const windowVals = getWindowValues(step.startR, step.startC);
    const maxVal = Math.max(...windowVals.map(v => v.value));

    for (let i = 0; i < INPUT.length; i++) {
      const tr = document.createElement('tr');
      for (let j = 0; j < INPUT[0].length; j++) {
        const td = document.createElement('td');
        td.textContent = INPUT[i][j];
        const inWindow = i >= step.startR && i < step.startR + state.w && j >= step.startC && j < step.startC + state.w;
        if (inWindow) td.classList.add('window');
        if (state.mode === 'max' && inWindow && INPUT[i][j] === maxVal) td.classList.add('maxpick');
        tr.appendChild(td);
      }
      inputGrid.appendChild(tr);
    }
  }

  function buildOutputGrid(step, output) {
    outputGrid.innerHTML = '';
    const { rows, cols } = getOutputShape();

    for (let i = 0; i < rows; i++) {
      const tr = document.createElement('tr');
      for (let j = 0; j < cols; j++) {
        const td = document.createElement('td');
        const isActive = i === step.r && j === step.c;
        const isFilled = i < step.r || (i === step.r && j <= step.c);
        if (isActive) {
          td.className = 'active-out';
          td.textContent = output[i][j];
        } else if (isFilled) {
          td.className = 'filled-out';
          td.textContent = output[i][j];
        } else {
          td.className = 'hidden-out';
          td.textContent = '•';
        }
        tr.appendChild(td);
      }
      outputGrid.appendChild(tr);
    }
  }

  function buildStepDots(total) {
    stepDots.innerHTML = '';
    const maxShow = Math.min(total, 16);
    for (let i = 0; i < maxShow; i++) {
      const dot = document.createElement('div');
      dot.className = 'step-dot' + (i === state.stepIdx ? ' active' : '');
      stepDots.appendChild(dot);
    }
    if (total > 16) {
      const more = document.createElement('span');
      more.style.fontSize = '11px';
      more.style.color = 'var(--gray4)';
      more.textContent = '… ' + total + ' steps';
      stepDots.appendChild(more);
    }
  }

  function updateText(step, output) {
    const vals = getWindowValues(step.startR, step.startC);
    const valuesOnly = vals.map(v => v.value);
    const result = output[step.r][step.c];
    const opText = state.mode === 'max' ? 'max' : 'avg';
    const formulaText = state.mode === 'max'
      ? `Output(${step.r + 1}, ${step.c + 1}) = max(${valuesOnly.join(', ')}) = ${result}`
      : `Output(${step.r + 1}, ${step.c + 1}) = avg(${valuesOnly.join(' + ')}) / ${valuesOnly.length} = ${result.toFixed(1)}`;

    document.getElementById('formulaLine').innerHTML = formulaText.replace(String(result), `<strong>${typeof result === 'number' && !Number.isInteger(result) ? result.toFixed(1) : result}</strong>`);

    const tokenWrap = document.getElementById('windowTokens');
    tokenWrap.innerHTML = '';
    valuesOnly.forEach((v, idx) => {
      const token = document.createElement('div');
      token.className = 'token' + ((state.mode === 'avg' && idx % 2 === 1) ? ' alt' : '');
      token.textContent = `x${idx + 1} = ${v}`;
      tokenWrap.appendChild(token);
    });

    document.getElementById('modeValue').textContent = state.mode === 'max' ? 'Max pooling' : 'Average pooling';
    document.getElementById('winValue').textContent = `${state.w}×${state.w}`;
    document.getElementById('strideValue').textContent = String(state.s);
    document.getElementById('navStatus').textContent = `${state.mode === 'max' ? 'Max pool' : 'Avg pool'} · ${state.w}×${state.w} · stride ${state.s}`;
    document.getElementById('mapTag').textContent = `step ${state.stepIdx + 1}`;

    document.getElementById('metricInput').textContent = `${INPUT.length}×${INPUT[0].length}`;
    document.getElementById('metricOutput').textContent = `${output.length}×${output[0].length}`;
    document.getElementById('metricCompression').textContent = `${Math.round((1 - (output.length * output[0].length) / (INPUT.length * INPUT[0].length)) * 100)}%`;
    document.getElementById('metricValue').textContent = typeof result === 'number' && !Number.isInteger(result) ? result.toFixed(1) : result;

    document.getElementById('currentWindow').textContent = `rows ${step.startR + 1}–${step.startR + state.w}, cols ${step.startC + 1}–${step.startC + state.w}`;
    document.getElementById('currentOutputCell').textContent = `row ${step.r + 1}, col ${step.c + 1}`;
    document.getElementById('stepCount').textContent = `${state.stepIdx + 1} / ${getSteps().length}`;

    const pill = document.getElementById('modePill');
    if (state.mode === 'max') {
      pill.className = 'status-pill max-style';
      pill.innerHTML = '<span class="status-dot"></span><span>Max pooling</span>';
      document.getElementById('explainBody').textContent = `Max pooling keeps only the strongest response inside the ${state.w}×${state.w} window. This helps the network remember that an important feature was present, even if its exact position shifts slightly.`;
      document.getElementById('takeawayBox').innerHTML = `Pooling does not learn a new pattern like convolution. Instead, it <strong>compresses</strong> an existing feature map by summarizing small local regions. The current setup is preserving the <strong>strongest</strong> signal in each patch and shrinking the map from <strong>${INPUT.length}×${INPUT[0].length}</strong> to <strong>${output.length}×${output[0].length}</strong>.`;
    } else {
      pill.className = 'status-pill avg-style';
      pill.innerHTML = '<span class="status-dot"></span><span>Average pooling</span>';
      document.getElementById('explainBody').textContent = `Average pooling smooths each local region into one representative number. Instead of keeping only the strongest activation, it summarizes the overall response level inside the window.`;
      document.getElementById('takeawayBox').innerHTML = `Pooling still performs <strong>downsampling</strong>, but now the summary rule is different. Instead of keeping only the strongest activation, the model stores the <strong>average response</strong> from each local region while reducing the map from <strong>${INPUT.length}×${INPUT[0].length}</strong> to <strong>${output.length}×${output[0].length}</strong>.`;
    }
  }

  function syncButtons() {
    btnMax.classList.toggle('active', state.mode === 'max');
    btnAvg.classList.toggle('active', state.mode === 'avg');
    document.querySelectorAll('[data-preset]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.preset === state.preset);
    });
    playBtn.classList.toggle('playing', !!state.timer);
    playBtn.textContent = state.timer ? 'Pause' : 'Auto-play';
  }

  function render() {
    const steps = getSteps();
    if (state.stepIdx >= steps.length) state.stepIdx = steps.length - 1;
    if (state.stepIdx < 0) state.stepIdx = 0;
    const step = steps[state.stepIdx];
    const output = computeOutput();

    buildInputGrid(step);
    buildOutputGrid(step, output);
    buildStepDots(steps.length);
    updateText(step, output);
    syncButtons();
  }

  function stopTimer() {
    if (state.timer) {
      clearInterval(state.timer);
      state.timer = null;
    }
  }

  function nextStep() {
    const steps = getSteps();
    state.stepIdx = (state.stepIdx + 1) % steps.length;
    render();
  }

  function prevStep() {
    const steps = getSteps();
    state.stepIdx = (state.stepIdx - 1 + steps.length) % steps.length;
    render();
  }

  function togglePlay() {
    if (state.timer) {
      stopTimer();
      render();
      return;
    }
    state.timer = setInterval(() => {
      nextStep();
    }, 800);
    render();
  }

  function setMode(mode) {
    state.mode = mode;
    state.stepIdx = 0;
    stopTimer();
    render();
  }

  function setPreset(kind) {
    state.preset = kind;
    stopTimer();
    if (kind === 'classic') {
      state.mode = 'max';
      state.w = 2;
      state.s = 2;
    } else if (kind === 'detail') {
      state.mode = 'max';
      state.w = 2;
      state.s = 1;
    } else if (kind === 'smooth') {
      state.mode = 'avg';
      state.w = 2;
      state.s = 2;
    } else if (kind === 'wide') {
      state.mode = 'max';
      state.w = 3;
      state.s = 2;
    }
    winSize.value = state.w;
    stride.value = state.s;
    state.stepIdx = 0;
    render();
  }

  btnMax.addEventListener('click', () => setMode('max'));
  btnAvg.addEventListener('click', () => setMode('avg'));
  document.getElementById('nextBtn').addEventListener('click', nextStep);
  document.getElementById('prevBtn').addEventListener('click', prevStep);
  playBtn.addEventListener('click', togglePlay);
  winSize.addEventListener('input', e => {
    state.w = +e.target.value;
    state.preset = 'custom';
    state.stepIdx = 0;
    stopTimer();
    render();
  });
  stride.addEventListener('input', e => {
    state.s = +e.target.value;
    state.preset = 'custom';
    state.stepIdx = 0;
    stopTimer();
    render();
  });
  document.querySelectorAll('[data-preset]').forEach(btn => {
    btn.addEventListener('click', () => setPreset(btn.dataset.preset));
  });

  render();
</script>
</body>
</html>
'''

display(HTML(html_code))