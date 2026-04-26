from IPython.display import HTML, display
import uuid

uid = str(uuid.uuid4())[:8]

html_code = r'''

<div id="loss-page-__UID__">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">

  <style>
    #loss-page-__UID__ {
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
      --green: #2d7c46;
      --greenSoft: #eaf3de;
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

    #loss-page-__UID__ * { box-sizing: border-box; margin: 0; padding: 0; }

    #loss-page-__UID__ .page {
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

    #loss-page-__UID__ .nav {
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

    #loss-page-__UID__ .nav-back {
      display: flex;
      align-items: center;
      gap: 6px;
      color: var(--blue);
      font-size: 13px;
      font-weight: 500;
    }

    #loss-page-__UID__ .nav-brand { font-size: 13px; font-weight: 600; }
    #loss-page-__UID__ .nav-status { font-size: 13px; color: var(--gray4); }

    #loss-page-__UID__ .hero {
      padding: 42px 32px 28px;
      border-bottom: 0.5px solid var(--gray2);
    }

    #loss-page-__UID__ .hero-shell {
      max-width: 1240px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: minmax(0, 1.25fr) minmax(320px, 0.75fr);
      gap: 18px;
      align-items: start;
    }

    #loss-page-__UID__ .badge {
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

    #loss-page-__UID__ h1 {
      font-size: clamp(30px, 4vw, 42px);
      font-weight: 700;
      letter-spacing: -0.03em;
      line-height: 1.05;
      margin-bottom: 10px;
    }

    #loss-page-__UID__ h1 span {
      background: linear-gradient(135deg, var(--blue), #58a6ff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    #loss-page-__UID__ .desc {
      font-size: 15px;
      color: var(--gray3);
      line-height: 1.65;
      max-width: 760px;
      margin-bottom: 22px;
    }

    #loss-page-__UID__ .meta { display: flex; flex-wrap: wrap; gap: 20px; }
    #loss-page-__UID__ .meta-item { font-size: 12px; color: var(--gray4); }
    #loss-page-__UID__ .meta-item span { color: var(--black); font-weight: 600; }

    #loss-page-__UID__ .hero-panel {
      background: linear-gradient(180deg,#fbfdff 0%, #f4f8ff 100%);
      border: 1px solid rgba(0,113,227,0.08);
      border-radius: 20px;
      padding: 18px;
      box-shadow: var(--shadow);
    }

    #loss-page-__UID__ .hero-panel-label {
      font-size: 10px;
      color: var(--gray4);
      letter-spacing: .08em;
      text-transform: uppercase;
      margin-bottom: 10px;
      font-weight: 600;
    }

    #loss-page-__UID__ .hero-panel-title {
      font-size: 16px;
      font-weight: 600;
      letter-spacing: -.02em;
      margin-bottom: 14px;
    }

    #loss-page-__UID__ .hero-points {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    #loss-page-__UID__ .hero-point {
      display: flex;
      gap: 10px;
      padding: 12px 14px;
      border-radius: 14px;
      background: rgba(255,255,255,0.72);
      border: 1px solid rgba(0,0,0,0.04);
    }

    #loss-page-__UID__ .dot {
      width: 9px;
      height: 9px;
      border-radius: 50%;
      margin-top: 5px;
      flex: none;
    }

    #loss-page-__UID__ .hero-point strong {
      display: block;
      font-size: 12px;
      margin-bottom: 2px;
    }

    #loss-page-__UID__ .hero-point span {
      font-size: 12px;
      color: var(--gray3);
      line-height: 1.5;
    }

    #loss-page-__UID__ .main {
      max-width: 1240px;
      margin: 0 auto;
      padding: 30px 32px 36px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    #loss-page-__UID__ .section-label {
      font-size: 11px;
      font-weight: 500;
      color: var(--gray3);
      letter-spacing: .07em;
      text-transform: uppercase;
      margin-bottom: 2px;
    }

    #loss-page-__UID__ .panel {
      background: var(--panel);
      border: 1px solid rgba(0,0,0,0.05);
      border-radius: var(--radius);
      box-shadow: var(--shadow);
      backdrop-filter: blur(18px);
    }

    #loss-page-__UID__ .controls-shell {
      padding: 18px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-bottom: 0;
    }

    #loss-page-__UID__ .controls-head h2 {
      font-size: 18px;
      font-weight: 600;
      letter-spacing: -0.02em;
      margin-bottom: 2px;
    }

    #loss-page-__UID__ .controls-head .sub {
      font-size: 13px;
      color: var(--gray3);
      line-height: 1.55;
    }

    #loss-page-__UID__ .controls-grid {
      display: grid;
      grid-template-columns: 1.25fr 1fr 1fr 1fr;
      gap: 14px;
      align-items: stretch;
    }

    #loss-page-__UID__ .control-block {
      padding: 14px;
      border-radius: 16px;
      background: rgba(255,255,255,0.78);
      border: 1px solid rgba(0,0,0,0.04);
    }

    #loss-page-__UID__ .control-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      margin-bottom: 8px;
    }

    #loss-page-__UID__ .control-label {
      font-size: 12px;
      font-weight: 600;
      color: var(--black);
      letter-spacing: -0.01em;
    }

    #loss-page-__UID__ .control-value {
      font-size: 12px;
      color: var(--gray4);
      font-weight: 600;
    }

    #loss-page-__UID__ .control-help {
      font-size: 12px;
      color: var(--gray3);
      line-height: 1.45;
      margin-top: 8px;
    }

    #loss-page-__UID__ input[type="range"] {
      width: 100%;
      accent-color: var(--blue);
      cursor: pointer;
    }

    #loss-page-__UID__ .chip-row,
    #loss-page-__UID__ .seg-row,
    #loss-page-__UID__ .class-row {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    #loss-page-__UID__ .chip,
    #loss-page-__UID__ .seg-btn,
    #loss-page-__UID__ .class-btn {
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

    #loss-page-__UID__ .chip:hover,
    #loss-page-__UID__ .seg-btn:hover,
    #loss-page-__UID__ .class-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    }

    #loss-page-__UID__ .chip.active,
    #loss-page-__UID__ .seg-btn.active,
    #loss-page-__UID__ .class-btn.active {
      background: var(--blue);
      color: #fff;
      border-color: transparent;
    }

    #loss-page-__UID__ .layout {
      display: grid;
      grid-template-columns: minmax(0, 1.22fr) minmax(320px, 0.78fr);
      gap: 16px;
      align-items: start;
    }

    #loss-page-__UID__ .viz-shell,
    #loss-page-__UID__ .side-shell {
      padding: 18px;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    #loss-page-__UID__ .card {
      background: rgba(255,255,255,0.78);
      border: 1px solid rgba(0,0,0,0.05);
      border-radius: 18px;
      padding: 14px;
    }

    #loss-page-__UID__ .card-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 10px;
    }

    #loss-page-__UID__ .card-title { font-size: 13px; font-weight: 600; letter-spacing: -0.01em; }
    #loss-page-__UID__ .card-sub { font-size: 11px; color: var(--gray4); }

    #loss-page-__UID__ .process-grid {
      display: grid;
      grid-template-columns: repeat(5, minmax(0, 1fr));
      gap: 10px;
      margin-bottom: 14px;
    }

    #loss-page-__UID__ .process-card {
      border-radius: 14px;
      background: rgba(255,255,255,0.86);
      border: 1px solid rgba(0,0,0,0.05);
      padding: 12px;
      min-height: 96px;
    }

    #loss-page-__UID__ .process-label {
      font-size: 10px;
      color: var(--gray4);
      letter-spacing: .07em;
      text-transform: uppercase;
      font-weight: 600;
      margin-bottom: 8px;
    }

    #loss-page-__UID__ .process-value {
      font-size: 21px;
      font-weight: 700;
      letter-spacing: -0.03em;
      margin-bottom: 4px;
    }

    #loss-page-__UID__ .process-note {
      font-size: 12px;
      color: var(--gray3);
      line-height: 1.45;
    }

    #loss-page-__UID__ .chart-wrap {
      width: 100%;
      height: 350px;
      border-radius: 16px;
      overflow: hidden;
      background: linear-gradient(to bottom, rgba(243,247,255,0.75), rgba(255,255,255,0.94));
      border: 1px solid rgba(0,0,0,0.04);
    }

    #loss-page-__UID__ svg {
      width: 100%;
      height: 100%;
      display: block;
    }

    #loss-page-__UID__ .bottom-grid {
      display: grid;
      grid-template-columns: 1.15fr 0.85fr;
      gap: 14px;
    }

    #loss-page-__UID__ .batch-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 10px;
    }

    #loss-page-__UID__ .batch-card {
      border-radius: 14px;
      padding: 12px;
      background: var(--gray1);
      min-height: 94px;
    }

    #loss-page-__UID__ .batch-title {
      font-size: 11px;
      color: var(--gray4);
      margin-bottom: 6px;
    }

    #loss-page-__UID__ .batch-main {
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 6px;
    }

    #loss-page-__UID__ .batch-loss {
      font-size: 18px;
      font-weight: 700;
      letter-spacing: -0.03em;
      color: var(--blue);
    }

    #loss-page-__UID__ .formula-box,
    #loss-page-__UID__ .takeaway-box {
      font-size: 12.5px;
      color: var(--black);
      background: var(--gray1);
      border-radius: 14px;
      padding: 14px 16px;
      line-height: 1.8;
    }

    #loss-page-__UID__ .formula-box strong,
    #loss-page-__UID__ .takeaway-box strong {
      color: var(--blue);
    }

    #loss-page-__UID__ .status-pill {
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

    #loss-page-__UID__ .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }

    #loss-page-__UID__ .metric-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-bottom: 10px;
    }

    #loss-page-__UID__ .metric {
      border-radius: 14px;
      padding: 12px;
      background: var(--gray1);
    }

    #loss-page-__UID__ .metric-label { font-size: 11px; color: var(--gray4); margin-bottom: 4px; }
    #loss-page-__UID__ .metric-value { font-size: 22px; font-weight: 600; letter-spacing: -0.03em; }

    #loss-page-__UID__ .list-rows {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    #loss-page-__UID__ .list-row {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      padding: 10px 12px;
      border-radius: 14px;
      background: var(--gray1);
      font-size: 12px;
    }

    #loss-page-__UID__ .list-row strong { color: var(--black); }
    #loss-page-__UID__ .list-row span { color: var(--gray3); line-height: 1.5; text-align: right; }

    #loss-page-__UID__ .footer-strip {
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
      #loss-page-__UID__ .controls-grid { grid-template-columns: 1fr 1fr; }
      #loss-page-__UID__ .hero-shell { grid-template-columns: 1fr; }
      #loss-page-__UID__ .layout { grid-template-columns: 1fr; }
      #loss-page-__UID__ .process-grid { grid-template-columns: 1fr 1fr; }
      #loss-page-__UID__ .bottom-grid { grid-template-columns: 1fr; }
      #loss-page-__UID__ .batch-grid { grid-template-columns: 1fr 1fr; }
    }

    @media (max-width: 700px) {
      #loss-page-__UID__ .hero,
      #loss-page-__UID__ .main {
        padding-left: 18px;
        padding-right: 18px;
      }
      #loss-page-__UID__ .controls-grid,
      #loss-page-__UID__ .process-grid,
      #loss-page-__UID__ .batch-grid,
      #loss-page-__UID__ .metric-grid {
        grid-template-columns: 1fr;
      }
      #loss-page-__UID__ .chart-wrap { height: 320px; }
    }

    #loss-page-__UID__ .hidden {
      display: none !important;
    }
  </style>

  <div class="page">
    <nav class="nav">
      <div class="nav-back">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8l4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        Neural Networks & Optimization
      </div>
      <div class="nav-brand">Interactive Lab</div>
      <div class="nav-status" id="navStatus">MSE · regression target vs prediction</div>
    </nav>

    <section class="hero">
      <div class="hero-shell">
        <div>
          <div class="badge">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor"><circle cx="5" cy="5" r="5"/></svg>
            Module 1 · Training Signal
          </div>
          <h1>Loss Functions and<br><span>Training Signal</span></h1>
          <p class="desc">
            A model does not learn from prediction alone. It predicts, compares against the ground truth, turns that mismatch into a scalar loss, averages across the batch, and uses the result to guide parameter updates.
          </p>
          <div class="meta">
            <div class="meta-item">Prediction <span>Model output</span></div>
            <div class="meta-item">Truth <span>Correct answer</span></div>
            <div class="meta-item">Batch loss <span>Average across samples</span></div>
            <div class="meta-item">Purpose <span>Guide learning</span></div>
          </div>
        </div>

        <div class="hero-panel">
          <div class="hero-panel-label">Key concepts</div>
          <div class="hero-panel-title">What to watch for</div>
          <div class="hero-points">
            <div class="hero-point">
              <div class="dot" style="background:#0071e3"></div>
              <div>
                <strong>Compare prediction with truth</strong>
                <span>The loss is computed only after the model output is compared with the correct target or label.</span>
              </div>
            </div>
            <div class="hero-point">
              <div class="dot" style="background:#0f6e56"></div>
              <div>
                <strong>Different tasks need different penalties</strong>
                <span>MSE and MAE suit continuous values, while cross-entropy is designed for probability-based classification.</span>
              </div>
            </div>
            <div class="hero-point">
              <div class="dot" style="background:#8a5410"></div>
              <div>
                <strong>Batch loss drives updates</strong>
                <span>Training usually averages losses across several samples before backpropagation adjusts the weights.</span>
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
          <p class="sub">Switch between regression and classification losses, then move prediction and target values to see how the loss changes.</p>
        </div>

        <div class="controls-grid">
          <div class="control-block">
            <div class="control-label" style="margin-bottom:10px;">Loss family</div>
            <div class="chip-row">
              <button class="chip active" data-mode="mse">MSE</button>
              <button class="chip" data-mode="mae">MAE</button>
              <button class="chip" data-mode="bce">Binary CE</button>
              <button class="chip" data-mode="cce">Categorical CE</button>
            </div>
            <div class="control-help">Choose a loss that matches the prediction type and target format.</div>
          </div>

          <div class="control-block" id="regressionBlock">
            <div class="control-top">
              <div class="control-label">Regression values</div>
              <div class="control-value" id="regressionReadout">ŷ = 1.20 · y = 2.40</div>
            </div>
            <div style="display:flex; flex-direction:column; gap:10px;">
              <div>
                <div class="control-top" style="margin-bottom:4px;">
                  <div class="control-label">Prediction ŷ</div>
                  <div class="control-value" id="predValue">1.20</div>
                </div>
                <input type="range" id="predSlider" min="-4" max="4" step="0.1" value="1.2">
              </div>
              <div>
                <div class="control-top" style="margin-bottom:4px;">
                  <div class="control-label">Target y</div>
                  <div class="control-value" id="targetValue">2.40</div>
                </div>
                <input type="range" id="targetSlider" min="-4" max="4" step="0.1" value="2.4">
              </div>
            </div>
            <div class="control-help">Used for continuous-value prediction tasks such as price, demand, or temperature.</div>
          </div>

          <div class="control-block hidden" id="binaryBlock">
            <div class="control-top">
              <div class="control-label">Binary classification</div>
              <div class="control-value" id="binaryReadout">p = 0.82 · label = 1</div>
            </div>
            <div style="display:flex; flex-direction:column; gap:10px;">
              <div>
                <div class="control-top" style="margin-bottom:4px;">
                  <div class="control-label">Predicted probability</div>
                  <div class="control-value" id="probValue">0.82</div>
                </div>
                <input type="range" id="probSlider" min="0.01" max="0.99" step="0.01" value="0.82">
              </div>
              <div>
                <div class="control-label" style="margin-bottom:8px;">True label</div>
                <div class="seg-row">
                  <button class="seg-btn" id="labelZero">Label 0</button>
                  <button class="seg-btn active" id="labelOne">Label 1</button>
                </div>
              </div>
            </div>
            <div class="control-help">Binary cross-entropy punishes wrong and overconfident probabilities very strongly.</div>
          </div>

          <div class="control-block hidden" id="categoricalBlock">
            <div class="control-top">
              <div class="control-label">Multiclass classification</div>
              <div class="control-value" id="categoricalReadout">true class prob = 0.72</div>
            </div>
            <div style="display:flex; flex-direction:column; gap:10px;">
              <div>
                <div class="control-top" style="margin-bottom:4px;">
                  <div class="control-label">Probability assigned to the true class</div>
                  <div class="control-value" id="trueProbValue">0.72</div>
                </div>
                <input type="range" id="trueProbSlider" min="0.01" max="0.99" step="0.01" value="0.72">
              </div>
              <div>
                <div class="control-label" style="margin-bottom:8px;">True class</div>
                <div class="class-row">
                  <button class="class-btn active" data-class="0">Class 1</button>
                  <button class="class-btn" data-class="1">Class 2</button>
                  <button class="class-btn" data-class="2">Class 3</button>
                </div>
              </div>
            </div>
            <div class="control-help">Categorical cross-entropy mainly cares about how much probability the model gave to the correct class.</div>
          </div>

          <div class="control-block">
            <div class="control-top">
              <div class="control-label">Teaching focus</div>
              <div class="control-value" id="focusValue">MSE</div>
            </div>
            <div class="formula-box" id="miniFormulaBox" style="margin-top:2px;">
              <strong>MSE</strong><br>
              L = (ŷ − y)<sup>2</sup>
            </div>
            <div class="control-help">Keep the formula short here, then explain what each term means in the walkthrough below.</div>
          </div>
        </div>
      </section>

      <div class="layout">
        <section class="panel viz-shell">
          <div class="card">
            <div class="card-head">
              <div>
                <div class="card-title">Loss computation walkthrough</div>
                <div class="card-sub">Prediction → comparison → sample loss → batch average → update signal</div>
              </div>
            </div>

            <div class="process-grid">
              <div class="process-card">
                <div class="process-label">Step 1</div>
                <div class="process-value" id="stepPredValue">1.20</div>
                <div class="process-note" id="stepPredNote">Current prediction from the model.</div>
              </div>
              <div class="process-card">
                <div class="process-label">Step 2</div>
                <div class="process-value" id="stepTruthValue">2.40</div>
                <div class="process-note" id="stepTruthNote">Ground-truth target or label.</div>
              </div>
              <div class="process-card">
                <div class="process-label">Step 3</div>
                <div class="process-value" id="stepCompareValue">-1.20</div>
                <div class="process-note" id="stepCompareNote">Comparison term used by the loss.</div>
              </div>
              <div class="process-card">
                <div class="process-label">Step 4</div>
                <div class="process-value" id="stepLossValue">1.44</div>
                <div class="process-note" id="stepLossNote">Per-sample loss for this one example.</div>
              </div>
              <div class="process-card">
                <div class="process-label">Step 5</div>
                <div class="process-value" id="stepBatchValue">1.52</div>
                <div class="process-note" id="stepBatchNote">Average loss across the current batch.</div>
              </div>
            </div>

            <div class="chart-wrap">
              <svg id="lossChart" viewBox="0 0 760 350" preserveAspectRatio="none"></svg>
            </div>
          </div>

          <div class="bottom-grid">
            <div class="card">
              <div class="card-head">
                <div>
                  <div class="card-title">Mini-batch view</div>
                  <div class="card-sub">Several samples, one average training signal</div>
                </div>
              </div>
              <div class="batch-grid" id="batchGrid"></div>
            </div>

            <div class="card">
              <div class="card-head">
                <div>
                  <div class="card-title">Core formula</div>
                  <div class="card-sub">Current loss definition</div>
                </div>
              </div>
              <div class="formula-box" id="formulaBox"></div>
            </div>
          </div>
        </section>

        <aside class="panel side-shell">
          <div class="card">
            <div class="card-head">
              <div>
                <div class="card-title">Current summary</div>
                <div class="card-sub">How the current example is being penalized</div>
              </div>
            </div>

            <div id="modePill" class="status-pill">
              <span class="status-dot" id="modeDot"></span>
              <span id="modePillText">Mean Squared Error</span>
            </div>

            <div class="metric-grid">
              <div class="metric">
                <div class="metric-label">Sample loss</div>
                <div class="metric-value" id="metricSampleLoss">1.44</div>
              </div>
              <div class="metric">
                <div class="metric-label">Batch loss</div>
                <div class="metric-value" id="metricBatchLoss">1.52</div>
              </div>
              <div class="metric">
                <div class="metric-label">Prediction</div>
                <div class="metric-value" id="metricPrediction">1.20</div>
              </div>
              <div class="metric">
                <div class="metric-label">Ground truth</div>
                <div class="metric-value" id="metricTruth">2.40</div>
              </div>
            </div>

            <div class="list-rows">
              <div class="list-row">
                <strong>Why this loss?</strong>
                <span id="whyLossText">Useful when the target is a continuous number and large errors should be punished more strongly.</span>
              </div>
              <div class="list-row">
                <strong>What the curve shows</strong>
                <span id="curveText">The current dot moves along the loss curve as the prediction changes.</span>
              </div>
              <div class="list-row">
                <strong>Current penalty style</strong>
                <span id="penaltyText">Squaring makes large misses grow quickly.</span>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-head">
              <div>
                <div class="card-title">Takeaway</div>
                <div class="card-sub">Teaching summary</div>
              </div>
            </div>
            <div class="takeaway-box" id="takeawayBox"></div>
          </div>
        </aside>
      </div>
    </main>

    <div class="footer-strip">Loss · Prediction error · Batch average · Regression · Classification</div>
  </div>

<script>
(function() {
  const svg = document.getElementById("lossChart");

  const state = {
    mode: "mse",
    pred: 1.2,
    target: 2.4,
    label: 1,
    prob: 0.82,
    trueClass: 0,
    trueProb: 0.72
  };

  const colors = {
    mse: { pill: "#e8f0fe", dot: "#0071e3", text: "#0071e3" },
    mae: { pill: "#efedff", dot: "#5d4fc4", text: "#5d4fc4" },
    bce: { pill: "#eaf3de", dot: "#2d7c46", text: "#2d7c46" },
    cce: { pill: "#faeeda", dot: "#b25a17", text: "#b25a17" }
  };

  const modeButtons = document.querySelectorAll('[data-mode]');
  const classButtons = document.querySelectorAll('[data-class]');
  const predSlider = document.getElementById("predSlider");
  const targetSlider = document.getElementById("targetSlider");
  const probSlider = document.getElementById("probSlider");
  const trueProbSlider = document.getElementById("trueProbSlider");
  const labelZero = document.getElementById("labelZero");
  const labelOne = document.getElementById("labelOne");

  function clamp(v, lo, hi) {
    return Math.max(lo, Math.min(hi, v));
  }

  function fmt(num, digits=2) {
    return Number(num).toFixed(digits);
  }

  function fmtSigned(num, digits=2) {
    const sign = num > 0 ? "+" : "";
    return sign + Number(num).toFixed(digits);
  }

  function getModeName(mode) {
    return {
      mse: "Mean Squared Error",
      mae: "Mean Absolute Error",
      bce: "Binary Cross-Entropy",
      cce: "Categorical Cross-Entropy"
    }[mode];
  }

  function getCurrentValues() {
    if (state.mode === "mse" || state.mode === "mae") {
      return {
        prediction: state.pred,
        truth: state.target,
        compare: state.pred - state.target
      };
    }
    if (state.mode === "bce") {
      return {
        prediction: state.prob,
        truth: state.label,
        compare: state.prob - state.label
      };
    }
    return {
      prediction: state.trueProb,
      truth: "Class " + (state.trueClass + 1),
      compare: 1 - state.trueProb
    };
  }

  function sampleLossFromValue(value) {
    if (state.mode === "mse") return Math.pow(value - state.target, 2);
    if (state.mode === "mae") return Math.abs(value - state.target);
    if (state.mode === "bce") {
      const p = clamp(value, 0.0001, 0.9999);
      return -(state.label * Math.log(p) + (1 - state.label) * Math.log(1 - p));
    }
    const pTrue = clamp(value, 0.0001, 0.9999);
    return -Math.log(pTrue);
  }

  function currentLoss() {
    if (state.mode === "mse") return Math.pow(state.pred - state.target, 2);
    if (state.mode === "mae") return Math.abs(state.pred - state.target);
    if (state.mode === "bce") {
      const p = clamp(state.prob, 0.0001, 0.9999);
      return -(state.label * Math.log(p) + (1 - state.label) * Math.log(1 - p));
    }
    const pTrue = clamp(state.trueProb, 0.0001, 0.9999);
    return -Math.log(pTrue);
  }

  function batchExamples() {
    let baseValues = [];
    if (state.mode === "mse" || state.mode === "mae") {
      baseValues = [state.pred - 1.2, state.pred - 0.35, state.pred + 0.55, state.pred + 1.35].map(v => clamp(v, -4, 4));
      return baseValues.map((v, i) => ({
        title: "Sample " + (i + 1),
        main: "ŷ = " + fmt(v) + " · y = " + fmt(state.target),
        loss: sampleLossFromValue(v)
      }));
    }
    if (state.mode === "bce") {
      baseValues = [state.prob - 0.30, state.prob - 0.12, state.prob + 0.08, state.prob + 0.22].map(v => clamp(v, 0.01, 0.99));
      return baseValues.map((v, i) => ({
        title: "Sample " + (i + 1),
        main: "p = " + fmt(v) + " · y = " + state.label,
        loss: sampleLossFromValue(v)
      }));
    }
    baseValues = [state.trueProb - 0.28, state.trueProb - 0.10, state.trueProb + 0.06, state.trueProb + 0.18].map(v => clamp(v, 0.01, 0.99));
    return baseValues.map((v, i) => ({
      title: "Sample " + (i + 1),
      main: "p(true) = " + fmt(v),
      loss: sampleLossFromValue(v)
    }));
  }

  function batchLossValue() {
    const samples = batchExamples();
    return samples.reduce((acc, s) => acc + s.loss, 0) / samples.length;
  }

  function buildBatchCards() {
    const wrap = document.getElementById("batchGrid");
    wrap.innerHTML = "";
    batchExamples().forEach(sample => {
      const card = document.createElement("div");
      card.className = "batch-card";
      card.innerHTML = `
        <div class="batch-title">${sample.title}</div>
        <div class="batch-main">${sample.main}</div>
        <div class="batch-loss">${fmt(sample.loss)}</div>
      `;
      wrap.appendChild(card);
    });
  }

  function svgEl(tag, attrs={}) {
    const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
    return el;
  }

  function drawChart() {
    svg.innerHTML = "";
    const dims = { w:760, h:350, ml:52, mr:22, mt:18, mb:40 };
    let points = [];
    let xMin = 0, xMax = 1, xTicks = [], currentX = 0, currentY = 0, xLabel = "";

    if (state.mode === "mse") {
      xMin = -4; xMax = 4; xTicks = [-4,-2,0,2,4]; xLabel = "Prediction ŷ";
      for (let i=0;i<=220;i++) {
        const x = xMin + (xMax - xMin) * (i / 220);
        points.push({ x, y: Math.pow(x - state.target, 2) });
      }
      currentX = state.pred; currentY = currentLoss();
    } else if (state.mode === "mae") {
      xMin = -4; xMax = 4; xTicks = [-4,-2,0,2,4]; xLabel = "Prediction ŷ";
      for (let i=0;i<=220;i++) {
        const x = xMin + (xMax - xMin) * (i / 220);
        points.push({ x, y: Math.abs(x - state.target) });
      }
      currentX = state.pred; currentY = currentLoss();
    } else if (state.mode === "bce") {
      xMin = 0.01; xMax = 0.99; xTicks = [0.1,0.3,0.5,0.7,0.9]; xLabel = "Predicted probability";
      for (let i=0;i<=220;i++) {
        const x = xMin + (xMax - xMin) * (i / 220);
        const y = state.label === 1 ? -Math.log(x) : -Math.log(1 - x);
        points.push({ x, y });
      }
      currentX = state.prob; currentY = currentLoss();
    } else {
      xMin = 0.01; xMax = 0.99; xTicks = [0.1,0.3,0.5,0.7,0.9]; xLabel = "Probability assigned to the true class";
      for (let i=0;i<=220;i++) {
        const x = xMin + (xMax - xMin) * (i / 220);
        points.push({ x, y: -Math.log(x) });
      }
      currentX = state.trueProb; currentY = currentLoss();
    }

    const yMax = Math.max(1.3, ...points.map(p => p.y), currentY) * 1.12;
    const xMap = x => dims.ml + ((x - xMin) / (xMax - xMin)) * (dims.w - dims.ml - dims.mr);
    const yMap = y => dims.mt + (1 - (y / yMax)) * (dims.h - dims.mt - dims.mb);

    const yTicks = [0, +(yMax*0.33).toFixed(1), +(yMax*0.66).toFixed(1), +yMax.toFixed(1)];
    const grid = svgEl("g");
    xTicks.forEach(v => {
      grid.appendChild(svgEl("line", { x1:xMap(v), y1:dims.mt, x2:xMap(v), y2:dims.h-dims.mb, stroke:"rgba(0,0,0,0.06)", "stroke-width":1 }));
    });
    yTicks.forEach(v => {
      grid.appendChild(svgEl("line", { x1:dims.ml, y1:yMap(v), x2:dims.w-dims.mr, y2:yMap(v), stroke:"rgba(0,0,0,0.06)", "stroke-width":1 }));
    });
    svg.appendChild(grid);

    const axis = svgEl("g");
    axis.appendChild(svgEl("line", { x1:dims.ml, y1:yMap(0), x2:dims.w-dims.mr, y2:yMap(0), stroke:"rgba(110,110,115,0.62)", "stroke-width":1.2 }));
    axis.appendChild(svgEl("line", { x1:dims.ml, y1:dims.mt, x2:dims.ml, y2:dims.h-dims.mb, stroke:"rgba(110,110,115,0.62)", "stroke-width":1.2 }));
    svg.appendChild(axis);

    xTicks.forEach(v => {
      const t = svgEl("text", { x:xMap(v), y:dims.h-12, "text-anchor":"middle", "font-size":11, fill:"#7d7d84" });
      t.textContent = v;
      svg.appendChild(t);
    });

    yTicks.forEach(v => {
      const t = svgEl("text", { x:dims.ml-10, y:yMap(v)+4, "text-anchor":"end", "font-size":11, fill:"#7d7d84" });
      t.textContent = v;
      svg.appendChild(t);
    });

    const xLab = svgEl("text", { x:(dims.w-dims.ml-dims.mr)/2+dims.ml, y:dims.h-2, "text-anchor":"middle", "font-size":10, fill:"#aeaeb2" });
    xLab.textContent = xLabel;
    svg.appendChild(xLab);

    const path = points.map((p, i) => `${i===0 ? "M" : "L"} ${xMap(p.x).toFixed(2)} ${yMap(p.y).toFixed(2)}`).join(" ");
    svg.appendChild(svgEl("path", {
      d: path,
      fill: "none",
      stroke: "#0071e3",
      "stroke-width": 3,
      "stroke-linecap": "round",
      "stroke-linejoin": "round"
    }));

    const cx = xMap(currentX);
    const cy = yMap(currentY);
    svg.appendChild(svgEl("line", {
      x1: cx, y1: dims.mt, x2: cx, y2: dims.h-dims.mb,
      stroke: "rgba(29,29,31,0.22)", "stroke-width": 1.5, "stroke-dasharray": "5 5"
    }));
    svg.appendChild(svgEl("line", {
      x1: dims.ml, y1: cy, x2: cx, y2: cy,
      stroke: "rgba(0,113,227,0.18)", "stroke-width": 2, "stroke-dasharray": "6 5"
    }));
    svg.appendChild(svgEl("circle", {
      cx, cy, r: 6,
      fill: "#ffffff",
      stroke: "#0071e3",
      "stroke-width": 3
    }));

    const bubble = svgEl("g");
    bubble.appendChild(svgEl("rect", {
      x: Math.min(cx + 10, dims.w - 120),
      y: Math.max(cy - 42, 22),
      rx: 10, ry: 10, width: 92, height: 32,
      fill: "#ffffff",
      stroke: "rgba(0,0,0,0.06)"
    }));
    const bubbleText = svgEl("text", {
      x: Math.min(cx + 56, dims.w - 74),
      y: Math.max(cy - 22, 42),
      "text-anchor": "middle",
      "font-size": 12,
      fill: "#0071e3",
      "font-weight": 700
    });
    bubbleText.textContent = "Loss = " + fmt(currentY);
    bubble.appendChild(bubbleText);
    svg.appendChild(bubble);
  }

  function updateVisibility() {
    const regressionVisible = state.mode === "mse" || state.mode === "mae";
    document.getElementById("regressionBlock").classList.toggle("hidden", !regressionVisible);
    document.getElementById("binaryBlock").classList.toggle("hidden", state.mode !== "bce");
    document.getElementById("categoricalBlock").classList.toggle("hidden", state.mode !== "cce");
  }

  function updateButtons() {
    modeButtons.forEach(btn => btn.classList.toggle("active", btn.dataset.mode === state.mode));
    classButtons.forEach(btn => btn.classList.toggle("active", Number(btn.dataset.class) === state.trueClass));
    labelZero.classList.toggle("active", state.label === 0);
    labelOne.classList.toggle("active", state.label === 1);
  }

  function updateFormulas() {
    let formulaHTML = "";
    let miniFormula = "";
    let whyLoss = "";
    let penalty = "";
    let curveText = "";
    let takeaway = "";

    if (state.mode === "mse") {
      formulaHTML = `<strong>MSE</strong><br>L = (ŷ − y)<sup>2</sup><br><br>Because the error is squared, larger misses grow much faster than smaller ones.`;
      miniFormula = `<strong>MSE</strong><br>L = (ŷ − y)<sup>2</sup>`;
      whyLoss = "Useful when the target is a continuous number and large errors should be punished more strongly.";
      penalty = "Squaring makes large misses grow quickly.";
      curveText = "The loss curve is a parabola centered on the true target.";
      takeaway = `The model first predicts <strong>ŷ</strong>, compares it with the true value <strong>y</strong>, turns the gap into a squared penalty, and then averages across the batch. MSE is common when you care a lot about large continuous-value mistakes.`;
    } else if (state.mode === "mae") {
      formulaHTML = `<strong>MAE</strong><br>L = |ŷ − y|<br><br>The penalty grows linearly with the size of the error, which makes it less sensitive to large outliers than MSE.`;
      miniFormula = `<strong>MAE</strong><br>L = |ŷ − y|`;
      whyLoss = "Useful for continuous targets when you want a direct, linear penalty on the size of the miss.";
      penalty = "Each extra unit of error increases the loss by the same amount.";
      curveText = "The curve forms a V-shape with its minimum at the true target.";
      takeaway = `MAE still compares prediction with truth, but it does not square the gap. That makes the training signal more robust to very large outliers while still rewarding predictions that move closer to the target.`;
    } else if (state.mode === "bce") {
      formulaHTML = `<strong>Binary Cross-Entropy</strong><br>L = −[y log(p) + (1 − y) log(1 − p)]<br><br>When the true label is 1, assigning a very small probability produces a very large loss.`;
      miniFormula = `<strong>Binary CE</strong><br>L = −[y log(p) + (1 − y) log(1 − p)]`;
      whyLoss = "Designed for binary classification when the model outputs a probability between 0 and 1.";
      penalty = "Confident wrong probabilities are punished very heavily.";
      curveText = state.label === 1
        ? "Because the true label is 1, the loss falls as p approaches 1."
        : "Because the true label is 0, the loss falls as p approaches 0.";
      takeaway = `Binary cross-entropy is not about distance on a number line. It measures how much probability the model gave to the correct class. Wrong and confident probabilities create a sharp loss spike.`;
    } else {
      formulaHTML = `<strong>Categorical Cross-Entropy</strong><br>L = − log(p<sub>true</sub>)<br><br>Only the probability assigned to the true class directly determines the loss.`;
      miniFormula = `<strong>Categorical CE</strong><br>L = − log(p<sub>true</sub>)`;
      whyLoss = "Used for multiclass classification where the model predicts a probability distribution over several classes.";
      penalty = "The loss shrinks only when the correct class receives more probability mass.";
      curveText = "The curve falls as the model assigns more probability to the true class.";
      takeaway = `In multiclass classification, the model may output many class probabilities, but the loss mainly focuses on one number: <strong>p(true class)</strong>. The higher that probability becomes, the lower the loss.`;
    }

    document.getElementById("formulaBox").innerHTML = formulaHTML;
    document.getElementById("miniFormulaBox").innerHTML = miniFormula;
    document.getElementById("whyLossText").textContent = whyLoss;
    document.getElementById("penaltyText").textContent = penalty;
    document.getElementById("curveText").textContent = curveText;
    document.getElementById("takeawayBox").innerHTML = takeaway;
  }

  function updateText() {
    const values = getCurrentValues();
    const current = currentLoss();
    const batchLoss = batchLossValue();

    document.getElementById("focusValue").textContent = {
      mse: "MSE",
      mae: "MAE",
      bce: "Binary CE",
      cce: "Categorical CE"
    }[state.mode];

    document.getElementById("navStatus").textContent = {
      mse: "MSE · regression target vs prediction",
      mae: "MAE · absolute regression penalty",
      bce: "Binary CE · probability vs label",
      cce: "Categorical CE · true class probability"
    }[state.mode];

    document.getElementById("regressionReadout").textContent = `ŷ = ${fmt(state.pred)} · y = ${fmt(state.target)}`;
    document.getElementById("predValue").textContent = fmt(state.pred);
    document.getElementById("targetValue").textContent = fmt(state.target);

    document.getElementById("binaryReadout").textContent = `p = ${fmt(state.prob)} · label = ${state.label}`;
    document.getElementById("probValue").textContent = fmt(state.prob);

    document.getElementById("categoricalReadout").textContent = `true class prob = ${fmt(state.trueProb)}`;
    document.getElementById("trueProbValue").textContent = fmt(state.trueProb);

    document.getElementById("stepPredValue").textContent = state.mode === "cce" ? fmt(state.trueProb) : fmt(values.prediction);
    document.getElementById("stepTruthValue").textContent = state.mode === "cce" ? values.truth : (typeof values.truth === "number" ? fmt(values.truth) : values.truth);
    document.getElementById("stepCompareValue").textContent = state.mode === "cce" ? fmt(1 - state.trueProb) : fmtSigned(values.compare);
    document.getElementById("stepLossValue").textContent = fmt(current);
    document.getElementById("stepBatchValue").textContent = fmt(batchLoss);

    document.getElementById("stepPredNote").textContent = state.mode === "cce" ? "Probability assigned to the true class." : "Current prediction from the model.";
    document.getElementById("stepTruthNote").textContent = state.mode === "cce" ? "Ground-truth class identity." : "Ground-truth target or label.";
    document.getElementById("stepCompareNote").textContent = {
      mse: "Signed prediction error before squaring.",
      mae: "Signed prediction error before taking absolute value.",
      bce: "Difference between predicted probability and binary label.",
      cce: "Missing probability mass on the true class."
    }[state.mode];
    document.getElementById("stepLossNote").textContent = "Per-sample loss for this one example.";
    document.getElementById("stepBatchNote").textContent = "Average loss across the current batch.";

    document.getElementById("metricSampleLoss").textContent = fmt(current);
    document.getElementById("metricBatchLoss").textContent = fmt(batchLoss);
    document.getElementById("metricPrediction").textContent = state.mode === "cce" ? fmt(state.trueProb) : fmt(values.prediction);
    document.getElementById("metricTruth").textContent = state.mode === "cce" ? values.truth : (typeof values.truth === "number" ? fmt(values.truth) : values.truth);

    const pill = document.getElementById("modePill");
    const dot = document.getElementById("modeDot");
    const pillText = document.getElementById("modePillText");
    const c = colors[state.mode];
    pill.style.background = c.pill;
    pill.style.color = c.text;
    pill.style.borderColor = "transparent";
    dot.style.background = c.dot;
    pillText.textContent = getModeName(state.mode);

    updateFormulas();
    buildBatchCards();
    drawChart();
  }

  function render() {
    updateVisibility();
    updateButtons();
    updateText();
  }

  modeButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      state.mode = btn.dataset.mode;
      render();
    });
  });

  classButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      state.trueClass = Number(btn.dataset.class);
      render();
    });
  });

  labelZero.addEventListener("click", () => {
    state.label = 0;
    render();
  });

  labelOne.addEventListener("click", () => {
    state.label = 1;
    render();
  });

  predSlider.addEventListener("input", e => {
    state.pred = Number(e.target.value);
    render();
  });

  targetSlider.addEventListener("input", e => {
    state.target = Number(e.target.value);
    render();
  });

  probSlider.addEventListener("input", e => {
    state.prob = Number(e.target.value);
    render();
  });

  trueProbSlider.addEventListener("input", e => {
    state.trueProb = Number(e.target.value);
    render();
  });

  render();
})();
</script>
</div>

'''

html_code = html_code.replace('__UID__', uid)
display(HTML(html_code))
