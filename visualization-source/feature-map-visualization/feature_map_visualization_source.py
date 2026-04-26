from IPython.display import HTML, display
import uuid

uid = str(uuid.uuid4())[:8]

html_code = r'''
<div id="featuremap-page-__UID__">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">

  <style>
    #featuremap-page-__UID__ {
      --white: #ffffff;
      --black: #1d1d1f;
      --gray1: #f5f5f7;
      --gray2: #e8e8ed;
      --gray3: #6e6e73;
      --gray4: #aeaeb2;
      --blue: #0071e3;
      --blue2: #2b8cff;
      --blueLight: #e8f0fe;
      --shadow: 0 18px 40px rgba(0, 77, 163, 0.06);
      --radius: 20px;
      --panel: rgba(255,255,255,0.74);
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      -webkit-font-smoothing: antialiased;
      color: var(--black);
    }

    #featuremap-page-__UID__ * { box-sizing: border-box; margin: 0; padding: 0; }

    #featuremap-page-__UID__ .page {
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

    #featuremap-page-__UID__ .nav {
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

    #featuremap-page-__UID__ .nav-back {
      display: flex;
      align-items: center;
      gap: 6px;
      color: var(--blue);
      font-size: 13px;
      font-weight: 500;
    }

    #featuremap-page-__UID__ .nav-brand { font-size: 13px; font-weight: 600; }
    #featuremap-page-__UID__ .nav-status { font-size: 13px; color: var(--gray4); }

    #featuremap-page-__UID__ .hero {
      padding: 42px 32px 28px;
      border-bottom: 0.5px solid var(--gray2);
    }

    #featuremap-page-__UID__ .hero-shell {
      max-width: 1240px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: minmax(0, 1.25fr) minmax(320px, 0.75fr);
      gap: 18px;
      align-items: start;
    }

    #featuremap-page-__UID__ .badge {
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

    #featuremap-page-__UID__ h1 {
      font-size: clamp(30px, 4vw, 42px);
      font-weight: 700;
      letter-spacing: -0.03em;
      line-height: 1.05;
      margin-bottom: 10px;
    }

    #featuremap-page-__UID__ h1 span {
      background: linear-gradient(135deg, var(--blue), #58a6ff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    #featuremap-page-__UID__ .desc {
      font-size: 15px;
      color: var(--gray3);
      line-height: 1.65;
      max-width: 760px;
      margin-bottom: 22px;
    }

    #featuremap-page-__UID__ .meta { display: flex; flex-wrap: wrap; gap: 20px; }
    #featuremap-page-__UID__ .meta-item { font-size: 12px; color: var(--gray4); }
    #featuremap-page-__UID__ .meta-item span { color: var(--black); font-weight: 600; }

    #featuremap-page-__UID__ .hero-panel {
      background: linear-gradient(180deg,#fbfdff 0%, #f4f8ff 100%);
      border: 1px solid rgba(0,113,227,0.08);
      border-radius: 20px;
      padding: 18px;
      box-shadow: var(--shadow);
    }

    #featuremap-page-__UID__ .hero-panel-label {
      font-size: 10px;
      color: var(--gray4);
      letter-spacing: .08em;
      text-transform: uppercase;
      margin-bottom: 10px;
      font-weight: 600;
    }

    #featuremap-page-__UID__ .hero-panel-title {
      font-size: 16px;
      font-weight: 600;
      letter-spacing: -.02em;
      margin-bottom: 14px;
    }

    #featuremap-page-__UID__ .hero-points { display: flex; flex-direction: column; gap: 12px; }

    #featuremap-page-__UID__ .hero-point {
      display: flex;
      gap: 10px;
      padding: 12px 14px;
      border-radius: 14px;
      background: rgba(255,255,255,0.72);
      border: 1px solid rgba(0,0,0,0.04);
    }

    #featuremap-page-__UID__ .dot {
      width: 9px;
      height: 9px;
      border-radius: 50%;
      margin-top: 5px;
      flex: none;
    }

    #featuremap-page-__UID__ .hero-point strong { display: block; font-size: 12px; margin-bottom: 2px; }
    #featuremap-page-__UID__ .hero-point span { font-size: 12px; color: var(--gray3); line-height: 1.5; }

    #featuremap-page-__UID__ .main {
      max-width: 1240px;
      margin: 0 auto;
      padding: 30px 32px 36px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    #featuremap-page-__UID__ .section-label {
      font-size: 11px;
      font-weight: 500;
      color: var(--gray3);
      letter-spacing: .07em;
      text-transform: uppercase;
      margin-bottom: 2px;
    }

    #featuremap-page-__UID__ .panel {
      background: var(--panel);
      border: 1px solid rgba(0,0,0,0.05);
      border-radius: var(--radius);
      box-shadow: var(--shadow);
      backdrop-filter: blur(18px);
    }

    #featuremap-page-__UID__ .controls-shell {
      padding: 18px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    #featuremap-page-__UID__ .controls-head h2 {
      font-size: 18px;
      font-weight: 600;
      letter-spacing: -0.02em;
      margin-bottom: 2px;
    }

    #featuremap-page-__UID__ .controls-head .sub {
      font-size: 13px;
      color: var(--gray3);
      line-height: 1.55;
    }

    #featuremap-page-__UID__ .controls-grid {
      display: grid;
      grid-template-columns: 1.25fr 1fr 1fr 1fr;
      gap: 14px;
      align-items: stretch;
    }

    #featuremap-page-__UID__ .control-block {
      padding: 14px;
      border-radius: 16px;
      background: rgba(255,255,255,0.78);
      border: 1px solid rgba(0,0,0,0.04);
    }

    #featuremap-page-__UID__ .control-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      margin-bottom: 8px;
    }

    #featuremap-page-__UID__ .control-label {
      font-size: 12px;
      font-weight: 600;
      color: var(--black);
      letter-spacing: -0.01em;
    }

    #featuremap-page-__UID__ .control-value {
      font-size: 12px;
      color: var(--gray4);
      font-weight: 600;
    }

    #featuremap-page-__UID__ .control-help {
      font-size: 12px;
      color: var(--gray3);
      line-height: 1.45;
      margin-top: 8px;
    }

    #featuremap-page-__UID__ .chip-row,
    #featuremap-page-__UID__ .seg-row,
    #featuremap-page-__UID__ .play-row {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    #featuremap-page-__UID__ .chip,
    #featuremap-page-__UID__ .seg-btn,
    #featuremap-page-__UID__ .play-btn {
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

    #featuremap-page-__UID__ .chip:hover,
    #featuremap-page-__UID__ .seg-btn:hover,
    #featuremap-page-__UID__ .play-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    }

    #featuremap-page-__UID__ .chip.active,
    #featuremap-page-__UID__ .seg-btn.active,
    #featuremap-page-__UID__ .play-btn.playing {
      background: var(--blue);
      color: #fff;
      border-color: transparent;
    }

    #featuremap-page-__UID__ .layout {
      display: grid;
      grid-template-columns: minmax(0, 1.2fr) minmax(320px, 0.8fr);
      gap: 16px;
      align-items: start;
    }

    #featuremap-page-__UID__ .viz-shell,
    #featuremap-page-__UID__ .side-shell {
      padding: 18px;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    #featuremap-page-__UID__ .card {
      background: rgba(255,255,255,0.78);
      border: 1px solid rgba(0,0,0,0.05);
      border-radius: 18px;
      padding: 14px;
    }

    #featuremap-page-__UID__ .card-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 10px;
    }

    #featuremap-page-__UID__ .card-title { font-size: 13px; font-weight: 600; letter-spacing: -0.01em; }
    #featuremap-page-__UID__ .card-sub { font-size: 11px; color: var(--gray4); }

    #featuremap-page-__UID__ .stage-grid {
      display: grid;
      grid-template-columns: minmax(240px, 0.72fr) 44px minmax(0, 1.28fr);
      gap: 14px;
      align-items: stretch;
    }

    #featuremap-page-__UID__ .input-card,
    #featuremap-page-__UID__ .maps-card {
      border-radius: 16px;
      background: rgba(255,255,255,0.86);
      border: 1px solid rgba(0,0,0,0.05);
      padding: 12px;
    }

    #featuremap-page-__UID__ .canvas-title,
    #featuremap-page-__UID__ .maps-title {
      font-size: 11px;
      color: var(--gray4);
      letter-spacing: .07em;
      text-transform: uppercase;
      font-weight: 600;
      margin-bottom: 10px;
    }

    #featuremap-page-__UID__ .input-canvas-wrap {
      position: relative;
      width: 100%;
      border-radius: 16px;
      overflow: hidden;
      background: linear-gradient(to bottom, rgba(243,247,255,0.85), rgba(255,255,255,0.98));
      border: 1px solid rgba(0,0,0,0.04);
      aspect-ratio: 1 / 1;
    }

    #featuremap-page-__UID__ canvas.main-canvas {
      width: 100%;
      height: 100%;
      display: block;
    }

    #featuremap-page-__UID__ .canvas-caption {
      font-size: 12px;
      color: var(--gray3);
      line-height: 1.6;
      margin-top: 10px;
      min-height: 56px;
    }

    #featuremap-page-__UID__ .flow-column {
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--blue);
      font-size: 28px;
      font-weight: 700;
      min-height: 100%;
    }

    #featuremap-page-__UID__ .map-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 10px;
    }

    #featuremap-page-__UID__ .map-card {
      border-radius: 14px;
      background: rgba(255,255,255,0.92);
      border: 1px solid rgba(0,0,0,0.05);
      padding: 10px;
      cursor: pointer;
      transition: transform .16s ease, box-shadow .16s ease, border-color .16s ease;
      opacity: 0;
      transform: translateY(8px);
      animation: fmFadeIn 0.45s ease forwards;
    }

    #featuremap-page-__UID__ .map-card:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 14px rgba(0,0,0,0.06);
    }

    #featuremap-page-__UID__ .map-card.active {
      border-color: rgba(0,113,227,0.16);
      box-shadow: 0 0 0 2px rgba(0,113,227,0.10) inset;
      background: linear-gradient(to bottom, #fbfdff, #f3f8ff);
    }

    #featuremap-page-__UID__ .map-label {
      font-size: 11px;
      color: var(--gray4);
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }

    #featuremap-page-__UID__ .map-label strong { color: var(--black); font-size: 12px; }

    #featuremap-page-__UID__ .map-canvas-wrap {
      width: 100%;
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid rgba(0,0,0,0.04);
      background: #fbfcff;
      aspect-ratio: 1 / 1;
      margin-bottom: 8px;
    }

    #featuremap-page-__UID__ canvas.map-canvas {
      width: 100%;
      height: 100%;
      display: block;
    }

    #featuremap-page-__UID__ .map-note {
      font-size: 11px;
      color: var(--gray3);
      line-height: 1.45;
      min-height: 34px;
    }

    #featuremap-page-__UID__ .explain-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    #featuremap-page-__UID__ .mini-card {
      border-radius: 16px;
      padding: 14px;
      background: rgba(255,255,255,0.86);
      border: 1px solid rgba(0,0,0,0.05);
    }

    #featuremap-page-__UID__ .mini-label {
      font-size: 10px;
      color: var(--gray4);
      letter-spacing: .07em;
      text-transform: uppercase;
      font-weight: 600;
      margin-bottom: 8px;
    }

    #featuremap-page-__UID__ .formula-line {
      font-size: 13px;
      color: var(--black);
      line-height: 1.7;
      font-weight: 500;
    }

    #featuremap-page-__UID__ .formula-line strong { color: var(--blue); }

    #featuremap-page-__UID__ .explain-body {
      font-size: 12.5px;
      color: var(--gray3);
      line-height: 1.65;
    }

    #featuremap-page-__UID__ .status-pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 600;
      border: 1px solid transparent;
      margin-bottom: 10px;
      background: var(--blueLight);
      color: var(--blue);
    }

    #featuremap-page-__UID__ .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--blue);
    }

    #featuremap-page-__UID__ .metric-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-bottom: 10px;
    }

    #featuremap-page-__UID__ .metric {
      border-radius: 14px;
      padding: 12px;
      background: var(--gray1);
    }

    #featuremap-page-__UID__ .metric-label { font-size: 11px; color: var(--gray4); margin-bottom: 4px; }
    #featuremap-page-__UID__ .metric-value { font-size: 20px; font-weight: 600; letter-spacing: -0.03em; }

    #featuremap-page-__UID__ .list-rows {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    #featuremap-page-__UID__ .list-row {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      padding: 10px 12px;
      border-radius: 14px;
      background: var(--gray1);
      font-size: 12px;
    }

    #featuremap-page-__UID__ .list-row strong { color: var(--black); }
    #featuremap-page-__UID__ .list-row span { color: var(--gray3); line-height: 1.5; text-align: right; }

    #featuremap-page-__UID__ .formula-box,
    #featuremap-page-__UID__ .takeaway-box {
      font-size: 12.5px;
      color: var(--black);
      background: var(--gray1);
      border-radius: 14px;
      padding: 14px 16px;
      line-height: 1.8;
    }

    #featuremap-page-__UID__ .formula-box strong,
    #featuremap-page-__UID__ .takeaway-box strong {
      color: var(--blue);
    }

    #featuremap-page-__UID__ .footer-strip {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 18px 32px 24px;
      border-top: 0.5px solid var(--gray2);
      font-size: 12px;
      color: var(--gray4);
    }

    @keyframes fmFadeIn {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @media (max-width: 1120px) {
      #featuremap-page-__UID__ .controls-grid { grid-template-columns: 1fr 1fr; }
      #featuremap-page-__UID__ .hero-shell { grid-template-columns: 1fr; }
      #featuremap-page-__UID__ .layout { grid-template-columns: 1fr; }
    }

    @media (max-width: 860px) {
      #featuremap-page-__UID__ .stage-grid,
      #featuremap-page-__UID__ .explain-grid { grid-template-columns: 1fr; }
      #featuremap-page-__UID__ .flow-column { min-height: 42px; transform: rotate(90deg); }
    }

    @media (max-width: 700px) {
      #featuremap-page-__UID__ .hero,
      #featuremap-page-__UID__ .main {
        padding-left: 18px;
        padding-right: 18px;
      }
      #featuremap-page-__UID__ .controls-grid,
      #featuremap-page-__UID__ .metric-grid,
      #featuremap-page-__UID__ .map-grid { grid-template-columns: 1fr; }
    }
  </style>

  <div class="page">
    <nav class="nav">
      <div class="nav-back">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8l4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        Convolutional Neural Networks
      </div>
      <div class="nav-brand">Interactive Lab</div>
      <div class="nav-status" id="navStatus">Layer 1 · simple edges and contrast</div>
    </nav>

    <section class="hero">
      <div class="hero-shell">
        <div>
          <div class="badge">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor"><circle cx="5" cy="5" r="5"/></svg>
            Module 4 · CNN Representation
          </div>
          <h1>CNN Feature Map<br><span>Visualization</span></h1>
          <p class="desc">
            A feature map is the output produced after a filter looks at the input or at a previous layer. Shallow layers usually respond to edges and simple texture, while deeper layers combine those signals into larger parts and more abstract attention regions.
          </p>
          <div class="meta">
            <div class="meta-item">Input <span>One image</span></div>
            <div class="meta-item">Layer choice <span>Shallow to deep</span></div>
            <div class="meta-item">Feature maps <span>One per channel</span></div>
            <div class="meta-item">Goal <span>See what the network attends to</span></div>
          </div>
        </div>

        <div class="hero-panel">
          <div class="hero-panel-label">Key concepts</div>
          <div class="hero-panel-title">What to watch for</div>
          <div class="hero-points">
            <div class="hero-point">
              <div class="dot" style="background:#0071e3"></div>
              <div>
                <strong>Each filter creates one map</strong>
                <span>The same image can produce very different outputs because each filter searches for a different pattern.</span>
              </div>
            </div>
            <div class="hero-point">
              <div class="dot" style="background:#0f6e56"></div>
              <div>
                <strong>Shallow layers are local</strong>
                <span>Early feature maps often light up around edges, strokes, corners, and simple textures.</span>
              </div>
            </div>
            <div class="hero-point">
              <div class="dot" style="background:#8a5410"></div>
              <div>
                <strong>Deeper layers are more abstract</strong>
                <span>Later maps combine earlier responses, so they can highlight larger parts or a more semantic region.</span>
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
          <p class="sub">Pick an input image, move across shallow → middle → deeper layers, and click any feature map to see what region it highlights on the original image.</p>
        </div>

        <div class="controls-grid">
          <div class="control-block">
            <div class="control-label" style="margin-bottom:10px;">Input presets</div>
            <div class="chip-row">
              <button class="chip active" data-preset="digit">Digit</button>
              <button class="chip" data-preset="face">Face</button>
              <button class="chip" data-preset="leaf">Leaf</button>
              <button class="chip" data-preset="shoe">Shoe</button>
            </div>
            <div class="control-help">Different shapes make different filters activate. Try switching presets before changing the layer.</div>
          </div>

          <div class="control-block">
            <div class="control-top">
              <div class="control-label">Layer depth</div>
              <div class="control-value" id="layerValue">Layer 1</div>
            </div>
            <div class="seg-row">
              <button class="seg-btn active" data-layer="0">Layer 1</button>
              <button class="seg-btn" data-layer="1">Layer 2</button>
              <button class="seg-btn" data-layer="2">Layer 3</button>
            </div>
            <div class="control-help">Earlier layers respond to simple patterns. Later layers summarize larger combinations.</div>
          </div>

          <div class="control-block">
            <div class="control-top">
              <div class="control-label">Animation</div>
              <div class="control-value">Layer / map playback</div>
            </div>
            <div class="play-row">
              <button class="play-btn" id="playBtn" type="button">Auto-play layers</button>
              <button class="play-btn" id="cycleBtn" type="button">Cycle maps</button>
            </div>
            <div class="control-help">Animation helps you see how the highlighted region changes as the representation gets deeper.</div>
          </div>

          <div class="control-block">
            <div class="control-top">
              <div class="control-label">Current map</div>
              <div class="control-value" id="selectedMapValue">Vertical edge</div>
            </div>
            <div class="formula-box" id="miniFormulaBox" style="margin-top:2px;">
              <strong>Feature map idea</strong><br>
              map = filter ⨂ input → activation
            </div>
            <div class="control-help">This topic is about <strong>what the outputs look like</strong>, not about doing long convolution arithmetic by hand.</div>
          </div>
        </div>
      </section>

      <div class="layout">
        <section class="panel viz-shell">
          <div class="card">
            <div class="card-head">
              <div>
                <div class="card-title">Input image and feature maps</div>
                <div class="card-sub">Left: original image · Right: one layer's channels</div>
              </div>
            </div>

            <div class="stage-grid">
              <div class="input-card">
                <div class="canvas-title">Input image + selected attention</div>
                <div class="input-canvas-wrap">
                  <canvas id="mainCanvas" class="main-canvas" width="320" height="320"></canvas>
                </div>
                <div class="canvas-caption" id="inputCaption">
                  Click any feature map on the right. The colored overlay shows where that map is strongest on the original image.
                </div>
              </div>

              <div class="flow-column">→</div>

              <div class="maps-card">
                <div class="maps-title">Feature maps in the current layer</div>
                <div class="map-grid" id="mapGrid"></div>
              </div>
            </div>

            <div class="explain-grid">
              <div class="mini-card">
                <div class="mini-label">Current operation</div>
                <div class="formula-line" id="formulaLine">
                  <strong>Layer 1:</strong> simple filters respond to edges, contrast, and small local structure.
                </div>
              </div>

              <div class="mini-card">
                <div class="mini-label">Why this matters</div>
                <div class="explain-body" id="explainBody">
                  A feature map is useful because it converts the raw image into a representation where important patterns become brighter and easier for later layers to reuse.
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
                <div class="card-sub">What this layer is focusing on</div>
              </div>
            </div>

            <div class="status-pill">
              <span class="status-dot"></span>
              <span id="modePillText">Layer 1 · local pattern detectors</span>
            </div>

            <div class="metric-grid">
              <div class="metric">
                <div class="metric-label">Preset</div>
                <div class="metric-value" id="metricPreset">Digit</div>
              </div>
              <div class="metric">
                <div class="metric-label">Channels shown</div>
                <div class="metric-value" id="metricChannels">4</div>
              </div>
              <div class="metric">
                <div class="metric-label">Current layer</div>
                <div class="metric-value" id="metricLayer">L1</div>
              </div>
              <div class="metric">
                <div class="metric-label">Selected map</div>
                <div class="metric-value" id="metricMap">Edge</div>
              </div>
            </div>

            <div class="list-rows">
              <div class="list-row">
                <strong>Layer role</strong>
                <span id="roleText">Shallow filters search for edges, corners, and local contrast.</span>
              </div>
              <div class="list-row">
                <strong>What gets brighter</strong>
                <span id="brightText">Pixels become bright where the selected filter responds strongly.</span>
              </div>
              <div class="list-row">
                <strong>Beginner takeaway</strong>
                <span id="beginnerText">Different channels are not different images. They are different ways of re-describing the same image.</span>
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
              <strong>Feature map</strong><br>
              activation = filter response at each location<br><br>
              Early layer:<br>
              <strong>input image → convolution → feature map</strong><br><br>
              Later layer:<br>
              <strong>previous maps → convolution → new maps</strong>
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
              A CNN does not keep the original picture unchanged. At every layer, it turns the image into several feature maps. Early maps respond to <strong>simple local patterns</strong>. Deeper maps respond to <strong>bigger combinations</strong> built from earlier ones.
            </div>
          </div>
        </aside>
      </div>
    </main>

    <div class="footer-strip">Feature maps · Filters · Layer depth · Attention regions · CNN intuition</div>
  </div>

<script>
(function() {
  const root = document.getElementById("featuremap-page-__UID__");
  const mainCanvas = root.querySelector("#mainCanvas");
  const mainCtx = mainCanvas.getContext("2d");
  const mapGrid = root.querySelector("#mapGrid");

  const state = {
    preset: "digit",
    layer: 0,
    selectedMap: 0,
    autoPlay: false,
    cycleMaps: false,
    autoTimer: null,
    cycleTimer: null,
    overlayPulse: 0
  };

  const SIZE = 32;
  const DISPLAY = 320;

  const layerMeta = [
    {
      name: "Layer 1",
      status: "Layer 1 · local pattern detectors",
      formula: "<strong>Layer 1:</strong> simple filters respond to edges, contrast, and small local structure.",
      explain: "The first convolutional layer often reacts to small local patterns. Different filters may prefer vertical edges, horizontal edges, diagonals, or small bright blobs.",
      role: "Shallow filters search for edges, corners, and local contrast.",
      beginner: "At this stage the network still looks at very small local structure.",
      nav: "Layer 1 · simple edges and contrast"
    },
    {
      name: "Layer 2",
      status: "Layer 2 · combined texture and parts",
      formula: "<strong>Layer 2:</strong> earlier edge maps are combined into contours, corners, and local parts.",
      explain: "Middle layers do not start from raw pixels anymore. They combine earlier channels, so the maps begin to respond to larger arrangements such as outlines, corners, and grouped texture.",
      role: "Middle layers combine several simple signals into useful local parts.",
      beginner: "Now the network is no longer asking only 'Is there an edge here?' but 'Do several small patterns form something meaningful here?'",
      nav: "Layer 2 · combined patterns and parts"
    },
    {
      name: "Layer 3",
      status: "Layer 3 · broader attention regions",
      formula: "<strong>Layer 3:</strong> deeper maps summarize larger regions and highlight broader object-relevant structure.",
      explain: "Deeper layers usually have a larger receptive field, so the maps can respond to wider regions such as a whole stroke cluster, face area, leaf body, or shoe silhouette rather than one tiny edge.",
      role: "Deeper layers summarize larger structure and object-relevant regions.",
      beginner: "A deep feature map is more abstract: it no longer looks like an ordinary image filter output.",
      nav: "Layer 3 · broader and more abstract focus"
    }
  ];

  const presets = {
    digit: { label: "Digit", caption: "The digit preset is useful because edges and stroke intersections are easy to spot across layers." },
    face: { label: "Face", caption: "The face-like preset helps show how shallow edges can later combine into eyes, mouth, and a central face region." },
    leaf: { label: "Leaf", caption: "The leaf preset shows contour, vein-like structure, and a larger body region in deeper maps." },
    shoe: { label: "Shoe", caption: "The shoe preset highlights sole edges, upper contour, and broader silhouette regions." }
  };

  const mapDescriptions = {
    0: [
      { name: "Vertical edge", note: "Responds strongly where left-vs-right contrast changes." },
      { name: "Horizontal edge", note: "Highlights top-vs-bottom transitions." },
      { name: "Diagonal edge", note: "Fires on slanted boundaries and angled strokes." },
      { name: "Center contrast", note: "Bright where a small local spot stands out from its neighborhood." }
    ],
    1: [
      { name: "Contour map", note: "Combines simple edges into a stronger outline-like response." },
      { name: "Corner / junction", note: "Bright where multiple directions meet or bend." },
      { name: "Texture grouping", note: "Summarizes repeated local variation in a slightly larger region." },
      { name: "Part detector", note: "Responds to grouped local parts rather than one tiny edge." }
    ],
    2: [
      { name: "Core region", note: "Highlights the broad central structure that defines the object." },
      { name: "Silhouette attention", note: "Keeps a broad response around the main object shape." },
      { name: "Semantic focus", note: "More abstract attention-like map built from earlier channels." },
      { name: "Suppressed background", note: "Keeps the main object region stronger than the background." }
    ]
  };

  const imageCache = {};
  const featureCache = {};

  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function zeros() { return Array.from({ length: SIZE }, () => Array(SIZE).fill(0)); }

  function normalize(arr) {
    let min = Infinity, max = -Infinity;
    for (let y = 0; y < SIZE; y++) {
      for (let x = 0; x < SIZE; x++) {
        const v = arr[y][x];
        if (v < min) min = v;
        if (v > max) max = v;
      }
    }
    if (max - min < 1e-8) return arr.map(row => row.map(() => 0));
    return arr.map(row => row.map(v => (v - min) / (max - min)));
  }

  function relu(arr) {
    return arr.map(row => row.map(v => Math.max(0, v)));
  }

  function threshold(arr, t) {
    return arr.map(row => row.map(v => v > t ? 1 : 0));
  }

  function addMaps(a, b) {
    const out = zeros();
    for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) out[y][x] = a[y][x] + b[y][x];
    return out;
  }

  function mulMaps(a, b) {
    const out = zeros();
    for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) out[y][x] = a[y][x] * b[y][x];
    return out;
  }

  function mulScalar(a, s) {
    return a.map(row => row.map(v => v * s));
  }

  function maxMaps(a, b) {
    const out = zeros();
    for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) out[y][x] = Math.max(a[y][x], b[y][x]);
    return out;
  }

  function conv2D(input, kernel) {
    const out = zeros();
    const kh = kernel.length, kw = kernel[0].length;
    const oy = Math.floor(kh / 2), ox = Math.floor(kw / 2);
    for (let y = 0; y < SIZE; y++) {
      for (let x = 0; x < SIZE; x++) {
        let sum = 0;
        for (let ky = 0; ky < kh; ky++) {
          for (let kx = 0; kx < kw; kx++) {
            const iy = clamp(y + ky - oy, 0, SIZE - 1);
            const ix = clamp(x + kx - ox, 0, SIZE - 1);
            sum += input[iy][ix] * kernel[ky][kx];
          }
        }
        out[y][x] = sum;
      }
    }
    return out;
  }

  function blurMap(input) {
    const raw = conv2D(input, [
      [1,2,1],
      [2,4,2],
      [1,2,1]
    ]);
    return normalize(raw.map(row => row.map(v => Math.max(0, v / 16))));
  }

  function localVariance(input) {
    const mean = blurMap(input);
    const sq = input.map(row => row.map(v => v * v));
    const meanSq = blurMap(sq);
    const out = zeros();
    for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) out[y][x] = Math.max(0, meanSq[y][x] - mean[y][x] * mean[y][x]);
    return normalize(out);
  }

  function distanceFieldMask() {
    const out = zeros();
    for (let y = 0; y < SIZE; y++) {
      for (let x = 0; x < SIZE; x++) {
        const dx = (x - SIZE / 2) / (SIZE / 2);
        const dy = (y - SIZE / 2) / (SIZE / 2);
        out[y][x] = Math.exp(-2.5 * (dx * dx + dy * dy));
      }
    }
    return normalize(out);
  }

  function createPreset(name) {
    const c = document.createElement("canvas");
    c.width = SIZE;
    c.height = SIZE;
    const ctx = c.getContext("2d");
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, SIZE, SIZE);
    ctx.strokeStyle = "white";
    ctx.fillStyle = "white";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if (name === "digit") {
      ctx.lineWidth = 4.2;
      ctx.beginPath();
      ctx.moveTo(9, 8);
      ctx.lineTo(22, 8);
      ctx.lineTo(15, 24);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(13, 15);
      ctx.lineTo(20, 15);
      ctx.stroke();
    } else if (name === "face") {
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(16, 16, 11, 13, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(12, 14, 1.8, 0, Math.PI * 2);
      ctx.arc(20, 14, 1.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(16, 18, 1.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(16, 20, 4.2, 0.1 * Math.PI, 0.9 * Math.PI);
      ctx.stroke();
    } else if (name === "leaf") {
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(16, 4);
      ctx.bezierCurveTo(6, 10, 5, 22, 16, 28);
      ctx.bezierCurveTo(27, 22, 26, 10, 16, 4);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(16, 6);
      ctx.lineTo(16, 26);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(16, 14);
      ctx.lineTo(10, 11);
      ctx.moveTo(16, 18);
      ctx.lineTo(11, 21);
      ctx.moveTo(16, 14);
      ctx.lineTo(22, 11);
      ctx.moveTo(16, 18);
      ctx.lineTo(21, 21);
      ctx.stroke();
    } else if (name === "shoe") {
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(7, 21);
      ctx.lineTo(11, 18);
      ctx.lineTo(18, 16);
      ctx.lineTo(23, 17);
      ctx.lineTo(27, 21);
      ctx.lineTo(27, 24);
      ctx.lineTo(7, 24);
      ctx.closePath();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(11, 18);
      ctx.lineTo(11, 13);
      ctx.lineTo(18, 13);
      ctx.lineTo(20, 16);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(9, 22);
      ctx.lineTo(25, 22);
      ctx.stroke();
    }

    const img = ctx.getImageData(0, 0, SIZE, SIZE).data;
    const arr = zeros();
    for (let y = 0; y < SIZE; y++) {
      for (let x = 0; x < SIZE; x++) {
        arr[y][x] = img[(y * SIZE + x) * 4] / 255;
      }
    }
    return blurMap(arr);
  }

  function getImagePreset(name) {
    if (!imageCache[name]) imageCache[name] = createPreset(name);
    return imageCache[name];
  }

  function buildFeaturesForPreset(name) {
    if (featureCache[name]) return featureCache[name];
    const img = getImagePreset(name);

    const vEdge = normalize(relu(conv2D(img, [
      [-1,0,1],
      [-2,0,2],
      [-1,0,1]
    ])));
    const hEdge = normalize(relu(conv2D(img, [
      [-1,-2,-1],
      [0,0,0],
      [1,2,1]
    ])));
    const dEdge = normalize(relu(conv2D(img, [
      [0,1,2],
      [-1,0,1],
      [-2,-1,0]
    ])));
    const blob = normalize(relu(conv2D(img, [
      [-1,-1,-1],
      [-1,8,-1],
      [-1,-1,-1]
    ])));

    const contour = normalize(maxMaps(vEdge, hEdge));
    const corner = normalize(mulMaps(blurMap(vEdge), blurMap(hEdge)));
    const texture = localVariance(img);
    const part = normalize(blurMap(addMaps(addMaps(vEdge, hEdge), dEdge)));

    const centerMask = distanceFieldMask();
    const core = normalize(mulMaps(blurMap(part), centerMask));
    const silhouette = normalize(blurMap(addMaps(contour, threshold(blurMap(img), 0.18))));
    const semantic = normalize(blurMap(addMaps(part, mulScalar(texture, 0.7))));
    const backgroundSuppress = normalize(mulMaps(semantic, threshold(blurMap(img), 0.2)));

    featureCache[name] = {
      image: img,
      layers: [
        [vEdge, hEdge, dEdge, blob],
        [contour, corner, texture, part],
        [core, silhouette, semantic, backgroundSuppress]
      ]
    };
    return featureCache[name];
  }

  function drawArrayToCanvas(canvas, arr, colorMode) {
    const ctx = canvas.getContext("2d");
    const w = canvas.width, h = canvas.height;
    const imageData = ctx.createImageData(SIZE, SIZE);
    for (let y = 0; y < SIZE; y++) {
      for (let x = 0; x < SIZE; x++) {
        const v = clamp(arr[y][x], 0, 1);
        const idx = (y * SIZE + x) * 4;
        let r, g, b;
        if (colorMode === "heat") {
          r = Math.round(255 * lerp(0.25, 1, v));
          g = Math.round(255 * lerp(0.35, 0.85, 1 - Math.abs(v - 0.5) * 1.8));
          b = Math.round(255 * lerp(0.95, 0.15, v));
        } else {
          r = g = b = Math.round(v * 255);
        }
        imageData.data[idx] = r;
        imageData.data[idx + 1] = g;
        imageData.data[idx + 2] = b;
        imageData.data[idx + 3] = 255;
      }
    }
    const tmp = document.createElement("canvas");
    tmp.width = SIZE;
    tmp.height = SIZE;
    tmp.getContext("2d").putImageData(imageData, 0, 0);
    ctx.clearRect(0, 0, w, h);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(tmp, 0, 0, w, h);
  }

  function drawMainCanvas() {
    const data = buildFeaturesForPreset(state.preset);
    drawArrayToCanvas(mainCanvas, data.image, "grayscale");
    const selected = data.layers[state.layer][state.selectedMap];
    const overlayCanvas = document.createElement("canvas");
    overlayCanvas.width = DISPLAY;
    overlayCanvas.height = DISPLAY;
    drawArrayToCanvas(overlayCanvas, selected, "heat");
    const pulse = 0.5 + 0.5 * Math.sin(state.overlayPulse * 0.08);
    mainCtx.save();
    mainCtx.globalAlpha = 0.22 + 0.20 * pulse;
    mainCtx.drawImage(overlayCanvas, 0, 0);
    mainCtx.restore();

    mainCtx.save();
    mainCtx.strokeStyle = "rgba(255,255,255,0.06)";
    mainCtx.lineWidth = 1;
    for (let i = 1; i < 8; i++) {
      const p = (DISPLAY / 8) * i;
      mainCtx.beginPath(); mainCtx.moveTo(p, 0); mainCtx.lineTo(p, DISPLAY); mainCtx.stroke();
      mainCtx.beginPath(); mainCtx.moveTo(0, p); mainCtx.lineTo(DISPLAY, p); mainCtx.stroke();
    }
    mainCtx.restore();
  }

  function renderMapGrid() {
    mapGrid.innerHTML = "";
    const data = buildFeaturesForPreset(state.preset);
    const layerMaps = data.layers[state.layer];
    const descriptors = mapDescriptions[state.layer];

    layerMaps.forEach((map, idx) => {
      const card = document.createElement("div");
      card.className = "map-card" + (idx === state.selectedMap ? " active" : "");
      card.style.animationDelay = (idx * 0.06) + "s";

      const label = document.createElement("div");
      label.className = "map-label";
      label.innerHTML = "<strong>" + descriptors[idx].name + "</strong><span>Ch " + (idx + 1) + "</span>";

      const wrap = document.createElement("div");
      wrap.className = "map-canvas-wrap";
      const canvas = document.createElement("canvas");
      canvas.className = "map-canvas";
      canvas.width = 160;
      canvas.height = 160;
      wrap.appendChild(canvas);

      const note = document.createElement("div");
      note.className = "map-note";
      note.textContent = descriptors[idx].note;

      card.appendChild(label);
      card.appendChild(wrap);
      card.appendChild(note);
      card.addEventListener("click", function() {
        state.selectedMap = idx;
        render();
      });

      mapGrid.appendChild(card);
      drawArrayToCanvas(canvas, map, "grayscale");
    });
  }

  function updateText() {
    const presetMeta = presets[state.preset];
    const layerInfo = layerMeta[state.layer];
    const mapInfo = mapDescriptions[state.layer][state.selectedMap];

    root.querySelector("#layerValue").textContent = layerInfo.name;
    root.querySelector("#navStatus").textContent = layerInfo.nav;
    root.querySelector("#modePillText").textContent = layerInfo.status;
    root.querySelector("#selectedMapValue").textContent = mapInfo.name;
    root.querySelector("#inputCaption").textContent = presetMeta.caption;
    root.querySelector("#formulaLine").innerHTML = layerInfo.formula;
    root.querySelector("#explainBody").textContent = layerInfo.explain;
    root.querySelector("#metricPreset").textContent = presetMeta.label;
    root.querySelector("#metricChannels").textContent = "4";
    root.querySelector("#metricLayer").textContent = "L" + (state.layer + 1);
    root.querySelector("#metricMap").textContent = mapInfo.name.split(" ")[0];
    root.querySelector("#roleText").textContent = layerInfo.role;
    root.querySelector("#brightText").textContent = "Selected map: " + mapInfo.note;
    root.querySelector("#beginnerText").textContent = layerInfo.beginner;
    root.querySelector("#formulaBox").innerHTML = `
      <strong>Feature map</strong><br>
      activation = filter response at each location<br><br>
      <strong>${mapInfo.name}</strong><br>
      ${mapInfo.note}<br><br>
      <strong>Current idea</strong><br>
      ${layerInfo.role}
    `;
    root.querySelector("#takeawayBox").innerHTML = `
      A CNN does not keep the original picture unchanged. In <strong>${layerInfo.name}</strong>, the image is rewritten into several channels. The selected map <strong>${mapInfo.name}</strong> becomes bright where that pattern appears most strongly in the <strong>${presetMeta.label.toLowerCase()}</strong> preset.
    `;
    root.querySelector("#miniFormulaBox").innerHTML = `
      <strong>${layerInfo.name}</strong><br>
      ${mapInfo.name}<br>
      <span style="color:var(--gray3);">${mapInfo.note}</span>
    `;
  }

  function syncButtons() {
    root.querySelectorAll("[data-preset]").forEach(btn => btn.classList.toggle("active", btn.dataset.preset === state.preset));
    root.querySelectorAll("[data-layer]").forEach(btn => btn.classList.toggle("active", Number(btn.dataset.layer) === state.layer));
    const playBtn = root.querySelector("#playBtn");
    const cycleBtn = root.querySelector("#cycleBtn");
    playBtn.classList.toggle("playing", state.autoPlay);
    cycleBtn.classList.toggle("playing", state.cycleMaps);
    playBtn.textContent = state.autoPlay ? "Pause layers" : "Auto-play layers";
    cycleBtn.textContent = state.cycleMaps ? "Pause map cycle" : "Cycle maps";
  }

  function stopAuto() {
    if (state.autoTimer) clearInterval(state.autoTimer);
    state.autoTimer = null;
    state.autoPlay = false;
  }

  function stopCycle() {
    if (state.cycleTimer) clearInterval(state.cycleTimer);
    state.cycleTimer = null;
    state.cycleMaps = false;
  }

  function render() {
    renderMapGrid();
    drawMainCanvas();
    updateText();
    syncButtons();
  }

  function animate() {
    state.overlayPulse += 1;
    drawMainCanvas();
    requestAnimationFrame(animate);
  }

  root.querySelectorAll("[data-preset]").forEach(btn => {
    btn.addEventListener("click", function() {
      state.preset = btn.dataset.preset;
      state.selectedMap = 0;
      render();
    });
  });

  root.querySelectorAll("[data-layer]").forEach(btn => {
    btn.addEventListener("click", function() {
      state.layer = Number(btn.dataset.layer);
      state.selectedMap = 0;
      render();
    });
  });

  root.querySelector("#playBtn").addEventListener("click", function() {
    if (state.autoPlay) {
      stopAuto();
      render();
      return;
    }
    state.autoPlay = true;
    if (state.autoTimer) clearInterval(state.autoTimer);
    state.autoTimer = setInterval(function() {
      state.layer = (state.layer + 1) % 3;
      state.selectedMap = 0;
      render();
    }, 1800);
    render();
  });

  root.querySelector("#cycleBtn").addEventListener("click", function() {
    if (state.cycleMaps) {
      stopCycle();
      render();
      return;
    }
    state.cycleMaps = true;
    if (state.cycleTimer) clearInterval(state.cycleTimer);
    state.cycleTimer = setInterval(function() {
      state.selectedMap = (state.selectedMap + 1) % 4;
      render();
    }, 900);
    render();
  });

  render();
  animate();
})();
</script>
</div>
'''

html_code = html_code.replace("__UID__", uid)
display(HTML(html_code))
