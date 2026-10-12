// Builds ../schedule.json from the ISP course list and the TimeEdit timetable
// (MNM Artificial Intelligence, fase 01, ECS, exported 2026-10-11).
// Only courses in the ISP are included. Edit the tables below and run:
//   node study-ledger/tools/build-schedule.mjs
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

// Monday of ISO week `w` in `year`, plus (dow - 1) days. dow: 1 = Mon ... 5 = Fri.
function isoDate(year, w, dow) {
  const jan4 = new Date(Date.UTC(year, 0, 4));
  const mon1 = new Date(jan4);
  mon1.setUTCDate(jan4.getUTCDate() - ((jan4.getUTCDay() + 6) % 7));
  const d = new Date(mon1);
  d.setUTCDate(mon1.getUTCDate() + (w - 1) * 7 + (dow - 1));
  return d.toISOString().slice(0, 10);
}
const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
const without = (arr, ...ex) => arr.filter(x => !ex.includes(x));

// weekly(year, weeks, dow, start, end, type, groups?)
function weekly(year, weeks, dow, start, end, type, groups) {
  return weeks.map(w => one(year, w, dow, start, end, type, groups));
}
function one(year, w, dow, start, end, type, groups) {
  const s = { date: isoDate(year, w, dow), start, end, type };
  if (groups) s.groups = groups;
  return s;
}
// list(year, [[week, dow, start, end], ...], type, groups)
function list(year, rows, type, groups) {
  return rows.map(([w, dow, start, end]) => one(year, w, dow, start, end, type, groups));
}

const S1 = 2026, S2 = 2027;
const S2_TEACH = [...range(6, 12), ...range(15, 20)]; // Easter break = weeks 13–14

const courses = [
  {
    code: "H02A0A", name: "Fundamentals of Artificial Intelligence", ects: 5, term: "S1",
    sessions: [
      ...weekly(S1, without(range(39, 51), 45), 1, "10:35", "12:30", "lecture"),
      one(S1, 41, 1, "17:00", "18:30", "lecture"),
      one(S1, 45, 5, "12:35", "14:00", "lecture"),
      ...list(S1, [[41, 4, "16:05", "18:30"], [42, 4, "16:05", "18:30"], [44, 4, "16:00", "18:25"], [47, 4, "16:05", "18:30"], [48, 4, "16:00", "18:25"], [49, 4, "16:05", "18:30"]], "exercises", ["A"]),
      ...list(S1, [[41, 3, "13:30", "15:55"], [42, 3, "13:30", "15:55"], [44, 3, "13:30", "15:55"], [47, 3, "13:30", "15:55"], [48, 2, "10:30", "12:55"], [49, 3, "13:30", "15:55"]], "exercises", ["B"]),
      ...list(S1, [[41, 4, "10:35", "13:00"], [42, 4, "10:35", "13:00"], [44, 4, "10:30", "12:55"], [47, 4, "10:35", "13:00"], [48, 4, "10:30", "12:55"], [49, 4, "10:35", "13:00"]], "exercises", ["C"]),
    ],
  },
  {
    code: "H02C1A", name: "Machine Learning and Inductive Inference", ects: 4, term: "S1",
    sessions: [
      ...weekly(S1, range(39, 50), 4, "14:00", "15:55", "lecture"),
      ...list(S1, [[43, 1, "16:05", "18:30"], [45, 2, "16:05", "18:30"], [47, 1, "16:05", "18:30"], [49, 1, "16:05", "18:30"], [51, 1, "16:05", "18:30"]], "exercises", ["A"]),
      ...list(S1, [[43, 3, "16:05", "18:30"], [45, 3, "16:05", "18:30"], [47, 3, "16:05", "18:30"], [49, 3, "16:05", "18:30"], [51, 3, "16:05", "18:30"]], "exercises", ["B", "D"]),
      ...list(S1, [[43, 4, "08:00", "10:25"], [45, 4, "08:00", "10:25"], [47, 4, "08:00", "10:25"], [49, 4, "08:00", "10:25"], [51, 4, "08:00", "10:25"]], "exercises", ["C"]),
      ...list(S1, [[43, 1, "16:05", "18:30"], [44, 2, "16:05", "18:30"], [47, 1, "16:05", "18:30"], [49, 1, "16:05", "18:30"], [51, 1, "16:05", "18:30"]], "exercises", ["E"]),
      ...list(S1, [[43, 1, "10:35", "13:00"], [44, 1, "08:00", "10:25"], [47, 1, "10:35", "13:00"], [49, 1, "10:35", "13:00"], [51, 1, "10:35", "13:00"]], "exercises", ["F"]),
    ],
  },
  {
    code: "H02D2A", name: "Uncertainty in Artificial Intelligence", ects: 4, term: "S1",
    sessions: [
      ...weekly(S1, range(39, 51), 5, "09:00", "10:25", "lecture"),
      ...weekly(S1, [40, 42, 44, 46, 48, 50], 1, "16:00", "18:30", "exercises", ["A"]),
      ...list(S1, [[40, 3, "16:00", "18:30"], [42, 3, "16:00", "18:30"], [44, 3, "16:00", "18:30"], [46, 2, "16:00", "18:30"], [48, 3, "16:00", "18:30"], [50, 3, "16:00", "18:30"]], "exercises", ["B"]),
    ],
  },
  {
    code: "H02B1A", name: "Natural Language Processing", ects: 4, term: "S1",
    sessions: [
      ...weekly(S1, without(range(39, 51), 44), 4, "11:00", "13:00", "lecture"),
      one(S1, 44, 5, "10:30", "12:30", "lecture"),
      ...weekly(S1, [41, 42, 44, 45, 47, 48, 50], 2, "08:30", "10:25", "exercises", ["A"]),
      ...list(S1, [[41, 5, "16:00", "17:55"], [42, 5, "14:30", "16:25"], [44, 3, "08:30", "10:25"], [45, 5, "16:00", "17:55"], [47, 1, "16:00", "17:55"], [48, 5, "16:00", "17:55"], [51, 3, "09:00", "10:55"]], "exercises", ["B"]),
    ],
  },
  {
    code: "H02A3A", name: "Constraint Solving", ects: 4, term: "S1",
    sessions: [
      ...weekly(S1, without(range(39, 50), 44), 5, "10:30", "12:30", "lecture"),
      ...list(S1, [[41, 3, "13:30", "16:00"], [42, 3, "10:00", "12:30"], [43, 3, "13:30", "16:00"], [44, 3, "13:30", "16:00"], [47, 1, "13:30", "16:00"], [48, 3, "13:30", "16:00"]], "exercises", ["A"]),
      ...list(S1, [[41, 4, "16:00", "18:30"], [42, 3, "13:30", "16:00"], [43, 4, "16:00", "18:30"], [44, 4, "16:00", "18:30"], [47, 3, "10:30", "13:00"], [48, 4, "16:00", "18:30"]], "exercises", ["B"]),
      ...list(S1, [[41, 5, "13:30", "16:00"], [42, 5, "14:30", "17:00"], [43, 5, "13:30", "16:00"], [44, 5, "13:30", "16:00"], [47, 5, "14:30", "17:00"], [48, 5, "13:30", "16:00"]], "exercises", ["C"]),
    ],
  },
  {
    code: "H02B2A", name: "Cognitive Science", ects: 4, term: "S1",
    sessions: weekly(S1, range(39, 51), 4, "09:00", "10:25", "lecture"),
  },
  {
    code: "H02C4A", name: "Artificial Neural Networks and Deep Learning", ects: 4, term: "S2",
    sessions: [
      ...weekly(S2, range(6, 11), 1, "08:30", "10:25", "lecture"),
      ...weekly(S2, range(6, 11), 3, "08:30", "10:25", "lecture"),
      ...weekly(S2, range(7, 11), 4, "10:30", "13:00", "exercises", ["A"]),
      ...weekly(S2, range(7, 11), 5, "09:30", "12:00", "exercises", ["B"]),
      ...weekly(S2, range(7, 11), 4, "13:30", "16:00", "exercises", ["C"]),
    ],
  },
  {
    code: "H02A5A", name: "Computer Vision", ects: 4, term: "S2",
    sessions: weekly(S2, S2_TEACH, 2, "16:05", "17:30", "lecture"),
  },
  {
    code: "H02C8A", name: "Information Retrieval and Search Engines", ects: 4, term: "S2",
    sessions: [
      ...weekly(S2, [...range(6, 12), 15, 16, 17], 4, "14:00", "15:30", "lecture"),
      ...list(S2, [[17, 5, "11:00", "12:30"], [18, 3, "14:00", "15:30"], [19, 2, "14:00", "15:30"]], "lecture"),
      ...weekly(S2, [8, 10, 12, 16, 20], 4, "08:00", "10:00", "exercises", ["A"]),
      one(S2, 20, 2, "13:00", "15:00", "exercises", ["A"]),
      ...weekly(S2, [8, 10, 12, 16, 18, 20], 3, "10:30", "12:30", "exercises", ["B"]),
    ],
  },
  {
    code: "H02H6B", name: "Bio-informatics", ects: 4, term: "S2",
    sessions: weekly(S2, S2_TEACH, 3, "14:00", "15:55", "lecture"),
  },
  {
    code: "H0O23A", name: "Reinforcement Learning", ects: 4, term: "S2",
    sessions: [
      ...weekly(S2, [...range(6, 12), ...range(15, 19)], 1, "14:00", "15:55", "lecture"),
      ...weekly(S2, [8, 10, 12, 16, 18, 20], 2, "08:00", "10:25", "exercises"),
    ],
  },
  { code: "H02D6A", name: "Master's Thesis ECS", ects: 15, term: "Y", sessions: [] },
];

// Groups each course offers for exercises; the default is the first one.
for (const c of courses) {
  const g = new Set();
  for (const s of c.sessions) for (const x of s.groups || []) g.add(x);
  if (g.size) c.groups = [...g].sort();
  c.sessions.sort((a, b) => (a.date + a.start).localeCompare(b.date + b.start));
}
const ir = courses.find(c => c.code === "H02C8A");
ir.groupNote = "Group A is the MAI group (4 ECTS)";

const out = {
  source: "TimeEdit export 2026-10-11, MNM Artificial Intelligence (Leuv) fase 01, ECS; ISP approved 2026-10-09",
  academicYear: "2026-2027",
  calendar: {
    teaching: {
      S1: { start: "2026-09-21", end: "2026-12-18" },
      S2: { start: "2027-02-08", end: "2027-05-21" },
    },
    breaks: [
      { name: "Christmas break", start: "2026-12-21", end: "2027-01-03" },
      { name: "Semester break", start: "2027-02-01", end: "2027-02-07" },
      { name: "Easter break", start: "2027-03-29", end: "2027-04-11" },
    ],
    // Not in the timetable export; estimated, editable in the page settings.
    examsEstimated: {
      S1: { start: "2027-01-04", end: "2027-01-31" },
      S2: { start: "2027-05-24", end: "2027-07-04" },
    },
  },
  courses,
};

const target = fileURLToPath(new URL("../schedule.json", import.meta.url));
writeFileSync(target, JSON.stringify(out, null, 2) + "\n");
const n = courses.reduce((a, c) => a + c.sessions.length, 0);
console.log(`Wrote ${target}: ${courses.length} courses, ${n} sessions`);
