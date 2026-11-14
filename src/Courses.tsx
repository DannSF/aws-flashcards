import { useState } from 'react';
import App from './App';
import { activateCourse, activeCourse, loadPackages, originalCourse, PACKAGES_KEY, parsePackage } from './lib/catalog';
import type { CoursePackage } from './lib/catalog';
export default function Courses() {
  const [catalog] = useState(() => {
    try { return { packages: loadPackages(), error: '' }; }
    catch { return { packages: [], error: 'No se pudo leer el catálogo. Se conservan los datos guardados; la importación está bloqueada.' }; }
  });
  const [packages, setPackages] = useState(catalog.packages);
  const [selected, setSelected] = useState(() => {
    let id = originalCourse.id;
    try { id = localStorage.getItem('cloudrecall.activeCourse') || id; } catch { /* optional preference */ }
    const course = [originalCourse, ...catalog.packages].find(c => c.id === id) || originalCourse;
    activateCourse(course); return course.id;
  });
  const [preview, setPreview] = useState<CoursePackage | null>(null);
  const [error, setError] = useState('');
  const all = [originalCourse, ...packages];
  const inspect = async (file?: File) => {
    setPreview(null); setError('');
    if (!file) return;
    try {
      if (file.size > 5_000_000) throw new Error('El paquete supera 5 MB.');
      const next = parsePackage(await file.text());
      if (all.some(c => c.id === next.id)) throw new Error('Ya existe un curso con este ID. Usa un ID nuevo para conservar su contenido y progreso.');
      setPreview(next);
    } catch (e) { setError(e instanceof Error ? e.message : 'No se pudo leer el paquete.'); }
  };
  const install = () => {
    if (!preview || catalog.error) return;
    try {
      // Recheck disk to avoid overwriting courses installed in another tab.
      const latest = loadPackages();
      if ([originalCourse, ...latest].some(c => c.id === preview.id)) throw new Error('El curso ya existe.');
      const next = [...latest, preview];
      localStorage.setItem(PACKAGES_KEY, JSON.stringify(next));
      setPackages(next); setPreview(null); setError('');
    } catch (e) { setError(e instanceof Error ? e.message : 'No se pudo guardar el curso.'); }
  };
  return <>
    <section className="course-bar" aria-label="Cursos independientes">
      <label>Curso activo <select aria-label="Curso activo" value={selected} onChange={e => {
        const course = all.find(c => c.id === e.target.value)!;
        activateCourse(course); setSelected(course.id);
        try { localStorage.setItem('cloudrecall.activeCourse', course.id); } catch { /* optional preference */ }
      }}>{all.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}</select></label>
      <label className="course-import">Importar paquete JSON<input aria-label="Importar paquete JSON" type="file" accept=".json,application/json" disabled={!!catalog.error} onChange={e => { void inspect(e.target.files?.[0]); e.target.value = ''; }} /></label>
      <details><summary>Paquetes de ejemplo</summary><div>{['clf-c02-avanzado','saa-c03','devops'].map(id => <a key={id} href={`./packages/${id}.json`} download>{id} ↓ </a>)}</div></details>
      {(catalog.error || error) && <p role="alert">{catalog.error || error}</p>}
    </section>
    {preview && <section className="package-preview panel" aria-label="Vista previa del paquete">
      <h2>{preview.title}</h2><p>{preview.description}</p>
      <p>ID: {preview.id} · Versión {preview.version} · {preview.domains.length} temas · {preview.cards.length} flashcards · {preview.challenges.length} retos</p>
      <p>Temas: {preview.domains.map(d => d.name).join(', ')}</p>
      <h3>Ejemplo: {preview.cards[0].question}</h3><p>{preview.cards[0].answer}</p><p>{preview.cards[0].explanation}</p>
      <p>El curso tendrá su propio progreso. Selecciónalo tras importarlo.</p>
      <button onClick={install}>Confirmar importación</button> <button onClick={() => setPreview(null)}>Cancelar</button>
    </section>}
    <App key={selected} />
    <span className="sr-only">{activeCourse.title}</span>
  </>;
}
