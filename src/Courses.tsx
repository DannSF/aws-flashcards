import { useEffect, useRef, useState } from 'react';
import { BookOpen, CheckCircle2, Download, FileJson, Plus, Upload, Search, Trash2, ArrowLeft, ArrowRight } from 'lucide-react';
import App from './App';
import { Button } from './components/ui/button';
import { activateCourse, loadPackages, originalCourse, PACKAGES_KEY, parsePackage } from './lib/catalog';
import { courseSummary, removeCourse } from './lib/course-storage';
import { download } from './lib/progress';
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
  const [open, setOpen] = useState(() => window.location.hash === '#courses');
  useEffect(() => {
    const sync = () => { setOpen(window.location.hash === '#courses'); request.current++; setPreview(null); setBusy(false); setDeleting(null); setError(''); };
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, []);
  const [tab, setTab] = useState<'courses' | 'import' | 'examples'>('courses');
  const [search, setSearch] = useState('');
  const [deleting, setDeleting] = useState<CoursePackage | null>(null);
  const [eraseProgress, setEraseProgress] = useState(false);
  const [undo, setUndo] = useState<CoursePackage | null>(null);
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
  const close = () => { request.current++; setOpen(false); if (window.location.hash === '#courses') window.location.hash = 'dashboard'; setPreview(null); setError(''); setBusy(false); setDragging(false); setDeleting(null); setEraseProgress(false); };
  const validate = (raw: string) => {
    const next = parsePackage(raw);
    if (all.some(c => c.id === next.id)) throw new Error(`«${next.title}» ya está en tus cursos. Ábrelo desde Mis cursos. No se ha cambiado ningún dato.`);
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
      if ([originalCourse, ...latest].some(c => c.id === preview.id)) throw new Error('Este curso ya existe. Recarga la página para verlo en tu biblioteca.');
      const next = [...latest, preview];
      localStorage.setItem(PACKAGES_KEY, JSON.stringify(next));
      setPackages(next); changeCourse(preview);
      setUndo(null); setSuccess(`Curso añadido: ${preview.title}. Ya puedes estudiar o iniciar un reto.`); close();
    } catch (e) { setError(e instanceof Error ? e.message : 'No se pudo guardar el curso.'); }
  };
  const switchTab = (next: typeof tab) => { request.current++; setTab(next); setPreview(null); setError(''); setBusy(false); setDeleting(null); setDragging(false); };
  const erase = () => {
    if (!deleting) return;
    try {
      const next = removeCourse(deleting.id, eraseProgress);
      setPackages(next);
      if (selected === deleting.id) changeCourse(originalCourse);
      setUndo(eraseProgress ? null : deleting);
      setSuccess(eraseProgress ? `Curso y progreso eliminados: ${deleting.title}.` : `Curso eliminado: ${deleting.title}. Conservamos su progreso para cuando lo reimportes.`);
      setDeleting(null); setEraseProgress(false); setError('');
    } catch (e) { setError(e instanceof Error ? e.message : 'No se pudo eliminar el curso.'); }
  };
  const restore = () => {
    if (!undo) return;
    try {
      const latest = loadPackages();
      if (latest.some(c => c.id === undo.id)) throw new Error('El curso ya está en tu biblioteca.');
      const next = [...latest, undo]; localStorage.setItem(PACKAGES_KEY, JSON.stringify(next));
      setPackages(next); setSuccess(`Curso restaurado: ${undo.title}.`); setUndo(null);
    } catch (e) { setError(e instanceof Error ? e.message : 'No se pudo restaurar.'); }
  };
  const management = <section className="courses-page" aria-label="Gestión de cursos">
      <div className="page-heading"><div><div className="eyebrow">TU BIBLIOTECA PERSONAL</div><h1>Mis cursos<span className="heading-dot">.</span></h1><p>Aprende lo que te interesa. Cada materia, a tu ritmo.</p></div>{!deleting && <Button onClick={() => switchTab('import')} aria-pressed={tab === 'import'}><Plus size={16} />Añadir curso</Button>}</div>
      <div className="course-import-flow">
        {!deleting && <nav className="course-tabs" aria-label="Gestión de cursos">{([['courses', 'Mi biblioteca'], ['examples', 'Explorar ejemplos']] as const).map(([id, label]) => <button key={id} aria-current={tab === id ? 'page' : undefined} onClick={() => switchTab(id)}>{label}</button>)}</nav>}
        {success && <p className="course-success" role="status">{success}{undo && <button className="text-button" onClick={restore}>Deshacer</button>}</p>}
        {deleting ? <section className="course-delete" aria-label="Confirmar eliminación">
          <button className="text-button" onClick={() => { setDeleting(null); setError(''); }}><ArrowLeft size={15} />Volver a mi biblioteca</button>
          <Trash2 size={28} /><h3>¿Eliminar «{deleting.title}»?</h3>
          <p>Quitaremos sus {deleting.cards.length} flashcards y {deleting.challenges.length} retos de tu biblioteca. Los demás cursos no cambian.</p>
          <label className="delete-option"><input type="checkbox" checked={eraseProgress} onChange={e => setEraseProgress(e.target.checked)} />Eliminar también sus repasos, retos y progreso guardados</label>
          <p>{eraseProgress ? 'Esta opción borra el progreso de forma permanente y no se puede deshacer.' : 'Tu progreso se conserva. Si reimportas el mismo paquete, podrás continuar donde lo dejaste.'}</p>
          {selected === deleting.id && <p>Es tu curso activo. Al eliminarlo, abriremos el curso incluido de CLF-C02.</p>}
          <div className="dialog-actions"><Button variant="outline" onClick={() => setDeleting(null)}>Cancelar</Button><Button className="course-danger" onClick={erase}>Eliminar curso{eraseProgress ? ' y progreso' : ''}</Button></div>
        </section> : tab === 'courses' ? <section className="course-library" aria-label="Mi biblioteca de cursos">
          <div className="course-library-heading"><div><h3>Todo lo que estás aprendiendo.</h3><p>{all.length} {all.length === 1 ? 'curso' : 'cursos'} · Un progreso independiente para cada materia</p></div></div>
          <label className="course-search"><Search size={16} /><input aria-label="Buscar cursos" placeholder="Buscar por nombre o materia…" value={search} onChange={e => setSearch(e.target.value)} /></label>
          <div className="course-list">{all.filter(c => `${c.title} ${c.description}`.toLowerCase().includes(search.toLowerCase())).map(c => {
            const summary = courseSummary(c.id);
            return <article className={`managed-course ${selected === c.id ? 'is-active' : ''}`} key={c.id} aria-label={c.title}>
              <div className="managed-course-top"><BookOpen size={22} /><span>{selected === c.id ? 'CURSO ACTIVO' : c.id === originalCourse.id ? 'INCLUIDO' : 'IMPORTADO'}</span></div>
              <h4>{c.title}</h4><p>{c.description}</p><div className="managed-course-meta">{c.cards.length} flashcards · {c.challenges.length} retos · {c.domains.length} temas</div>
              {summary.unreadable ? <p>Progreso no disponible. Los datos guardados se conservan.</p> : <><div className="managed-course-track"><i style={{width: `${Math.min(100, summary.learned / c.cards.length * 100)}%`}} /></div><p>{summary.learned} de {c.cards.length} tarjetas estudiadas · {summary.reviews} repasos</p></>}
              <div className="managed-course-actions"><Button variant={selected === c.id ? 'outline' : 'default'} onClick={() => { changeCourse(c); close(); setSuccess(''); }}>{selected === c.id ? 'Continuar' : 'Abrir curso'}<ArrowRight size={15} /></Button>
              <button className="icon-button" aria-label={`Exportar paquete de ${c.title}`} onClick={() => { try { download(`${c.id}.json`, JSON.stringify(c, null, 2)); } catch { setError('No se pudo exportar el paquete.'); } }}><Download size={17} /></button>
              {c.id !== originalCourse.id && <button className="icon-button" disabled={!!catalog.error} aria-label={`Eliminar ${c.title}`} onClick={() => { setDeleting(c); setEraseProgress(false); setError(''); }}><Trash2 size={17} /></button>}</div>
              {c.id === originalCourse.id && <small>Curso incluido en la aplicación; su progreso se gestiona en Ajustes.</small>}
            </article>;
          })}</div>
          {!all.some(c => `${c.title} ${c.description}`.toLowerCase().includes(search.toLowerCase())) && <div className="course-empty"><Search size={24} /><h4>No encontramos ese curso</h4><p>Prueba otro nombre o importa un nuevo paquete.</p><Button variant="outline" onClick={() => setSearch('')}>Limpiar búsqueda</Button></div>}
          {packages.length === 0 && <div className="course-empty"><h4>Tu biblioteca puede crecer</h4><p>Importa tu propio material o prueba Python, arquitectura y DevOps.</p></div>}
        </section> : <>
        <ol className="import-steps" aria-label="Pasos de importación"><li className={!preview ? 'current' : ''}>1 · Elegir contenido</li><li className={preview ? 'current' : ''}>2 · Revisar y añadir</li></ol>
        {!preview ? <>
          {tab === 'import' && <><div className="import-intro"><h3>Tu próxima materia empieza aquí.</h3><p>Un paquete añade flashcards y preguntas de opción múltiple. Cada curso conserva su propio progreso.</p></div>
          <div className={`import-dropzone ${dragging ? 'dragging' : ''}`} onDragOver={e => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={e => { e.preventDefault(); setDragging(false); if (!catalog.error) void inspect(e.dataTransfer.files[0]); }}>
            <Upload size={26} aria-hidden="true" /><h4>Arrastra aquí tu paquete JSON</h4><p>Hasta 5 MB · Se validará antes de guardarlo</p>
            <Button variant="outline" disabled={busy || !!catalog.error} onClick={() => input.current?.click()}>Elegir archivo JSON</Button>
            <input ref={input} className="sr-only" aria-label="Importar paquete JSON" type="file" accept=".json,application/json" disabled={!!catalog.error} onChange={e => { void inspect(e.target.files?.[0]); e.target.value = ''; }} />
          </div>
          </>}
          {tab === 'examples' && <><div className="import-example-heading"><h3>¿Quieres probar primero?</h3><p>Abre un ejemplo o descarga el JSON para importarlo tú.</p></div>
          <div className="import-examples">{examples.map(item => <article key={item.id}>
            <FileJson size={20} aria-hidden="true" /><div><h4>{item.title}</h4><p>{item.detail}</p></div>
            {all.some(c => c.id === item.id) ? <button className="text-button" aria-label={`Abrir curso de ${item.title}`} onClick={() => { changeCourse(all.find(c => c.id === item.id)!); close(); setSuccess(''); }}>Abrir curso<span className="sr-only"> de {item.title}</span><CheckCircle2 size={14} aria-label="Ya añadido" /></button> : <button className="text-button" disabled={busy || !!catalog.error} onClick={() => void example(item.id)}>Vista previa<span className="sr-only"> de {item.title}</span></button>}
            <a className="icon-button" href={`${import.meta.env.BASE_URL}packages/${item.id}.json`} download aria-label={`Descargar JSON de ${item.title}`}><Download size={17} /></a>
          </article>)}</div></>}
        </> : <section className="package-preview" aria-label="Vista previa del paquete">
          <span className="package-valid"><CheckCircle2 size={16} />Paquete validado</span><h3>{preview.title}</h3><p>{preview.description}</p>
          <div className="package-counts"><span><strong>{preview.cards.length}</strong> flashcards</span><span><strong>{preview.challenges.length}</strong> retos</span><span><strong>{preview.domains.length}</strong> temas</span></div>
          <p className="package-topics">{preview.domains.map(d => d.name).join(' · ')}</p>
          <div className="package-sample"><span>UNA MUESTRA DE LO QUE APRENDERÁS</span><h4>{preview.cards[0].question}</h4><p><strong>{preview.cards[0].answer}</strong></p><p>{preview.cards[0].explanation}</p></div>
          <details className="package-metadata"><summary>Detalles del paquete</summary><p>ID: {preview.id} · Versión {preview.version}</p></details>
          <p className="package-reassurance">Tu contenido y progreso actuales se conservan. Al añadirlo, abriremos este curso para que puedas empezar.</p>
          <div className="dialog-actions"><Button variant="outline" onClick={() => { setPreview(null); setError(''); }}>{tab === 'examples' ? 'Volver a ejemplos' : 'Elegir otro archivo'}</Button><Button disabled={!!catalog.error} onClick={install}><Plus size={16} />Añadir y abrir curso</Button></div>
        </section>}
        </>}
        {busy && <p role="status">Validando contenido…</p>}
        {(catalog.error || error) && <div className="import-error" role="alert"><strong>No se pudo completar la acción</strong><p>{catalog.error || error}</p><p>Tu biblioteca y tu progreso siguen intactos.</p></div>}
      </div>
    </section>;
  return <App key={selected} coursesContent={management} showCourses={open}
    onOpenCourses={() => { switchTab('courses'); setOpen(true); window.location.hash = 'courses'; }}
    onLeaveCourses={close} courseList={all} onSelectCourse={course => { changeCourse(course); close(); setSuccess(''); }}
    courseNotice={!open && success ? <p className="course-success panel" role="status"><CheckCircle2 size={16} />{success}{undo && <button className="text-button" onClick={restore}>Deshacer</button>}</p> : null} />;
}
