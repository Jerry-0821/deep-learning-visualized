from IPython.display import HTML, display

display(HTML(r'''
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Overfitting vs Underfitting</title>
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

    /* NAV */
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

    /* HERO */
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
      max-width: 660px;
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

    /* MAIN */
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

    /* LAYOUT: controls on top, visualization below */
    .layout {
      display: flex;
      flex-direction: column;
      gap: 16px;
      align-items: stretch;
    }

    .controls-panel {
      width: 100%;
    }

    .panel {
      background: var(--panel);
      border: 1px solid rgba(0,0,0,0.05);
      border-radius: var(--radius);
      box-shadow: var(--shadow);
      backdrop-filter: blur(18px);
    }

    /* CONTROLS */
    .controls {
      padding: 18px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .controls-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 16px;
      align-items: start;
    }
    .controls h2 {
      font-size: 18px;
      font-weight: 600;
      letter-spacing: -0.02em;
      margin-bottom: 2px;
    }
    .controls .sub {
      font-size: 13px;
      color: var(--gray3);
      line-height: 1.55;
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

    /* PRESET CHIPS */
    .preset-row { display: flex; gap: 8px; flex-wrap: wrap; }
    .chip {
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
    .chip:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
    .chip.active { background: var(--blue); color: #fff; border-color: transparent; }
    .chip.chip-under.active { background: #d85a30; }
    .chip.chip-good.active  { background: #639922; }
    .chip.chip-over.active  { background: #ba7517; }
    .chip.chip-reset        { color: var(--gray3); }

    /* TOGGLES */
    .toggle-row { display: flex; gap: 10px; flex-wrap: wrap; }
    .toggle {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      color: var(--gray3);
      font-weight: 500;
      cursor: pointer;
      user-select: none;
    }
    .toggle input[type="checkbox"] { accent-color: var(--blue); cursor: pointer; }

    /* VIZ */
    .viz {
      padding: 18px;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
    .viz-top {
      display: grid;
      grid-template-columns: 1fr 270px;
      gap: 14px;
    }

    .chart-card, .side-card, .bottom-card {
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

    .svg-wrap {
      width: 100%;
      height: 430px;
      border-radius: 14px;
      overflow: hidden;
      background: linear-gradient(to bottom, rgba(243,247,255,0.75), rgba(255,255,255,0.94));
    }
    svg { width: 100%; height: 100%; display: block; }

    /* DIAGNOSIS */
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
      transition: background .2s;
    }
    .metric-label { font-size: 11px; color: var(--gray4); margin-bottom: 4px; }
    .metric-value { font-size: 22px; font-weight: 600; letter-spacing: -0.03em; }

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
      transition: all .2s;
    }
    .status-dot { width: 8px; height: 8px; border-radius: 50%; }

    .under { background: #faece7; color: var(--red); border-color: #f0997b; }
    .under .status-dot { background: #d85a30; }
    .good  { background: #eaf3de; color: var(--green); border-color: #97c459; }
    .good .status-dot { background: #639922; }
    .over  { background: #faeeda; color: var(--orange); border-color: #ef9f27; }
    .over .status-dot { background: #ba7517; }

    .explain-title { font-size: 13px; font-weight: 600; margin-bottom: 4px; }
    .explain-body  { font-size: 12px; color: var(--gray3); line-height: 1.6; }

    /* BIAS-VARIANCE BAR */
    .bv-bars { display: flex; flex-direction: column; gap: 8px; margin-top: 12px; }
    .bv-row { display: flex; flex-direction: column; gap: 4px; }
    .bv-label-row { display: flex; justify-content: space-between; font-size: 11px; color: var(--gray3); }
    .bv-track {
      height: 6px;
      border-radius: 99px;
      background: var(--gray2);
      overflow: hidden;
    }
    .bv-fill {
      height: 100%;
      border-radius: 99px;
      transition: width .35s cubic-bezier(.4,0,.2,1);
    }
    .bv-fill.bias { background: #d85a30; }
    .bv-fill.variance { background: #ba7517; }

    /* BOTTOM */
    .bottom-grid {
      display: grid;
      grid-template-columns: 1.1fr 0.9fr;
      gap: 14px;
    }

    .legend-row { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 10px; }
    .legend-item { display: inline-flex; align-items: center; gap: 8px; font-size: 11px; color: var(--gray3); }
    .legend-line, .legend-dot { display: inline-block; flex: none; }
    .legend-line.blue   { width: 18px; height: 2px; background: var(--blue); }
    .legend-line.orange { width: 18px; height: 2px; background: #d85a30; }
    .legend-line.green  { width: 18px; height: 2px; background: #639922; border-top: 2px dashed #639922; height: 0; }
    .legend-dot.scatter { width: 8px; height: 8px; border-radius: 50%; background: rgba(0,113,227,0.45); border: 1px solid rgba(0,113,227,0.85); }

    .formula {
      font-family: 'Inter', sans-serif;
      font-size: 12.5px;
      color: var(--black);
      background: var(--gray1);
      border-radius: 14px;
      padding: 14px 16px;
      line-height: 1.8;
    }
    .formula strong { color: var(--blue); }

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

    @media (max-width: 1080px) {
      .controls-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .viz-top { grid-template-columns: 1fr; }
      .bottom-grid { grid-template-columns: 1fr; }
      .hero-shell { grid-template-columns: 1fr; }
    }
    @media (max-width: 700px) {
      body { padding: 12px; }
      .main, .hero { padding-left: 18px; padding-right: 18px; }
      .controls-grid { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
<div class="page">

  <!-- NAV -->
  <nav class="nav">
    <div class="nav-back">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8l4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
      Machine Learning
    </div>
    <div class="nav-brand">Interactive Lab</div>
    <div class="nav-status" id="presetLabel">Good fit</div>
  </nav>

  <!-- HERO -->
  <section class="hero">
    <div class="hero-shell">
      <div>
        <div class="badge">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor"><circle cx="5" cy="5" r="5"/></svg>
          Module 3 · Bias–Variance
        </div>
        <h1>Overfitting vs.<br><span>Underfitting</span></h1>
        <p class="desc">
          Drag the sliders or tap a preset to see how model complexity, data size, noise, and regularization change the fit — and what happens to train vs. validation error.
        </p>
        <div class="meta">
          <div class="meta-item">Complexity <span>Polynomial degree</span></div>
          <div class="meta-item">Noise <span>Data scatter</span></div>
          <div class="meta-item">Dataset <span>Training size</span></div>
          <div class="meta-item">Regularization <span>Ridge λ</span></div>
        </div>
      </div>
      <div class="hero-panel">
        <div class="hero-panel-label">Key concepts</div>
        <div class="hero-panel-title">What to watch for</div>
        <div class="hero-points">
          <div class="hero-point">
            <div class="dot" style="background:#d85a30"></div>
            <div>
              <strong>Underfitting</strong>
              <span>Both train &amp; validation errors are high. The model is too simple to learn the pattern.</span>
            </div>
          </div>
          <div class="hero-point">
            <div class="dot" style="background:#639922"></div>
            <div>
              <strong>Good fit</strong>
              <span>Validation error is near its minimum. Small gap between train and validation.</span>
            </div>
          </div>
          <div class="hero-point">
            <div class="dot" style="background:#ba7517"></div>
            <div>
              <strong>Overfitting</strong>
              <span>Train error is low but validation error rises. The model memorises noise.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- MAIN -->
  <main class="main">
    <div class="section-label">Interactive Playground</div>
    <div class="layout">

      <!-- CONTROLS -->
      <aside class="panel controls-panel">
        <div class="controls">
          <div>
            <h2>Controls</h2>
            <p class="sub">Adjust parameters and observe the effect on the fit and error curves.</p>
          </div>

          <div class="controls-grid">
            <!-- PRESETS -->
            <div class="control-block">
              <div class="control-label" style="margin-bottom:10px;">Quick presets</div>
              <div class="preset-row">
                <button class="chip chip-under" data-preset="under">Underfit</button>
                <button class="chip chip-good active" data-preset="good">Good fit</button>
                <button class="chip chip-over" data-preset="over">Overfit</button>
                <button class="chip chip-reset" data-preset="reset">↺ Reset</button>
              </div>
            </div>

            <!-- DEGREE -->
            <div class="control-block">
              <div class="control-top">
                <div class="control-label">Model complexity</div>
                <div class="control-value" id="degreeVal">Degree 4</div>
              </div>
              <input type="range" id="degree" min="1" max="12" step="1" value="4">
              <div class="control-help">Polynomial degree — higher means a more flexible curve that can bend more.</div>
            </div>

            <!-- NOISE -->
            <div class="control-block">
              <div class="control-top">
                <div class="control-label">Noise level</div>
                <div class="control-value" id="noiseVal">1.2</div>
              </div>
              <input type="range" id="noise" min="0.2" max="3.0" step="0.1" value="1.2">
              <div class="control-help">Scatter in the data — real-world signals always have some noise.</div>
            </div>

            <!-- TRAINING SIZE -->
            <div class="control-block">
              <div class="control-top">
                <div class="control-label">Training set size</div>
                <div class="control-value" id="countVal">22 pts</div>
              </div>
              <input type="range" id="count" min="8" max="60" step="2" value="22">
              <div class="control-help">Fewer data points → easier to overfit. More data → harder to memorise noise.</div>
            </div>

            <!-- REGULARIZATION -->
            <div class="control-block">
              <div class="control-top">
                <div class="control-label">Regularization (λ)</div>
                <div class="control-value" id="lambdaVal">0.08</div>
              </div>
              <input type="range" id="lambda" min="0.00" max="1.0" step="0.01" value="0.08">
              <div class="control-help">Ridge penalty — smooths the curve and reduces overfitting without changing complexity.</div>
            </div>

            <!-- DISPLAY TOGGLES -->
            <div class="control-block">
              <div class="control-label" style="margin-bottom:10px;">Display options</div>
              <div class="toggle-row">
                <label class="toggle">
                  <input type="checkbox" id="showTruth" checked>
                  Show true pattern
                </label>
                <label class="toggle">
                  <input type="checkbox" id="showGap" checked>
                  Show error gap
                </label>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <!-- VIZ -->
      <div class="panel">
        <div class="viz">

          <!-- TOP: fit chart + diagnosis -->
          <div class="viz-top">
            <div class="chart-card">
              <div class="card-head">
                <div>
                  <div class="card-title">Model fit</div>
                  <div class="card-sub">Training data and fitted curve</div>
                </div>
              </div>
              <div class="svg-wrap">
                <svg id="fitSvg" viewBox="0 0 760 430" preserveAspectRatio="none"></svg>
              </div>
              <div class="legend-row">
                <div class="legend-item"><span class="legend-dot scatter"></span> Training data</div>
                <div class="legend-item"><span class="legend-line orange"></span> Model fit</div>
                <div class="legend-item">
                  <svg width="18" height="8" style="flex:none"><line x1="0" y1="4" x2="18" y2="4" stroke="#639922" stroke-width="2" stroke-dasharray="5 3"/></svg>
                  True pattern
                </div>
              </div>
            </div>

            <!-- DIAGNOSIS -->
            <div class="side-card">
              <div class="card-head">
                <div>
                  <div class="card-title">Model diagnosis</div>
                  <div class="card-sub">Bias–variance snapshot</div>
                </div>
              </div>

              <div id="statusPill" class="status-pill good">
                <span class="status-dot"></span><span>Good fit</span>
              </div>

              <div class="metric-grid">
                <div class="metric">
                  <div class="metric-label">Train error</div>
                  <div class="metric-value" id="trainErr">—</div>
                </div>
                <div class="metric">
                  <div class="metric-label">Val error</div>
                  <div class="metric-value" id="valErr">—</div>
                </div>
                <div class="metric">
                  <div class="metric-label">Bias</div>
                  <div class="metric-value" id="biasVal">—</div>
                </div>
                <div class="metric">
                  <div class="metric-label">Variance</div>
                  <div class="metric-value" id="varVal">—</div>
                </div>
              </div>

              <!-- Bias / Variance bars -->
              <div class="bv-bars">
                <div class="bv-row">
                  <div class="bv-label-row"><span>Bias</span><span id="biasBarLabel">—</span></div>
                  <div class="bv-track"><div class="bv-fill bias" id="biasBar" style="width:0%"></div></div>
                </div>
                <div class="bv-row">
                  <div class="bv-label-row"><span>Variance</span><span id="varBarLabel">—</span></div>
                  <div class="bv-track"><div class="bv-fill variance" id="varBar" style="width:0%"></div></div>
                </div>
              </div>

              <div style="margin-top:12px;">
                <div class="explain-title" id="explainTitle">Balanced generalization</div>
                <div class="explain-body" id="explainBody">The model is flexible enough to capture the main trend, but not so flexible that it chases random noise.</div>
              </div>
            </div>
          </div>

          <!-- BOTTOM: error curve + takeaway -->
          <div class="bottom-grid">
            <div class="bottom-card">
              <div class="card-head">
                <div>
                  <div class="card-title">Error vs. Complexity</div>
                  <div class="card-sub">Validation error falls, then rises — find the sweet spot</div>
                </div>
              </div>
              <div class="svg-wrap" style="height:260px;">
                <svg id="errorSvg" viewBox="0 0 760 260" preserveAspectRatio="none"></svg>
              </div>
              <div class="legend-row">
                <div class="legend-item"><span class="legend-line blue"></span> Train error</div>
                <div class="legend-item"><span class="legend-line orange"></span> Validation error</div>
              </div>
            </div>

            <div class="bottom-card">
              <div class="card-head">
                <div>
                  <div class="card-title">Takeaway</div>
                  <div class="card-sub">The core idea</div>
                </div>
              </div>
              <div class="formula" id="takeawayBox">
                <strong>Underfitting</strong> → too simple → high bias<br>
                <strong>Overfitting</strong> → too sensitive → high variance<br>
                <strong>Sweet spot</strong> → lowest validation error<br>
                <strong>More data</strong> → pushes overfitting further right<br>
                <strong>Regularization</strong> → tames the curve without reducing degree<br><br>
                Current: <strong id="takeawayState">Good fit</strong>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </main>

  <div class="footer-strip">Bias · Variance · Generalization · Model Complexity · Regularization</div>
</div>

<script>
  const fitSvg   = document.getElementById('fitSvg');
  const errorSvg = document.getElementById('errorSvg');

  const state = {
    degree: 4, noise: 1.2, count: 22, lambda: 0.08,
    showTruth: true, showGap: true, preset: 'good'
  };

  const COLORS = {
    axis: 'rgba(110,110,115,0.62)',
    grid: 'rgba(0,0,0,0.06)',
    pointsFill: 'rgba(0,113,227,0.22)',
    pointsStroke: 'rgba(0,113,227,0.82)',
    fit: '#d85a30',
    truth: '#639922',
    train: '#0071e3',
    val: '#d85a30',
    gap: 'rgba(239,159,39,0.13)'
  };

  /* ── MATH ──────────────────────────────────────────────── */
  function srand(seed) {
    let t = seed >>> 0;
    return function() {
      t += 0x6D2B79F5;
      let r = Math.imul(t ^ (t >>> 15), 1 | t);
      r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
      return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
  }
  function randn(random) {
    let u=0,v=0;
    while(u===0) u=random(); while(v===0) v=random();
    return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);
  }
  function trueFn(x) {
    return 1.25*Math.sin(1.2*x) + 0.18*x*x - 0.04*x*x*x + 0.4;
  }
  function generateData(n, noise, seedOffset=0) {
    const random = srand(2026 + seedOffset + n*17 + Math.round(noise*100));
    const pts = [];
    for (let i=0;i<n;i++) {
      const x = -3.9 + 7.8*(i/Math.max(1,n-1));
      const jitter = (random()-0.5)*0.18;
      const xx = x+jitter;
      const y = trueFn(xx) + randn(random)*noise;
      pts.push({x:xx, y});
    }
    return pts;
  }
  function solveLinear(A, b) {
    const n=A.length;
    const M=A.map((row,i)=>row.slice().concat([b[i]]));
    for (let col=0;col<n;col++) {
      let pivot=col;
      for (let r=col+1;r<n;r++) if(Math.abs(M[r][col])>Math.abs(M[pivot][col])) pivot=r;
      if(Math.abs(M[pivot][col])<1e-10) continue;
      [M[col],M[pivot]]=[M[pivot],M[col]];
      const div=M[col][col];
      for (let c=col;c<=n;c++) M[col][c]/=div;
      for (let r=0;r<n;r++) {
        if(r===col) continue;
        const f=M[r][col];
        for (let c=col;c<=n;c++) M[r][c]-=f*M[col][c];
      }
    }
    return M.map(row=>row[n]);
  }
  function polyFitRidge(points, degree, lambda) {
    const d=degree+1;
    const XtX=Array.from({length:d},()=>Array(d).fill(0));
    const Xty=Array(d).fill(0);
    for (const p of points) {
      const pw=[];
      for (let i=0;i<d;i++) pw.push(Math.pow(p.x,i));
      for (let i=0;i<d;i++) {
        Xty[i]+=pw[i]*p.y;
        for (let j=0;j<d;j++) XtX[i][j]+=pw[i]*pw[j];
      }
    }
    for (let i=1;i<d;i++) XtX[i][i]+=lambda*points.length;
    return solveLinear(XtX, Xty);
  }
  function evalPoly(coef, x) {
    let y=0;
    for (let i=0;i<coef.length;i++) y+=coef[i]*Math.pow(x,i);
    return y;
  }
  function mse(points, coef) {
    let s=0;
    for (const p of points) { const e=p.y-evalPoly(coef,p.x); s+=e*e; }
    return s/points.length;
  }
  function makeComplexityCurve(noise, count, lambda) {
    const train=[], val=[];
    const trainPts=generateData(count, noise, 0);
    const valPts=generateData(32, noise+0.18, 999);
    for (let deg=1;deg<=12;deg++) {
      let coef;
      try { coef=polyFitRidge(trainPts, deg, lambda); } catch(e){coef=[0];}
      train.push({x:deg, y:mse(trainPts,coef)});
      val.push({x:deg, y:mse(valPts,coef)});
    }
    return {train, val};
  }
  function classify(degree, trainErr, valErr, lambda) {
    const gap=valErr-trainErr;
    if (degree<=2 && trainErr>1.0) return {
      key:'under', label:'Underfitting',
      title:'High bias — model too simple',
      body:'The curve cannot bend enough to capture the real structure. Both training and validation errors are high. Add more complexity.'
    };
    if (gap>0.75 && degree>=7 && lambda<0.22) return {
      key:'over', label:'Overfitting',
      title:'High variance — memorising noise',
      body:'Training error is low, but validation error is climbing. The model is fitting the noise in the training set rather than the true pattern.'
    };
    return {
      key:'good', label:'Good fit',
      title:'Balanced generalization',
      body:'The model is flexible enough to learn the underlying trend while keeping the validation error relatively low and the train–validation gap small.'
    };
  }
  function estimateBiasVariance(degree, trainErr, valErr, lambda) {
    const bias=Math.max(0.2, 3.9-degree*0.44+lambda*1.2+trainErr*0.18);
    const variance=Math.max(0.2, -0.3+degree*0.42-lambda*2.0+Math.max(0,valErr-trainErr)*0.9);
    return { bias:Math.min(5.0,bias), variance:Math.min(5.0,variance) };
  }

  /* ── SVG HELPERS ────────────────────────────────────────── */
  function svgEl(tag, attrs={}) {
    const el=document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (const [k,v] of Object.entries(attrs)) el.setAttribute(k,v);
    return el;
  }
  function pathFromPoints(points, mapX, mapY) {
    return points.map((p,i)=>`${i===0?'M':'L'} ${mapX(p.x).toFixed(2)} ${mapY(p.y).toFixed(2)}`).join(' ');
  }
  function drawAxes(svg, dims, xTicks, yTicks, xMap, yMap) {
    const {w,h,ml,mr,mt,mb}=dims;
    const plotW=w-ml-mr, plotH=h-mt-mb;
    const grid=svgEl('g');
    xTicks.forEach(v=>{
      const x=xMap(v);
      grid.appendChild(svgEl('line',{x1:x,y1:mt,x2:x,y2:mt+plotH,stroke:COLORS.grid,'stroke-width':1}));
    });
    yTicks.forEach(v=>{
      const y=yMap(v);
      grid.appendChild(svgEl('line',{x1:ml,y1:y,x2:ml+plotW,y2:y,stroke:COLORS.grid,'stroke-width':1}));
    });
    svg.appendChild(grid);
    const axis=svgEl('g');
    axis.appendChild(svgEl('line',{x1:ml,y1:yMap(0),x2:ml+plotW,y2:yMap(0),stroke:COLORS.axis,'stroke-width':1.2}));
    axis.appendChild(svgEl('line',{x1:xMap(0),y1:mt,x2:xMap(0),y2:mt+plotH,stroke:COLORS.axis,'stroke-width':1.2}));
    svg.appendChild(axis);
    const labels=svgEl('g');
    xTicks.forEach(v=>{
      const t=svgEl('text',{x:xMap(v),y:h-12,'text-anchor':'middle','font-size':11,fill:'#7d7d84'});
      t.textContent=v; labels.appendChild(t);
    });
    yTicks.forEach(v=>{
      const t=svgEl('text',{x:ml-10,y:yMap(v)+4,'text-anchor':'end','font-size':11,fill:'#7d7d84'});
      t.textContent=v; labels.appendChild(t);
    });
    svg.appendChild(labels);
  }

  /* ── RENDER ─────────────────────────────────────────────── */
  function render() {
    document.getElementById('degreeVal').textContent = `Degree ${state.degree}`;
    document.getElementById('noiseVal').textContent  = state.noise.toFixed(1);
    document.getElementById('countVal').textContent  = `${state.count} pts`;
    document.getElementById('lambdaVal').textContent = state.lambda.toFixed(2);
    document.getElementById('presetLabel').textContent =
      state.preset==='good'?'Good fit': state.preset==='under'?'Underfit': state.preset==='over'?'Overfit':'Custom';

    const trainPts = generateData(state.count, state.noise, 0);
    const valPts   = generateData(32, state.noise+0.18, 999);

    let coef;
    try { coef=polyFitRidge(trainPts, state.degree, state.lambda); }
    catch(e) { coef=[0]; }

    const trainErr = mse(trainPts, coef);
    const valErr   = mse(valPts,   coef);
    const diagnosis = classify(state.degree, trainErr, valErr, state.lambda);
    const bv        = estimateBiasVariance(state.degree, trainErr, valErr, state.lambda);

    document.getElementById('trainErr').textContent = trainErr.toFixed(2);
    document.getElementById('valErr').textContent   = valErr.toFixed(2);
    document.getElementById('biasVal').textContent  = bv.bias.toFixed(1);
    document.getElementById('varVal').textContent   = bv.variance.toFixed(1);

    // bias/variance bars
    document.getElementById('biasBar').style.width    = Math.min(100, bv.bias/5*100)+'%';
    document.getElementById('varBar').style.width     = Math.min(100, bv.variance/5*100)+'%';
    document.getElementById('biasBarLabel').textContent  = bv.bias.toFixed(1)+' / 5';
    document.getElementById('varBarLabel').textContent   = bv.variance.toFixed(1)+' / 5';

    document.getElementById('explainTitle').textContent = diagnosis.title;
    document.getElementById('explainBody').textContent  = diagnosis.body;
    document.getElementById('takeawayState').textContent = diagnosis.label;

    const pill=document.getElementById('statusPill');
    pill.className=`status-pill ${diagnosis.key}`;
    pill.innerHTML=`<span class="status-dot"></span><span>${diagnosis.label}</span>`;

    drawFitChart(trainPts, coef);
    drawErrorChart();
  }

  function drawFitChart(trainPts, coef) {
    fitSvg.innerHTML='';
    const dims={w:760,h:430,ml:52,mr:22,mt:18,mb:34};
    const xMin=-4.4,xMax=4.4,yMin=-4.8,yMax=5.8;
    const xMap=x=>dims.ml+((x-xMin)/(xMax-xMin))*(dims.w-dims.ml-dims.mr);
    const yMap=y=>dims.mt+(1-(y-yMin)/(yMax-yMin))*(dims.h-dims.mt-dims.mb);

    drawAxes(fitSvg, dims, [-4,-2,0,2,4], [-4,-2,0,2,4], xMap, yMap);

    const sample=[], truth=[];
    for (let i=0;i<=220;i++) {
      const x=xMin+(xMax-xMin)*(i/220);
      sample.push({x,y:evalPoly(coef,x)});
      truth.push({x,y:trueFn(x)});
    }

    if (state.showTruth) {
      fitSvg.appendChild(svgEl('path',{
        d:pathFromPoints(truth,xMap,yMap),
        fill:'none', stroke:COLORS.truth, 'stroke-width':2,
        'stroke-dasharray':'6 5', 'stroke-linecap':'round'
      }));
    }

    fitSvg.appendChild(svgEl('path',{
      d:pathFromPoints(sample,xMap,yMap),
      fill:'none', stroke:COLORS.fit, 'stroke-width':3,
      'stroke-linecap':'round', 'stroke-linejoin':'round'
    }));

    for (const p of trainPts) {
      fitSvg.appendChild(svgEl('circle',{
        cx:xMap(p.x), cy:yMap(p.y), r:4.5,
        fill:COLORS.pointsFill, stroke:COLORS.pointsStroke, 'stroke-width':1.2
      }));
    }
  }

  function drawErrorChart() {
    errorSvg.innerHTML='';
    const dims={w:760,h:260,ml:46,mr:18,mt:18,mb:34};
    const curves=makeComplexityCurve(state.noise, state.count, state.lambda);
    const yMax=Math.max(1.3,...curves.train.map(p=>p.y),...curves.val.map(p=>p.y))*1.12;
    const xMap=x=>dims.ml+((x-1)/11)*(dims.w-dims.ml-dims.mr);
    const yMap=y=>dims.mt+(1-(y/yMax))*(dims.h-dims.mt-dims.mb);

    const yTicks=[0, +(yMax*0.33).toFixed(1), +(yMax*0.66).toFixed(1), +yMax.toFixed(1)];
    drawAxes(errorSvg, dims, [1,3,5,7,9,11], yTicks, xMap, yMap);

    // X axis label
    const xLab=svgEl('text',{x:(dims.w-dims.ml-dims.mr)/2+dims.ml, y:dims.h-2,'text-anchor':'middle','font-size':10,fill:'#aeaeb2'});
    xLab.textContent='Model complexity (degree)';
    errorSvg.appendChild(xLab);

    if (state.showGap) {
      const area=curves.val.map(p=>({x:p.x,y:p.y}))
        .concat(curves.train.slice().reverse().map(p=>({x:p.x,y:p.y})));
      errorSvg.appendChild(svgEl('path',{
        d:area.map((p,i)=>`${i===0?'M':'L'} ${xMap(p.x).toFixed(2)} ${yMap(p.y).toFixed(2)}`).join(' ')+' Z',
        fill:COLORS.gap, stroke:'none'
      }));
    }

    // train line
    errorSvg.appendChild(svgEl('path',{
      d:pathFromPoints(curves.train,xMap,yMap),
      fill:'none', stroke:COLORS.train, 'stroke-width':2.6,
      'stroke-linecap':'round', 'stroke-linejoin':'round'
    }));
    // val line
    errorSvg.appendChild(svgEl('path',{
      d:pathFromPoints(curves.val,xMap,yMap),
      fill:'none', stroke:COLORS.val, 'stroke-width':2.6,
      'stroke-linecap':'round', 'stroke-linejoin':'round'
    }));

    for (const p of curves.train) errorSvg.appendChild(svgEl('circle',{cx:xMap(p.x),cy:yMap(p.y),r:2.8,fill:COLORS.train}));
    for (const p of curves.val)   errorSvg.appendChild(svgEl('circle',{cx:xMap(p.x),cy:yMap(p.y),r:2.8,fill:COLORS.val}));

    // current degree indicator
    const xNow=xMap(state.degree);
    errorSvg.appendChild(svgEl('line',{
      x1:xNow,y1:dims.mt,x2:xNow,y2:dims.h-dims.mb,
      stroke:'rgba(29,29,31,0.2)','stroke-width':1.5,'stroke-dasharray':'5 5'
    }));
    const cTrain=curves.train[state.degree-1];
    const cVal  =curves.val[state.degree-1];
    errorSvg.appendChild(svgEl('circle',{cx:xMap(cTrain.x),cy:yMap(cTrain.y),r:5,fill:'#fff',stroke:COLORS.train,'stroke-width':2.4}));
    errorSvg.appendChild(svgEl('circle',{cx:xMap(cVal.x),  cy:yMap(cVal.y),  r:5,fill:'#fff',stroke:COLORS.val,  'stroke-width':2.4}));

    // region labels
    const underX=xMap(1.5), goodX=xMap(4), overX=xMap(9.5);
    const labelY=dims.mt+14;
    [[underX,'Underfit','#d85a30'],[goodX,'Good','#639922'],[overX,'Overfit','#ba7517']].forEach(([x,txt,col])=>{
      const t=svgEl('text',{x,y:labelY,'text-anchor':'middle','font-size':9.5,fill:col,'font-weight':'600','opacity':'0.7'});
      t.textContent=txt; errorSvg.appendChild(t);
    });
  }

  /* ── PRESETS ─────────────────────────────────────────────── */
  function setPreset(kind) {
    if      (kind==='under') { state.degree=1;  state.noise=1.0; state.count=24; state.lambda=0.12; state.preset='under'; }
    else if (kind==='good')  { state.degree=4;  state.noise=1.2; state.count=22; state.lambda=0.08; state.preset='good'; }
    else if (kind==='over')  { state.degree=10; state.noise=1.6; state.count=16; state.lambda=0.02; state.preset='over'; }
    else { state.degree=4; state.noise=1.2; state.count=22; state.lambda=0.08; state.showTruth=true; state.showGap=true; state.preset='good'; }
    syncInputs();
    syncPresetButtons(kind==='reset'?'good':state.preset);
    render();
  }

  function syncInputs() {
    document.getElementById('degree').value     = state.degree;
    document.getElementById('noise').value      = state.noise;
    document.getElementById('count').value      = state.count;
    document.getElementById('lambda').value     = state.lambda;
    document.getElementById('showTruth').checked = state.showTruth;
    document.getElementById('showGap').checked  = state.showGap;
  }

  function syncPresetButtons(active) {
    document.querySelectorAll('.chip[data-preset]').forEach(btn=>{
      const isActive = btn.dataset.preset===active && active!=='reset';
      btn.classList.toggle('active', isActive);
    });
  }

  /* ── EVENTS ──────────────────────────────────────────────── */
  document.getElementById('degree').addEventListener('input', e=>{ state.degree=+e.target.value; state.preset='custom'; syncPresetButtons(''); render(); });
  document.getElementById('noise').addEventListener('input',  e=>{ state.noise=+e.target.value;  state.preset='custom'; syncPresetButtons(''); render(); });
  document.getElementById('count').addEventListener('input',  e=>{ state.count=+e.target.value;  state.preset='custom'; syncPresetButtons(''); render(); });
  document.getElementById('lambda').addEventListener('input', e=>{ state.lambda=+e.target.value; state.preset='custom'; syncPresetButtons(''); render(); });
  document.getElementById('showTruth').addEventListener('change', e=>{ state.showTruth=e.target.checked; render(); });
  document.getElementById('showGap').addEventListener('change',   e=>{ state.showGap=e.target.checked;   render(); });
  document.querySelectorAll('.chip[data-preset]').forEach(btn=>{
    btn.addEventListener('click', ()=>setPreset(btn.dataset.preset));
  });

  syncInputs();
  syncPresetButtons('good');
  render();
</script>
</body>
</html>

'''))
