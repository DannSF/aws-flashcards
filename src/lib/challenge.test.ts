import { describe, it, expect } from "vitest";
import { cards } from "../data/cards";
import { challengeQuestions } from "../data/challenges";
import {
  advanceChallenge,
  answerChallenge,
  challengeResult,
  createChallenge,
  parseChallenges,
  shuffle,
} from "./challenge";
import { emptyProgress, parseProgress } from "./progress";
describe("reviewed choice library", () => {
  it("covers every card exactly once with four distinct options and its original correct answer", () => {
    expect(challengeQuestions.map((q) => q.id)).toEqual(cards.map((c) => c.id));
    for (const q of challengeQuestions) {
      expect(q.options).toHaveLength(4);
      expect(new Set(q.options.map((o) => o.text)).size).toBe(4);
      expect(q.options.filter((o) => o.id === q.correctId)).toHaveLength(1);
      expect(q.options.find((o) => o.id === q.correctId)?.text).toBe(
        cards.find((c) => c.id === q.id)?.answer,
      );
      for (const option of q.options)
        expect(option.explanation.length).toBeGreaterThan(20);
    }
  });
});
describe("challenge scoring and transitions", () => {
  it("shuffles without changing identity or correctness", () => {
    const values = challengeQuestions[0].options;
    expect(
      shuffle(values, () => 0)
        .map((o) => o.id)
        .sort(),
    ).toEqual(values.map((o) => o.id).sort());
    expect(shuffle(values, () => 0)).not.toEqual(values);
  });
  it("creates full-library and full-domain evaluations with no duplicates", () => {
    const full = createChallenge("full", "all");
    expect(full.questionIds).toHaveLength(cards.length);
    expect(new Set(full.questionIds).size).toBe(cards.length);
    const domain = createChallenge("full", "security");
    expect(domain.questionIds).toHaveLength(30);
    expect(
      domain.questionIds.every(
        (id) => cards.find((c) => c.id === id)?.domain === "security",
      ),
    ).toBe(true);
  });
  it("locks answers and requires confirmation before advancing practice", () => {
    const initial = createChallenge("practice", "all");
    expect(() => advanceChallenge(initial)).toThrow();
    const q = challengeQuestions.find((q) => q.id === initial.questionIds[0])!;
    const answered = answerChallenge(initial, q.correctId);
    expect(answered.cursor).toBe(0);
    expect(() => answerChallenge(answered, q.options[1].id)).toThrow();
    expect(advanceChallenge(answered).cursor).toBe(1);
    expect(initial.answers).toEqual({});
  });
  it("scores the full denominator correctly, persists progression, and separates retries", () => {
    let attempt = createChallenge("full", "all");
    const original = attempt;
    for (let i = 0; i < 114; i++) {
      const q = challengeQuestions.find(
        (q) => q.id === attempt.questionIds[attempt.cursor],
      )!;
      attempt = answerChallenge(
        attempt,
        i < 91 ? q.correctId : q.options.find((o) => o.id !== q.correctId)!.id,
      );
      attempt = parseChallenges(JSON.parse(JSON.stringify([attempt])))[0];
    }
    const result = challengeResult(attempt);
    expect(attempt.completedAt).toBeTruthy();
    expect(result).toMatchObject({
      correct: 91,
      total: 114,
      percent: 80,
      answered: 114,
    });
    expect(result.incorrect).toHaveLength(23);
    expect(result.domains.reduce((n, d) => n + d.correct, 0)).toBe(91);
    const retry = createChallenge(
      "retry",
      "all",
      10,
      result.incorrect,
      attempt.id,
    );
    expect(retry.questionIds.sort()).toEqual([...result.incorrect].sort());
    expect(retry.parentId).toBe(attempt.id);
    expect(original.answers).toEqual({});
    expect(challengeResult(attempt).percent).toBe(80);
    expect(() => answerChallenge(attempt, "invalid")).toThrow();
  });
  it("completes practice after the final explanation and includes challenge records in backups without changing FSRS", () => {
    let a = createChallenge("practice", "billing", 10);
    for (let i = 0; i < 10; i++) {
      const q = challengeQuestions.find(
        (q) => q.id === a.questionIds[a.cursor],
      )!;
      a = advanceChallenge(answerChallenge(a, q.correctId));
    }
    const p = { ...emptyProgress(), challenges: [a] };
    expect(parseProgress(JSON.stringify(p)).challenges?.[0]).toEqual(a);
    expect(p.cards).toEqual({});
    expect(p.history).toEqual([]);
    expect(p.sessions).toEqual([]);
  });
});
describe("safe backward-compatible imports", () => {
  it("accepts old backups and rejects malformed or tampered challenge data", () => {
    expect(parseProgress(JSON.stringify(emptyProgress())).challenges).toEqual(
      [],
    );
    const a = createChallenge("full", "all");
    const variants = [
      { ...a, cursor: -1 },
      { ...a, questionIds: a.questionIds.slice(1) },
      { ...a, optionOrder: {} },
      { ...a, answers: { unknown: "invalid" } },
      { ...a, completedAt: new Date().toISOString() },
      { ...a, domain: "security" },
      { ...a, answers: { [a.questionIds[0]]: "invalid" } },
      { ...a, cursor: 1 },
    ];
    for (const bad of variants)
      expect(() =>
        parseProgress(
          JSON.stringify({ ...emptyProgress(), challenges: [bad] }),
        ),
      ).toThrow();
    expect(() => parseChallenges([a, a])).toThrow();
    expect(() => parseChallenges("bad")).toThrow();
  });
});
