import { describe, it, expect } from "vitest";
import { cards } from "../data/cards";
import {
  cardStatus,
  emptyProgress,
  localDay,
  parseProgress,
  review,
  streak,
} from "./progress";
const now = new Date("2026-11-12T12:00:00Z");
const reviewed = () =>
  review(emptyProgress(), "clf-001", 3, "session", "2026-11-12T11:59:00Z", now);
describe("content library", () => {
  it("has at least 100 unique and fully populated bilingual cards across all four domains", () => {
    expect(cards.length).toBeGreaterThanOrEqual(100);
    expect(new Set(cards.map((c) => c.id)).size).toBe(cards.length);
    expect(new Set(cards.map((c) => c.question)).size).toBe(cards.length);
    expect(new Set(cards.map((c) => c.domain)).size).toBe(4);
    for (const card of cards) {
      for (const field of [
        "question",
        "explanation",
        "example",
        "confusion",
        "mnemonic",
      ] as const)
        expect(card[field].length).toBeGreaterThan(10);
      expect(card.answer.length).toBeGreaterThan(0);
      expect(card.keywords.length).toBeGreaterThan(0);
      expect(card.mnemonic).not.toBe(card.explanation);
    }
  });
  it("keeps security distinctions and multiple-choice-free questions defensible", () => {
    expect(
      cards.find((c) => c.answer === "Amazon GuardDuty")?.confusion,
    ).toContain("Inspector");
    expect(cards.find((c) => c.answer === "Amazon Macie")?.question).toContain(
      "S3",
    );
    expect(
      cards.find((c) => c.answer === "High availability and failover")
        ?.question,
    ).toContain("standby instance");
  });
});
describe("FSRS and analytics", () => {
  it("schedules Again sooner than Easy and records review metadata", () => {
    const again = review(
      emptyProgress(),
      "clf-001",
      1,
      "s",
      now.toISOString(),
      now,
    );
    const easy = review(
      emptyProgress(),
      "clf-001",
      4,
      "s",
      now.toISOString(),
      now,
    );
    expect(again.cards["clf-001"].due.getTime()).toBeLessThan(
      easy.cards["clf-001"].due.getTime(),
    );
    expect(easy.cards["clf-001"].stability).toBeGreaterThan(0);
    expect(again.history[0].rating).toBe(1);
    expect(again.cards["clf-001"].last_review?.toISOString()).toBe(
      now.toISOString(),
    );
  });
  it("counts a session once across multiple ratings and preserves its original start", () => {
    const first = reviewed();
    const next = review(
      first,
      "clf-002",
      2,
      "session",
      "2026-11-12T12:00:00Z",
      now,
    );
    expect(next.sessions).toHaveLength(1);
    expect(next.sessions[0].reviews).toBe(2);
    expect(next.sessions[0].startedAt).toBe("2026-11-12T11:59:00Z");
    expect(first.history).toHaveLength(1);
  });
  it("distinguishes new, due, learning, and mastered without fake progress", () => {
    expect(cardStatus(undefined, now)).toBe("new");
    const card = reviewed().cards["clf-001"];
    expect(cardStatus({ ...card, due: new Date(now.getTime() - 1) }, now)).toBe(
      "due",
    );
    expect(cardStatus({ ...card, state: 2, stability: 25 }, now)).toBe(
      "mastered",
    );
    expect(cardStatus({ ...card, stability: 1 }, now)).toBe("learning");
  });
  it("counts consecutive calendar days including a streak before today starts", () => {
    const p = reviewed();
    expect(streak(p, now)).toBe(1);
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    expect(streak(p, tomorrow)).toBe(1);
    tomorrow.setDate(tomorrow.getDate() + 1);
    expect(streak(p, tomorrow)).toBe(0);
    expect(localDay(now)).toMatch(/^2026-11-12$/);
  });
});
describe("backups", () => {
  it("round trips progress with hydrated FSRS dates and can schedule another review", () => {
    const imported = parseProgress(JSON.stringify(reviewed()));
    expect(imported.cards["clf-001"].due).toBeInstanceOf(Date);
    expect(imported.cards["clf-001"].last_review).toBeInstanceOf(Date);
    expect(
      review(
        imported,
        "clf-001",
        4,
        "next",
        now.toISOString(),
        new Date("2026-11-13"),
      ).history,
    ).toHaveLength(2);
  });
  it.each([
    "null",
    "{}",
    "not json",
    JSON.stringify({ ...emptyProgress(), version: 2 }),
    JSON.stringify({ ...emptyProgress(), dailyGoal: -1 }),
    JSON.stringify({ ...emptyProgress(), history: [{ cardId: "unknown" }] }),
  ])("rejects malformed input: %s", (raw) =>
    expect(() => parseProgress(raw)).toThrow(),
  );
  it("rejects invalid scheduling parameters, unknown cards, histories and sessions", () => {
    const p = JSON.parse(JSON.stringify(reviewed()));
    p.cards["clf-001"].stability = -5;
    expect(() => parseProgress(JSON.stringify(p))).toThrow();
    const q = JSON.parse(JSON.stringify(reviewed()));
    q.cards["clf-001"].due = "invalid";
    expect(() => parseProgress(JSON.stringify(q))).toThrow();
    const r = JSON.parse(JSON.stringify(reviewed()));
    r.history[0].rating = 5;
    expect(() => parseProgress(JSON.stringify(r))).toThrow();
    const s = JSON.parse(JSON.stringify(reviewed()));
    s.sessions[0].endedAt = "2020-01-01";
    expect(() => parseProgress(JSON.stringify(s))).toThrow();
  });
});
