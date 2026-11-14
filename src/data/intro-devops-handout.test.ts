import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { parsePackage } from '../lib/catalog';
const course = parsePackage(readFileSync('public/packages/intro-devops-handout-es.json', 'utf8'));
const normalize = (s: string) => s.normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
describe('DevOps handout study content', () => {
  it('keeps application examples distinct from questions and option feedback', () => {
    expect(course.cards).toHaveLength(32);
    for (const card of course.cards) {
      const question = course.challenges.find(q => q.id === card.id)!;
      expect(question).toBeDefined();
      expect(normalize(card.example), card.id).not.toContain(normalize(card.question));
      expect(normalize(card.example), card.id).not.toContain(normalize(question.prompt));
      expect(card.example, card.id).not.toMatch(/[¿?]/);
      expect(card.example, card.id).not.toEqual(card.explanation);
      expect(question.options.map(o => normalize(o.explanation)), card.id).not.toContain(normalize(card.confusion));
      expect(question.options.find(o => o.id === question.correctId)?.text, card.id).toBe(card.answer);
    }
  });
  it('keeps source references in metadata rather than visible learning fields', () => {
    const fields = course.cards.flatMap(c => [c.question, c.answer, c.explanation, c.example, c.confusion, c.mnemonic]);
    fields.push(...course.challenges.flatMap(q => [q.prompt, ...q.options.flatMap(o => [o.text, o.explanation])]));
    for (const field of fields) expect(field).not.toMatch(/\bPDF\b|según el (documento|mapa)|\bdiapositiva\b|fuente:/i);
  });
});
