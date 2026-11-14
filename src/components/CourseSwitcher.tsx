import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowRight, BookOpen, CheckCircle2, ChevronsUpDown, FolderOpen, Search } from 'lucide-react';
import type { CoursePackage } from '../lib/catalog';
import { courseSummary } from '../lib/course-storage';
import { Dialog } from './StudyWidgets';
import { Button } from './ui/button';
interface Props {
  courses: CoursePackage[];
  activeId: string;
  onSelect: (course: CoursePackage) => void;
  onManage: () => void;
}
export function CourseSwitcher({ courses, activeId, onSelect, onManage }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const input = useRef<HTMLInputElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const restoreFocus = useRef(false);
  useEffect(() => {
    if (!open && restoreFocus.current) {
      restoreFocus.current = false;
      trigger.current?.focus();
    }
  }, [open]);
  const active = courses.find(c => c.id === activeId)!;
  const filtered = courses.filter(c => `${c.title} ${c.description}`.toLowerCase().includes(query.trim().toLowerCase()));
  const close = () => { restoreFocus.current = true; setOpen(false); };
  return <div className="course-switcher">
    <button ref={trigger} className="course-switch-trigger" aria-label={`Cambiar curso: ${active.title}`} aria-haspopup="dialog" aria-expanded={open} onClick={() => { setQuery(''); setOpen(true); }}>
      <span className="course-switch-icon"><BookOpen size={19} /></span><span className="course-switch-title"><strong>{active.title}</strong><small>Elegir otra materia</small></span><ChevronsUpDown size={15} />
    </button>
    {open && createPortal(<Dialog title="Cambiar de curso" onClose={close} initialFocusRef={input} className="course-switch-dialog">
      <div className="course-switch-intro"><h3>¿Qué quieres estudiar?</h3><p>Elige una materia para continuar donde la dejaste.</p></div>
      <label className="course-switch-search"><Search size={18} aria-hidden="true" /><input ref={input} value={query} onChange={e => setQuery(e.target.value)} aria-label="Buscar un curso para cambiar" placeholder="Buscar por nombre o materia…" /></label>
      <div className="course-switch-list" aria-label="Cursos disponibles">{filtered.map(c => {
        const summary = courseSummary(c.id);
        const current = c.id === activeId;
        return <button key={c.id} aria-label={`Cambiar a ${c.title}`} aria-current={current ? 'true' : undefined} onClick={() => { if (current) close(); else { setOpen(false); onSelect(c); } }}>
          <span className="switch-course-icon"><BookOpen size={21} aria-hidden="true" /></span>
          <span className="switch-course-body"><strong>{c.title}</strong><span className="switch-course-description">{c.description}</span><small>{c.cards.length} tarjetas · {c.challenges.length} retos{!summary.unreadable && ` · ${summary.learned} estudiadas`}</small></span>
          {current ? <span className="switch-course-current"><CheckCircle2 size={17} aria-hidden="true" />Actual</span> : <ArrowRight size={18} aria-hidden="true" />}
        </button>;
      })}</div>
      {filtered.length === 0 && <div className="course-switch-empty"><Search size={25} aria-hidden="true" /><strong>No encontramos ese curso</strong><p>Prueba otro nombre o añade una materia desde Mis cursos.</p><button className="text-button" onClick={() => { setQuery(''); input.current?.focus(); }}>Limpiar búsqueda</button></div>}
      {courses.length === 1 && <p className="course-switch-hint">Esta es tu primera materia. Puedes añadir más desde Mis cursos.</p>}
      <div className="course-switch-footer"><div><FolderOpen size={20} aria-hidden="true" /><span><strong>Tu biblioteca completa</strong><small>Importa y organiza tus materias en Mis cursos.</small></span></div><Button variant="outline" onClick={() => { setOpen(false); onManage(); }}>Ir a Mis cursos<ArrowRight size={15} /></Button></div>
    </Dialog>, document.body)}
  </div>;
}
