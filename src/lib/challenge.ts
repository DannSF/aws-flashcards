import { challengeQuestions } from "../data/challenges";
import { cards, CONTENT_VERSION } from "../data/cards";
import { domains } from "../data/domains";
import type { ChallengeAttempt, DomainId } from "../types";
const questionMap = new Map(challengeQuestions.map((q) => [q.id, q]));
export function shuffle<T>(values: readonly T[], random = Math.random): T[] {
  const result = [...values];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
export function createChallenge(
  kind: ChallengeAttempt["kind"],
  domain: DomainId | "all",
  count = 10,
  retryIds?: string[],
  parentId?: string,
): ChallengeAttempt {
  const eligible = retryIds
    ? challengeQuestions.filter((q) => retryIds.includes(q.id))
    : challengeQuestions.filter((q) => domain === "all" || q.domain === domain);
  const questions = shuffle(eligible).slice(
    0,
    kind === "practice" ? count : eligible.length,
  );
  if (!questions.length) throw new Error("No hay preguntas disponibles.");
  return {
    id: crypto.randomUUID(),
    contentVersion: CONTENT_VERSION,
    kind,
    domain,
    startedAt: new Date().toISOString(),
    questionIds: questions.map((q) => q.id),
    optionOrder: Object.fromEntries(
      questions.map((q) => [q.id, shuffle(q.options.map((o) => o.id))]),
    ),
    answers: {},
    cursor: 0,
    ...(parentId ? { parentId } : {}),
  };
}
export function answerChallenge(
  attempt: ChallengeAttempt,
  optionId: string,
): ChallengeAttempt {
  if (attempt.completedAt) throw new Error("Este reto ya terminó.");
  const id = attempt.questionIds[attempt.cursor];
  const q = questionMap.get(id);
  if (!q || attempt.answers[id] || !q.options.some((o) => o.id === optionId))
    throw new Error("Respuesta no válida.");
  const answers = { ...attempt.answers, [id]: optionId };
  // Full evaluations withhold all correctness until the entire library is answered.
  return {
    ...attempt,
    answers,
    ...(attempt.kind === "full"
      ? attempt.cursor === attempt.questionIds.length - 1
        ? {
            cursor: attempt.questionIds.length,
            completedAt: new Date().toISOString(),
          }
        : { cursor: attempt.cursor + 1 }
      : {}),
  };
}
export function advanceChallenge(attempt: ChallengeAttempt): ChallengeAttempt {
  if (
    attempt.kind === "full" ||
    attempt.completedAt ||
    !attempt.answers[attempt.questionIds[attempt.cursor]]
  )
    throw new Error("Confirma una respuesta antes de continuar.");
  const cursor = attempt.cursor + 1;
  return {
    ...attempt,
    cursor,
    ...(cursor === attempt.questionIds.length
      ? { completedAt: new Date().toISOString() }
      : {}),
  };
}
export function challengeResult(attempt: ChallengeAttempt) {
  const incorrect = attempt.questionIds.filter(
    (id) => attempt.answers[id] !== questionMap.get(id)?.correctId,
  );
  const correct = attempt.questionIds.length - incorrect.length;
  return {
    correct,
    total: attempt.questionIds.length,
    percent: Math.round((correct / attempt.questionIds.length) * 100),
    incorrect,
    answered: Object.keys(attempt.answers).length,
    domains: domains.map((d) => {
      const ids = attempt.questionIds.filter(
        (id) => questionMap.get(id)?.domain === d.id,
      );
      const count = ids.filter(
        (id) => attempt.answers[id] === questionMap.get(id)?.correctId,
      ).length;
      return { ...d, total: ids.length, correct: count };
    }),
  };
}
const isRecord = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === "object" && !Array.isArray(v);
const validDate = (v: unknown) =>
  typeof v === "string" && Number.isFinite(Date.parse(v));
export function parseChallenges(value: unknown): ChallengeAttempt[] {
  if (value === undefined) return []; // Backward compatible with v1 progress backups.
  if (!Array.isArray(value)) throw new Error("Historial de retos inválido.");
  const attemptIds = new Set<string>();
  for (const a of value) {
    if (
      !isRecord(a) ||
      typeof a.id !== "string" ||
      typeof a.contentVersion !== "string" ||
      !a.contentVersion ||
      !a.id ||
      attemptIds.has(a.id) ||
      !["practice", "full", "retry"].includes(a.kind as string) ||
      !["all", ...domains.map((d) => d.id)].includes(a.domain as string) ||
      !validDate(a.startedAt) ||
      !Array.isArray(a.questionIds) ||
      !a.questionIds.length ||
      a.questionIds.some(
        (id) => typeof id !== "string" || !questionMap.has(id),
      ) ||
      new Set(a.questionIds).size !== a.questionIds.length ||
      !isRecord(a.optionOrder) ||
      !isRecord(a.answers) ||
      !Number.isInteger(a.cursor) ||
      (a.cursor as number) < 0 ||
      (a.cursor as number) > a.questionIds.length ||
      (a.parentId !== undefined && typeof a.parentId !== "string")
    )
      throw new Error("Historial de retos inválido.");
    attemptIds.add(a.id);
    const ids = a.questionIds as string[];
    const order = a.optionOrder;
    const answers = a.answers;
    const cursor = a.cursor as number;
    if (
      Object.keys(order).length !== ids.length ||
      Object.keys(answers).some((id) => !ids.includes(id))
    )
      throw new Error("Opciones o respuestas de reto inválidas.");
    for (const id of ids) {
      const q = questionMap.get(id)!;
      const options = order[id];
      if (
        !Array.isArray(options) ||
        options.length !== 4 ||
        new Set(options).size !== 4 ||
        options.some((oid) => !q.options.some((o) => o.id === oid)) ||
        (answers[id] !== undefined &&
          !q.options.some((o) => o.id === answers[id])) ||
        (a.domain !== "all" && q.domain !== a.domain)
      )
        throw new Error("Opciones o respuestas de reto inválidas.");
    }
    const expectedIds = cards
      .filter((c) => a.domain === "all" || c.domain === a.domain)
      .map((c) => c.id);
    if (
      a.kind === "full" &&
      a.contentVersion === CONTENT_VERSION &&
      (ids.length !== expectedIds.length ||
        expectedIds.some((id) => !ids.includes(id)))
    )
      throw new Error(
        "La evaluación completa debe cubrir todo el dominio seleccionado.",
      );
    if (a.completedAt !== undefined) {
      if (
        !validDate(a.completedAt) ||
        Date.parse(a.completedAt as string) <
          Date.parse(a.startedAt as string) ||
        cursor !== ids.length ||
        Object.keys(answers).length !== ids.length
      )
        throw new Error("Resultado de reto incompleto.");
    } else if (
      cursor >= ids.length ||
      ids.some((id, i) =>
        i < cursor
          ? !answers[id]
          : i > cursor
            ? !!answers[id]
            : a.kind === "full" && !!answers[id],
      )
    )
      throw new Error("Progreso de reto incoherente.");
  }
  if (value.filter((a) => !a.completedAt).length > 1)
    throw new Error("Solo puede haber un reto activo.");
  return value as ChallengeAttempt[];
}
