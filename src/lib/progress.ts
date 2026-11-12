import { createEmptyCard, fsrs, State } from "ts-fsrs";
import type { Card } from "ts-fsrs";
import { cards } from "../data/cards";
import type { RecallRating, UserProgress } from "../types";

export const STORAGE_KEY = "cloudrecall.progress.v1";
export const scheduler = fsrs({ enable_fuzz: false, request_retention: 0.9 });
export const emptyProgress = (): UserProgress => ({
  version: 1,
  cards: {},
  history: [],
  sessions: [],
  exams: [],
  dailyGoal: 20,
});
const ids = new Set(cards.map((c) => c.id));
const record = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === "object" && !Array.isArray(v);
const date = (v: unknown) =>
  (typeof v === "string" || v instanceof Date) &&
  Number.isFinite(new Date(v).getTime());
const number = (v: unknown, min = 0, max = Number.MAX_SAFE_INTEGER) =>
  typeof v === "number" && Number.isFinite(v) && v >= min && v <= max;
export function parseProgress(raw: string): UserProgress {
  const v: unknown = JSON.parse(raw);
  if (
    !record(v) ||
    v.version !== 1 ||
    !record(v.cards) ||
    !Array.isArray(v.history) ||
    !Array.isArray(v.sessions) ||
    !Array.isArray(v.exams) ||
    !number(v.dailyGoal, 1, 200) ||
    !Number.isInteger(v.dailyGoal)
  )
    throw new Error("El archivo no es una copia válida de CloudRecall v1.");
  const hydrated: Record<string, Card> = {};
  for (const [id, c] of Object.entries(v.cards)) {
    if (
      !ids.has(id) ||
      !record(c) ||
      !date(c.due) ||
      (c.last_review !== undefined && !date(c.last_review)) ||
      !number(c.stability) ||
      !number(c.difficulty, 0, 10) ||
      !number(c.elapsed_days) ||
      !number(c.scheduled_days) ||
      !number(c.learning_steps) ||
      !number(c.reps) ||
      !number(c.lapses) ||
      !number(c.state, 0, 3) ||
      ![c.learning_steps, c.reps, c.lapses, c.state].every(Number.isInteger)
    )
      throw new Error("La copia contiene una tarjeta o programación inválida.");
    hydrated[id] = {
      due: new Date(c.due as string),
      stability: c.stability as number,
      difficulty: c.difficulty as number,
      elapsed_days: c.elapsed_days as number,
      scheduled_days: c.scheduled_days as number,
      learning_steps: c.learning_steps as number,
      reps: c.reps as number,
      lapses: c.lapses as number,
      state: c.state as State,
      ...(c.last_review
        ? { last_review: new Date(c.last_review as string) }
        : {}),
    };
  }
  if (
    v.history.some(
      (h) =>
        !record(h) ||
        typeof h.cardId !== "string" ||
        !ids.has(h.cardId) ||
        !date(h.at) ||
        !date(h.previousDue) ||
        !date(h.nextDue) ||
        ![1, 2, 3, 4].includes(h.rating as number),
    )
  )
    throw new Error("El historial de repasos no es válido.");
  if (
    v.sessions.some(
      (s) =>
        !record(s) ||
        typeof s.id !== "string" ||
        !date(s.startedAt) ||
        !date(s.endedAt) ||
        new Date(s.endedAt as string) < new Date(s.startedAt as string) ||
        !number(s.reviews) ||
        !Number.isInteger(s.reviews),
    )
  )
    throw new Error("El historial de sesiones no es válido.");
  // This release has no exam workflow. Do not silently accept unsupported records.
  if (v.exams.length)
    throw new Error("Esta versión no admite copias con exámenes.");
  return {
    version: 1,
    cards: hydrated,
    history: v.history as UserProgress["history"],
    sessions: v.sessions as UserProgress["sessions"],
    exams: [],
    dailyGoal: v.dailyGoal as number,
  };
}
export function loadProgress(): {
  progress: UserProgress;
  error: string | null;
} {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return {
      progress: raw ? parseProgress(raw) : emptyProgress(),
      error: null,
    };
  } catch {
    return {
      progress: emptyProgress(),
      error:
        "No se pudo leer el progreso. No sobrescribiremos los datos guardados. Exporta la copia original o restablece para continuar.",
    };
  }
}
export function saveProgress(progress: UserProgress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}
export function review(
  progress: UserProgress,
  id: string,
  rating: RecallRating,
  sessionId: string,
  startedAt: string,
  now = new Date(),
): UserProgress {
  const before = progress.cards[id] ?? createEmptyCard(now);
  const next = scheduler.next(before, now, rating).card;
  const session = progress.sessions.find((s) => s.id === sessionId);
  return {
    ...progress,
    cards: { ...progress.cards, [id]: next },
    history: [
      ...progress.history,
      {
        cardId: id,
        at: now.toISOString(),
        rating,
        previousDue: before.due.toISOString(),
        nextDue: next.due.toISOString(),
      },
    ],
    sessions: [
      ...progress.sessions.filter((s) => s.id !== sessionId),
      {
        id: sessionId,
        startedAt: session?.startedAt ?? startedAt,
        endedAt: now.toISOString(),
        reviews: (session?.reviews ?? 0) + 1,
      },
    ],
  };
}
export const localDay = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
export function streak(progress: UserProgress, now = new Date()) {
  const days = new Set(progress.history.map((h) => localDay(new Date(h.at))));
  const cursor = new Date(now);
  if (!days.has(localDay(cursor))) cursor.setDate(cursor.getDate() - 1);
  let count = 0;
  while (days.has(localDay(cursor))) {
    count++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return count;
}
export const cardStatus = (card: Card | undefined, now = new Date()) =>
  !card
    ? "new"
    : card.due <= now
      ? "due"
      : card.state === State.Review && card.stability >= 21
        ? "mastered"
        : "learning";
export function dueLabel(due: Date, now = new Date()) {
  const minutes = Math.max(
    1,
    Math.round((due.getTime() - now.getTime()) / 60000),
  );
  return minutes < 60
    ? `${minutes} min`
    : minutes < 1440
      ? `${Math.round(minutes / 60)} h`
      : `${Math.round(minutes / 1440)} d`;
}
export function download(name: string, contents: string) {
  const url = URL.createObjectURL(
    new Blob([contents], { type: "application/json" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
