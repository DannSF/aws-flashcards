import {
  ArrowRight,
  BarChart3,
  BookOpen,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  Cloud,
  ExternalLink,
  Flame,
  Layers3,
  Lightbulb,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Stat, WeekActivity } from "../components/StudyWidgets";
import { cards } from "../data/cards";
import { domains } from "../data/domains";
import { cardStatus, localDay, streak } from "../lib/progress";
import type { DomainId, UserProgress } from "../types";
interface Props {
  progress: UserProgress;
  now: Date;
  onStudy: (domain: DomainId | "all", learn: boolean) => void;
  onNavigate: (page: "library") => void;
}
export function Dashboard({ progress, now, onStudy, onNavigate }: Props) {
  const due = cards.filter(
    (c) => cardStatus(progress.cards[c.id], now) === "due",
  );
  const mastered = cards.filter(
    (c) => cardStatus(progress.cards[c.id], now) === "mastered",
  );
  const learning = cards.filter(
    (c) =>
      progress.cards[c.id] &&
      cardStatus(progress.cards[c.id], now) !== "mastered",
  );
  const today = progress.history.filter(
    (h) => localDay(new Date(h.at)) === localDay(now),
  );
  const accuracy = progress.history.length
    ? Math.round(
        (progress.history.filter((h) => h.rating >= 3).length /
          progress.history.length) *
          100,
      )
    : null;
  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">TU PRÓXIMO GRAN PASO EMPIEZA AQUÍ</div>
          <h1>
            Hola, cloud learner <span className="wave">✦</span>
          </h1>
          <p>
            Construye conocimiento que se queda contigo. Una tarjeta a la vez.
          </p>
        </div>
        <div className="date-pill">
          <CalendarDays size={16} />
          {now.toLocaleDateString("es", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </div>
      </div>
      <section className="stats-grid" aria-label="Resumen de aprendizaje">
        <Stat
          label="Tarjetas disponibles"
          value={cards.length}
          icon={Layers3}
          color="purple"
          note="Tu universo de conocimiento"
        />
        <Stat
          label="Tarjetas dominadas"
          value={mastered.length}
          icon={CheckCircle2}
          color="green"
          note={`${Math.round((mastered.length / cards.length) * 100)}% de tu biblioteca`}
        />
        <Stat
          label="En aprendizaje"
          value={learning.length}
          icon={BookOpen}
          color="blue"
          note="Cada repaso cuenta"
        />
        <Stat
          label="Por repasar hoy"
          value={due.length}
          icon={Clock3}
          color="orange"
          note={
            due.length
              ? "Tu memoria te lo agradecerá"
              : "Todo al día. Explora algo nuevo."
          }
        />
      </section>
      <div className="dashboard-columns">
        <div className="dashboard-main">
          <section className="hero-card">
            <div className="hero-copy">
              <span className="hero-kicker">
                <span className="live-dot" /> TU MOMENTO DE ENFOQUE
              </span>
              <h2>
                Pequeños repasos.
                <br />
                Grandes conexiones.
              </h2>
              <p>
                {due.length
                  ? `Tienes ${due.length} tarjetas listas para repasar.`
                  : "Tu próxima idea favorita está a una tarjeta de distancia."}
                <br />
                Dale a tu conocimiento el espacio para crecer.
              </p>
              <Button onClick={() => onStudy("all", false)}>
                Continuar estudiando <ArrowRight size={17} />
              </Button>
              <div className="hero-footer">
                <ShieldCheck size={14} />
                Repetición espaciada con FSRS <span>·</span> A tu ritmo
              </div>
            </div>
            <div className="hero-art" aria-hidden="true">
              <div className="orb orb-one" />
              <div className="orb orb-two" />
              <div className="art-grid" />
              <div className="floating-card back-card">
                <Cloud size={25} />
                <div />
                <div />
              </div>
              <div className="floating-card front-card">
                <span className="art-card-label">ACTIVE RECALL</span>
                <div className="art-cloud">
                  <Cloud size={44} strokeWidth={1.5} />
                  <Sparkles size={18} />
                </div>
                <strong>Learn. Recall. Grow.</strong>
                <div className="art-lines">
                  <i />
                  <i />
                </div>
                <span className="art-card-footer">
                  <span>
                    <Check size={11} />
                  </span>{" "}
                  Una conexión más
                </span>
              </div>
              <span className="art-spark s1">✦</span>
              <span className="art-spark s2">✧</span>
              <span className="art-dot" />
            </div>
          </section>
          <section className="domain-section">
            <div className="section-heading">
              <div>
                <h2>Tu ruta de aprendizaje</h2>
                <p>Cuatro dominios. Una base sólida en AWS.</p>
              </div>
              <button
                className="text-button"
                onClick={() => {
                  onNavigate("library");
                }}
              >
                Ver biblioteca <ArrowRight size={15} />
              </button>
            </div>
            <div className="domain-grid">
              {domains.map((d, i) => {
                const total = cards.filter((c) => c.domain === d.id).length;
                const count = cards.filter(
                  (c) =>
                    c.domain === d.id &&
                    cardStatus(progress.cards[c.id], now) === "mastered",
                ).length;
                const Icon = [Cloud, ShieldCheck, Layers3, BarChart3][i];
                return (
                  <button
                    key={d.id}
                    className="domain-card"
                    onClick={() => onStudy(d.id, false)}
                    style={{ "--domain-color": d.color } as React.CSSProperties}
                  >
                    <div className="domain-card-top">
                      <span className="domain-icon">
                        <Icon size={21} />
                      </span>
                      <span className="weight">{d.weight}% del examen</span>
                    </div>
                    <div className="domain-number">DOMINIO 0{i + 1}</div>
                    <h3>{d.name}</h3>
                    <p>{d.description}</p>
                    <div className="domain-track">
                      <i style={{ width: `${(count / total) * 100}%` }} />
                    </div>
                    <div className="domain-bottom">
                      <span>
                        {count} de {total} dominadas
                      </span>
                      <strong>
                        {Math.round((count / total) * 100)}%{" "}
                        <ArrowRight size={13} />
                      </strong>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
          <section className="approach-card">
            <div className="approach-icon">
              <Lightbulb size={23} />
            </div>
            <div>
              <h3>Entender es mejor que memorizar.</h3>
              <p>
                Preguntas en inglés. Explicaciones en español. Conecta cada
                servicio con un caso real.
              </p>
            </div>
            <button
              className="text-button"
              onClick={() => onStudy("all", true)}
            >
              Aprender algo nuevo <ArrowRight size={16} />
            </button>
          </section>
        </div>
        <aside className="dashboard-rail">
          <section className="panel goal-panel">
            <div className="panel-heading">
              <h3>Tu objetivo de hoy</h3>
              <Target size={18} />
            </div>
            <div
              className="goal-ring"
              style={
                {
                  "--progress": `${Math.min(today.length / progress.dailyGoal, 1) * 360}deg`,
                } as React.CSSProperties
              }
            >
              <div>
                <strong>
                  {today.length}
                  <span> / {progress.dailyGoal}</span>
                </strong>
                <small>tarjetas repasadas</small>
              </div>
            </div>
            <div className="goal-caption">
              {today.length >= progress.dailyGoal
                ? "¡Objetivo completado! Bien hecho."
                : today.length
                  ? `¡Sigue así! Te faltan ${progress.dailyGoal - today.length} repasos.`
                  : "Un pequeño paso es un gran comienzo."}
            </div>
            <div className="rail-divider" />
            <div className="streak-row">
              <span className="streak-icon">
                <Flame size={23} />
              </span>
              <div>
                <strong>
                  {streak(progress, now)}{" "}
                  {streak(progress, now) === 1 ? "día" : "días"} de racha
                </strong>
                <p>Haz espacio para aprender.</p>
              </div>
            </div>
            <WeekActivity progress={progress} now={now} />
          </section>
          <section className="panel accuracy-panel">
            <div className="panel-heading">
              <h3>Tu precisión</h3>
              <TrendingUp size={18} />
            </div>
            <div className="accuracy-value">
              {accuracy === null ? "—" : `${accuracy}%`}
              <Target
                size={43}
                strokeWidth={1.2}
                className="accuracy-symbol"
                aria-hidden="true"
              />
            </div>
            <p>
              {accuracy === null
                ? "Tu primer repaso empieza a contar tu historia."
                : "Recuerdo autónomo: valoraciones Good y Easy."}
            </p>
            <div className="accuracy-footer">
              <span className="green-dot" />
              {progress.history.length} repasos en total
            </div>
          </section>
          <div className="exam-note">
            <span className="aws-text">
              aws<span>⌣</span>
            </span>
            <div>
              <strong>Tu meta: CLF-C02</strong>
              <p>
                Contenido de práctica original.
                <br />
                No afiliado ni avalado por AWS.
              </p>
              <a
                href="https://aws.amazon.com/certification/certified-cloud-practitioner/"
                target="_blank"
                rel="noreferrer"
              >
                Explorar la certificación <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
