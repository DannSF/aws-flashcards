import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDownToLine,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock3,
  Cloud,
  FolderOpen,
  Command,
  Flame,
  GraduationCap,
  Layers3,
  LayoutDashboard,
  Lightbulb,
  Menu,
  Moon,
  RotateCcw,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
  Sun,
  Target,
  Upload,
  X,
  BarChart3,
  ExternalLink,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  Stat,
  ActivityChart,
  WeakCards,
  Dialog,
} from "./components/StudyWidgets";
import { Challenge } from "./pages/Challenge";
import { Dashboard } from "./pages/Dashboard";
import { createEmptyCard } from "ts-fsrs";
import { Button } from "./components/ui/button";
import { cards, contentVersion as CONTENT_VERSION } from "./lib/catalog";
import { domains } from "./lib/catalog";
import {
  cardStatus,
  download,
  dueLabel,
  emptyProgress,
  loadProgress,
  localDay,
  parseProgress,
  review,
  saveProgress,
  scheduler,
  STORAGE_KEY,
  streak,
} from "./lib/progress";
import type { ReactNode } from "react";
import type { CoursePackage } from "./lib/catalog";
import { activeCourse } from "./lib/catalog";
import type { DomainId, RecallRating, UserProgress } from "./types";

type Page =
  "dashboard" | "study" | "library" | "analytics" | "settings" | "challenge";
type Status = "all" | "new" | "learning" | "due" | "mastered";
const statusNames: Record<Exclude<Status, "all">, string> = {
  new: "Nueva",
  learning: "Aprendiendo",
  due: "Por repasar",
  mastered: "Dominada",
};

const nav: { page: Page; label: string; icon: LucideIcon }[] = [
  { page: "dashboard", label: "Mi dashboard", icon: LayoutDashboard },
  { page: "study", label: "Estudiar", icon: Layers3 },
  { page: "challenge", label: "Reta tu conocimiento", icon: Target },
  { page: "library", label: "Biblioteca", icon: BookOpen },
  { page: "analytics", label: "Mi progreso", icon: BarChart3 },
];
interface AppProps {
  coursesContent: ReactNode;
  showCourses: boolean;
  onOpenCourses: () => void;
  onLeaveCourses: () => void;
  courseList: CoursePackage[];
  onSelectCourse: (course: CoursePackage) => void;
  courseNotice: ReactNode;
}
function App({ coursesContent, showCourses, onOpenCourses, onLeaveCourses, courseList, onSelectCourse, courseNotice }: AppProps) {
  const [initial] = useState(loadProgress);
  const [progress, setProgress] = useState(initial.progress);
  const [storageError, setStorageError] = useState(initial.error);
  const [page, setPage] = useState<Page>("dashboard");
  const [dark, setDark] = useState(() => {
    try {
      return localStorage.getItem("cloudrecall.theme") === "dark";
    } catch {
      return false;
    }
  });
  const [mobile, setMobile] = useState(false);
  const [query, setQuery] = useState("");
  const [domain, setDomain] = useState<DomainId | "all">("all");
  const [status, setStatus] = useState<Status>("all");
  const [difficulty, setDifficulty] = useState("all");
  const [service, setService] = useState("all");
  const [notice, setNotice] = useState("");
  const [now, setNow] = useState(() => new Date());
  const [studyIds, setStudyIds] = useState<string[]>([]);
  const [studyIndex, setStudyIndex] = useState(0);
  const [session, setSession] = useState<{ id: string; at: string } | null>(
    null,
  );
  const [revealed, setRevealed] = useState(false);
  const [learn, setLearn] = useState(false);
  const [intro, setIntro] = useState(false);
  const [started, setStarted] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(false);
  const importRef = useRef<HTMLInputElement>(null);
  const answerRef = useRef<HTMLButtonElement>(null);
  const [selected, setSelected] = useState<string | null>(null);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", dark ? "#14141c" : "#f7f8fb");
    try {
      localStorage.setItem("cloudrecall.theme", dark ? "dark" : "light");
    } catch {
      /* preference only */
    }
  }, [dark]);
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 5000);
    return () => clearTimeout(timer);
  }, [notice]);
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        const loaded = loadProgress();
        setProgress(loaded.progress);
        setStorageError(loaded.error);
        setStarted(false);
        setNotice("Progreso actualizado desde otra pestaña.");
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);
  const commit = (next: UserProgress) => {
    if (storageError) {
      setNotice(
        "Resuelve el problema de almacenamiento en Ajustes antes de estudiar.",
      );
      return false;
    }
    try {
      saveProgress(next);
      setProgress(next);
      return true;
    } catch {
      setNotice(
        "No se pudo guardar. Comprueba el espacio o los permisos del navegador. Tu progreso anterior sigue intacto.",
      );
      return false;
    }
  };
  const go = (next: Page) => {
    if (showCourses) onLeaveCourses();
    setPage(next);
    setMobile(false);
    setSelected(null);
    window.scrollTo({ top: 0, behavior: "instant" });
  };
  useEffect(() => {
    document.getElementById('main-content')?.focus();
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [showCourses]);
  const due = cards.filter(
    (c) => cardStatus(progress.cards[c.id], now) === "due",
  );
  const accuracy = progress.history.length
    ? Math.round(
        (progress.history.filter((h) => h.rating >= 3).length /
          progress.history.length) *
          100,
      )
    : null;
  const filtered = useMemo(
    () =>
      cards.filter(
        (c) =>
          (domain === "all" || c.domain === domain) &&
          (status === "all" ||
            cardStatus(progress.cards[c.id], now) === status) &&
          (difficulty === "all" || c.difficulty === difficulty) &&
          (service === "all" || c.service === service) &&
          `${c.question} ${c.answer} ${c.explanation} ${c.keywords.join(" ")}`
            .toLowerCase()
            .includes(query.toLowerCase()),
      ),
    [domain, status, difficulty, service, query, progress, now],
  );
  const studyCard = cards.find((c) => c.id === studyIds[studyIndex]);
  const startStudy = (
    chosen: DomainId | "all" = domain,
    learningMode = learn,
  ) => {
    const eligible = cards.filter(
      (c) =>
        (chosen === "all" || c.domain === chosen) &&
        (!progress.cards[c.id] || progress.cards[c.id].due <= new Date()),
    );
    eligible.sort((a, b) => {
      const x = progress.cards[a.id],
        y = progress.cards[b.id];
      return (
        (x ? 0 : 1) - (y ? 0 : 1) ||
        (x && y ? x.due.getTime() - y.due.getTime() : 0)
      );
    });
    setDomain(chosen);
    setStudyIds(eligible.map((c) => c.id));
    setStudyIndex(0);
    setSession({ id: crypto.randomUUID(), at: new Date().toISOString() });
    setRevealed(false);
    setLearn(learningMode);
    setIntro(learningMode && !!eligible[0] && !progress.cards[eligible[0].id]);
    setStarted(true);
    go("study");
  };
  const rate = (rating: RecallRating) => {
    if (!studyCard || !session || !revealed) return;
    const next = review(progress, studyCard.id, rating, session.id, session.at);
    if (commit(next)) {
      setStudyIndex((i) => i + 1);
      setRevealed(false);
      const following = studyIds[studyIndex + 1];
      setIntro(learn && !!following && !next.cards[following]);
      setNow(new Date());
      setTimeout(() => answerRef.current?.focus(), 0);
    }
  };
  useEffect(() => {
    if (page !== "study" || !started || !studyCard || intro) return;
    const key = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      if (
        ["INPUT", "SELECT", "TEXTAREA", "BUTTON", "A"].includes(el.tagName) ||
        el.isContentEditable
      )
        return;
      if (e.code === "Space") {
        e.preventDefault();
        setRevealed((r) => !r);
      }
      if (revealed && ["1", "2", "3", "4"].includes(e.key)) {
        e.preventDefault();
        rate(Number(e.key) as RecallRating);
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  });
  const importBackup = async (file: File | undefined) => {
    if (!file) return;
    try {
      if (file.size > 5_000_000)
        throw new Error("El archivo supera el límite de 5 MB.");
      const next = parseProgress(await file.text());
      if (
        !window.confirm(
          `¿Reemplazar tu progreso por esta copia con ${next.history.length} repasos y ${next.challenges?.length ?? 0} retos? Exporta primero tu progreso actual si quieres conservarlo.`,
        )
      )
        return;
      saveProgress(next);
      setProgress(next);
      setStorageError(null);
      setStarted(false);
      setNotice("Copia importada. Tu progreso ya está disponible.");
    } catch (e) {
      setNotice(
        e instanceof Error ? e.message : "No se pudo importar la copia.",
      );
    } finally {
      if (importRef.current) importRef.current.value = "";
    }
  };
  const exportBackup = () => {
    try {
      const raw = storageError
        ? localStorage.getItem(STORAGE_KEY)
        : JSON.stringify({ ...progress, courseId: activeCourse.id }, null, 2);
      if (!raw) {
        setNotice("No hay una copia guardada para exportar.");
        return;
      }
      download(`cloudrecall-${activeCourse.id}-${localDay(now)}.json`, raw);
      setNotice("Copia exportada. Guárdala en un lugar seguro.");
    } catch {
      setNotice("El navegador no permite leer el almacenamiento.");
    }
  };
  const detail = cards.find((c) => c.id === selected);
  const domainSelect = (
    <label className="select-wrap">
      <span className="sr-only">Filtrar por dominio</span>
      <select
        value={domain}
        onChange={(e) => {
          setDomain(e.target.value as DomainId | "all");
          setStarted(false);
        }}
      >
        <option value="all">Todos los dominios</option>
        {domains.map((d) => (
          <option key={d.id} value={d.id}>
            {d.name}
          </option>
        ))}
      </select>
      <ChevronDown size={15} />
    </label>
  );
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content" onClick={e => { e.preventDefault(); document.getElementById("main-content")?.focus(); }}>
        Saltar al contenido
      </a>
      {mobile && (
        <button
          className="sidebar-backdrop"
          aria-label="Cerrar navegación"
          onClick={() => setMobile(false)}
        />
      )}
      <aside className={`sidebar ${mobile ? "open" : ""}`}>
        <a
          className="brand"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            go("dashboard");
          }}
        >
          <span className="brand-icon">
            <Cloud size={25} />
          </span>
          CloudRecall<span className="brand-dot">.</span>
        </a>
        <div className="workspace-label">MI ESPACIO</div>
        <nav aria-label="Navegación principal">
          <button aria-label="Mis cursos" className={`nav-item ${showCourses ? 'active' : ''}`} aria-current={showCourses ? 'page' : undefined} onClick={() => { onOpenCourses(); setMobile(false); }}><FolderOpen size={19} /><span>Mis cursos</span><span className="nav-count">{courseList.length}</span></button>
        </nav>
        <div className="sidebar-rule" />
        <div className="workspace-label">CURSO ACTIVO</div>
        <div className="sidebar-course-picker">
          <BookOpen size={18} aria-hidden="true" />
          <label className="sr-only" htmlFor="active-course-select">Curso activo</label>
          <select id="active-course-select" value={activeCourse.id} onChange={e => { const course = courseList.find(c => c.id === e.target.value); if (course) { onSelectCourse(course); setMobile(false); } }}>
            {courseList.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
        </div>
        <nav aria-label="Aprender en el curso activo">
          {nav.map(({ page: p, label, icon: Icon }) => (
            <button key={p} className={`nav-item ${!showCourses && page === p ? "active" : ""}`} aria-current={!showCourses && page === p ? 'page' : undefined} onClick={() => { if (p === "study" && !started) startStudy(); else go(p); }}>
              <Icon size={19} /><span>{label}</span>{p === "study" && due.length > 0 && <span className="nav-count">{due.length}</span>}
            </button>
          ))}
        </nav>
        <div className="sidebar-tip">
          <span className="tip-star">
            <Sparkles size={18} />
          </span>
          <h4>Un poco, cada día.</h4>
          <p>La constancia transforma lo que estudias en lo que sabes.</p>
          <div className="tip-dots">
            <i />
            <i />
            <i />
          </div>
        </div>
        <div className="sidebar-bottom">
          <button
            className={`nav-item ${!showCourses && page === "settings" ? "active" : ""}`}
            onClick={() => go("settings")}
          >
            <Settings2 size={19} />
            Ajustes y datos
          </button>
          <div className="local-profile">
            <div className="avatar">
              <GraduationCap size={20} />
            </div>
            <div>
              Mi espacio personal
              <small>
                <span className="green-dot" />
                Progreso local · sin cuenta
              </small>
            </div>
          </div>
        </div>
      </aside>
      <div className="main-shell">
        <header className="topbar">
          <div className="breadcrumb">
            <button
              className="icon-button mobile-menu"
              aria-label="Abrir navegación"
              onClick={() => setMobile(true)}
            >
              <Menu size={21} />
            </button>
            <span>Mi aprendizaje</span>
            <ChevronRight size={14} />
            <strong>
              {showCourses ? 'Mis cursos' :
                {
                  dashboard: "Dashboard",
                  study: "Sesión de estudio",
                  library: "Biblioteca",
                  analytics: "Mi progreso",
                  settings: "Ajustes",
                  challenge: "Reto de conocimiento",
                }[page]
              }
            </strong>
          </div>
          <div className="top-actions">
            <span className="local-badge">
              <span className="green-dot" />
              Guardado en este dispositivo
            </span>
            <button
              className="icon-button"
              onClick={() => setDark(!dark)}
              aria-label={dark ? "Activar modo claro" : "Activar modo oscuro"}
            >
              {dark ? <Sun size={19} /> : <Moon size={19} />}
            </button>
            <button
              className="avatar small-avatar"
              aria-label="Abrir ajustes personales"
              onClick={() => go("settings")}
            >
              TÚ
            </button>
          </div>
        </header>
        <main id="main-content" tabIndex={-1}>
          {courseNotice}
          {showCourses ? coursesContent : <>
          {storageError && (
            <div className="error-banner" role="alert">
              {storageError}{" "}
              <button onClick={() => go("settings")}>Abrir ajustes</button>
            </div>
          )}
          {page === "dashboard" && (
            <Dashboard
              progress={progress}
              now={now}
              onStudy={startStudy}
              onNavigate={(p) => {
                setQuery("");
                go(p);
              }}
            />
          )}
          {page === "challenge" && (
            <Challenge
              progress={progress}
              onSave={commit}
              blocked={!!storageError}
            />
          )}
          {page === "study" && (
            <>
              <div className="page-heading">
                <div>
                  <div className="eyebrow">
                    ACTIVE RECALL · REPETICIÓN ESPACIADA
                  </div>
                  <h1>
                    Tu espacio de enfoque<span className="heading-dot">.</span>
                  </h1>
                  <p>
                    Haz una pausa, busca la respuesta en tu memoria y después
                    comprueba.
                  </p>
                </div>
                <Button variant="outline" onClick={() => go("dashboard")}>
                  <ArrowLeft size={15} />
                  Volver al dashboard
                </Button>
              </div>
              <div className="study-toolbar">
                <div className="mode-tabs">
                  <button
                    className={!learn ? "selected" : ""}
                    onClick={() => {
                      setLearn(false);
                      setStarted(false);
                    }}
                  >
                    <Layers3 size={16} />
                    Flashcards
                  </button>
                  <button
                    className={learn ? "selected" : ""}
                    onClick={() => {
                      setLearn(true);
                      setStarted(false);
                    }}
                  >
                    <Lightbulb size={16} />
                    Aprender
                  </button>
                </div>
                {domainSelect}
              </div>
              {!started ? (
                <section className="study-empty panel">
                  <span className="large-icon">
                    <Layers3 size={32} />
                  </span>
                  <h2>
                    {learn
                      ? "Primero comprende. Después recuerda."
                      : "Dale una oportunidad a tu memoria."}
                  </h2>
                  <p>
                    {learn
                      ? "Conoce el concepto y un caso real antes de poner a prueba tu recuerdo."
                      : "Las tarjetas pendientes aparecen primero, seguidas de conceptos nuevos."}
                  </p>
                  <Button
                    onClick={() => startStudy()}
                    disabled={!!storageError}
                  >
                    Comenzar sesión <ArrowRight size={17} />
                  </Button>
                  <small>Sin prisas. Puedes terminar cuando quieras.</small>
                </section>
              ) : studyCard ? (
                <>
                  <div className="session-progress">
                    <span>
                      {domains.find((d) => d.id === studyCard.domain)?.name}
                    </span>
                    <span>
                      {studyIndex + 1} de {studyIds.length} tarjetas
                    </span>
                    <div>
                      <i
                        style={{
                          width: `${(studyIndex / studyIds.length) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                  {intro ? (
                    <section className="flashcard intro-card">
                      <span className="card-overline">
                        <Lightbulb size={16} />
                        CONOCE EL CONCEPTO
                      </span>
                      <h2>{studyCard.answer}</h2>
                      <p className="intro-explanation">
                        {studyCard.explanation}
                      </p>
                      <div className="answer-block">
                        <span>EN LA VIDA REAL</span>
                        <p>{studyCard.example}</p>
                      </div>
                      <Button
                        onClick={() => {
                          setIntro(false);
                          setRevealed(false);
                        }}
                      >
                        Ya lo entendí. Quiero recordarlo{" "}
                        <ArrowRight size={16} />
                      </Button>
                    </section>
                  ) : (
                    <>
                      <section
                        className={`flashcard ${revealed ? "is-revealed" : ""}`}
                        aria-label="Tarjeta de estudio"
                      >
                        <div className="card-topline">
                          <span className="card-overline">
                            <Cloud size={16} />
                            {studyCard.category}
                          </span>
                          <span className="difficulty">
                            {studyCard.difficulty}
                          </span>
                        </div>
                        <span className="question-label">
                          {revealed
                            ? "RECUERDA LA CONEXIÓN"
                            : "PIENSA ANTES DE REVELAR"}
                        </span>
                        <h2 lang="en">{studyCard.question}</h2>
                        {!revealed ? (
                          <>
                            <div
                              className="recall-illustration"
                              aria-hidden="true"
                            >
                              <Command size={28} />
                            </div>
                            <Button
                              ref={answerRef}
                              variant="outline"
                              onClick={() => setRevealed(true)}
                              className="reveal-button"
                            >
                              Revelar respuesta{" "}
                              <span className="keycap">Space</span>
                            </Button>
                            <p className="card-guidance">
                              Intenta responder en voz alta antes de continuar.
                            </p>
                          </>
                        ) : (
                          <div className="answer-content" aria-live="polite">
                            <span className="correct-answer">
                              <CheckCircle2 size={19} />
                              RESPUESTA
                            </span>
                            <h3 lang="en">{studyCard.answer}</h3>
                            <p>{studyCard.explanation}</p>
                            <div className="keywords">
                              {studyCard.keywords.map((k) => (
                                <span key={k} lang="en">
                                  {k}
                                </span>
                              ))}
                            </div>
                            <div className="answer-columns">
                              <div className="answer-block">
                                <span>
                                  <Lightbulb size={14} />
                                  EN LA VIDA REAL
                                </span>
                                <p>{studyCard.example}</p>
                              </div>
                              <div className="answer-block confusion">
                                <span>
                                  <Layers3 size={14} />
                                  NO LO CONFUNDAS
                                </span>
                                <p lang="en">{studyCard.confusion}</p>
                              </div>
                            </div>
                            <div className="memory-note">
                              <Sparkles size={16} />
                              <p>
                                <strong>Conexión mental</strong>{" "}
                                {studyCard.mnemonic}
                              </p>
                            </div>
                            <button
                              className="text-button"
                              onClick={() => setRevealed(false)}
                            >
                              Volver a la pregunta <RotateCcw size={13} />
                            </button>
                          </div>
                        )}
                      </section>
                      {revealed ? (
                        <div className="rating-area">
                          <p>
                            ¿Cómo te fue al recordar?{" "}
                            <span>
                              Tu honestidad hace más útil el próximo repaso.
                            </span>
                          </p>
                          <div className="rating-grid">
                            {(
                              [
                                {
                                  rating: 1,
                                  label: "Again",
                                  hint: "No lo recordé",
                                  className: "again",
                                },
                                {
                                  rating: 2,
                                  label: "Hard",
                                  hint: "Me costó mucho",
                                  className: "hard",
                                },
                                {
                                  rating: 3,
                                  label: "Good",
                                  hint: "Lo recordé",
                                  className: "good",
                                },
                                {
                                  rating: 4,
                                  label: "Easy",
                                  hint: "Lo sabía enseguida",
                                  className: "easy",
                                },
                              ] as const
                            ).map((r) => {
                              const scheduled = scheduler.next(
                                progress.cards[studyCard.id] ??
                                  createEmptyCard(now),
                                now,
                                r.rating,
                              ).card;
                              return (
                                <button
                                  key={r.rating}
                                  className={`rating-button ${r.className}`}
                                  onClick={() => rate(r.rating)}
                                  disabled={!!storageError}
                                >
                                  <span>
                                    {r.label}
                                    <small>{r.rating}</small>
                                  </span>
                                  <p>{r.hint}</p>
                                  <strong>
                                    {dueLabel(scheduled.due, now)}
                                  </strong>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        <p className="keyboard-help">
                          <span className="keycap">Space</span> para revelar{" "}
                          <span>·</span> <span className="keycap">1–4</span>{" "}
                          para valorar después
                        </p>
                      )}
                    </>
                  )}
                  <div className="session-end">
                    <button
                      className="text-button"
                      onClick={() => {
                        setStarted(false);
                        go("dashboard");
                      }}
                    >
                      Terminar sesión <ArrowRight size={14} />
                    </button>
                    <span>
                      <ShieldCheck size={14} />
                      Cada repaso se guarda al valorarlo
                    </span>
                  </div>
                </>
              ) : (
                <section className="study-empty panel">
                  <span className="large-icon success-icon">
                    <CheckCircle2 size={36} />
                  </span>
                  <h2>
                    {studyIds.length
                      ? "¡Una conexión más fuerte!"
                      : "Todo al día en este dominio."}
                  </h2>
                  <p>
                    {studyIds.length
                      ? `Completaste ${studyIds.length} tarjetas en esta sesión. Deja que la repetición espaciada haga su parte.`
                      : "No hay conceptos nuevos ni repasos pendientes. Vuelve cuando llegue el próximo repaso."}
                  </p>
                  <Button onClick={() => go("dashboard")}>
                    Volver al dashboard <ArrowRight size={17} />
                  </Button>
                  <Button variant="ghost" onClick={() => startStudy()}>
                    Comprobar próximos repasos
                  </Button>
                </section>
              )}
            </>
          )}
          {page === "library" && (
            <>
              <div className="page-heading">
                <div>
                  <div className="eyebrow">EXPLORA. CONECTA. COMPRENDE.</div>
                  <h1>
                    Tu biblioteca<span className="heading-dot">.</span>
                  </h1>
                  <p>
                    {cards.length} tarjetas originales para construir una base
                    sólida. Contenido v{CONTENT_VERSION}.
                  </p>
                </div>
                <Button onClick={() => startStudy(domain, false)}>
                  Estudiar dominio <ArrowRight size={16} />
                </Button>
              </div>
              <div className="library-controls">
                <label className="search-input">
                  <Search size={18} />
                  <input
                    aria-label="Buscar tarjetas"
                    placeholder="Busca un servicio, concepto o pregunta…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                  {query && (
                    <button
                      aria-label="Limpiar búsqueda"
                      onClick={() => setQuery("")}
                    >
                      <X size={16} />
                    </button>
                  )}
                </label>
                <div className="filter-row">
                  {domainSelect}
                  <label className="select-wrap">
                    <span className="sr-only">Estado de repaso</span>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as Status)}
                    >
                      <option value="all">Todos los estados</option>
                      {Object.entries(statusNames).map(([k, v]) => (
                        <option key={k} value={k}>
                          {v}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={15} />
                  </label>
                  <label className="select-wrap">
                    <span className="sr-only">Dificultad</span>
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value)}
                    >
                      <option value="all">Toda dificultad</option>
                      <option>Foundation</option>
                      <option>Applied</option>
                    </select>
                    <ChevronDown size={15} />
                  </label>
                  <label className="select-wrap service-select">
                    <span className="sr-only">Servicio o concepto</span>
                    <select
                      value={service}
                      onChange={(e) => setService(e.target.value)}
                    >
                      <option value="all">Todos los servicios</option>
                      {[...new Set(cards.map((c) => c.service))]
                        .sort()
                        .map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                    </select>
                    <ChevronDown size={15} />
                  </label>
                  <button
                    className="text-button"
                    onClick={() => {
                      setQuery("");
                      setDomain("all");
                      setStatus("all");
                      setDifficulty("all");
                      setService("all");
                    }}
                  >
                    Limpiar filtros
                  </button>
                </div>
              </div>
              <div className="results-label">
                {filtered.length} tarjetas encontradas{" "}
                <span>Selecciona una para explorar su explicación.</span>
              </div>
              <div className="library-grid">
                {filtered.map((c) => (
                  <button
                    className="library-card"
                    key={c.id}
                    onClick={() => setSelected(c.id)}
                  >
                    <div className="library-card-top">
                      <span
                        className="domain-chip"
                        style={{
                          color: domains.find((d) => d.id === c.domain)?.color,
                        }}
                      >
                        {domains.find((d) => d.id === c.domain)?.short}
                      </span>
                      <span
                        className={`status-chip ${cardStatus(progress.cards[c.id], now)}`}
                      >
                        {statusNames[cardStatus(progress.cards[c.id], now)]}
                      </span>
                    </div>
                    <h3 lang="en">{c.question}</h3>
                    <div className="library-card-bottom">
                      <span>{c.difficulty}</span>
                      <ArrowRight size={16} />
                    </div>
                  </button>
                ))}
              </div>
              {!filtered.length && (
                <div className="empty-state">
                  <Search size={28} />
                  <h3>No hay coincidencias</h3>
                  <p>Prueba con otro concepto o elimina algunos filtros.</p>
                </div>
              )}
            </>
          )}
          {page === "analytics" && (
            <>
              <div className="page-heading">
                <div>
                  <div className="eyebrow">CADA REPASO DEJA HUELLA</div>
                  <h1>
                    El conocimiento se construye
                    <span className="heading-dot">.</span>
                  </h1>
                  <p>
                    Una mirada honesta a tu aprendizaje, basada en tu actividad
                    real.
                  </p>
                </div>
                <Button variant="outline" onClick={exportBackup}>
                  <ArrowDownToLine size={16} />
                  Exportar progreso
                </Button>
              </div>
              <section className="stats-grid">
                <Stat
                  label="Sesiones de estudio"
                  value={progress.sessions.length}
                  icon={BookOpen}
                  color="purple"
                  note="Con al menos una tarjeta valorada"
                />
                <Stat
                  label="Repasos realizados"
                  value={progress.history.length}
                  icon={RotateCcw}
                  color="blue"
                  note="Tu constancia, en números"
                />
                <Stat
                  label="Precisión de recuerdo"
                  value={accuracy === null ? "—" : `${accuracy}%`}
                  icon={Target}
                  color="green"
                  note="Good + Easy / total de repasos"
                />
                <Stat
                  label="Racha actual"
                  value={`${streak(progress, now)} días`}
                  icon={Flame}
                  color="orange"
                  note="Días consecutivos con actividad"
                />
              </section>
              <div className="analytics-grid">
                <section className="panel analytics-panel">
                  <div className="section-heading">
                    <div>
                      <h2>Actividad de los últimos 7 días</h2>
                      <p>Cada barra representa tus repasos diarios.</p>
                    </div>
                  </div>
                  <ActivityChart progress={progress} now={now} />
                </section>
                <section className="panel analytics-panel">
                  <h2>Conceptos que merecen otro vistazo</h2>
                  <p>Tarjetas con más valoraciones Again o Hard.</p>
                  <WeakCards progress={progress} onSelect={setSelected} />
                </section>
              </div>
              <section className="panel analytics-panel">
                <h2>Próximos repasos</h2>
                <p>La programación se adapta a cómo recuerdas cada concepto.</p>
                {Object.keys(progress.cards).length ? (
                  <div className="upcoming-list">
                    {cards
                      .filter((c) => progress.cards[c.id])
                      .sort(
                        (a, b) =>
                          progress.cards[a.id].due.getTime() -
                          progress.cards[b.id].due.getTime(),
                      )
                      .slice(0, 8)
                      .map((c) => (
                        <button key={c.id} onClick={() => setSelected(c.id)}>
                          <span>
                            <strong>{c.answer}</strong>
                            <small>
                              {domains.find((d) => d.id === c.domain)?.short}
                            </small>
                          </span>
                          <span>
                            {progress.cards[c.id].due <= now
                              ? "Pendiente"
                              : progress.cards[c.id].due.toLocaleString("es", {
                                  day: "numeric",
                                  month: "short",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                            <ChevronRight size={16} />
                          </span>
                        </button>
                      ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <Clock3 size={25} />
                    <p>
                      Tus próximas fechas aparecerán después del primer repaso.
                    </p>
                    <Button onClick={() => startStudy("all")}>
                      Empezar a estudiar
                    </Button>
                  </div>
                )}
              </section>
            </>
          )}
          {page === "settings" && (
            <>
              <div className="page-heading">
                <div>
                  <div className="eyebrow">TU APRENDIZAJE, TUS DATOS</div>
                  <h1>
                    A tu manera<span className="heading-dot">.</span>
                  </h1>
                  <p>
                    Sin cuenta, sin suscripciones. El progreso se guarda en este
                    navegador.
                  </p>
                </div>
              </div>
              <div className="settings-grid">
                <section className="panel settings-panel">
                  <h2>Preferencias de estudio</h2>
                  <div className="setting-row">
                    <div>
                      <h3>Objetivo diario</h3>
                      <p>Número de repasos para tu meta diaria.</p>
                    </div>
                    <label>
                      <span className="sr-only">
                        Objetivo diario de tarjetas
                      </span>
                      <select
                        value={progress.dailyGoal}
                        onChange={(e) =>
                          commit({
                            ...progress,
                            dailyGoal: Number(e.target.value),
                          })
                        }
                      >
                        {[10, 15, 20, 30, 50].map((n) => (
                          <option key={n} value={n}>
                            {n} tarjetas
                          </option>
                        ))}
                        {![10, 15, 20, 30, 50].includes(progress.dailyGoal) && (
                          <option value={progress.dailyGoal}>
                            {progress.dailyGoal} tarjetas
                          </option>
                        )}
                      </select>
                    </label>
                  </div>
                  <div className="setting-row">
                    <div>
                      <h3>Apariencia</h3>
                      <p>Elige el espacio donde mejor te concentras.</p>
                    </div>
                    <Button variant="outline" onClick={() => setDark(!dark)}>
                      {dark ? <Sun size={16} /> : <Moon size={16} />}Modo{" "}
                      {dark ? "claro" : "oscuro"}
                    </Button>
                  </div>
                  <div className="method-note">
                    <ShieldCheck size={20} />
                    <p>
                      <strong>FSRS · Retención objetivo del 90%</strong>
                      <br />
                      Cada valoración actualiza la dificultad, estabilidad y
                      fecha del próximo repaso. “Dominada” significa estado de
                      revisión y estabilidad de al menos 21 días, siempre que no
                      esté pendiente.
                    </p>
                  </div>
                </section>
                <section className="panel settings-panel">
                  <h2>Una copia es tranquilidad</h2>
                  <p>
                    El almacenamiento local puede eliminarse al limpiar el
                    navegador. Exporta tu progreso periódicamente.
                  </p>
                  <div className="backup-actions">
                    <Button variant="outline" onClick={exportBackup}>
                      <ArrowDownToLine size={16} />
                      {storageError
                        ? "Exportar datos originales"
                        : "Exportar copia JSON"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => importRef.current?.click()}
                    >
                      <Upload size={16} />
                      Importar copia
                    </Button>
                    <input
                      ref={importRef}
                      type="file"
                      accept=".json,application/json"
                      className="sr-only"
                      aria-label="Importar copia JSON"
                      onChange={(e) => void importBackup(e.target.files?.[0])}
                    />
                  </div>
                  <p className="small-note">
                    Solo se importan copias válidas de esta versión. Se pedirá
                    confirmación antes de reemplazar tu progreso.
                  </p>
                  <div className="danger-zone">
                    <div>
                      <h3>Empezar de nuevo</h3>
                      <p>
                        Elimina tus repasos, retos y estadísticas. Las tarjetas
                        permanecen.
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setResetConfirm(true)}
                    >
                      Restablecer progreso
                    </Button>
                  </div>
                </section>
                <section className="panel settings-panel content-notes">
                  <h2>Acerca del contenido</h2>
                  <p>
                    {cards.length} tarjetas de {activeCourse.title}. {activeCourse.description}
                  </p>
                  <p>
                    CloudRecall incluye Flashcards, Aprender,
                    repetición espaciada, retos de opción múltiple y analítica
                    local. Los escenarios, comparaciones interactivas, simulador
                    de examen y modo cram quedan para las siguientes fases.
                  </p>
                  {activeCourse.id === 'clf-c02' && <><p>
                    Las referencias oficiales se incluyen para consulta. Su
                    actualización en línea no pudo verificarse en este entorno
                    (acceso HTTP 403). Comprueba los planes de soporte, precios
                    y detalles cambiantes directamente en AWS.
                  </p>
                  <a
                    href="https://docs.aws.amazon.com/aws-certification/latest/examguides/cloud-practitioner-02.html"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Guía oficial CLF-C02 <ExternalLink size={14} />
                  </a>
                  <a
                    href="https://aws.amazon.com/architecture/well-architected/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    AWS Well-Architected <ExternalLink size={14} />
                  </a>
                  <a
                    href="https://aws.amazon.com/compliance/shared-responsibility-model/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Shared Responsibility Model <ExternalLink size={14} />
                  </a></>}
                </section>
              </div>
            </>
          )}
          </>}
          <footer className="page-footer">
            <span>
              <Cloud size={14} />
              CloudRecall <span className="footer-dot">·</span> Aprende con
              intención.
            </span>
            <span>Hecho para comprender, no solo recordar.</span>
          </footer>
        </main>
      </div>
      {notice && (
        <div className="toast" role="status">
          <CheckCircle2 size={18} />
          {notice}
          <button aria-label="Cerrar aviso" onClick={() => setNotice("")}>
            <X size={16} />
          </button>
        </div>
      )}
      {detail && (
        <Dialog title="Explora el concepto" onClose={() => setSelected(null)}>
          <div className="detail-body">
            <span className="domain-chip">
              {domains.find((d) => d.id === detail.domain)?.name}
            </span>
            <h2 lang="en">{detail.question}</h2>
            <h3>{detail.answer}</h3>
            <p>{detail.explanation}</p>
            <div className="answer-block">
              <span>EN LA VIDA REAL</span>
              <p>{detail.example}</p>
            </div>
            <div className="answer-block">
              <span>NO LO CONFUNDAS</span>
              <p lang="en">{detail.confusion}</p>
            </div>
            <div className="memory-note">
              <Sparkles size={18} />
              <p>{detail.mnemonic}</p>
            </div>
            {progress.cards[detail.id] && (
              <p className="small-note">
                Repasos: {progress.cards[detail.id].reps} · Lapsos FSRS:{" "}
                {progress.cards[detail.id].lapses} · Dificultad:{" "}
                {progress.cards[detail.id].difficulty.toFixed(1)} · Estabilidad:{" "}
                {progress.cards[detail.id].stability.toFixed(1)} días
                <br />
                Fallos (Again):{" "}
                {
                  progress.history.filter(
                    (h) => h.cardId === detail.id && h.rating === 1,
                  ).length
                }
                <br />
                Próximo repaso:{" "}
                {progress.cards[detail.id].due.toLocaleString("es")}
              </p>
            )}
            <p className="small-note">
              Explorar la biblioteca no modifica tu programación de repasos.
            </p>
          </div>
        </Dialog>
      )}
      {resetConfirm && (
        <Dialog
          title="¿Restablecer tu progreso?"
          onClose={() => setResetConfirm(false)}
        >
          <p>
            Se eliminarán todos los repasos, sesiones y retos de este navegador.
            Exporta una copia antes si deseas conservarlos.
          </p>
          <div className="dialog-actions">
            <Button variant="outline" onClick={() => setResetConfirm(false)}>
              Cancelar
            </Button>
            <Button
              className="danger-button"
              onClick={() => {
                try {
                  const next = emptyProgress();
                  saveProgress(next);
                  setProgress(next);
                  setStorageError(null);
                  setStarted(false);
                  setResetConfirm(false);
                  setNotice("Progreso restablecido. Un nuevo comienzo.");
                } catch {
                  setNotice("No se pudo acceder al almacenamiento.");
                }
              }}
            >
              Sí, eliminar mi progreso
            </Button>
          </div>
        </Dialog>
      )}
    </div>
  );
}
export default App;
