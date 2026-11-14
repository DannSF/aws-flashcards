import { loadPackages, originalCourse, PACKAGES_KEY } from './catalog';
import type { CoursePackage } from './catalog';
export const courseProgressKey = (id: string) => id === originalCourse.id ? 'cloudrecall.progress.v1' : `cloudrecall.course.${id}.progress.v1`;
export function courseSummary(id: string) {
  try {
    const raw = localStorage.getItem(courseProgressKey(id));
    if (!raw) return { reviews: 0, learned: 0, unreadable: false };
    const p = JSON.parse(raw);
    if (!p || !Array.isArray(p.history) || !p.cards || typeof p.cards !== 'object' || Array.isArray(p.cards)) throw new Error();
    return { reviews: p.history.length, learned: Object.keys(p.cards).length, unreadable: false };
  } catch { return { reviews: 0, learned: 0, unreadable: true }; }
}
export function removeCourse(id: string, eraseProgress: boolean): CoursePackage[] {
  if (id === originalCourse.id) throw new Error('El curso incluido forma parte de la aplicación. Su progreso se gestiona en Ajustes.');
  const latest = loadPackages();
  if (!latest.some(p => p.id === id)) throw new Error('El curso ya no existe. Recarga para actualizar la biblioteca.');
  const next = latest.filter(p => p.id !== id);
  const previous = localStorage.getItem(PACKAGES_KEY);
  localStorage.setItem(PACKAGES_KEY, JSON.stringify(next));
  if (eraseProgress) {
    try { localStorage.removeItem(courseProgressKey(id)); }
    catch (error) {
      // Restore the catalog if progress deletion fails; never report a partial deletion as success.
      if (previous !== null) localStorage.setItem(PACKAGES_KEY, previous);
      throw error;
    }
  }
  return next;
}
