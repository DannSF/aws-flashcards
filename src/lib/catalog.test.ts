import { afterEach, describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { activateCourse, originalCourse, parsePackage } from './catalog';
import { emptyProgress, parseProgress, review } from './progress';
import { createChallenge, answerChallenge, challengeResult } from './challenge';
const raw = readFileSync('public/packages/devops.json', 'utf8');
afterEach(() => activateCourse(originalCourse));
describe('course packages', () => {
  it('validates all supplied packages', () => {
    for (const id of ['devops','saa-c03','clf-c02-avanzado']) expect(parsePackage(readFileSync(`public/packages/${id}.json`, 'utf8')).cards).toHaveLength(6);
  });
  it('rejects malformed content, duplicate IDs and dangling references', () => {
    for (const mutate of [(p: any) => p.cards.push(p.cards[0]), (p: any) => p.challenges[0].correctId = 'missing', (p: any) => p.cards[0].domain = 'missing', (p: any) => p.challenges[0].options.pop(), (p: any) => p.schemaVersion = 2]) {
      const p = JSON.parse(raw); mutate(p); expect(() => parsePackage(JSON.stringify(p))).toThrow('Paquete inválido');
    }
    expect(() => parsePackage('{')).toThrow('JSON inválido');
  });
  it('uses arbitrary domains, schedules and restores course-specific challenges', () => {
    const course = parsePackage(raw); activateCourse(course);
    const progress = review(emptyProgress(), course.cards[0].id, 3, 'session', new Date().toISOString());
    const attempt = createChallenge('full','all');
    expect(attempt.questionIds).toHaveLength(6);
    const q = course.challenges.find(q => q.id === attempt.questionIds[0])!;
    const answered = answerChallenge(attempt, q.correctId);
    expect(challengeResult(answered).correct).toBe(1);
    const backup = JSON.stringify({...progress, challenges: [answered], courseId: course.id});
    expect(parseProgress(backup).cards[course.cards[0].id].due).toBeInstanceOf(Date);
    activateCourse(originalCourse);
    expect(() => parseProgress(backup)).toThrow();
    expect(parseProgress(JSON.stringify(emptyProgress())).history).toEqual([]);
  });
});
