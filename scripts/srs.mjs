#!/usr/bin/env node
// Spaced-repetition scheduler for english-coach. Zero dependencies.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const BANK = path.join(ROOT, "bank", "questions.jsonl");
const CARDS = path.join(ROOT, "progress", "cards.json");

const PASS = 4.5;
// Interval (days) after the n-th consecutive pass; streak 0 (just failed) retries next day.
const INTERVALS = [1, 1, 2, 4, 7, 15, 30];
const MASTERED_STREAK = 7;

function parseArgs(argv) {
  const pos = [];
  const opts = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith("--")) opts[argv[i].slice(2)] = argv[++i];
    else pos.push(argv[i]);
  }
  return { pos, opts };
}

function localDate(d = new Date()) {
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

function addDays(dateStr, days) {
  const [y, m, d] = dateStr.split("-").map(Number);
  return localDate(new Date(y, m - 1, d + days));
}

function readText(file) {
  return fs.readFileSync(file, "utf8").replace(/^\uFEFF/, "");
}

function loadBank() {
  if (!fs.existsSync(BANK)) return [];
  return readText(BANK)
    .split(/\r?\n/)
    .map((l, i) => [l.trim(), i + 1])
    .filter(([l]) => l)
    .map(([l, n]) => {
      try {
        return JSON.parse(l);
      } catch (e) {
        throw new Error(`bank/questions.jsonl line ${n}: ${e.message}`);
      }
    });
}

function loadCards() {
  if (!fs.existsSync(CARDS)) return {};
  return JSON.parse(readText(CARDS) || "{}");
}

function saveCards(cards) {
  fs.mkdirSync(path.dirname(CARDS), { recursive: true });
  const sorted = Object.fromEntries(Object.keys(cards).sort().map((k) => [k, cards[k]]));
  fs.writeFileSync(CARDS, JSON.stringify(sorted, null, 2) + "\n");
}

function promptFor(q, attempt) {
  const variants = q.variants || [];
  if (attempt === 0 || variants.length === 0) return { variant: 0, zh: q.zh, refs: q.refs };
  const idx = ((attempt - 1) % variants.length) + 1;
  return { variant: idx, zh: variants[idx - 1].zh, refs: variants[idx - 1].refs };
}

function cmdToday(opts) {
  const today = opts.date || localDate();
  const limit = Number(opts.limit ?? 8);
  const newMax = Number(opts["new-max"] ?? 8);
  const bank = loadBank();
  const cards = loadCards();
  const byId = new Map(bank.map((q) => [q.id, q]));

  const doneToday = Object.values(cards).filter((c) => c.history.some((h) => h.date === today)).length;
  const newDoneToday = Object.values(cards).filter((c) => c.history[0]?.date === today).length;
  let remaining = Math.max(0, limit - doneToday);

  const due = Object.entries(cards)
    .filter(([id, c]) => !c.mastered && c.due <= today && byId.has(id))
    .sort((a, b) => a[1].due.localeCompare(b[1].due) || a[0].localeCompare(b[0]))
    .slice(0, remaining)
    .map(([id, c]) => {
      const q = byId.get(id);
      return { type: "review", id, review_no: c.history.length, overdue_days: daysBetween(c.due, today), ...base(q), ...promptFor(q, c.history.length) };
    });
  remaining -= due.length;

  const fresh = bank
    .filter((q) => !cards[q.id])
    .slice(0, Math.min(remaining, Math.max(0, newMax - newDoneToday)))
    .map((q) => ({ type: "new", id: q.id, ...base(q), ...promptFor(q, 0) }));

  console.log(JSON.stringify({ date: today, done_today: doneToday, items: [...due, ...fresh] }, null, 2));
}

function base(q) {
  return { grammar: q.grammar, domain: q.domain, scene: q.scene, level: q.level, target: q.target, notes: q.notes };
}

function daysBetween(a, b) {
  const [y1, m1, d1] = a.split("-").map(Number);
  const [y2, m2, d2] = b.split("-").map(Number);
  return Math.round((new Date(y2, m2 - 1, d2) - new Date(y1, m1 - 1, d1)) / 86400000);
}

function cmdRecord(pos, opts) {
  const [id, scoreStr] = pos;
  const score = Number(scoreStr);
  if (!id || Number.isNaN(score) || score < 0 || score > 5) {
    throw new Error("usage: record <id> <score 0-5> [--date YYYY-MM-DD]");
  }
  const today = opts.date || localDate();
  const q = loadBank().find((x) => x.id === id);
  if (!q) throw new Error(`unknown question id: ${id}`);

  const cards = loadCards();
  const c = cards[id] || { streak: 0, due: today, mastered: false, history: [] };
  if (c.mastered) throw new Error(`${id} is already mastered`);
  const { variant } = promptFor(q, c.history.length);
  const pass = score >= PASS;
  c.streak = pass ? c.streak + 1 : 0;
  c.history.push({ date: today, score, variant, pass });
  c.mastered = c.streak >= MASTERED_STREAK;
  c.due = c.mastered ? null : addDays(today, INTERVALS[Math.min(c.streak, INTERVALS.length - 1)]);
  cards[id] = c;
  saveCards(cards);
  console.log(JSON.stringify({ id, score, pass, streak: c.streak, mastered: c.mastered, next_due: c.due }));
}

function cmdStats(opts) {
  const today = opts.date || localDate();
  const bank = loadBank();
  const cards = loadCards();
  const list = Object.values(cards);
  const all = list.flatMap((c) => c.history);
  const todays = all.filter((h) => h.date === today);
  const weekAgo = addDays(today, -6);
  const week = all.filter((h) => h.date >= weekAgo && h.date <= today);
  const avg = (xs) => (xs.length ? +(xs.reduce((s, h) => s + h.score, 0) / xs.length).toFixed(2) : null);
  const rate = (xs) => (xs.length ? +(xs.filter((h) => h.pass).length / xs.length).toFixed(2) : null);

  const byGrammar = {};
  for (const q of bank) {
    const g = (byGrammar[q.grammar] ||= { total: 0, started: 0, mastered: 0 });
    g.total++;
    if (cards[q.id]) g.started++;
    if (cards[q.id]?.mastered) g.mastered++;
  }

  console.log(
    JSON.stringify(
      {
        date: today,
        bank_total: bank.length,
        not_started: bank.filter((q) => !cards[q.id]).length,
        learning: list.filter((c) => !c.mastered).length,
        mastered: list.filter((c) => c.mastered).length,
        due_today: list.filter((c) => !c.mastered && c.due <= today).length,
        today: { count: todays.length, avg: avg(todays), pass_rate: rate(todays) },
        last_7_days: { count: week.length, avg: avg(week), pass_rate: rate(week) },
        newly_mastered_today: Object.entries(cards)
          .filter(([, c]) => c.mastered && c.history.at(-1).date === today)
          .map(([id]) => id),
        by_grammar: byGrammar,
      },
      null,
      2
    )
  );
}

function cmdValidate() {
  const bank = loadBank();
  const errors = [];
  const seen = new Set();
  for (const q of bank) {
    const tag = q.id || "(no id)";
    if (!/^G\d{2}-[TP]-\d{2,}$/.test(q.id || "")) errors.push(`${tag}: bad id format`);
    if (seen.has(q.id)) errors.push(`${tag}: duplicate id`);
    seen.add(q.id);
    for (const k of ["grammar", "domain", "scene", "zh", "target"]) if (!q[k]) errors.push(`${tag}: missing ${k}`);
    if (!["travel", "paper"].includes(q.domain)) errors.push(`${tag}: domain must be travel|paper`);
    if (!Array.isArray(q.refs) || !q.refs.length) errors.push(`${tag}: refs must be a non-empty array`);
    if (!Array.isArray(q.variants) || q.variants.length < 2) errors.push(`${tag}: needs at least 2 variants`);
    for (const [i, v] of (q.variants || []).entries()) {
      if (!v.zh || !Array.isArray(v.refs) || !v.refs.length) errors.push(`${tag}: variant ${i + 1} needs zh and refs`);
    }
  }
  const orphan = Object.keys(loadCards()).filter((id) => !seen.has(id));
  if (orphan.length) errors.push(`cards without bank entry: ${orphan.join(", ")}`);
  console.log(errors.length ? errors.join("\n") : `OK: ${bank.length} questions`);
  if (errors.length) process.exitCode = 1;
}

const [cmd, ...rest] = process.argv.slice(2);
const { pos, opts } = parseArgs(rest);
try {
  if (cmd === "today") cmdToday(opts);
  else if (cmd === "record") cmdRecord(pos, opts);
  else if (cmd === "stats") cmdStats(opts);
  else if (cmd === "validate") cmdValidate();
  else console.log("usage: node scripts/srs.mjs <today|record|stats|validate> [options]");
} catch (e) {
  console.error(e.message);
  process.exitCode = 1;
}
