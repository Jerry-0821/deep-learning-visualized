"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  formulaCategories,
  formulaHubEntryAliasesById,
  formulaHubEntries,
  formulaHubEntriesById,
  getFormulaRelationGroups,
  searchFormulaEntries,
  type FormulaCategory,
  type FormulaEntryType,
  type FormulaHubEntry,
} from "@/data/formulaHub";

declare global {
  interface Window {
    MathJax?: {
      typesetClear?: () => void;
      typesetPromise?: () => Promise<void>;
    };
  }
}

const primaryFilters = [
  "All",
  "Backpropagation",
  "Optimization",
  "CNN",
  "RNN / LSTM",
  "Transformer",
  "Shapes & Dimensions",
] as const;
const categoryOptions = ["All", ...formulaCategories.map((category) => category.id)] as const;
const sortOptions = [
  { value: "relevance", label: "Relevance" },
  { value: "name", label: "Name" },
  { value: "category", label: "Category" },
  { value: "type", label: "Type" },
  { value: "use", label: "Use" },
] as const;
const pageSize = 10;
const savedStorageKey = "formula-hub-saved-ids";

const typeLabels: Record<FormulaEntryType, string> = {
  derivative: "Derivative",
  formula: "Formula",
  loss: "Loss",
  metric: "Metric",
  pipeline: "Pipeline",
  shape: "Shape",
  statement: "Statement",
  "update-rule": "Update Rule",
};

const typeFilterOptions = [
  { value: "All", label: "All" },
  ...Array.from(new Set(formulaHubEntries.map((entry) => entry.type))).map((type) => ({
    value: type,
    label: typeLabels[type],
  })),
] as const;

const useFilterOptions = [
  "All",
  ...Array.from(new Set(formulaHubEntries.map((entry) => entry.useCase))).sort((a, b) => a.localeCompare(b)),
] as const;

const shapeFilterOptions = [
  { value: "All", label: "All" },
  { value: "scalar", label: "Scalar" },
  { value: "matrix", label: "Matrix / Tensor" },
  { value: "same-shape", label: "Same Shape" },
  { value: "parameter", label: "Parameter Shape" },
  { value: "concept", label: "Concept / Statement" },
] as const;

const symbolFilterOptions = [
  { value: "All", label: "All" },
  { value: "dW", label: "dW" },
  { value: "dZ", label: "dZ" },
  { value: "W", label: "W" },
  { value: "A", label: "A" },
  { value: "b", label: "b" },
  { value: "m", label: "m" },
  { value: "theta", label: "theta" },
  { value: "QKV", label: "Q / K / V" },
  { value: "gamma-beta", label: "gamma / beta" },
  { value: "softmax", label: "softmax" },
  { value: "TP", label: "TP / FP / FN" },
  { value: "IoU", label: "IoU" },
] as const;

type FormulaSort = (typeof sortOptions)[number]["value"];
type FormulaCategoryFilter = FormulaCategory | "All";
type FormulaTypeFilter = (typeof typeFilterOptions)[number]["value"];
type FormulaUseFilter = (typeof useFilterOptions)[number];
type FormulaShapeFilter = (typeof shapeFilterOptions)[number]["value"];
type FormulaSymbolFilter = (typeof symbolFilterOptions)[number]["value"];

function isFormulaCategory(value: string | null): value is FormulaCategoryFilter {
  return Boolean(value && categoryOptions.includes(value as FormulaCategoryFilter));
}

function isFormulaSort(value: string | null): value is FormulaSort {
  return Boolean(value && sortOptions.some((option) => option.value === value));
}

function isTypeFilter(value: string | null): value is FormulaTypeFilter {
  return Boolean(value && typeFilterOptions.some((option) => option.value === value));
}

function isUseFilter(value: string | null): value is FormulaUseFilter {
  return Boolean(value && useFilterOptions.includes(value as FormulaUseFilter));
}

function isShapeFilter(value: string | null): value is FormulaShapeFilter {
  return Boolean(value && shapeFilterOptions.some((option) => option.value === value));
}

function isSymbolFilter(value: string | null): value is FormulaSymbolFilter {
  return Boolean(value && symbolFilterOptions.some((option) => option.value === value));
}

function normalizeFilterText(value: string) {
  return value
    .toLowerCase()
    .replace(/\\operatorname|\\mathrm|\\mathbb|\\left|\\right|\\frac|\\sum|\\sqrt/g, " ")
    .replace(/[{}()[\],_^\\]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function FormulaMath({ latex, display = false }: { latex: string; display?: boolean }) {
  return <span>{display ? `\\[${latex}\\]` : `\\(${latex}\\)`}</span>;
}

function hasMathSyntax(value: string) {
  return /[\\^_{}]/.test(value);
}

function splitShapeValue(value: string) {
  const [label, ...details] = value.split(":");
  const detail = details.join(":").trim();
  return {
    label: label.trim(),
    detail,
  };
}

function FormulaShapeDimension({ value }: { value: string }) {
  const { detail, label } = splitShapeValue(value);
  const compactValue = detail || label;
  return hasMathSyntax(compactValue) ? <FormulaMath latex={compactValue} /> : <>{compactValue}</>;
}

function FormulaShapeBox({ value, result = false }: { value: string; result?: boolean }) {
  const { detail, label } = splitShapeValue(value);
  return (
    <div className={`shape-box ${result ? "result" : ""}`}>
      {hasMathSyntax(label) ? <FormulaMath latex={label} /> : label}
      {detail ? (
        <div className="dim">{hasMathSyntax(detail) ? <FormulaMath latex={detail} /> : detail}</div>
      ) : null}
    </div>
  );
}

function categoryAccent(category: FormulaCategory) {
  if (category === "Backpropagation") return "bp";
  if (category === "Optimization" || category === "Regularization" || category === "Practice") return "opt";
  if (category === "CNN" || category === "Evaluation") return "cnn";
  return "tr";
}

function categoryLetter(category: FormulaCategory) {
  if (category === "Backpropagation") return "B";
  if (category === "Optimization") return "O";
  if (category === "Regularization") return "R";
  if (category === "CNN") return "C";
  if (category === "RNN / LSTM") return "R";
  if (category === "Transformer") return "T";
  if (category === "Evaluation") return "E";
  if (category === "Practice") return "P";
  if (category === "Shapes & Dimensions") return "S";
  return "F";
}

function formulaIconLabel(category: FormulaCategory) {
  if (category === "Backpropagation") return "BP";
  if (category === "Optimization") return "OPT";
  if (category === "CNN") return "CNN";
  if (category === "Transformer") return "TR";
  if (category === "RNN / LSTM") return "RL";
  if (category === "Shapes & Dimensions") return "SH";
  if (category === "Evaluation") return "EV";
  if (category === "Regularization") return "RG";
  if (category === "Practice") return "PR";
  return "F";
}

function BookmarkIcon({ saved }: { saved: boolean }) {
  return saved ? (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M7 4.8A2.8 2.8 0 0 1 9.8 2h4.4A2.8 2.8 0 0 1 17 4.8v16l-5-3.15L7 20.8v-16Z" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M7 4.8A2.8 2.8 0 0 1 9.8 2h4.4A2.8 2.8 0 0 1 17 4.8v16l-5-3.15L7 20.8v-16Z" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function useNeuralCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    const context = canvas?.getContext("2d");
    if (!canvas || !parent || !context) return;
    const canvasElement = canvas;
    const parentElement = parent;
    const ctx = context;

    const purple = [108, 92, 231] as const;
    const teal = [11, 168, 136] as const;
    const nodeCount = 28;
    const connectionDistance = 110;
    const nodeSpeed = 0.28;
    const nodeRadius = 2.8;
    let width = 0;
    let height = 0;
    let frame = 0;
    let resizeTimer = 0;

    type Node = {
      color: readonly [number, number, number];
      phase: number;
      r: number;
      vx: number;
      vy: number;
      x: number;
      y: number;
    };

    let nodes: Node[] = [];
    const rgb = (color: readonly [number, number, number], alpha: number) =>
      `rgba(${color[0]},${color[1]},${color[2]},${alpha})`;

    function initCanvas() {
      const rect = parentElement.getBoundingClientRect();
      const ratio = window.devicePixelRatio || 1;
      width = rect.width;
      height = rect.height;
      canvasElement.width = width * ratio;
      canvasElement.height = height * ratio;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    function makeNode(): Node {
      const color = Math.random() > 0.35 ? purple : teal;
      return {
        color,
        phase: Math.random() * Math.PI * 2,
        r: nodeRadius * (0.7 + Math.random() * 0.8),
        vx: (Math.random() - 0.5) * nodeSpeed,
        vy: (Math.random() - 0.5) * nodeSpeed,
        x: Math.random() * width,
        y: Math.random() * height,
      };
    }

    function step() {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < nodes.length; i += 1) {
        for (let j = i + 1; j < nodes.length; j += 1) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            const alpha = (1 - distance / connectionDistance) * 0.22;
            const blended = a.color === b.color ? a.color : ([108, 120, 231] as const);
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = rgb(blended, alpha);
            ctx.lineWidth = 0.9;
            ctx.stroke();
          }
        }
      }

      const time = performance.now() * 0.001;
      nodes.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        const pulse = node.r * (1 + 0.3 * Math.sin(time * 2.5 + node.phase));
        const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, pulse * 3.5);
        gradient.addColorStop(0, rgb(node.color, 0.28));
        gradient.addColorStop(1, rgb(node.color, 0));
        ctx.beginPath();
        ctx.arc(node.x, node.y, pulse * 3.5, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(node.x, node.y, pulse, 0, Math.PI * 2);
        ctx.fillStyle = rgb(node.color, 0.75);
        ctx.fill();
      });

      frame = requestAnimationFrame(step);
    }

    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        initCanvas();
        nodes = Array.from({ length: nodeCount }, makeNode);
      }, 150);
    };

    initCanvas();
    nodes = Array.from({ length: nodeCount }, makeNode);
    frame = requestAnimationFrame(step);
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return canvasRef;
}

function FormulaResultCard({
  entry,
  saved,
  selected,
  onSave,
  onSelect,
}: {
  entry: FormulaHubEntry;
  saved: boolean;
  selected: boolean;
  onSave: () => void;
  onSelect: () => void;
}) {
  const accent = categoryAccent(entry.category);
  const expressionStyle = entry.latex.length > 82 ? { fontSize: "15px" } : undefined;
  const stepCount = entry.steps?.length ?? 1;

  return (
    <article className={`fcard ${selected ? "active" : ""}`} onClick={onSelect}>
      <div className={`fcard-icon ${accent}`}>{formulaIconLabel(entry.category)}</div>
      <div className="fcard-body">
        <div className="fcard-title">
          <span className="fcard-name">{entry.title}</span>
          <span className={`ftag ${accent}`}>{entry.category}</span>
          {entry.nodeLabel ? <span className="node-tag">{entry.nodeLabel}</span> : null}
        </div>
        <div className="fcard-formula" style={expressionStyle}>
          <FormulaMath latex={entry.latex} />
        </div>
      </div>
      <div className="fcard-meta">
        <div className="fmeta-row">
          <span className="fmeta-label">Flow</span>
          <span>{stepCount} step{stepCount === 1 ? "" : "s"}</span>
        </div>
        <div className="fmeta-row">
          <span className="fmeta-label">Use</span>
          <span>{entry.useCase}</span>
        </div>
        <div className="fmeta-row">
          <span className="fmeta-label">Shape</span>
          <span>{entry.shape?.output ? <FormulaShapeDimension value={entry.shape.output} /> : "Concept"}</span>
        </div>
        <div className="fmeta-row">
          <span className="fmeta-label">Symbols</span>
          <span>
            <FormulaMath latex={entry.symbols.map((symbol) => symbol.symbol).slice(0, 4).join(",\\,")} />
          </span>
        </div>
      </div>
      <button
        type="button"
        className={`bm-btn ${saved ? "saved" : ""}`}
        aria-label={saved ? `Unsave ${entry.title}` : `Save ${entry.title}`}
        aria-pressed={saved}
        onClick={(event) => {
          event.stopPropagation();
          onSave();
        }}
      >
        <BookmarkIcon saved={saved} />
      </button>
    </article>
  );
}

function entryShapeText(entry: FormulaHubEntry) {
  return [
    entry.shape?.output,
    entry.shape?.explanation,
    ...(entry.shape?.input ?? []),
    ...entry.symbols.map((symbol) => symbol.shape),
    ...(entry.steps ?? []).flatMap((step) => [
      step.shape?.output,
      step.shape?.explanation,
      ...(step.shape?.input ?? []),
      ...(step.symbols ?? []).map((symbol) => symbol.shape),
    ]),
  ]
    .filter(Boolean)
    .join(" ");
}

function entryMatchesShape(entry: FormulaHubEntry, filter: FormulaShapeFilter) {
  if (filter === "All") return true;

  const text = normalizeFilterText(entryShapeText(entry));

  if (filter === "scalar") {
    return /\bscalar\b|\bcount\b|\bprobability\b/.test(text);
  }

  if (filter === "matrix") {
    return text.includes("times") || text.includes("matrix") || text.includes("tensor") || text.includes("vector");
  }

  if (filter === "same-shape") {
    return text.includes("same shape");
  }

  if (filter === "parameter") {
    return text.includes("parameter shape") || text.includes("theta");
  }

  return text.includes("concept") || entry.type === "statement" || entry.type === "pipeline";
}

function entryMatchesSymbol(entry: FormulaHubEntry, filter: FormulaSymbolFilter) {
  if (filter === "All") return true;

  const text = normalizeFilterText(
    [
      entry.title,
      entry.latex,
      entry.plainTextFormula,
      ...entry.aliases,
      ...entry.symbols.flatMap((symbol) => [symbol.symbol, symbol.meaning, symbol.shape, ...(symbol.aliases ?? [])]),
      ...(entry.steps ?? []).flatMap((step) => [
        step.title,
        step.latex,
        step.plainTextFormula,
        step.description,
        ...(step.symbols ?? []).flatMap((symbol) => [symbol.symbol, symbol.meaning, symbol.shape, ...(symbol.aliases ?? [])]),
      ]),
    ]
      .filter(Boolean)
      .join(" "),
  );

  if (filter === "QKV") return /\bq\b/.test(text) && /\bk\b/.test(text) && /\bv\b/.test(text);
  if (filter === "gamma-beta") return text.includes("gamma") || text.includes("beta");
  if (filter === "TP") return /\btp\b|\bfp\b|\bfn\b|\btn\b/.test(text);
  if (filter === "theta") return text.includes("theta");

  return text.includes(normalizeFilterText(filter));
}

function applyFormulaFilters({
  entries,
  savedIds,
  savedOnly,
  shapeFilter,
  symbolFilter,
  typeFilter,
  useFilter,
}: {
  entries: FormulaHubEntry[];
  savedIds: Set<string>;
  savedOnly: boolean;
  shapeFilter: FormulaShapeFilter;
  symbolFilter: FormulaSymbolFilter;
  typeFilter: FormulaTypeFilter;
  useFilter: FormulaUseFilter;
}) {
  return entries.filter((entry) => {
    if (savedOnly && !savedIds.has(entry.id)) return false;
    if (typeFilter !== "All" && entry.type !== typeFilter) return false;
    if (useFilter !== "All" && entry.useCase !== useFilter) return false;
    if (!entryMatchesShape(entry, shapeFilter)) return false;
    if (!entryMatchesSymbol(entry, symbolFilter)) return false;
    return true;
  });
}

function sortFormulaEntries(entries: FormulaHubEntry[], sort: FormulaSort) {
  const next = [...entries];

  if (sort === "name") return next.sort((a, b) => a.title.localeCompare(b.title));
  if (sort === "category") return next.sort((a, b) => a.category.localeCompare(b.category) || a.title.localeCompare(b.title));
  if (sort === "type") return next.sort((a, b) => typeLabels[a.type].localeCompare(typeLabels[b.type]) || a.title.localeCompare(b.title));
  if (sort === "use") return next.sort((a, b) => a.useCase.localeCompare(b.useCase) || a.title.localeCompare(b.title));

  return entries;
}

function FormulaFilterSelect({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
}) {
  const selected = options.find((option) => option.value === value)?.label ?? "All";

  return (
    <label className="sfbtn">
      <span>{label}: </span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <span className="sfbtn-value">{selected}</span>
      <ChevronIcon />
    </label>
  );
}

function FormulaDrawerContent({
  entry,
  onSelectRelated,
}: {
  entry: FormulaHubEntry;
  onSelectRelated: (id: string) => void;
}) {
  const relatedEntries = entry.relatedFormulaIds
    .map((id) => formulaHubEntriesById[id])
    .filter(Boolean)
    .slice(0, 3);
  const relationGroups = getFormulaRelationGroups(entry);
  const steps = entry.steps ?? [];

  return (
    <>
      {entry.nodeLabel ? <div className="drawer-node">{entry.nodeLabel}</div> : null}
      <h2 className="drawer-title">{entry.title}</h2>
      <div className="drawer-formula-wrap">
        <FormulaMath latex={entry.latex} display />
      </div>
      <p className="drawer-desc">{entry.description}</p>

      {steps.length > 1 ? (
        <>
          <div className="dsec">Formula Flow</div>
          <div className="formula-steps">
            {steps.map((step, index) => (
              <div className="formula-step" key={`${entry.id}-${step.id}`}>
                <div className="formula-step-head">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{step.title}</strong>
                </div>
                <div className="formula-step-math">
                  <FormulaMath latex={step.latex} display />
                </div>
                <p>{step.description}</p>
              </div>
            ))}
          </div>
        </>
      ) : null}

      {entry.shape ? (
        <>
          <div className="dsec">
            Shape Check <span className="dsec-check">ok</span>
          </div>
          <div className="shape-flow">
            {(entry.shape.input ?? []).slice(0, 2).map((item, index) => (
              <span className="shape-fragment" key={`${entry.id}-shape-${item}`}>
                {index > 0 ? <span className="shape-op">x</span> : null}
                <FormulaShapeBox value={item} />
              </span>
            ))}
            {entry.shape.output ? (
              <>
                <span className="shape-arr">-&gt;</span>
                <FormulaShapeBox value={entry.shape.output} result />
              </>
            ) : null}
          </div>
        </>
      ) : null}

      <div className="dsec">Symbols</div>
      <div className="sym-table">
        {entry.symbols.map((symbol) => (
          <div className="sym-row" key={`${entry.id}-${symbol.symbol}`}>
            <span className="sym-key">
              <FormulaMath latex={symbol.symbol} />
            </span>
            <span className="sym-val">
              {symbol.meaning}
              {symbol.shape ? (
                <>
                  {" "}
                  <FormulaMath latex={symbol.shape} />
                </>
              ) : null}
            </span>
          </div>
        ))}
      </div>

      {relationGroups.length > 0 ? (
        <>
          <div className="dsec">Connection Map</div>
          <div className="connection-map">
            {relationGroups.map((group) => (
              <div className="connection-group" key={`${entry.id}-${group.type}`}>
                <div className="connection-type">{group.label}</div>
                {group.relations.map((relation) => (
                  <button
                    className="connection-row"
                    key={`${entry.id}-${relation.type}-${relation.targetId}`}
                    type="button"
                    onClick={() => onSelectRelated(relation.targetId)}
                  >
                    <div>
                      <div className="connection-name">{relation.target.title}</div>
                      {relation.label ? <div className="connection-note">{relation.label}</div> : null}
                    </div>
                    <span className="rel-arrow">&gt;</span>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </>
      ) : relatedEntries.length > 0 ? (
        <>
          <div className="dsec">
            <div className="related-header">
              <span>Related Formulas</span>
              <span className="view-all-link">View all ({entry.relatedFormulaIds.length}) -&gt;</span>
            </div>
          </div>
          <div className="related">
            {relatedEntries.map((related) => (
              <button className="rel-row" key={related.id} type="button" onClick={() => onSelectRelated(related.id)}>
                <div>
                  <div className="rel-name">{related.title}</div>
                  <div className="rel-formula">
                    <FormulaMath latex={related.latex} />
                  </div>
                </div>
                <span className="rel-arrow">&gt;</span>
              </button>
            ))}
          </div>
        </>
      ) : null}

    </>
  );
}

function FormulaDrawer({
  entry,
  open,
  saved,
  modalOpen,
  onClose,
  onModalClose,
  onModalOpen,
  onSave,
  onSelectRelated,
}: {
  entry: FormulaHubEntry | null;
  open: boolean;
  saved: boolean;
  modalOpen: boolean;
  onClose: () => void;
  onModalClose: () => void;
  onModalOpen: () => void;
  onSave: () => void;
  onSelectRelated: (id: string) => void;
}) {
  if (!entry) return null;

  const accent = categoryAccent(entry.category);

  return (
    <>
      <div className={`drawer-overlay ${open ? "open" : ""}`} onClick={onClose} />
      <aside className={`drawer ${open ? "open" : ""}`} aria-label="Formula details">
        <div className="drawer-header">
          <span className={`drawer-tag ${accent}`}>{entry.category}</span>
          <div className="drawer-actions">
            <button className="drawer-expand-btn" type="button" onClick={onModalOpen} title="Expand to full view">
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
              </svg>
            </button>
            <button className={`drawer-btn star ${saved ? "saved" : ""}`} type="button" onClick={onSave}>
              <svg viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </button>
            <button className="drawer-btn" type="button" onClick={onClose} aria-label="Close formula details">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="drawer-body">
          <FormulaDrawerContent entry={entry} onSelectRelated={onSelectRelated} />
        </div>
      </aside>

      {modalOpen ? (
        <div className="modal-overlay open" onClick={onModalClose}>
          <div className="modal" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <span className={`drawer-tag ${accent}`}>{entry.category}</span>
              <button className="drawer-btn" type="button" onClick={onModalClose} aria-label="Close expanded formula">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <FormulaDrawerContent entry={entry} onSelectRelated={onSelectRelated} />
          </div>
        </div>
      ) : null}
    </>
  );
}

export function FormulaHubClient() {
  const canvasRef = useNeuralCanvas();
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [savedIds, setSavedIds] = useState<Set<string>>(() => new Set());
  const [savedLoaded, setSavedLoaded] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const query = searchParams.get("q") ?? "";
  const categoryParam = searchParams.get("category");
  const sortParam = searchParams.get("sort");
  const typeParam = searchParams.get("type");
  const useParam = searchParams.get("use");
  const shapeParam = searchParams.get("shape");
  const symbolParam = searchParams.get("symbol");
  const pageParam = Number(searchParams.get("page") ?? "1");
  const category: FormulaCategoryFilter = isFormulaCategory(categoryParam) ? categoryParam : "All";
  const sort: FormulaSort = isFormulaSort(sortParam) ? sortParam : "relevance";
  const typeFilter: FormulaTypeFilter = isTypeFilter(typeParam) ? typeParam : "All";
  const useFilter: FormulaUseFilter = isUseFilter(useParam) ? useParam : "All";
  const shapeFilter: FormulaShapeFilter = isShapeFilter(shapeParam) ? shapeParam : "All";
  const symbolFilter: FormulaSymbolFilter = isSymbolFilter(symbolParam) ? symbolParam : "All";
  const selectedId = searchParams.get("formula") ?? "";
  const savedOnly = pathname === "/formula-hub/saved";

  const searchedResults = useMemo(
    () =>
      searchFormulaEntries({
        query,
        category,
        sort: sort === "type" || sort === "use" ? "relevance" : sort,
      }),
    [category, query, sort],
  );

  const results = useMemo(() => {
    const filtered = applyFormulaFilters({
      entries: searchedResults,
      savedIds,
      savedOnly,
      shapeFilter,
      symbolFilter,
      typeFilter,
      useFilter,
    });

    return sortFormulaEntries(filtered, sort);
  }, [savedIds, savedOnly, searchedResults, shapeFilter, sort, symbolFilter, typeFilter, useFilter]);

  const totalPages = Math.max(1, Math.ceil(results.length / pageSize));
  const currentPage = Number.isFinite(pageParam) ? Math.min(Math.max(pageParam, 1), totalPages) : 1;
  const pageStart = (currentPage - 1) * pageSize;
  const pageResults = results.slice(pageStart, pageStart + pageSize);
  const selectedEntry = selectedId ? results.find((entry) => entry.id === selectedId) ?? null : null;
  const sortLabel = sortOptions.find((option) => option.value === sort)?.label ?? "Relevance";
  const visibleMathKey = [
    pageResults.map((entry) => entry.id).join(","),
    selectedEntry?.id ?? "",
    drawerOpen ? "drawer" : "",
    modalOpen ? "modal" : "",
  ].join("|");

  const updateParams = (updates: Record<string, string | null>) => {
    const nextParams = new URLSearchParams(searchParams.toString());

    for (const [key, value] of Object.entries(updates)) {
      if (
        value === null ||
        value === "" ||
        (key === "category" && value === "All") ||
        (key === "sort" && value === "relevance") ||
        (key === "type" && value === "All") ||
        (key === "use" && value === "All") ||
        (key === "shape" && value === "All") ||
        (key === "symbol" && value === "All") ||
        (key === "page" && value === "1")
      ) {
        nextParams.delete(key);
      } else {
        nextParams.set(key, value);
      }
    }

    const queryString = nextParams.toString();
    router.replace(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
  };

  const selectFormula = (id: string) => {
    updateParams({ formula: id });
    setDrawerOpen(true);
    setModalOpen(false);
  };

  const toggleSaved = (id: string) => {
    setSavedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(savedStorageKey);
      const parsed = raw ? (JSON.parse(raw) as unknown) : [];
      const validIds = Array.isArray(parsed)
        ? parsed
            .map((id) => {
              if (typeof id !== "string") return null;
              return formulaHubEntriesById[id] ? id : formulaHubEntryAliasesById[id] ?? null;
            })
            .filter((id): id is string => typeof id === "string" && Boolean(formulaHubEntriesById[id]))
        : [];
      setSavedIds(new Set(validIds));
    } catch {
      setSavedIds(new Set());
    } finally {
      setSavedLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!savedLoaded) return;
    window.localStorage.setItem(savedStorageKey, JSON.stringify(Array.from(savedIds)));
  }, [savedIds, savedLoaded]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const isSearchShortcut = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k";
      if (isSearchShortcut) {
        event.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
        return;
      }

      if (event.key === "Escape") {
        setDrawerOpen(false);
        setModalOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (!selectedEntry) {
      setDrawerOpen(false);
      setModalOpen(false);
    }
  }, [selectedEntry]);

  useEffect(() => {
    if (!window.MathJax?.typesetPromise) return;

    const timer = window.setTimeout(() => {
      const elements = [
        document.getElementById("formula-results"),
        drawerOpen ? document.querySelector(".drawer-body") : null,
        modalOpen ? document.querySelector(".modal") : null,
      ].filter(Boolean) as Element[];
      const mathJax = window.MathJax as
        | (typeof window.MathJax & {
            typesetClear?: (elements?: Element[]) => void;
            typesetPromise?: (elements?: Element[]) => Promise<void>;
          })
        | undefined;

      mathJax?.typesetClear?.(elements);
      void mathJax?.typesetPromise?.(elements);
    }, 24);

    return () => window.clearTimeout(timer);
  }, [drawerOpen, modalOpen, visibleMathKey]);

  const setCategory = (nextCategory: FormulaCategoryFilter) => {
    updateParams({ category: nextCategory, formula: null, page: null });
    setDrawerOpen(false);
    setModalOpen(false);
  };

  const setPage = (nextPage: number) => {
    updateParams({ page: String(nextPage), formula: null });
    setDrawerOpen(false);
    setModalOpen(false);
  };

  return (
    <div className="formula-v6-app">
      <div className="page">
        <aside className="sidebar">
          <p className="sidebar-label">Browse Topics</p>
          <nav className="side-nav" aria-label="Formula categories">
            <Link className={`side-item ${!savedOnly && category === "All" ? "active" : ""}`} href="/formula-hub">
              <span className="side-item-left">
                <span className="side-letter">*</span>All Topics
              </span>
              <span className="side-count">{formulaHubEntries.length}</span>
            </Link>
            <Link className={`side-item ${savedOnly ? "active" : ""}`} href="/formula-hub/saved">
              <span className="side-item-left">
                <span className="side-letter">S</span>Saved Formulas
              </span>
              <span className="side-count">{savedIds.size}</span>
            </Link>
            {formulaCategories.map((item) => (
              <button
                className={`side-item ${category === item.id ? "active" : ""}`}
                key={item.id}
                type="button"
                onClick={() => setCategory(item.id)}
              >
                <span className="side-item-left">
                  <span className="side-letter">{categoryLetter(item.id)}</span>
                  {item.label}
                </span>
                <span className="side-count">{item.count}</span>
              </button>
            ))}
          </nav>

          <hr className="sidebar-sep" />

          <p className="sidebar-label">Symbol Dictionary</p>
          <div className="sym-dict">
            {[
              ["m", "Batch size"],
              ["n^{[l]}", "Units in layer l"],
              ["A^{[l]}", "Activations (layer l)"],
              ["Z^{[l]}", "Pre-activations"],
              ["W^{[l]}", "Weights (layer l)"],
              ["b^{[l]}", "Biases (layer l)"],
            ].map(([symbol, label]) => (
              <div className="sym-dict-row" key={symbol}>
                <span className="sym-k">
                  <FormulaMath latex={symbol} />
                </span>
                <span className="sym-d">{label}</span>
              </div>
            ))}
            <div className="sym-more">View all symbols -&gt;</div>
          </div>
        </aside>

        <main className="formula-v6-main">
          <section className="hero">
            <div>
              <p className="hero-eyebrow">Deep Learning Formula Search</p>
              <h1 className="hero-title">
                Formula
                <br />
                <em>Hub.</em>
              </h1>
              <p className="hero-sub">Search formulas, tensor shapes, and symbols across deep learning topics.</p>
            </div>
            <div className="hero-art">
              <canvas ref={canvasRef} />
              <div className="hero-chip chip-a">
                <FormulaMath latex={"dW^{[l]}=\\frac{1}{m}dZ^{[l]}(A^{[l-1]})^T"} />
              </div>
              <div className="hero-chip chip-b">
                <FormulaMath latex={"\\operatorname{softmax}\\!\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V"} />
              </div>
            </div>
          </section>

          <label className="search-bar" htmlFor="formula-hub-search">
            <SearchIcon />
            <input
              id="formula-hub-search"
              ref={searchInputRef}
              type="search"
              value={query}
              placeholder="Search Adam, RMSProp, BatchNorm, dW, QK^T, CNN output size..."
              onChange={(event) => {
                updateParams({ q: event.target.value, formula: null, page: null });
                setDrawerOpen(false);
                setModalOpen(false);
              }}
            />
            <kbd className="kbd" title="Focus search">
              Ctrl+K
            </kbd>
          </label>

          <div className="filter-strip">
            {primaryFilters.map((item) => (
              <button
                className={`fpill ${category === item ? "active" : item === "Transformer" ? "outline" : ""}`}
                key={item}
                type="button"
                onClick={() => setCategory(item)}
              >
                {item === "Shapes & Dimensions" ? "Shapes" : item}
              </button>
            ))}
            <button className="fpill" type="button">
              More &gt;
            </button>
          </div>

          <div className="subfilter-strip">
            <FormulaFilterSelect
              label="Type"
              options={typeFilterOptions}
              value={typeFilter}
              onChange={(value) => updateParams({ type: value, formula: null, page: null })}
            />
            <FormulaFilterSelect
              label="Use"
              options={useFilterOptions.map((value) => ({ label: value, value }))}
              value={useFilter}
              onChange={(value) => updateParams({ use: value, formula: null, page: null })}
            />
            <FormulaFilterSelect
              label="Shape"
              options={shapeFilterOptions}
              value={shapeFilter}
              onChange={(value) => updateParams({ shape: value, formula: null, page: null })}
            />
            <FormulaFilterSelect
              label="Symbol"
              options={symbolFilterOptions}
              value={symbolFilter}
              onChange={(value) => updateParams({ symbol: value, formula: null, page: null })}
            />
            <label className="sort-btn">
              Sort:
              <select value={sort} onChange={(event) => updateParams({ sort: event.target.value, formula: null, page: null })}>
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <strong>{sortLabel}</strong> <ChevronIcon />
            </label>
          </div>

          <p className="results-label">
            {savedOnly ? "Saved formulas - " : ""}
            Showing <strong>{results.length === 0 ? 0 : pageStart + 1}-{Math.min(pageStart + pageSize, results.length)}</strong> of{" "}
            <strong>{results.length} results</strong>
          </p>

          <div className="cards" id="formula-results">
            {pageResults.length > 0 ? (
              pageResults.map((entry) => (
                <FormulaResultCard
                  entry={entry}
                  key={entry.id}
                  saved={savedIds.has(entry.id)}
                  selected={selectedEntry?.id === entry.id}
                  onSave={() => toggleSaved(entry.id)}
                  onSelect={() => selectFormula(entry.id)}
                />
              ))
            ) : (
              <div className="formula-v6-empty">
                <h2>{savedOnly ? "No saved formulas yet" : "No formulas found"}</h2>
                <p>{savedOnly ? "Use the bookmark icon on any formula card to save it here." : "Try a symbol like dW, a topic like CNN, or a concept like attention."}</p>
              </div>
            )}
          </div>

          {totalPages > 1 ? (
            <nav className="pagination" aria-label="Formula results pagination">
              <button
                className="pg-btn"
                type="button"
                onClick={() => setPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                &lt;
              </button>
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                <button
                  className={`pg-btn ${currentPage === page ? "active" : ""}`}
                  key={page}
                  type="button"
                  onClick={() => setPage(page)}
                >
                  {page}
                </button>
              ))}
              <button
                className="pg-btn"
                type="button"
                onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                &gt;
              </button>
            </nav>
          ) : null}
        </main>
      </div>

      <FormulaDrawer
        entry={selectedEntry}
        modalOpen={modalOpen}
        open={drawerOpen}
        saved={selectedEntry ? savedIds.has(selectedEntry.id) : false}
        onClose={() => setDrawerOpen(false)}
        onModalClose={() => setModalOpen(false)}
        onModalOpen={() => {
          setDrawerOpen(false);
          setModalOpen(true);
        }}
        onSave={() => selectedEntry && toggleSaved(selectedEntry.id)}
        onSelectRelated={selectFormula}
      />
    </div>
  );
}
