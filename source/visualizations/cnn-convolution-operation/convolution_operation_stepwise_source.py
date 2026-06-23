from IPython.display import HTML, display

html_code = r"""
<style>
#conv-demo-wrap * { box-sizing:border-box; }
#conv-demo-wrap .conv-btn{
  padding:10px 16px;border:none;border-radius:12px;cursor:pointer;
  font-weight:700;font-size:14px;transition:all .18s ease;
}
#conv-demo-wrap .conv-btn:hover{ transform:translateY(-1px); }
#conv-demo-wrap .conv-btn.primary{
  background:#2563eb;color:#fff;box-shadow:0 8px 18px rgba(37,99,235,.24);
}
#conv-demo-wrap .conv-btn.secondary{
  background:#ffffff;color:#0f172a;border:1px solid #cbd5e1;
}
#conv-demo-wrap .mini-field{
  background:#ffffff;border:1px solid #cbd5e1;border-radius:20px;
  padding:12px 14px;min-height:86px;display:flex;flex-direction:column;justify-content:center;
  box-shadow:0 6px 16px rgba(15,23,42,.04);
}
#conv-demo-wrap .mini-field label{
  color:#475569;font-size:13px;font-weight:700;margin-bottom:8px;
}
#conv-demo-wrap .mini-field select,
#conv-demo-wrap .mini-field input[type="range"]{
  width:100%;
}
#conv-demo-wrap .mini-field select{
  padding:8px 10px;border-radius:10px;border:1px solid #cbd5e1;background:#fff;color:#0f172a;
}
#conv-demo-wrap .mini-hint{
  font-size:12px;color:#64748b;margin-top:6px;min-height:16px;
}
#conv-demo-wrap .step-chip{
  padding:6px 10px;border-radius:999px;border:1px solid #475569;background:#0f172a;
  color:#cbd5e1;font-size:12px;cursor:pointer;
}
#conv-demo-wrap .step-chip.active{
  background:#dbeafe;color:#1e3a8a;border-color:#bfdbfe;font-weight:700;
}
</style>

<div id="conv-demo-wrap" style="max-width:1360px;margin:18px auto;background:#f7fbff;padding:18px;border-radius:24px;font-family:Arial,sans-serif;">
  <div style="font-size:30px;font-weight:700;color:#0f172a;margin-bottom:6px;">2D Convolution Operation</div>
  <div style="font-size:14px;color:#64748b;margin-bottom:14px;">
    Sliding Window &rarr; Element-wise Multiply &rarr; Summation
  </div>

  <div style="background:#ffffff;border:1px solid #dbeafe;border-radius:24px;padding:18px;box-shadow:0 10px 30px rgba(59,130,246,0.06);">
    <div style="background:#0d1124;border:1px solid #1f2a4d;border-radius:18px;padding:14px;">
      <canvas id="convCanvas" width="1240" height="600"
        style="display:block;width:100%;max-width:1240px;margin:0 auto;border-radius:14px;background:#151a34;"></canvas>

      <div style="display:flex;gap:10px;align-items:stretch;justify-content:center;flex-wrap:wrap;margin-top:14px;">
        <button id="convPrevBtn" class="conv-btn secondary">&larr; Prev</button>
        <button id="convNextBtn" class="conv-btn secondary">Next &rarr;</button>
        <button id="convPlayBtn" class="conv-btn primary">&#9654; Play</button>
        <button id="convReplayBtn" class="conv-btn secondary">Replay</button>

        <div class="mini-field" style="min-width:150px;">
          <label for="convPresetSelect">Input preset</label>
          <select id="convPresetSelect">
            <option value="original">Original</option>
            <option value="highcontrast" selected>High-contrast Edge</option>
            <option value="plus">Plus Sign</option>
          </select>
        </div>

        <div class="mini-field" style="min-width:118px;">
          <label for="convStrideSelect">Stride</label>
          <select id="convStrideSelect">
            <option value="1" selected>1</option>
            <option value="2">2</option>
          </select>
        </div>

        <div class="mini-field" style="min-width:190px;">
          <label for="convStepSlider">Step</label>
          <input id="convStepSlider" type="range" min="0" max="0" step="1" value="0">
          <div id="convStepLabel" class="mini-hint">1 / 1</div>
        </div>

        <div class="mini-field" style="min-width:210px;">
          <label for="convFilterSelect">Filter</label>
          <select id="convFilterSelect">
            <option value="edge" selected>Vertical Edge (Sobel-like)</option>
            <option value="sharpen">Sharpen</option>
            <option value="blur">Box Blur</option>
          </select>
        </div>

        <div class="mini-field" style="min-width:320px;">
          <label for="convTimeSlider">Timeline</label>
          <input id="convTimeSlider" type="range" min="0" max="15.0" step="0.01" value="0">
          <div id="convTimeLabel" class="mini-hint">0.00 s</div>
        </div>
      </div>

      <div id="convStepMarkers" style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-top:12px;"></div>
    </div>

    <div style="display:grid;grid-template-columns:1fr;gap:14px;margin-top:16px;">
      <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:18px;padding:16px 18px;">
        <div style="font-size:16px;font-weight:700;color:#1e3a8a;margin-bottom:10px;">Live Calculation (Element-wise Multiply & Sum)</div>
        <div id="convFormulaMain" style="font-size:22px;color:#111827;line-height:1.8;overflow-x:auto;min-height:100px;"></div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
        <div style="background:#f5faff;border:1px solid #c7d2fe;border-radius:18px;padding:16px 18px;">
          <div style="font-size:16px;font-weight:700;color:#3730a3;margin-bottom:10px;">Filter Characteristics</div>
          <div id="convFilterExplain" style="font-size:16px;line-height:1.75;color:#475569;"></div>
        </div>

        <div style="background:#f8fbff;border:1px solid #dbeafe;border-radius:18px;padding:16px 18px;">
          <div style="font-size:16px;font-weight:700;color:#1e3a8a;margin-bottom:10px;">Current Step</div>
          <div id="convMomentTitle" style="font-size:24px;font-weight:700;color:#111827;margin-bottom:8px;"></div>
          <div id="convMomentDesc" style="font-size:16px;line-height:1.6;color:#475569;"></div>
        </div>
      </div>
    </div>
  </div>
</div>

<script>
(function() {
  if (!window.__mathjax_loaded__) {
    const mj = document.createElement("script");
    mj.src = "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js";
    mj.async = true;
    document.head.appendChild(mj);
    window.__mathjax_loaded__ = true;
  }

  const canvas = document.getElementById("convCanvas");
  const ctx = canvas.getContext("2d");

  const playBtn = document.getElementById("convPlayBtn");
  const replayBtn = document.getElementById("convReplayBtn");
  const prevBtn = document.getElementById("convPrevBtn");
  const nextBtn = document.getElementById("convNextBtn");
  const filterSelect = document.getElementById("convFilterSelect");
  const presetSelect = document.getElementById("convPresetSelect");
  const strideSelect = document.getElementById("convStrideSelect");
  const stepSlider = document.getElementById("convStepSlider");
  const stepLabel = document.getElementById("convStepLabel");
  const timeSlider = document.getElementById("convTimeSlider");
  const timeLabel = document.getElementById("convTimeLabel");
  const stepMarkersWrap = document.getElementById("convStepMarkers");

  const formulaMain = document.getElementById("convFormulaMain");
  const filterExplain = document.getElementById("convFilterExplain");
  const momentTitle = document.getElementById("convMomentTitle");
  const momentDesc = document.getElementById("convMomentDesc");

  const W = canvas.width;
  const H = canvas.height;

  const CONFIG = {
    fSize: 3,
    stride: 1,
    cellSize: 50,
    gap: 4
  };

  const PRESETS = {
    original: {
      name: "Original",
      input: [
        [1, 1, 1, 0, 0],
        [0, 1, 1, 1, 0],
        [0, 0, 1, 1, 1],
        [0, 0, 1, 1, 0],
        [0, 1, 1, 0, 0]
      ]
    },
    highcontrast: {
      name: "High-contrast Edge",
      input: [
        [0, 0, 0, 0, 5],
        [0, 0, 0, 0, 5],
        [0, 0, 0, 0, 5],
        [0, 0, 0, 0, 5],
        [0, 0, 0, 0, 5]
      ]
    },
    plus: {
      name: "Plus Sign",
      input: [
        [0, 0, 1, 0, 0],
        [0, 0, 1, 0, 0],
        [1, 1, 1, 1, 1],
        [0, 0, 1, 0, 0],
        [0, 0, 1, 0, 0]
      ]
    }
  };

  const DATA = {
    input: PRESETS.highcontrast.input,
    filters: {
      edge: {
        name: "Vertical Edge Detection",
        desc: "This kernel is sensitive to horizontal changes in pixel intensity. It subtracts the right pixels from the left pixels to highlight vertical edges.",
        matrix: [
          [1, 0, -1],
          [1, 0, -1],
          [1, 0, -1]
        ]
      },
      sharpen: {
        name: "Sharpen",
        desc: "A strong center weight with negative surrounding weights. It enhances the difference between the center pixel and its neighbors, sharpening the image.",
        matrix: [
          [ 0, -1,  0],
          [-1,  5, -1],
          [ 0, -1,  0]
        ]
      },
      blur: {
        name: "Box Blur",
        desc: "All weights are equal. It computes the local average of the surrounding region, resulting in a smoothed or blurred output.",
        matrix: [
          [0.11, 0.11, 0.11],
          [0.11, 0.11, 0.11],
          [0.11, 0.11, 0.11]
        ]
      }
    }
  };

  let currentFilterKey = "edge";
  let currentPresetKey = "highcontrast";
  let outputMatrix = [];
  let positions = [];
  let STEP_MARKERS = [{ t:0, label:"Setup" }];
  let STEP_TIMES = [0];
  let TOTAL_DURATION = 15.0;

  function getInRows() { return DATA.input.length; }
  function getInCols() { return DATA.input[0].length; }
  function getOutRows() { return Math.floor((getInRows() - CONFIG.fSize) / CONFIG.stride) + 1; }
  function getOutCols() { return Math.floor((getInCols() - CONFIG.fSize) / CONFIG.stride) + 1; }

  function computeOutput() {
    const f = DATA.filters[currentFilterKey].matrix;
    const inp = DATA.input;
    const outRows = getOutRows();
    const outCols = getOutCols();
    outputMatrix = Array(outRows).fill().map(() => Array(outCols).fill(0));

    for (let r = 0; r < outRows; r++) {
      for (let c = 0; c < outCols; c++) {
        let sum = 0;
        const startR = r * CONFIG.stride;
        const startC = c * CONFIG.stride;
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            sum += inp[startR + i][startC + j] * f[i][j];
          }
        }
        outputMatrix[r][c] = sum;
      }
    }
  }

  const COLORS = {
    bgTop: "#121735", bgBottom: "#171c38",
    inputStroke: "#3b82f6", inputFill: "#1e3a8a",
    filterStroke: "#f59e0b", filterFill: "rgba(245, 158, 11, 0.2)",
    outputStroke: "#8b5cf6", outputFill: "#4c1d95",
    highlight: "#fef08a",
    text: "#f8fafc", subtext: "#94a3b8"
  };

  const POS = {
    inX: 100, inY: 150,
    outX: 850, outY: 200,
  };

  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function easeInOut(t) { return t < 0.5 ? 2*t*t : -1 + (4 - 2*t) * t; }

  function state0() {
    return {
      titleWrite: 0,
      filterX: 0, filterY: 0,
      multiplyPulse: 0, sumProgress: 0, writeProgress: 0,
      outputRevealed: Array(getOutRows() * getOutCols()).fill(0),
      curStepIndex: -1
    };
  }

  class Animator {
    constructor() {
      this.clips = []; this.t0 = null; this.elapsed = 0; this.playing = false; this.raf = null;
    }
    clear() { this.clips = []; this.t0 = null; }
    add(start, duration, updateFn, easeFn=easeInOut) {
      this.clips.push({ start, duration, updateFn, easeFn });
    }
    buildState(timeSec) {
      const s = state0();
      this.clips.forEach(clip => {
        if (timeSec < clip.start) return;
        const raw = clamp((timeSec - clip.start) / clip.duration, 0, 1);
        clip.updateFn(clip.easeFn(raw), s);
      });
      return s;
    }
    applyAt(timeSec) {
      this.elapsed = timeSec;
      const s = this.buildState(timeSec);
      render(s, timeSec);
      updateText(s, timeSec);
      syncControls();
      updateStepUI();
    }
    run(fromSec=null) {
      if (fromSec !== null) this.elapsed = fromSec;
      this.playing = true; this.t0 = null;
      const tick = (now) => {
        if (!this.playing) return;
        if (this.t0 === null) this.t0 = now - this.elapsed * 1000;
        this.elapsed = (now - this.t0) / 1000;
        if (this.elapsed >= TOTAL_DURATION) { this.elapsed = TOTAL_DURATION; this.playing = false; }
        this.applyAt(this.elapsed);
        if (this.playing) this.raf = requestAnimationFrame(tick);
      };
      this.raf = requestAnimationFrame(tick);
    }
    pause() { this.playing = false; if (this.raf) cancelAnimationFrame(this.raf); }
    replay() { this.pause(); this.applyAt(0); this.run(0); }
  }

  const animator = new Animator();

  function buildPositions() {
    positions = [];
    const outRows = getOutRows();
    const outCols = getOutCols();
    for (let r = 0; r < outRows; r++) {
      for (let c = 0; c < outCols; c++) {
        positions.push({
          outR: r,
          outC: c,
          inR: r * CONFIG.stride,
          inC: c * CONFIG.stride
        });
      }
    }
  }

  function rebuildTimeline() {
    computeOutput();
    buildPositions();
    animator.clear();

    STEP_MARKERS = [{ t: 0, label: "Setup" }];
    STEP_TIMES = [0];

    animator.add(0, 0.8, (p, s) => { s.titleWrite = p; });

    let tStart = 1.0;
    const stepDur = 1.4;

    for (let i = 0; i < positions.length; i++) {
      const cur = positions[i];
      STEP_MARKERS.push({ t: tStart, label: `Pos(${cur.outR},${cur.outC})` });
      STEP_TIMES.push(tStart);

      if (i > 0) {
        const prev = positions[i - 1];
        animator.add(tStart - 0.4, 0.4, (p, s) => {
          s.filterY = lerp(prev.inR, cur.inR, p);
          s.filterX = lerp(prev.inC, cur.inC, p);
        });
      }

      animator.add(tStart, 0.4, (p, s) => {
        s.multiplyPulse = Math.sin(p * Math.PI);
        s.filterY = cur.inR;
        s.filterX = cur.inC;
        s.curStepIndex = i;
      });

      animator.add(tStart + 0.4, 0.5, (p, s) => {
        s.sumProgress = p;
        s.filterY = cur.inR;
        s.filterX = cur.inC;
        s.curStepIndex = i;
      });

      animator.add(tStart + 0.9, 0.3, (p, s) => {
        s.outputRevealed[i] = p;
        s.writeProgress = p;
        s.filterY = cur.inR;
        s.filterX = cur.inC;
        s.curStepIndex = i;
      });

      tStart += stepDur;
    }

    TOTAL_DURATION = Math.max(3, tStart + 0.4);
    STEP_MARKERS.push({ t: TOTAL_DURATION, label: "End" });

    timeSlider.max = TOTAL_DURATION.toFixed(2);
    timeSlider.value = "0";
    stepSlider.max = Math.max(positions.length - 1, 0);
    stepSlider.value = "0";

    renderStepMarkers();
    animator.applyAt(0);
  }

  function text(txt, x, y, size=20, color=COLORS.text, align="center", weight="500") {
    ctx.save();
    ctx.fillStyle = color;
    ctx.font = `${weight} ${size}px Arial, sans-serif`;
    ctx.textAlign = align; ctx.textBaseline = "middle";
    ctx.fillText(txt, x, y);
    ctx.restore();
  }

  function drawGrid(x, y, rows, cols, size, gap, stroke, fill) {
    ctx.save();
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 2;
    ctx.fillStyle = fill;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        ctx.beginPath();
        ctx.roundRect(x + c * (size + gap), y + r * (size + gap), size, size, 6);
        ctx.fill();
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  function render(s, t) {
    ctx.clearRect(0, 0, W, H);
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, COLORS.bgTop);
    g.addColorStop(1, COLORS.bgBottom);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    const inRows = getInRows();
    const inCols = getInCols();
    const outRows = getOutRows();
    const outCols = getOutCols();
    const unit = CONFIG.cellSize + CONFIG.gap;

    text(`Input Matrix (${inRows}x${inCols})`, POS.inX + (inCols * unit - CONFIG.gap) / 2, POS.inY - 30, 20, COLORS.text, "center", "700");
    text(`Feature Map (${outRows}x${outCols})`, POS.outX + (outCols * unit - CONFIG.gap) / 2, POS.outY - 30, 20, COLORS.text, "center", "700");
    text(`Stride = ${CONFIG.stride}`, POS.outX + (outCols * unit - CONFIG.gap) / 2, POS.outY - 58, 14, COLORS.subtext, "center", "600");

    drawGrid(POS.inX, POS.inY, inRows, inCols, CONFIG.cellSize, CONFIG.gap, COLORS.inputStroke, COLORS.inputFill);
    for (let r = 0; r < inRows; r++) {
      for (let c = 0; c < inCols; c++) {
        text(DATA.input[r][c], POS.inX + c * unit + 25, POS.inY + r * unit + 25, 20);
      }
    }

    drawGrid(POS.outX, POS.outY, outRows, outCols, CONFIG.cellSize, CONFIG.gap, COLORS.outputStroke, "#1a1625");

    const fX = POS.inX + s.filterX * unit;
    const fY = POS.inY + s.filterY * unit;
    const fMat = DATA.filters[currentFilterKey].matrix;

    ctx.save();
    ctx.strokeStyle = COLORS.filterStroke;
    ctx.lineWidth = 4;
    ctx.fillStyle = COLORS.filterFill;
    if (s.multiplyPulse > 0) {
      ctx.shadowColor = COLORS.filterStroke;
      ctx.shadowBlur = 15 * s.multiplyPulse;
    }
    ctx.beginPath();
    ctx.roundRect(fX - 4, fY - 4, 3 * unit - CONFIG.gap, 3 * unit - CONFIG.gap, 10);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        let val = fMat[r][c];
        if (!Number.isInteger(val)) val = Number(val).toFixed(2);
        text(val, fX + c * unit + 40, fY + r * unit + 40, 13, COLORS.filterStroke, "right", "700");
      }
    }

    let curPos = null;
    if (s.curStepIndex >= 0 && s.curStepIndex < positions.length) curPos = positions[s.curStepIndex];

    if (curPos) {
      const outCenter = {
        x: POS.outX + curPos.outC * unit + 25,
        y: POS.outY + curPos.outR * unit + 25
      };

      if (s.sumProgress > 0 && s.sumProgress < 1 && t < TOTAL_DURATION - 1) {
        ctx.save();
        ctx.strokeStyle = "rgba(245, 158, 11, " + Math.sin(s.sumProgress * Math.PI) + ")";
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let r = 0; r < 3; r++) {
          for (let c = 0; c < 3; c++) {
            const cellCenter = { x: fX + c * unit + 25, y: fY + r * unit + 25 };
            ctx.moveTo(cellCenter.x, cellCenter.y);
            const px = lerp(cellCenter.x, outCenter.x, s.sumProgress);
            const py = lerp(cellCenter.y, outCenter.y, s.sumProgress);
            ctx.lineTo(px, py);
          }
        }
        ctx.stroke();
        ctx.restore();

        let curSum = outputMatrix[curPos.outR][curPos.outC];
        if (!Number.isInteger(curSum)) curSum = Number(curSum).toFixed(2);
        const fxMid = lerp(fX + 1.5 * unit, outCenter.x, s.sumProgress);
        const fyMid = lerp(fY + 1.5 * unit, outCenter.y, s.sumProgress);
        text(curSum, fxMid, fyMid - 20, 24, COLORS.highlight, "center", "700");
      }
    }

    for (let i = 0; i < outputMatrix.flat().length; i++) {
      if (s.outputRevealed[i] > 0.01) {
        const r = Math.floor(i / outCols);
        const c = i % outCols;
        let val = outputMatrix[r][c];
        if (!Number.isInteger(val)) val = Number(val).toFixed(2);

        ctx.save();
        ctx.fillStyle = `rgba(139, 92, 246, ${s.outputRevealed[i]})`;
        ctx.beginPath();
        ctx.roundRect(POS.outX + c * unit, POS.outY + r * unit, CONFIG.cellSize, CONFIG.cellSize, 6);
        ctx.fill();
        ctx.restore();

        text(val, POS.outX + c * unit + 25, POS.outY + r * unit + 25, 20, `rgba(255,255,255,${s.outputRevealed[i]})`, "center", "700");
      }
    }
  }

  let lastLatex = "";
  function updateText(s, t) {
    const fMeta = DATA.filters[currentFilterKey];
    filterExplain.innerHTML = fMeta.desc;

    let title = "Setup Ready";
    let desc = "Select a filter, stride, or input preset. Click Play to watch the sliding window compute each output position.";
    let latex = String.raw`\text{Awaiting animation start...}`;

    if (s.curStepIndex >= 0 && s.curStepIndex < positions.length) {
      const pos = positions[s.curStepIndex];
      title = `Computing Feature Map at y(${pos.outR}, ${pos.outC})`;
      desc = `The 3×3 filter is centered on the highlighted input patch. With stride ${CONFIG.stride}, this patch starts at input coordinate (${pos.inR}, ${pos.inC}).`;

      const fMat = fMeta.matrix;
      const inp = DATA.input;
      let terms = [];

      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          let w = fMat[i][j];
          let x = inp[pos.inR + i][pos.inC + j];
          let wStr = Number.isInteger(w) ? w : Number(w).toFixed(2);
          terms.push(`(${x} \\times ${wStr})`);
        }
      }

      let sumVal = outputMatrix[pos.outR][pos.outC];
      let sumStr = Number.isInteger(sumVal) ? sumVal : Number(sumVal).toFixed(2);

      latex = String.raw`
        \begin{aligned}
        y_{${pos.outR},${pos.outC}} &= ${terms.slice(0,3).join(' + ')} \\
        &\quad + ${terms.slice(3,6).join(' + ')} \\
        &\quad + ${terms.slice(6,9).join(' + ')} \\
        &= \mathbf{${sumStr}}
        \end{aligned}
      `;
    } else if (t >= TOTAL_DURATION - 0.2) {
      title = "Convolution Complete";
      desc = `The full feature map has been calculated with stride ${CONFIG.stride}. Output size is ${getOutRows()}×${getOutCols()}.`;
      latex = String.raw`\text{Feature Map Fully Computed!}`;
    }

    momentTitle.innerText = title;
    momentDesc.innerText = desc;

    if (latex !== lastLatex) {
      formulaMain.innerHTML = `\\[ ${latex} \\]`;
      lastLatex = latex;
      if (window.MathJax && window.MathJax.typesetPromise) {
        window.MathJax.typesetPromise([formulaMain]).catch(() => {});
      }
    }
  }

  function getActiveStepIndex() {
    let activeIdx = 0;
    for (let i = 0; i < STEP_MARKERS.length; i++) {
      if (animator.elapsed >= STEP_MARKERS[i].t) activeIdx = i;
    }
    return activeIdx;
  }

  function getActivePositionIndex() {
    let idx = 0;
    for (let i = 0; i < positions.length; i++) {
      if (animator.elapsed >= STEP_TIMES[i + 1]) idx = i;
    }
    return idx;
  }

  function syncControls() {
    timeSlider.value = animator.elapsed.toFixed(2);
    timeLabel.textContent = animator.elapsed.toFixed(2) + " s";
    playBtn.textContent = animator.playing ? "⏸ Pause" : "▶ Play";

    const posIndex = positions.length ? getActivePositionIndex() : 0;
    stepSlider.value = String(posIndex);
    stepLabel.textContent = positions.length ? `${posIndex + 1} / ${positions.length}` : "0 / 0";
  }

  function updateStepUI() {
    const buttons = stepMarkersWrap.querySelectorAll("button");
    const activeIdx = getActiveStepIndex();
    buttons.forEach((btn, i) => {
      btn.className = i === activeIdx ? "step-chip active" : "step-chip";
    });
  }

  function renderStepMarkers() {
    stepMarkersWrap.innerHTML = "";
    STEP_MARKERS.forEach((step) => {
      const btn = document.createElement("button");
      btn.textContent = step.label;
      btn.className = "step-chip";
      btn.onclick = () => { animator.pause(); animator.applyAt(step.t); };
      stepMarkersWrap.appendChild(btn);
    });
  }

  function jumpToPosition(index) {
    if (!positions.length) return;
    const clamped = Math.max(0, Math.min(index, positions.length - 1));
    animator.pause();
    animator.applyAt(STEP_TIMES[clamped + 1]);
  }

  playBtn.onclick = () => {
    animator.playing ? animator.pause() : animator.run(animator.elapsed);
    syncControls();
  };

  replayBtn.onclick = () => { animator.replay(); };

  prevBtn.onclick = () => {
    const activeIdx = getActivePositionIndex();
    jumpToPosition(activeIdx - 1);
  };

  nextBtn.onclick = () => {
    const activeIdx = getActivePositionIndex();
    jumpToPosition(activeIdx + 1);
  };

  timeSlider.oninput = (e) => {
    animator.pause();
    animator.applyAt(parseFloat(e.target.value));
  };

  stepSlider.oninput = (e) => {
    jumpToPosition(parseInt(e.target.value, 10));
  };

  filterSelect.onchange = (e) => {
    currentFilterKey = e.target.value;
    rebuildTimeline();
  };

  presetSelect.onchange = (e) => {
    currentPresetKey = e.target.value;
    DATA.input = PRESETS[currentPresetKey].input;
    rebuildTimeline();
  };

  strideSelect.onchange = (e) => {
    CONFIG.stride = parseInt(e.target.value, 10);
    rebuildTimeline();
  };

  rebuildTimeline();
})();
</script>
"""

display(HTML(html_code))
