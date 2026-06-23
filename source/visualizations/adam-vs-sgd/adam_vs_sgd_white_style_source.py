from IPython.display import HTML, display

html_code = r'''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Adam vs SGD - Optimizer Comparison</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=STIX+Two+Text:wght@400;500;600;700&display=swap" rel="stylesheet">

  <style>
    * { box-sizing: border-box; }

    body {
      margin: 0;
      padding: 16px;
      background: #dce8ff;
      font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      -webkit-font-smoothing: antialiased;
    }

    #app {
      width: 100%;
      max-width: 1300px;
      margin: 0 auto;
      background: #eef4ff;
      border: 1px solid #d9e6ff;
      border-radius: 24px;
      box-shadow: 0 16px 40px rgba(41, 72, 152, 0.10);
      overflow: hidden;
      color: #0f172a;
    }

    /* ── HEADER ── */
    #header {
      padding: 20px 24px 12px 24px;
      border-bottom: 1px solid #d9e6ff;
    }
    #header h1 {
      margin: 0;
      font-family: "STIX Two Text", Georgia, serif;
      font-size: 32px;
      font-weight: 700;
      letter-spacing: -0.02em;
      color: #0b1c3f;
      line-height: 1.12;
    }
    #subtitle {
      margin: 5px 0 0;
      color: #4f648d;
      font-size: 14px;
      line-height: 1.5;
    }

    /* ── WRAP ── */
    #mainWrap {
      padding: 0 16px 20px 16px;
    }

    /* ── PANEL ── */
    .panel {
      background: rgba(255,255,255,0.76);
      border: 1px solid #c7d8ff;
      border-radius: 22px;
      padding: 16px;
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.6);
      backdrop-filter: blur(3px);
      margin-bottom: 14px;
    }

    /* ── TOP ROW ── */
    #plotTopRow {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 18px;
      margin-bottom: 10px;
      flex-wrap: wrap;
    }
    #plotHeading h2 {
      margin: 0;
      font-size: 19px;
      color: #0d2250;
      font-family: "STIX Two Text", Georgia, serif;
      font-weight: 700;
      letter-spacing: -0.01em;
    }
    #plotHeading p {
      margin: 5px 0 0;
      font-size: 13px;
      line-height: 1.45;
      color: #607398;
    }

    #statusChips {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      justify-content: flex-end;
    }
    .chip {
      border: 1px solid #d7e3ff;
      background: rgba(255,255,255,0.9);
      border-radius: 999px;
      padding: 7px 11px;
      font-size: 12px;
      font-weight: 700;
      color: #2450b3;
      white-space: nowrap;
    }

    /* ── 3D PLOT ── */
    #plot {
      width: 100%;
      height: 620px;
      background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
      border: 1px solid #d6e2ff;
      border-radius: 18px;
      overflow: hidden;
    }

    /* ── CONTROLS ── */
    #controlWrap {
      margin-top: 12px;
      background: #f7fbff;
      border: 1px solid #d7e3ff;
      border-radius: 18px;
      padding: 12px 12px 10px 12px;
    }

    #buttonRow {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 8px;
      margin-bottom: 10px;
    }
    .btn {
      border: 1px solid #b8cbf4;
      background: #ffffff;
      color: #10224e;
      border-radius: 12px;
      padding: 9px 13px;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.14s ease;
      font-family: inherit;
    }
    .btn:hover { background: #f0f6ff; border-color: #8fb0ea; }
    .btnPrimary { background: #2e69f0; border-color: #2e69f0; color: white; }
    .btnPrimary:hover { background: #255add; border-color: #255add; }

    /* optimizer selector */
    #optRow {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      align-items: center;
      margin-bottom: 10px;
    }
    #optLabel {
      font-size: 12px;
      font-weight: 700;
      color: #3b5487;
      margin-right: 4px;
    }
    .optBtn {
      border: 1.5px solid #c7d8ff;
      background: rgba(255,255,255,0.82);
      color: #10224e;
      border-radius: 999px;
      padding: 6px 13px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.14s ease;
      font-family: inherit;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .optBtn:hover { transform: translateY(-1px); box-shadow: 0 3px 10px rgba(0,0,0,0.08); }
    .optBtn.active-adam { background: rgba(0,105,220,0.12); border-color: #0069dc; color: #0069dc; }
    .optBtn.active-sgd  { background: rgba(210,80,0,0.10);  border-color: #d25000; color: #d25000; }
    .optBtn.active-sgdm { background: rgba(30,115,60,0.10); border-color: #1e733c; color: #1e733c; }
    .optBtn.active-all  { background: rgba(46,105,240,0.10); border-color: #2e69f0; color: #2e69f0; }
    .optSwatch { width: 8px; height: 8px; border-radius: 50%; flex: none; }

    #stepRow {
      display: grid;
      grid-template-columns: auto 1fr auto;
      gap: 12px;
      align-items: center;
      margin-bottom: 10px;
    }
    .smallLabel {
      font-size: 12px;
      color: #3b5487;
      font-weight: 700;
      white-space: nowrap;
    }
    .range {
      width: 100%;
      accent-color: #2f6cf2;
    }
    #stepValue {
      font-size: 12px;
      color: #16377e;
      font-weight: 800;
      white-space: nowrap;
    }

    #paramGrid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 10px;
      margin-bottom: 10px;
    }
    .paramBox {
      background: rgba(255,255,255,0.92);
      border: 1px solid #d7e3ff;
      border-radius: 14px;
      padding: 10px 12px;
    }
    .paramHead {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 8px;
      margin-bottom: 7px;
    }
    .paramName { font-size: 13px; font-weight: 700; color: #10224e; }
    .paramVal  { font-size: 12px; font-weight: 800; color: #355fc1; white-space: nowrap; }

    /* surface selector inside paramBox */
    .surfBtns { display: flex; gap: 5px; flex-wrap: wrap; margin-top: 2px; }
    .surfBtn {
      border: 1px solid #c7d8ff;
      background: rgba(255,255,255,0.85);
      color: #2450b3;
      border-radius: 999px;
      padding: 5px 10px;
      font-size: 11px;
      font-weight: 700;
      cursor: pointer;
      font-family: inherit;
      transition: all 0.12s;
    }
    .surfBtn:hover { background: #e8f0ff; }
    .surfBtn.active { background: #2e69f0; color: #fff; border-color: #2e69f0; }

    #toggleRow {
      display: flex;
      flex-wrap: wrap;
      gap: 14px;
      align-items: center;
      padding-top: 2px;
    }
    .check {
      display: flex;
      align-items: center;
      gap: 7px;
      color: #31466f;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
    }

    /* ── INFO CARDS BELOW PLOT ── */
    .cards {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
    .formulaCard {
      background: rgba(255,255,255,0.74);
      border: 1px solid #c7d8ff;
      border-radius: 18px;
      padding: 14px 16px;
    }
    .cardTop {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 14px;
      margin-bottom: 10px;
    }
    .cardTitle {
      font-size: 13px;
      font-weight: 800;
      color: #1b46a5;
      letter-spacing: 0.01em;
    }
    .cardMeta {
      font-size: 12px;
      font-weight: 700;
      color: #4766aa;
      text-align: right;
    }
    .formulaText {
      color: #11244d;
      font-family: "STIX Two Text", Georgia, serif;
      font-size: 15px;
      line-height: 1.85;
      min-height: 24px;
    }
    .noteCard {
      background: rgba(241,255,247,0.86);
      border: 1px solid #b9e6c9;
      border-radius: 16px;
      padding: 14px 16px;
    }
    .noteTitle { font-size: 13px; font-weight: 800; color: #0f7a44; margin-bottom: 8px; }
    .noteText  { font-size: 14px; color: #1a3e2f; line-height: 1.65; }
    .noteText strong { font-weight: 700; }

    .metricsCard {
      background: rgba(255,255,255,0.74);
      border: 1px solid #c7d8ff;
      border-radius: 18px;
      padding: 14px 16px;
    }
    .metricsGrid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
      margin-top: 8px;
    }
    .metricBox {
      background: #f3f7ff;
      border: 1px solid #dce8ff;
      border-radius: 12px;
      padding: 9px 12px;
    }
    .metricLabel {
      font-size: 10px;
      color: #7b94c4;
      font-weight: 700;
      letter-spacing: .04em;
      text-transform: uppercase;
      margin-bottom: 4px;
    }
    .metricVal {
      font-size: 17px;
      font-weight: 800;
      letter-spacing: -0.02em;
      color: #0f1f49;
    }
    .metricVal.adam { color: #0069dc; }
    .metricVal.sgd  { color: #d25000; }
    .metricVal.sgdm { color: #1e733c; }

    @media (max-width: 900px) {
      #paramGrid { grid-template-columns: 1fr 1fr; }
      .cards { grid-template-columns: 1fr; }
      #plot { height: 480px; }
    }
  </style>

<style id="style-harmony-overrides">
  html, body {
    background: #ffffff !important;
  }

  body {
    margin: 0 !important;
    padding: 18px !important;
    background:
      radial-gradient(circle at top right, rgba(0,113,227,0.05), transparent 18%),
      linear-gradient(180deg, #ffffff 0%, #f7faff 100%) !important;
    font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif !important;
    -webkit-font-smoothing: antialiased;
  }

  #app {
    max-width: 1680px !important;
    margin: 0 auto !important;
    background:
      radial-gradient(circle at top right, rgba(0,113,227,0.05), transparent 24%),
      linear-gradient(180deg, #ffffff 0%, #fbfcff 100%) !important;
    border: 1px solid rgba(15, 23, 42, 0.06) !important;
    border-radius: 30px !important;
    box-shadow: 0 18px 44px rgba(34, 62, 132, 0.08) !important;
    color: #1d1d1f !important;
    overflow: hidden !important;
  }

  #header {
    padding: 42px 52px 34px 52px !important;
    border-bottom: 1px solid #eceef3 !important;
    background: transparent !important;
  }

  #heroShell {
    display: grid;
    grid-template-columns: minmax(0, 1.18fr) minmax(340px, 0.82fr);
    gap: 28px;
    align-items: start;
  }

  #heroLeft,
  #heroRight {
    min-width: 0;
  }

  #heroEyebrow {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 12px;
    border-radius: 999px;
    background: #e8f0fe;
    color: #0071e3;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.02em;
    margin-bottom: 16px;
  }

  .heroDot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #0071e3;
    flex: none;
  }

  #header h1 {
    margin: 0 !important;
    max-width: 880px;
    font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif !important;
    font-size: clamp(42px, 5vw, 72px) !important;
    font-weight: 700 !important;
    line-height: 0.96 !important;
    letter-spacing: -0.055em !important;
    color: #1d1d1f !important;
  }

  #header h1 span {
    background: linear-gradient(135deg, #0071e3, #58a6ff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  #subtitle {
    margin: 18px 0 0 0 !important;
    max-width: 920px !important;
    color: #6e6e73 !important;
    font-size: 20px !important;
    line-height: 1.68 !important;
  }

  .heroStatusCard {
    background: linear-gradient(180deg, #fbfdff 0%, #f4f8ff 100%) !important;
    border: 1px solid rgba(0,113,227,0.08) !important;
    border-radius: 24px !important;
    padding: 20px !important;
    box-shadow: 0 12px 30px rgba(34, 62, 132, 0.06) !important;
  }

  .heroCardLabel {
    font-size: 10px;
    color: #8d98aa;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    font-weight: 700;
    margin-bottom: 10px;
  }

  .heroCardTitle {
    font-size: 16px;
    font-weight: 700;
    line-height: 1.2;
    letter-spacing: -0.02em;
    color: #1d1d1f;
    margin-bottom: 14px;
  }

  #statusChips {
    width: 100%;
    display: grid !important;
    grid-template-columns: 1fr !important;
    gap: 12px !important;
  }

  .conceptCard {
    display: flex;
    gap: 12px;
    border-radius: 18px !important;
    padding: 14px 16px !important;
    border: 1px solid #eceef3 !important;
    background: rgba(255,255,255,0.90) !important;
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.84);
  }

  .conceptDot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-top: 6px;
    flex: none;
  }

  .conceptTitle {
    font-size: 13px;
    font-weight: 700;
    color: #1d1d1f;
    margin-bottom: 4px;
    line-height: 1.3;
  }

  .conceptDesc {
    font-size: 13px;
    line-height: 1.6;
    color: #6e6e73;
  }

  .conceptCard.adam .conceptDot {
    background: #0071e3;
  }

  .conceptCard.sgd .conceptDot {
    background: #b85d00;
  }

  .conceptCard.sgdm .conceptDot {
    background: #197a4c;
  }

  #mainWrap {
    padding: 0 52px 42px 52px !important;
  }

  .panel,
  .formulaCard,
  .metricsCard,
  .noteCard {
    background: rgba(255,255,255,0.94) !important;
    border: 1px solid rgba(15, 23, 42, 0.06) !important;
    border-radius: 24px !important;
    box-shadow: 0 14px 32px rgba(15, 23, 42, 0.05) !important;
    backdrop-filter: none !important;
  }

  #topPanel {
    margin-top: 24px;
    padding: 24px !important;
  }

  #plotTopRow {
    gap: 18px !important;
    align-items: flex-end !important;
    margin-bottom: 16px !important;
    padding-bottom: 14px !important;
    border-bottom: 1px solid #f1f3f7 !important;
  }

  #plotHeading h2 {
    margin: 0 !important;
    font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif !important;
    font-size: 24px !important;
    font-weight: 700 !important;
    line-height: 1.15 !important;
    letter-spacing: -0.03em !important;
    color: #1d1d1f !important;
  }

  #plotHeading p {
    margin: 8px 0 0 0 !important;
    max-width: 880px !important;
    font-size: 15px !important;
    line-height: 1.62 !important;
    color: #6e6e73 !important;
  }

  #plot {
    height: 680px !important;
    border-radius: 22px !important;
    border: 1px solid #e8edf5 !important;
    background: linear-gradient(180deg, #ffffff 0%, #fafbff 100%) !important;
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.84);
  }

  #controlWrap {
    margin-top: 18px !important;
    padding: 18px !important;
    background: linear-gradient(180deg, #fbfcff 0%, #f7faff 100%) !important;
    border: 1px solid #eceef3 !important;
    border-radius: 22px !important;
  }

  #buttonRow,
  #optRow,
  #toggleRow {
    gap: 10px !important;
  }

  .btn,
  .optBtn,
  .surfBtn {
    border-radius: 999px !important;
    border: 1px solid #d9dde5 !important;
    background: #ffffff !important;
    color: #1d1d1f !important;
    box-shadow: none !important;
    font-size: 13px !important;
    font-weight: 600 !important;
  }

  .btn {
    padding: 10px 16px !important;
  }

  .btn:hover,
  .optBtn:hover,
  .surfBtn:hover {
    background: #f5f7fb !important;
    border-color: #cfd5df !important;
    transform: translateY(-1px);
    box-shadow: 0 6px 14px rgba(15, 23, 42, 0.06) !important;
  }

  .btnPrimary {
    background: #0071e3 !important;
    color: #ffffff !important;
    border-color: #0071e3 !important;
  }

  .btnPrimary:hover {
    background: #0062c7 !important;
    border-color: #0062c7 !important;
  }

  .optBtn.active-adam {
    background: #edf5ff !important;
    border-color: rgba(0,113,227,0.24) !important;
    color: #0071e3 !important;
  }

  .optBtn.active-sgd {
    background: #fff4ec !important;
    border-color: rgba(184,93,0,0.22) !important;
    color: #b85d00 !important;
  }

  .optBtn.active-sgdm {
    background: #eefbf5 !important;
    border-color: rgba(25,122,76,0.20) !important;
    color: #197a4c !important;
  }

  .optBtn.active-all,
  .surfBtn.active {
    background: #0071e3 !important;
    border-color: #0071e3 !important;
    color: #ffffff !important;
  }

  .optSwatch {
    width: 8px !important;
    height: 8px !important;
  }

  .smallLabel,
  #optLabel,
  .paramName,
  .controlLabel {
    color: #6e6e73 !important;
  }

  .range {
    accent-color: #0071e3 !important;
  }

  #stepValue,
  .paramVal,
  .cardMeta {
    color: #1d1d1f !important;
  }

  #paramGrid {
    gap: 12px !important;
    margin-bottom: 12px !important;
  }

  .paramBox,
  .metricBox {
    background: rgba(255,255,255,0.86) !important;
    border: 1px solid rgba(15, 23, 42, 0.05) !important;
    border-radius: 18px !important;
    padding: 14px !important;
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.84) !important;
  }

  .metricBox {
    background: #f7f9fc !important;
  }

  .cardTitle,
  .noteTitle {
    color: #1d1d1f !important;
    font-size: 18px !important;
    letter-spacing: -0.02em !important;
  }

  .formulaText {
    color: #334155 !important;
    font-family: "STIX Two Text", Georgia, serif !important;
    font-size: 16px !important;
    line-height: 1.88 !important;
  }

  .noteText,
  #takeawayText,
  #plotHeading p,
  #subtitle {
    color: #6e6e73 !important;
  }

  .metricsGrid {
    gap: 12px !important;
  }

  .metricLabel {
    color: #8d98aa !important;
  }

  .metricVal {
    color: #1d1d1f !important;
    font-size: 22px !important;
    letter-spacing: -0.03em !important;
  }

  .metricVal.adam { color: #0071e3 !important; }
  .metricVal.sgd  { color: #b85d00 !important; }
  .metricVal.sgdm { color: #197a4c !important; }

  .formulaCard {
    background: linear-gradient(180deg, #fbfdff 0%, #f4f8ff 100%) !important;
    border-color: rgba(0,113,227,0.08) !important;
  }

  .metricsCard {
    background: linear-gradient(180deg, #ffffff 0%, #fbfcff 100%) !important;
  }

  .noteCard {
    background: linear-gradient(180deg, #fffdf8 0%, #fff7ec 100%) !important;
    border-color: rgba(184,93,0,0.10) !important;
  }

  .cards {
    margin-top: 18px !important;
    display: grid !important;
    grid-template-columns: minmax(0, 1.02fr) minmax(420px, 0.98fr) !important;
    gap: 16px !important;
    align-items: start;
  }

  .formulaCard,
  .metricsCard,
  .noteCard {
    padding: 20px !important;
  }

  @media (max-width: 1280px) {
    #heroShell,
    .cards {
      grid-template-columns: 1fr !important;
    }

    #heroRight {
      max-width: 660px;
    }
  }

  @media (max-width: 980px) {
    #header,
    #mainWrap {
      padding-left: 26px !important;
      padding-right: 26px !important;
    }

    #paramGrid {
      grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
    }

    #plot {
      height: 540px !important;
    }
  }

  @media (max-width: 680px) {
    body {
      padding: 10px !important;
    }

    #header,
    #mainWrap {
      padding-left: 18px !important;
      padding-right: 18px !important;
    }

    #header h1 {
      font-size: clamp(34px, 10vw, 50px) !important;
    }

    #subtitle {
      font-size: 16px !important;
    }

    #paramGrid {
      grid-template-columns: 1fr !important;
    }

    #plot {
      height: 460px !important;
    }
  }
</style>

</head>
<body>

<div id="app">
  <div id="header">
    <div id="heroShell">
      <div id="heroLeft">
        <div id="heroEyebrow"><span class="heroDot"></span>Interactive Optimizer Lab</div>
        <h1>Adam vs SGD<br><span>Optimizer Comparison</span></h1>
        <div id="subtitle">
          3D loss surface &middot; watch Adam, SGD, and SGD+Momentum converge from the same start &middot; drag to rotate 360&deg;
        </div>
      </div>
      <div id="heroRight">
        <div class="heroStatusCard">
          <div class="heroCardLabel">Key concepts</div>
          <div class="heroCardTitle">What to watch for</div>
          <div id="statusChips">
            <div class="conceptCard adam">
              <div class="conceptDot"></div>
              <div>
                <div class="conceptTitle">Adam</div>
                <div class="conceptDesc">Adaptive step scaling helps it stay stable when curvature changes across directions.</div>
              </div>
            </div>
            <div class="conceptCard sgd">
              <div class="conceptDot"></div>
              <div>
                <div class="conceptTitle">SGD</div>
                <div class="conceptDesc">Simple and direct, but it tends to oscillate on steep walls before settling into the valley.</div>
              </div>
            </div>
            <div class="conceptCard sgdm">
              <div class="conceptDot"></div>
              <div>
                <div class="conceptTitle">SGD+M</div>
                <div class="conceptDesc">Smoother than plain SGD because momentum carries useful direction across multiple updates.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div id="mainWrap">

    <!-- 3D PANEL -->
    <div class="panel" id="topPanel">
      <div id="plotTopRow">
        <div id="plotHeading">
          <h2>3D loss surface</h2>
          <p>
            Drag to rotate freely. Each optimizer traces its own path on the same surface.
            The floor projection shows the (x, y) trajectory from above.
          </p>
        </div>
      </div>

      <div id="plot"></div>

      <div id="controlWrap">
        <!-- Play controls -->
        <div id="buttonRow">
          <button class="btn" id="prevBtn">&larr; Prev</button>
          <button class="btn" id="nextBtn">Next &rarr;</button>
          <button class="btn btnPrimary" id="playBtn">&#9654; Play</button>
          <button class="btn" id="pauseBtn">Pause</button>
          <button class="btn" id="replayBtn">Replay</button>
          <button class="btn" id="viewBtn">Reset View</button>
          <div style="flex:1"></div>
          <!-- optimizer selector inline -->
          <div id="optRow">
            <span id="optLabel">Show:</span>
            <button class="optBtn active-all" id="btnAll"  onclick="selectOpt('all')">
              <span class="optSwatch" style="background:linear-gradient(135deg,#0069dc,#d25000)"></span>All three
            </button>
            <button class="optBtn" id="btnAdam" onclick="selectOpt('adam')">
              <span class="optSwatch" style="background:#0069dc"></span>Adam
            </button>
            <button class="optBtn" id="btnSgd"  onclick="selectOpt('sgd')">
              <span class="optSwatch" style="background:#d25000"></span>SGD
            </button>
            <button class="optBtn" id="btnSgdm" onclick="selectOpt('sgdm')">
              <span class="optSwatch" style="background:#1e733c"></span>SGD+M
            </button>
          </div>
        </div>

        <!-- Seek slider -->
        <div id="stepRow">
          <div class="smallLabel">Step</div>
          <input class="range" id="seekSlider" type="range" min="0" max="120" step="1" value="0">
          <div id="stepValue">0 / 120</div>
        </div>

        <!-- Params -->
        <div id="paramGrid">
          <div class="paramBox">
            <div class="paramHead">
              <div class="paramName">Learning rate &eta;</div>
              <div class="paramVal" id="lrVal">0.010</div>
            </div>
            <input class="range" id="lrSlider" type="range" min="1" max="50" step="1" value="10">
          </div>
          <div class="paramBox">
            <div class="paramHead">
              <div class="paramName">Momentum &beta;<sub>1</sub></div>
              <div class="paramVal" id="momVal">0.90</div>
            </div>
            <input class="range" id="momSlider" type="range" min="0" max="99" step="1" value="90">
          </div>
          <div class="paramBox">
            <div class="paramHead">
              <div class="paramName">Steps</div>
              <div class="paramVal" id="stepsVal">120</div>
            </div>
            <input class="range" id="stepsSlider" type="range" min="20" max="200" step="10" value="120">
          </div>
          <div class="paramBox">
            <div class="paramHead">
              <div class="paramName">Loss surface</div>
              <div class="paramVal" id="surfVal">Rosen</div>
            </div>
            <div class="surfBtns">
              <button class="surfBtn active" id="surfRosen" onclick="setSurface('rosenbrock')">Rosen</button>
              <button class="surfBtn" id="surfRavine" onclick="setSurface('ravine')">Ravine</button>
              <button class="surfBtn" id="surfSaddle" onclick="setSurface('saddle')">Saddle</button>
            </div>
          </div>
        </div>

        <div id="toggleRow">
          <label class="check"><input type="checkbox" id="showPath" checked> Show paths</label>
          <label class="check"><input type="checkbox" id="showProj" checked> Floor projection</label>
          <label class="check"><input type="checkbox" id="showSeg"  checked> Highlight step</label>
          <label class="check">
            Speed: <input class="range" id="speedSlider" type="range" min="60" max="800" step="20" value="300" style="width:90px; margin-left:6px;">
            <span id="speedVal" style="margin-left:6px; font-size:12px; color:#355fc1;">300 ms</span>
          </label>
        </div>
      </div>
    </div><!-- /panel -->

    <!-- INFO CARDS -->
    <div class="cards">

      <!-- Update rules -->
      <div class="formulaCard">
        <div class="cardTop">
          <div class="cardTitle">Update rules</div>
          <div class="cardMeta" id="rulesMeta">all three optimizers</div>
        </div>
        <div class="formulaText" id="formulaMain">
          <b style="color:#0069dc;">Adam:</b> &nbsp;m = &beta;<sub>1</sub>m + (1-&beta;<sub>1</sub>)g &nbsp;|&nbsp; v = &beta;<sub>2</sub>v + (1-&beta;<sub>2</sub>)g<sup>2</sup> &nbsp;|&nbsp; &theta; &larr; &theta; - &eta;&middot;m&#770;/(&radic;v&#770;+&epsilon;)<br>
          <b style="color:#d25000;">SGD:</b> &nbsp;&nbsp;&theta; &larr; &theta; - &eta;&middot;g<br>
          <b style="color:#1e733c;">SGD+M:</b> v &larr; &beta;&middot;v + &eta;&middot;g &nbsp;|&nbsp; &theta; &larr; &theta; - v
        </div>
      </div>

      <!-- Live step metrics -->
      <div class="metricsCard">
        <div class="cardTop">
          <div class="cardTitle">Step metrics</div>
          <div class="cardMeta" id="stepMeta">step 0</div>
        </div>
        <div class="metricsGrid">
          <div class="metricBox">
            <div class="metricLabel">Loss &middot; Adam</div>
            <div class="metricVal adam" id="mAdam">-</div>
          </div>
          <div class="metricBox">
            <div class="metricLabel">Loss &middot; SGD</div>
            <div class="metricVal sgd" id="mSgd">-</div>
          </div>
          <div class="metricBox">
            <div class="metricLabel">Loss &middot; SGD+M</div>
            <div class="metricVal sgdm" id="mSgdm">-</div>
          </div>
          <div class="metricBox">
            <div class="metricLabel">Dist Adam&rarr;min</div>
            <div class="metricVal" id="mDistAdam">-</div>
          </div>
          <div class="metricBox">
            <div class="metricLabel">Dist SGD&rarr;min</div>
            <div class="metricVal" id="mDistSgd">-</div>
          </div>
          <div class="metricBox">
            <div class="metricLabel">Dist SGD+M&rarr;min</div>
            <div class="metricVal" id="mDistSgdm">-</div>
          </div>
        </div>
      </div>

      <!-- Takeaway -->
      <div class="noteCard" style="grid-column: 1 / -1;">
        <div class="noteTitle">Takeaway - <span id="takeawayTitle">Rosenbrock surface</span></div>
        <div class="noteText" id="takeawayText">
          On the <strong>Rosenbrock</strong> surface, the narrow curved banana valley is notoriously hard.
          Gradients across the valley are much larger than along it - SGD oscillates wildly while
          Adam's per-parameter scaling lets it glide smoothly toward (1, 1). SGD+Momentum accumulates
          velocity along the valley floor but may overshoot on the curve.
        </div>
      </div>

    </div><!-- /cards -->

  </div><!-- /mainWrap -->
</div><!-- /app -->

<script src="https://cdn.plot.ly/plotly-2.27.0.min.js"></script>
<script>
(function () {

  // ── SURFACES ─────────────────────────────────────────────────────────────────
  const SURFACES = {
    rosenbrock: {
      label: 'Rosenbrock',
      f:  (x,y) => Math.pow(1-x,2) + 100*Math.pow(y - x*x, 2),
      g:  (x,y) => [
            -2*(1-x) - 400*x*(y - x*x),
            200*(y - x*x)
          ],
      start: [-1.2, 1.0],
      min:   [1, 1],
      xRange:[-2, 2],
      yRange:[-0.5, 2.5],
      N: 70,
      takeawayTitle: 'Rosenbrock surface',
      takeaway: `On the <strong>Rosenbrock</strong> surface, the narrow curved banana valley is notoriously hard.
        Gradients across the valley are much larger than along it - SGD oscillates wildly while
        Adam's per-parameter scaling lets it glide smoothly toward (1, 1). SGD+Momentum accumulates
        velocity along the valley floor but may overshoot on the curve.`,
    },
    ravine: {
      label: 'Ravine',
      f:  (x,y) => x*x/20 + 5*y*y,
      g:  (x,y) => [x/10, 10*y],
      start: [-3, 2],
      min:   [0, 0],
      xRange:[-4, 4],
      yRange:[-2.5, 2.5],
      N: 60,
      takeawayTitle: 'Ravine surface',
      takeaway: `The <strong>Ravine</strong> is shallow along x but very steep along y. SGD zig-zags violently
        across the steep axis while barely moving along the shallow one. Adam normalises each dimension
        independently so it converges in a straight line. SGD+Momentum dampens the oscillation but still
        takes many steps.`,
    },
    saddle: {
      label: 'Saddle / bumpy',
      f:  (x,y) => x*x + 4*y*y + 0.3*Math.sin(3*x) + 0.5*Math.sin(5*y),
      g:  (x,y) => [2*x + 0.9*Math.cos(3*x), 8*y + 2.5*Math.cos(5*y)],
      start: [-2.5, 1.8],
      min:   [0, 0],
      xRange:[-3.5, 3.5],
      yRange:[-2.5, 2.5],
      N: 60,
      takeawayTitle: 'Saddle / bumpy surface',
      takeaway: `The <strong>bumpy bowl</strong> has high-frequency oscillations on top of a smooth quadratic.
        SGD can get stuck on a local bump or oscillate between ridges. Adam's bias-corrected
        second moment estimate quickly damps the high-frequency gradient noise. SGD+Momentum
        may briefly overshoot but its inertia carries it past small bumps.`,
    },
  };

  // ── OPTIMIZER COLORS ─────────────────────────────────────────────────────────
  const C = {
    adam:  '#0069dc',
    sgd:   '#d25000',
    sgdm:  '#1e733c',
  };

  // ── STATE ─────────────────────────────────────────────────────────────────────
  const DEFAULT_CAMERA = {
    eye:    { x: 1.72, y: 1.54, z: 0.96 },
    center: { x: 0, y: 0, z: 0 },
    up:     { x: 0, y: 0, z: 1 },
  };

  const state = {
    surface:  'rosenbrock',
    opt:      'all',
    lr:       0.01,
    beta1:    0.90,
    beta2:    0.999,
    eps:      1e-8,
    maxSteps: 120,
    step:     0,
    playing:  false,
    animId:   null,
    lastTs:   null,
    speedMs:  300,
    showPath: true,
    showProj: true,
    showSeg:  true,
    camera:   JSON.parse(JSON.stringify(DEFAULT_CAMERA)),
    paths:    {},
    surf:     null,
    zFloor:   0,
  };

  // ── MATH HELPERS ──────────────────────────────────────────────────────────────
  function linspace(a, b, n) {
    const arr = [];
    for (let i = 0; i < n; i++) arr.push(a + (b-a)*i/(n-1));
    return arr;
  }

  function clip(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

  // ── BUILD SURFACE GRID ───────────────────────────────────────────────────────
  function buildSurf() {
    const S = SURFACES[state.surface];
    const xs = linspace(S.xRange[0], S.xRange[1], S.N);
    const ys = linspace(S.yRange[0], S.yRange[1], S.N);
    const zs = [];
    let zMin = Infinity, zMax = -Infinity;
    for (let j = 0; j < ys.length; j++) {
      const row = [];
      for (let i = 0; i < xs.length; i++) {
        const z = S.f(xs[i], ys[j]);
        row.push(z);
        if (z < zMin) zMin = z;
        if (z > zMax) zMax = z;
      }
      zs.push(row);
    }
    return { xs, ys, zs, zMin, zMax };
  }

  // ── COMPUTE OPTIMIZER PATH ───────────────────────────────────────────────────
  function computePath(type) {
    const S   = SURFACES[state.surface];
    const lr  = state.lr;
    const b1  = state.beta1;
    const b2  = state.beta2;
    const eps = state.eps;
    let x = S.start[0], y = S.start[1];
    let mx=0, my=0, vx=0, vy=0, velx=0, vely=0;

    const pts = [{ x, y, z: S.f(x,y) }];

    for (let t = 1; t <= state.maxSteps; t++) {
      let [gx, gy] = S.g(x, y);
      // gradient clipping
      const gnorm = Math.sqrt(gx*gx + gy*gy) + 1e-10;
      const CLIP = 8;
      if (gnorm > CLIP) { gx *= CLIP/gnorm; gy *= CLIP/gnorm; }

      if (type === 'adam') {
        mx = b1*mx + (1-b1)*gx;
        my = b1*my + (1-b1)*gy;
        vx = b2*vx + (1-b2)*gx*gx;
        vy = b2*vy + (1-b2)*gy*gy;
        const mhx = mx / (1 - Math.pow(b1,t));
        const mhy = my / (1 - Math.pow(b1,t));
        const vhx = vx / (1 - Math.pow(b2,t));
        const vhy = vy / (1 - Math.pow(b2,t));
        x -= lr * mhx / (Math.sqrt(vhx) + eps);
        y -= lr * mhy / (Math.sqrt(vhy) + eps);
      } else if (type === 'sgd') {
        x -= lr * gx;
        y -= lr * gy;
      } else { // sgdm
        velx = b1*velx + lr*gx;
        vely = b1*vely + lr*gy;
        x -= velx;
        y -= vely;
      }

      // clamp to xRange/yRange to avoid explosions
      const S2 = SURFACES[state.surface];
      x = clip(x, S2.xRange[0], S2.xRange[1]);
      y = clip(y, S2.yRange[0], S2.yRange[1]);
      pts.push({ x, y, z: S.f(x,y) });
    }
    return pts;
  }

  function buildAllPaths() {
    state.paths = {
      adam:  computePath('adam'),
      sgd:   computePath('sgd'),
      sgdm:  computePath('sgdm'),
    };
  }

  // ── PLOTLY TRACES ─────────────────────────────────────────────────────────────
  function getTraces() {
    const step = state.step;
    const opt  = state.opt;
    const surf = state.surf;
    const ZF   = state.zFloor;
    const traces = [];

    // 1. Surface
    traces.push({
      type: 'surface',
      x: surf.xs,
      y: surf.ys,
      z: surf.zs,
      colorscale: [
        [0.00, '#56a6f1'],
        [0.35, '#67c8ef'],
        [0.60, '#90ddb1'],
        [0.82, '#f0d46a'],
        [1.00, '#f28b57'],
      ],
      showscale: false,
      opacity: 0.97,
      hovertemplate: 'x=%{x:.2f}<br>y=%{y:.2f}<br>f=%{z:.3f}<extra></extra>',
      lighting: { ambient: 0.82, diffuse: 0.9, roughness: 0.48, specular: 0.12 },
    });

    const OPTS = ['adam','sgd','sgdm'].filter(k =>
      opt === 'all' || opt === k
    );

    for (const key of OPTS) {
      const path = state.paths[key];
      const color = C[key];
      const name  = key === 'sgdm' ? 'SGD+M' : key.toUpperCase();
      const slice = path.slice(0, step + 1);

      const px = slice.map(d => d.x);
      const py = slice.map(d => d.y);
      const pz = slice.map(d => d.z);

      // Path line on surface
      if (state.showPath && slice.length > 1) {
        traces.push({
          type: 'scatter3d', mode: 'lines',
          x: px, y: py, z: pz,
          line: { color, width: 7 },
          name,
          hoverinfo: 'skip',
          showlegend: false,
        });
      }

      // Floor projection
      if (state.showProj && slice.length > 1) {
        traces.push({
          type: 'scatter3d', mode: 'lines',
          x: px, y: py, z: px.map(() => ZF),
          line: { color, width: 3, dash: 'dash' },
          opacity: 0.55,
          hoverinfo: 'skip',
          showlegend: false,
        });
        // vertical drop line from current point to floor
        const cur = slice[slice.length-1];
        traces.push({
          type: 'scatter3d', mode: 'lines',
          x: [cur.x, cur.x], y: [cur.y, cur.y], z: [ZF, cur.z],
          line: { color, width: 2, dash: 'dot' },
          opacity: 0.45,
          hoverinfo: 'skip',
          showlegend: false,
        });
        // floor dot
        traces.push({
          type: 'scatter3d', mode: 'markers',
          x: [cur.x], y: [cur.y], z: [ZF],
          marker: { size: 4, color },
          hoverinfo: 'skip',
          showlegend: false,
        });
      }

      // Next-step segment highlight
      if (state.showSeg && step < path.length - 1) {
        const cur  = path[step];
        const next = path[step+1];
        traces.push({
          type: 'scatter3d', mode: 'lines',
          x: [cur.x, next.x], y: [cur.y, next.y], z: [cur.z, next.z],
          line: { color: '#ef4444', width: 11 },
          hoverinfo: 'skip',
          showlegend: false,
        });
      }

      // Start marker
      traces.push({
        type: 'scatter3d', mode: 'markers',
        x: [path[0].x], y: [path[0].y], z: [path[0].z],
        marker: { size: 6, color: '#f59e0b', symbol: 'circle' },
        name: `${name} start`,
        hovertemplate: `${name} start<br>x=%{x:.3f}, y=%{y:.3f}<extra></extra>`,
        showlegend: false,
      });

      // Current position marker + label
      const cur = slice[slice.length - 1];
      traces.push({
        type: 'scatter3d', mode: 'markers+text',
        x: [cur.x], y: [cur.y], z: [cur.z],
        text: [name],
        textposition: 'top center',
        textfont: { size: 13, color, family: 'Inter, sans-serif' },
        marker: { size: 9, color, line: { color: '#fff', width: 3 } },
        name,
        hovertemplate: `${name}<br>x=%{x:.3f}, y=%{y:.3f}<br>loss=%{customdata:.4f}<extra></extra>`,
        customdata: [cur.z],
        showlegend: true,
      });
    }

    // Global minimum star
    const S = SURFACES[state.surface];
    const [mx,my] = S.min;
    const mz = S.f(mx,my);
    traces.push({
      type: 'scatter3d', mode: 'markers+text',
      x: [mx], y: [my], z: [mz],
      text: ['★ min'],
      textposition: 'top center',
      textfont: { size: 12, color: '#f5a623', family: 'Inter, sans-serif' },
      marker: { size: 8, color: '#f5a623', symbol: 'diamond', line:{ color:'#fff', width:2 } },
      name: 'Global min',
      hovertemplate: 'Global min<br>x=%{x:.3f}, y=%{y:.3f}<extra></extra>',
      showlegend: false,
    });

    return traces;
  }

  function getLayout() {
    const S = SURFACES[state.surface];
    const zMax = state.surf.zMax;
    return {
      margin: { l:0, r:0, t:0, b:0 },
      showlegend: true,
      legend: {
        x: 0.01, y: 0.99,
        bgcolor: 'rgba(255,255,255,0.82)',
        bordercolor: 'rgba(0,0,0,0.06)',
        borderwidth: 1,
        font: { size: 12, family: 'Inter, sans-serif', color:'#10224e' },
      },
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor:  'rgba(0,0,0,0)',
      uirevision: 'keep-view',
      scene: {
        xaxis: {
          title: { text:'x', font:{ size:14, color:'#263b6b' } },
          range: S.xRange,
          backgroundcolor: '#fbfdff',
          gridcolor: '#dde5f5',
          zerolinecolor: '#cad5ea',
          tickfont: { size:11, color:'#566b95' },
          showspikes: false,
        },
        yaxis: {
          title: { text:'y', font:{ size:14, color:'#263b6b' } },
          range: S.yRange,
          backgroundcolor: '#fbfdff',
          gridcolor: '#dde5f5',
          zerolinecolor: '#cad5ea',
          tickfont: { size:11, color:'#566b95' },
          showspikes: false,
        },
        zaxis: {
          title: { text:'loss f(x,y)', font:{ size:14, color:'#263b6b' } },
          range: [state.zFloor, zMax + 0.05*(zMax - state.zFloor)],
          backgroundcolor: '#fbfdff',
          gridcolor: '#dde5f5',
          zerolinecolor: '#cad5ea',
          tickfont: { size:11, color:'#566b95' },
          showspikes: false,
        },
        aspectratio: { x:1.16, y:1.16, z:0.72 },
        camera: state.camera,
      },
    };
  }

  // ── RENDER ────────────────────────────────────────────────────────────────────
  function renderPlot() {
    Plotly.react('plot', getTraces(), getLayout(), {
      displayModeBar: false,
      responsive: true,
      scrollZoom: true,
    });
  }

  function fmtLoss(v) {
    if (v === undefined || isNaN(v)) return '-';
    return v < 0.01 ? v.toExponential(2) : v < 10 ? v.toFixed(4) : v.toFixed(1);
  }

  function fmtDist(x1,y1,x2,y2) {
    return Math.sqrt((x1-x2)**2 + (y1-y2)**2).toFixed(3);
  }

  function updateUI() {
    const step = state.step;
    const S    = SURFACES[state.surface];
    const [mx,my] = S.min;

    const ap = state.paths.adam[Math.min(step, state.paths.adam.length-1)];
    const sp = state.paths.sgd[Math.min(step, state.paths.sgd.length-1)];
    const mp = state.paths.sgdm[Math.min(step, state.paths.sgdm.length-1)];

    document.getElementById('stepMeta').textContent    = `step ${step} of ${state.maxSteps}`;
    document.getElementById('stepValue').textContent   = `${step} / ${state.maxSteps}`;
    document.getElementById('seekSlider').value        = step;

    document.getElementById('mAdam').textContent    = fmtLoss(ap.z);
    document.getElementById('mSgd').textContent     = fmtLoss(sp.z);
    document.getElementById('mSgdm').textContent    = fmtLoss(mp.z);
    document.getElementById('mDistAdam').textContent = fmtDist(ap.x,ap.y,mx,my);
    document.getElementById('mDistSgd').textContent  = fmtDist(sp.x,sp.y,mx,my);
    document.getElementById('mDistSgdm').textContent = fmtDist(mp.x,mp.y,mx,my);
  }

  function renderAll() {
    renderPlot();
    updateUI();
  }

  // ── ANIMATION ─────────────────────────────────────────────────────────────────
  function stopAnim() {
    state.playing = false;
    if (state.animId) { cancelAnimationFrame(state.animId); state.animId = null; }
    state.lastTs = null;
    document.getElementById('playBtn').textContent = '\u25B6 Play';
  }

  function startAnim() {
    stopAnim();
    state.playing = true;
    document.getElementById('playBtn').textContent = '\u23F8 Pause';
    function frame(ts) {
      if (!state.playing) return;
      if (state.lastTs === null) state.lastTs = ts;
      if (ts - state.lastTs >= state.speedMs) {
        if (state.step < state.maxSteps) {
          state.step++;
          renderAll();
          state.lastTs = ts;
        } else {
          stopAnim();
          return;
        }
      }
      state.animId = requestAnimationFrame(frame);
    }
    state.animId = requestAnimationFrame(frame);
  }

  // ── CONTROLS ─────────────────────────────────────────────────────────────────
  window.selectOpt = function(opt) {
    state.opt = opt;
    ['adam','sgd','sgdm','all'].forEach(k => {
      const el = document.getElementById('btn'+k.charAt(0).toUpperCase()+k.slice(1));
      if (!el) return;
      el.className = 'optBtn' + (k === opt ? ` active-${k}` : '');
    });
    renderPlot();
  };

  window.setSurface = function(s) {
    stopAnim();
    state.surface = s;
    state.step = 0;
    state.surf = buildSurf();
    state.zFloor = state.surf.zMin - (state.surf.zMax - state.surf.zMin) * 0.08;
    buildAllPaths();
    document.getElementById('surfVal').textContent = SURFACES[s].label.slice(0,6);
    ['rosenbrock','ravine','saddle'].forEach(k => {
      const id = 'surf' + k.charAt(0).toUpperCase() + k.slice(1);
      document.getElementById(id).classList.toggle('active', k === s);
    });
    document.getElementById('takeawayTitle').textContent = SURFACES[s].takeawayTitle;
    document.getElementById('takeawayText').innerHTML    = SURFACES[s].takeaway;
    renderAll();
  };

  function rebuildPaths() {
    stopAnim();
    state.step = 0;
    state.surf = buildSurf();
    state.zFloor = state.surf.zMin - (state.surf.zMax - state.surf.zMin) * 0.08;
    buildAllPaths();
    renderAll();
  }

  // ── INIT ──────────────────────────────────────────────────────────────────────
  function init() {
    state.surf   = buildSurf();
    state.zFloor = state.surf.zMin - (state.surf.zMax - state.surf.zMin) * 0.08;
    buildAllPaths();

    document.getElementById('seekSlider').max   = String(state.maxSteps);
    document.getElementById('stepsSlider').value= String(state.maxSteps);

    Plotly.newPlot('plot', getTraces(), getLayout(), {
      displayModeBar: false,
      responsive: true,
      scrollZoom: true,
    }).then(() => {
      document.getElementById('plot').on('plotly_relayout', function(evt) {
        if (evt['scene.camera']) state.camera = evt['scene.camera'];
      });
      updateUI();
    });

    // ── EVENT LISTENERS ──────────────────────────────────────────────────────
    document.getElementById('prevBtn').addEventListener('click', () => {
      stopAnim(); state.step = Math.max(0, state.step-1); renderAll();
    });
    document.getElementById('nextBtn').addEventListener('click', () => {
      stopAnim(); state.step = Math.min(state.maxSteps, state.step+1); renderAll();
    });
    document.getElementById('playBtn').addEventListener('click', () => {
      if (state.playing) stopAnim();
      else { if (state.step >= state.maxSteps) state.step=0; startAnim(); }
    });
    document.getElementById('pauseBtn').addEventListener('click', stopAnim);
    document.getElementById('replayBtn').addEventListener('click', () => {
      stopAnim(); state.step=0; renderAll(); startAnim();
    });
    document.getElementById('viewBtn').addEventListener('click', () => {
      state.camera = JSON.parse(JSON.stringify(DEFAULT_CAMERA));
      Plotly.relayout('plot', { 'scene.camera': state.camera });
    });

    document.getElementById('seekSlider').addEventListener('input', e => {
      stopAnim(); state.step = Number(e.target.value); renderAll();
    });
    document.getElementById('lrSlider').addEventListener('input', e => {
      state.lr = Number(e.target.value)/1000;
      document.getElementById('lrVal').textContent = state.lr.toFixed(3);
      rebuildPaths();
    });
    document.getElementById('momSlider').addEventListener('input', e => {
      state.beta1 = Number(e.target.value)/100;
      document.getElementById('momVal').textContent = state.beta1.toFixed(2);
      rebuildPaths();
    });
    document.getElementById('stepsSlider').addEventListener('input', e => {
      state.maxSteps = Number(e.target.value);
      document.getElementById('stepsVal').textContent = String(state.maxSteps);
      document.getElementById('seekSlider').max = String(state.maxSteps);
      rebuildPaths();
    });
    document.getElementById('speedSlider').addEventListener('input', e => {
      state.speedMs = Number(e.target.value);
      document.getElementById('speedVal').textContent = `${state.speedMs} ms`;
    });
    document.getElementById('showPath').addEventListener('change', e => {
      state.showPath = e.target.checked; renderPlot();
    });
    document.getElementById('showProj').addEventListener('change', e => {
      state.showProj = e.target.checked; renderPlot();
    });
    document.getElementById('showSeg').addEventListener('change', e => {
      state.showSeg  = e.target.checked; renderPlot();
    });

    // auto-play after short delay
    setTimeout(startAnim, 700);
  }

  init();

})();
</script>

<script id="style-harmony-script">
(function () {
  function initStyleHarmony() {
    const header = document.getElementById('header');
    const title = header ? header.querySelector('h1') : null;
    const subtitle = document.getElementById('subtitle');
    const chips = document.getElementById('statusChips');

    if (header && title && subtitle && chips && !document.getElementById('heroShell')) {
      const shell = document.createElement('div');
      shell.id = 'heroShell';

      const left = document.createElement('div');
      left.id = 'heroLeft';

      const right = document.createElement('div');
      right.id = 'heroRight';
      right.className = 'heroStatusCard';

      left.appendChild(title);
      left.appendChild(subtitle);
      right.appendChild(chips);

      shell.appendChild(left);
      shell.appendChild(right);
      header.appendChild(shell);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initStyleHarmony);
  } else {
    initStyleHarmony();
  }
})();
</script>

</body>
</html>
'''

display(HTML(html_code))