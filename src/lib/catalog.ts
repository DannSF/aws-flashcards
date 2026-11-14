import { cards as originalCards, CONTENT_VERSION } from '../data/cards';
import { domains as originalDomains } from '../data/domains';
import { challengeQuestions as originalQuestions } from '../data/challenges';
import type { Flashcard } from '../types';
import type { ChallengeQuestion } from '../data/challenges';
export interface CoursePackage {
  schemaVersion: 1;
  id: string;
  title: string;
  description: string;
  version: string;
  domains: typeof originalDomains;
  cards: Flashcard[];
  challenges: ChallengeQuestion[];
}
export const originalCourse: CoursePackage = { schemaVersion: 1, id: 'clf-c02', title: 'AWS Cloud Practitioner', description: 'CLF-C02 · Nivel foundational', version: CONTENT_VERSION, domains: originalDomains, cards: originalCards, challenges: originalQuestions };
export let activeCourse = originalCourse;
export let cards = originalCards;
export let domains = originalDomains;
export let challengeQuestions = originalQuestions;
export let contentVersion = CONTENT_VERSION;
export let storageKey = 'cloudrecall.progress.v1';
export function activateCourse(course: CoursePackage) {
  activeCourse = course; cards = course.cards; domains = course.domains;
  challengeQuestions = course.challenges; contentVersion = course.version;
  storageKey = course.id === originalCourse.id ? 'cloudrecall.progress.v1' : `cloudrecall.course.${course.id}.progress.v1`;
}
const object = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);
const text = (v: unknown): v is string => typeof v === 'string' && v.trim().length > 0 && v.length <= 10000;
const identifier = (v: unknown): v is string => typeof v === 'string' && /^[a-z0-9][a-z0-9-]{0,79}$/.test(v);
const strings = (v: unknown) => Array.isArray(v) && v.every(text);
export function parsePackage(raw: string): CoursePackage {
  if (new Blob([raw]).size > 5_000_000) throw new Error('El paquete supera 5 MB.');
  let v: unknown;
  try { v = JSON.parse(raw); } catch { throw new Error('JSON inválido.'); }
  const fail = (path: string): never => { throw new Error(`Paquete inválido: ${path}.`); };
  if (!object(v) || v.schemaVersion !== 1 || !identifier(v.id) || !text(v.title) || !text(v.description) || !text(v.version)) fail('metadatos o schemaVersion');
  const p = v as Record<string, unknown>;
  if (!Array.isArray(p.domains) || !p.domains.length || p.domains.length > 20) fail('domains');
  const domainIds = new Set<string>();
  for (const d of p.domains as unknown[]) {
    if (!object(d) || !identifier(d.id) || domainIds.has(d.id) || !text(d.name) || !text(d.short) || !text(d.description) || typeof d.weight !== 'number' || !Number.isFinite(d.weight) || d.weight < 0 || d.weight > 100 || typeof d.color !== 'string' || !/^#[0-9a-f]{6}$/i.test(d.color)) fail('domains: campos o ID duplicado');
    domainIds.add((d as {id:string}).id);
  }
  if (!Array.isArray(p.cards) || !p.cards.length || p.cards.length > 10000) fail('cards');
  const cardMap = new Map<string, Record<string, unknown>>();
  for (const c of p.cards as unknown[]) {
    if (!object(c) || !identifier(c.id) || cardMap.has(c.id) || !domainIds.has(c.domain as string) || !['service','category','question','answer','explanation','example','confusion','mnemonic'].every(k => text(c[k])) || !strings(c.keywords) || !strings(c.tags) || !['Foundation','Applied'].includes(c.difficulty as string)) fail('cards: campos, dominio o ID duplicado');
    cardMap.set((c as {id:string}).id, c as Record<string,unknown>);
  }
  if (!Array.isArray(p.challenges) || p.challenges.length !== cardMap.size) fail('challenges: se requiere un reto por tarjeta');
  const questionIds = new Set<string>();
  for (const q of p.challenges as unknown[]) {
    if (!object(q) || !cardMap.has(q.id as string) || questionIds.has(q.id as string) || q.domain !== cardMap.get(q.id as string)?.domain || !text(q.prompt) || !Array.isArray(q.options) || q.options.length !== 4) fail('challenges: referencia o campos');
    const question = q as Record<string, unknown>;
    const optionIds = new Set<string>();
    for (const o of question.options as unknown[]) {
      if (!object(o) || !identifier(o.id) || optionIds.has(o.id) || !text(o.text) || !text(o.explanation)) fail('challenges.options');
      optionIds.add((o as {id:string}).id);
    }
    if (!optionIds.has(question.correctId as string)) fail('challenges.correctId');
    questionIds.add(question.id as string);
  }
  if ([...domainIds].some(id => ![...cardMap.values()].some(c => c.domain === id))) fail('dominio sin tarjetas');
  return v as CoursePackage;
}
export const PACKAGES_KEY = 'cloudrecall.packages.v2';
export function loadPackages(): CoursePackage[] {
  const raw = localStorage.getItem(PACKAGES_KEY);
  if (!raw) return [];
  const values: unknown = JSON.parse(raw);
  if (!Array.isArray(values)) throw new Error('Catálogo guardado inválido.');
  const packages = values.map(v => parsePackage(JSON.stringify(v)));
  if (new Set([originalCourse.id, ...packages.map(p => p.id)]).size !== packages.length + 1) throw new Error('IDs de curso duplicados.');
  return packages;
}
