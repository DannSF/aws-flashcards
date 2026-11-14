import { useRef, useState } from 'react';
import { BookOpen, CheckCircle2, Download, FileJson, Plus, Upload } from 'lucide-react';
import App from './App';
import { Dialog } from './components/StudyWidgets';
import { Button } from './components/ui/button';
import { activateCourse, loadPackages, originalCourse, PACKAGES_KEY, parsePackage } from './lib/catalog';
import type { CoursePackage } from './lib/catalog';
const examples = [
  { id: 'python-fundamentos', title: 'Python desde cero', detail: 'Programación · 8 tarjetas y retos' },
  { id: 'clf-c02-avanzado', title: 'CLF-C02 avanzado', detail: 'AWS · 6 tarjetas y retos' },
  { id: 'saa-c03', title: 'SAA-C03', detail: 'Arquitectura · 6 tarjetas y retos' },
  { id: 'devops', title: 'DevOps', detail: 'Entrega y fiabilidad · 6 tarjetas y retos' },
];
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
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState<CoursePackage | null>(null);
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState('');
  const input = useRef<HTMLInputElement>(null);
  const request = useRef(0);
  const all = [originalCourse, ...packages];
  const changeCourse = (course: CoursePackage) => {
    activateCourse(course); setSelected(course.id);
    try { localStorage.setItem('cloudrecall.activeCourse', course.id); } catch { /* optional preference */ }
  };
  const close = () => { request.current++; setOpen(false); setPreview(null); setError(''); setBusy(false); setDragging(false); };
  const validate = (raw: string) => {
    const next = parsePackage(raw);
    if (all.some(c => c.id === next.id)) throw new Error(`«${next.title}» ya está en tus cursos. Selecciónalo en Curso activo. No se ha cambiado ningún dato.`);
    return next;
  };
  const inspect = async (file?: File) => {
    if (!file) return;
    const token = ++request.current;
    setPreview(null); setError(''); setBusy(true);
    try {
      if (file.size > 5_000_000) throw new Error('El archivo supera 5 MB. Elige un paquete más pequeño.');
      const raw = await file.text();
      if (token === request.current) setPreview(validate(raw));
    } catch (e) { if (token === request.current) setError(e instanceof Error ? e.message : 'No se pudo leer el paquete.'); }
    finally { if (token === request.current) setBusy(false); }
  };
  const example = async (id: string) => {
    const token = ++request.current;
    setPreview(null); setError(''); setBusy(true);
    try {
      const response = await fetch(`${import.meta.env.BASE_URL}packages/${id}.json`);
      if (!response.ok) throw new Error('No se pudo cargar el ejemplo. Descarga su JSON y vuelve a intentarlo.');
      const raw = await response.text();
      if (token === request.current) setPreview(validate(raw));
    } catch (e) { if (token === request.current) setError(e instanceof Error ? e.message : 'No se pudo cargar el ejemplo.'); }
    finally { if (token === request.current) setBusy(false); }
  };
  const install = () => {
    if (!preview || catalog.error) return;
    try {
      const latest = loadPackages();
      if ([originalCourse, ...latest].some(c => c.id === preview.id)) throw new Error('Este curso ya existe. Cierra el diálogo y recarga para verlo en el selector.');
      const next = [...latest, preview];
      localStorage.setItem(PACKAGES_KEY, JSON.stringify(next));
      setPackages(next); changeCourse(preview);
      setSuccess(`Curso añadido: ${preview.title}. Ya puedes estudiar o iniciar un reto.`); close();
    } catch (e) { setError(e instanceof Error ? e.message : 'No se pudo guardar el curso.'); }
  };
  return <>
    <section className="course-bar" aria-label="Cursos independientes">
      <div className="course-picker"><BookOpen size={20} aria-hidden="true" /><label>MI APRENDIZAJE<select aria-label="Curso activo" value={selected} onChange={e => { changeCourse(all.find(c => c.id === e.target.value)!); setSuccess(''); }}>{all.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}</select></label></div>
      <Button variant="outline" onClick={() => { setOpen(true); setSuccess(''); }}><Plus size={16} />Añadir curso</Button>
      {catalog.error && <p role="alert">{catalog.error}</p>}
      {success && <p className="course-success" role="status"><CheckCircle2 size={16} />{success}</p>}
    </section>
    <App key={selected} />
    {open && <Dialog title="Añadir un curso" onClose={close}>
      <div className="course-import-flow">
        <ol className="import-steps" aria-label="Pasos de importación"><li className={!preview ? 'current' : ''}>1 · Elegir contenido</li><li className={preview ? 'current' : ''}>2 · Revisar y añadir</li></ol>
        {!preview ? <>
          <div className="import-intro"><h3>Tu próxima materia empieza aquí.</h3><p>Un paquete añade flashcards y preguntas de opción múltiple. Cada curso conserva su propio progreso.</p></div>
          <div className={`import-dropzone ${dragging ? 'dragging' : ''}`} onDragOver={e => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={e => { e.preventDefault(); setDragging(false); if (!catalog.error) void inspect(e.dataTransfer.files[0]); }}>
            <Upload size={26} aria-hidden="true" /><h4>Arrastra aquí tu paquete JSON</h4><p>Hasta 5 MB · Se validará antes de guardarlo</p>
            <Button variant="outline" disabled={busy || !!catalog.error} onClick={() => input.current?.click()}>Elegir archivo</Button>
            <input ref={input} className="sr-only" aria-label="Importar paquete JSON" type="file" accept=".json,application/json" disabled={!!catalog.error} onChange={e => { void inspect(e.target.files?.[0]); e.target.value = ''; }} />
          </div>
          <div className="import-example-heading"><h3>¿Quieres probar primero?</h3><p>Abre un ejemplo o descarga el JSON para importarlo tú.</p></div>
          <div className="import-examples">{examples.map(item => <article key={item.id}>
            <FileJson size={20} aria-hidden="true" /><div><h4>{item.title}</h4><p>{item.detail}</p></div>
            <button className="text-button" disabled={busy || !!catalog.error} onClick={() => void example(item.id)}>Vista previa<span className="sr-only"> de {item.title}</span></button>
            <a className="icon-button" href={`${import.meta.env.BASE_URL}packages/${item.id}.json`} download aria-label={`Descargar JSON de ${item.title}`}><Download size={17} /></a>
          </article>)}</div>
        </> : <section className="package-preview" aria-label="Vista previa del paquete">
          <span className="package-valid"><CheckCircle2 size={16} />Paquete validado</span><h3>{preview.title}</h3><p>{preview.description}</p>
          <div className="package-counts"><span><strong>{preview.cards.length}</strong> flashcards</span><span><strong>{preview.challenges.length}</strong> retos</span><span><strong>{preview.domains.length}</strong> temas</span></div>
          <p className="package-topics">{preview.domains.map(d => d.name).join(' · ')}</p>
          <div className="package-sample"><span>UNA MUESTRA DE LO QUE APRENDERÁS</span><h4>{preview.cards[0].question}</h4><p><strong>{preview.cards[0].answer}</strong></p><p>{preview.cards[0].explanation}</p></div>
          <details className="package-metadata"><summary>Detalles del paquete</summary><p>ID: {preview.id} · Versión {preview.version}</p></details>
          <p className="package-reassurance">Tu contenido y progreso actuales se conservan. Al añadirlo, abriremos este curso para que puedas empezar.</p>
          <div className="dialog-actions"><Button variant="outline" onClick={() => { setPreview(null); setError(''); }}>Elegir otro archivo</Button><Button disabled={!!catalog.error} onClick={install}><Plus size={16} />Añadir y abrir curso</Button></div>
        </section>}
        {busy && <p role="status">Validando contenido…</p>}
        {(catalog.error || error) && <div className="import-error" role="alert"><strong>No se ha importado el curso</strong><p>{catalog.error || error}</p><p>Tu biblioteca y tu progreso siguen intactos.</p></div>}
      </div>
    </Dialog>}
  </>;
}
