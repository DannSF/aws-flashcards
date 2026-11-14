import { useEffect, useRef, useState } from 'react';
import { BookOpen, Check, ChevronsUpDown, Search } from 'lucide-react';
import type { CoursePackage } from '../lib/catalog';
interface Props { courses: CoursePackage[]; activeId: string; onSelect: (course: CoursePackage) => void; }
export function CourseSwitcher({ courses, activeId, onSelect }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const container = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const active = courses.find(c => c.id === activeId)!;
  const filtered = courses.filter(c => `${c.title} ${c.description}`.toLowerCase().includes(query.trim().toLowerCase()));
  useEffect(() => {
    if (!open) return;
    input.current?.focus();
    const outside = (event: PointerEvent) => { if (!container.current?.contains(event.target as Node)) setOpen(false); };
    document.addEventListener('pointerdown', outside);
    return () => document.removeEventListener('pointerdown', outside);
  }, [open]);
  return <div className="course-switcher" ref={container} onKeyDown={e => {
    if (e.key === 'Escape' && open) { e.preventDefault(); e.stopPropagation(); setOpen(false); trigger.current?.focus(); }
  }}>
    <button ref={trigger} className="course-switch-trigger" aria-label={`Cambiar curso: ${active.title}`} aria-expanded={open} aria-controls="course-switch-panel" onClick={() => { setOpen(v => !v); setQuery(''); }}>
      <span className="course-switch-icon"><BookOpen size={19} /></span><span className="course-switch-title"><strong>{active.title}</strong><small>Cambiar curso</small></span><ChevronsUpDown size={15} />
    </button>
    {open && <section id="course-switch-panel" className="course-switch-panel" aria-label="Cambiar de curso">
      <label className="course-switch-search"><Search size={14} /><input ref={input} value={query} onChange={e => setQuery(e.target.value)} aria-label="Buscar un curso para cambiar" placeholder="Buscar materia…" /></label>
      <div className="course-switch-list">{filtered.map(c => <button key={c.id} aria-label={`Cambiar a ${c.title}`} aria-current={c.id === activeId ? 'true' : undefined} onClick={() => { setOpen(false); setQuery(''); if (c.id !== activeId) onSelect(c); else trigger.current?.focus(); }}>
        <span><strong>{c.title}</strong><small>{c.cards.length} tarjetas · {c.description}</small></span>{c.id === activeId && <Check size={16} aria-label="Curso actual" />}
      </button>)}</div>
      {filtered.length === 0 && <p className="course-switch-empty">No hay coincidencias.<button onClick={() => { setQuery(''); input.current?.focus(); }}>Limpiar búsqueda</button></p>}
      {courses.length === 1 && <p className="course-switch-hint">Añade otras materias desde Mis cursos.</p>}
    </section>}
  </div>;
}
