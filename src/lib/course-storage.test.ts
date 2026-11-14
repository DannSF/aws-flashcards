import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { PACKAGES_KEY, parsePackage } from './catalog';
import { courseProgressKey, removeCourse } from './course-storage';
const course = parsePackage(readFileSync('public/packages/devops.json','utf8'));
let values: Map<string,string>;
beforeEach(() => {
  values = new Map([[PACKAGES_KEY, JSON.stringify([course])], [courseProgressKey(course.id),'saved-progress'], ['cloudrecall.progress.v1','original-progress']]);
  vi.stubGlobal('localStorage', {getItem: (k:string) => values.get(k) ?? null, setItem: (k:string,v:string) => {values.set(k,v);}, removeItem: (k:string) => {values.delete(k);} });
});
afterEach(() => vi.unstubAllGlobals());
it('removes the package while retaining progress by default', () => {
  expect(removeCourse(course.id,false)).toEqual([]);
  expect(values.get(courseProgressKey(course.id))).toBe('saved-progress');
  expect(values.get('cloudrecall.progress.v1')).toBe('original-progress');
});
it('deletes only the selected course progress when explicitly requested', () => {
  removeCourse(course.id,true);
  expect(values.has(courseProgressKey(course.id))).toBe(false);
  expect(values.get('cloudrecall.progress.v1')).toBe('original-progress');
});
it('restores the catalog when removing progress fails', () => {
  const previous = values.get(PACKAGES_KEY);
  localStorage.removeItem = () => { throw new Error('blocked'); };
  expect(() => removeCourse(course.id,true)).toThrow('blocked');
  expect(values.get(PACKAGES_KEY)).toBe(previous);
  expect(values.get(courseProgressKey(course.id))).toBe('saved-progress');
});
it('does not overwrite an unreadable catalog or remove the included course', () => {
  values.set(PACKAGES_KEY,'bad');
  expect(() => removeCourse(course.id,true)).toThrow();
  expect(values.get(PACKAGES_KEY)).toBe('bad');
  expect(() => removeCourse('clf-c02',true)).toThrow('curso incluido');
  expect(values.get('cloudrecall.progress.v1')).toBe('original-progress');
});
