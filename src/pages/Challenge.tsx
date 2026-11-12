import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Layers3,
  Lightbulb,
  RotateCcw,
  ShieldCheck,
  Target,
  Trophy,
  XCircle,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { challengeQuestions } from "../data/challenges";
import { cards, CONTENT_VERSION } from "../data/cards";
import { domains } from "../data/domains";
import {
  advanceChallenge,
  answerChallenge,
  challengeResult,
  createChallenge,
} from "../lib/challenge";
import type { ChallengeAttempt, DomainId, UserProgress } from "../types";
interface Props {
  progress: UserProgress;
  onSave: (p: UserProgress) => boolean;
  blocked: boolean;
}
export function Challenge({ progress, onSave, blocked }: Props) {
  const attempts = progress.challenges ?? [];
  const [viewId, setViewId] = useState<string | null>(null);
  const [domain, setDomain] = useState<DomainId | "all">("all");
  const [count, setCount] = useState(10);
  const [selection, setSelection] = useState<string | null>(null);
  const [onlyIncorrect, setOnlyIncorrect] = useState(true);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const attempt = attempts.find((a) => a.id === viewId);
  const active = attempts.find((a) => !a.completedAt);
  const question = attempt
    ? challengeQuestions.find(
        (q) => q.id === attempt.questionIds[attempt.cursor],
      )
    : undefined;
  const submitted = question ? attempt?.answers[question.id] : undefined;
  const showFeedback = attempt?.kind !== "full" && !!submitted;
  const result = attempt?.completedAt ? challengeResult(attempt) : null;
  const eligible = cards.filter((c) => domain === "all" || c.domain === domain);
  useEffect(() => {
    setSelection(null);
    if (viewId) {
      titleRef.current?.focus();
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [viewId, attempt?.cursor, attempt?.completedAt]);
  const update = (next: ChallengeAttempt) =>
    onSave({
      ...progress,
      challenges: attempts.map((a) => (a.id === next.id ? next : a)),
    });
  const start = (kind: ChallengeAttempt["kind"], retry?: ChallengeAttempt) => {
    if (
      active &&
      !window.confirm(
        "Tienes un reto sin terminar. ¿Descartarlo y comenzar uno nuevo?",
      )
    )
      return;
    const next = createChallenge(
      kind,
      retry?.domain ?? domain,
      count,
      retry ? challengeResult(retry).incorrect : undefined,
      retry?.id,
    );
    if (
      onSave({
        ...progress,
        challenges: [...attempts.filter((a) => a.completedAt), next],
      })
    ) {
      setViewId(next.id);
      setOnlyIncorrect(true);
    }
  };
  const confirm = () => {
    if (!attempt || !selection) return;
    update(answerChallenge(attempt, selection));
  };
  const next = () => {
    if (attempt) update(advanceChallenge(attempt));
  };
  const latestFull = [...attempts]
    .reverse()
    .find(
      (a) =>
        a.kind === "full" &&
        a.domain === "all" &&
        a.completedAt &&
        a.contentVersion === CONTENT_VERSION,
    );
  const latestResult = latestFull ? challengeResult(latestFull) : null;
  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">PON A PRUEBA LO QUE COMPRENDES</div>
          <h1>
            Reta tu conocimiento<span className="heading-dot">.</span>
          </h1>
          <p>
            Sin reloj. Sin prisas. Responde, descubre tus puntos débiles y sigue
            aprendiendo.
          </p>
        </div>
        {attempt && (
          <Button variant="outline" onClick={() => setViewId(null)}>
            <ArrowLeft size={16} />
            Volver al resumen
          </Button>
        )}
      </div>
      {!attempt ? (
        <>
          {active && (
            <section className="challenge-resume panel">
              <div>
                <strong>Tienes un reto en marcha</strong>
                <p>
                  {Object.keys(active.answers).length} de{" "}
                  {active.questionIds.length} respuestas guardadas. Puedes
                  continuar donde lo dejaste.
                </p>
              </div>
              <Button disabled={blocked} onClick={() => setViewId(active.id)}>
                Continuar reto <ArrowRight size={16} />
              </Button>
            </section>
          )}
          {latestResult && (
            <section className="challenge-global panel">
              <span className="large-icon">
                <Trophy size={30} />
              </span>
              <div>
                <span className="eyebrow">
                  ÚLTIMA EVALUACIÓN DE TODA LA BIBLIOTECA
                </span>
                <h2>
                  Acertaste {latestResult.percent}% de tus {latestResult.total}{" "}
                  tarjetas
                </h2>
                <p>
                  {latestResult.correct} correctas ·{" "}
                  {latestResult.incorrect.length} por reforzar ·{" "}
                  {new Date(latestFull!.completedAt!).toLocaleDateString("es")}
                </p>
                <button
                  className="text-button"
                  onClick={() => {
                    setViewId(latestFull!.id);
                    setOnlyIncorrect(true);
                  }}
                >
                  Revisar evaluación <ChevronRight size={15} />
                </button>
              </div>
            </section>
          )}
          <div className="challenge-config panel">
            <div>
              <h2>¿Qué quieres practicar?</h2>
              <p>Elige todos los dominios o concéntrate en uno.</p>
            </div>
            <label className="select-wrap">
              <span className="sr-only">Dominio del reto</span>
              <select
                value={domain}
                onChange={(e) => setDomain(e.target.value as DomainId | "all")}
              >
                <option value="all">
                  Toda la biblioteca · {cards.length} tarjetas
                </option>
                {domains.map((d) => (
                  <option value={d.id} key={d.id}>
                    {d.name} · {cards.filter((c) => c.domain === d.id).length}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="challenge-mode-grid">
            <section className="panel challenge-mode">
              <span className="large-icon">
                <Lightbulb size={28} />
              </span>
              <span className="eyebrow">PRACTICAR Y APRENDER</span>
              <h2>Reto corto</h2>
              <p>
                Una pregunta, cuatro opciones y una explicación después de
                responder. Aprende por qué encaja la respuesta y por qué las
                demás no.
              </p>
              <label className="challenge-count">
                Número de preguntas
                <select
                  aria-label="Número de preguntas del reto"
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value))}
                >
                  <option value={10}>10 preguntas</option>
                  <option value={20}>20 preguntas</option>
                </select>
              </label>
              <Button disabled={blocked} onClick={() => start("practice")}>
                Empezar reto <ArrowRight size={16} />
              </Button>
              <small>
                Selección aleatoria, sin preguntas repetidas dentro del reto.
              </small>
            </section>
            <section className="panel challenge-mode full-mode">
              <span className="large-icon">
                <Target size={28} />
              </span>
              <span className="eyebrow">MEDIR LO QUE SABES</span>
              <h2>
                {domain === "all"
                  ? "Evaluar toda mi biblioteca"
                  : "Evaluar todo este dominio"}
              </h2>
              <p>
                Responde las {eligible.length} tarjetas una por una. Las
                respuestas se revelan al terminar, para que tu resultado refleje
                tu primer intento.
              </p>
              <div className="challenge-scope">
                <Layers3 size={19} />
                <strong>{eligible.length} preguntas · sin temporizador</strong>
                <span>
                  Resultado total + desglose por dominio + revisión de errores.
                </span>
              </div>
              <Button disabled={blocked} onClick={() => start("full")}>
                Comenzar evaluación completa <ArrowRight size={16} />
              </Button>
              <small>
                Tu avance se guarda con cada respuesta. Puedes retomarla otro
                día.
              </small>
            </section>
          </div>
          <div className="method-note challenge-method">
            <ShieldCheck size={20} />
            <p>
              El porcentaje mide aciertos de opción múltiple en este intento, no
              la probabilidad de aprobar el examen oficial ni tarjetas dominadas
              en FSRS. Un reto corto solo mide las preguntas que incluye; la
              evaluación completa cubre cada tarjeta del alcance seleccionado.
            </p>
          </div>
          <section className="panel challenge-history">
            <h2>Tus retos anteriores</h2>
            {attempts.some((a) => a.completedAt) ? (
              <div className="upcoming-list">
                {[...attempts]
                  .reverse()
                  .filter((a) => a.completedAt)
                  .map((a) => {
                    const score = challengeResult(a);
                    return (
                      <button
                        key={a.id}
                        onClick={() => {
                          setViewId(a.id);
                          setOnlyIncorrect(true);
                        }}
                      >
                        <span>
                          <strong>
                            {a.kind === "full"
                              ? a.domain === "all"
                                ? "Toda la biblioteca"
                                : "Dominio completo"
                              : a.kind === "retry"
                                ? "Repaso de errores"
                                : "Reto corto"}
                          </strong>
                          <small>
                            {a.domain === "all"
                              ? "Todos los dominios"
                              : domains.find((d) => d.id === a.domain)
                                  ?.name}{" "}
                            ·{" "}
                            {new Date(a.completedAt!).toLocaleDateString("es")}
                          </small>
                        </span>
                        <span>
                          {score.correct}/{score.total} · {score.percent}%{" "}
                          <ChevronRight size={16} />
                        </span>
                      </button>
                    );
                  })}
              </div>
            ) : (
              <div className="empty-state">
                <Trophy size={28} />
                <p>
                  Tu primer reto será el punto de partida. Aquí verás tus
                  resultados reales.
                </p>
              </div>
            )}
          </section>
        </>
      ) : result ? (
        <>
          <section
            className="panel challenge-result"
            aria-labelledby="result-title"
          >
            <span className="large-icon">
              <Trophy size={32} />
            </span>
            <span className="eyebrow">
              {attempt.kind === "full"
                ? "EVALUACIÓN COMPLETADA"
                : attempt.kind === "retry"
                  ? "REPASO DE ERRORES COMPLETADO"
                  : "RETO COMPLETADO"}
            </span>
            <h2 ref={titleRef} tabIndex={-1} id="result-title">
              Acertaste {result.correct} de {result.total} · {result.percent}%
            </h2>
            <p>
              {attempt.kind === "full" && attempt.domain === "all"
                ? `Respondiste toda tu biblioteca: ${result.total} tarjetas, sin repeticiones.`
                : attempt.domain !== "all"
                  ? `Alcance: ${domains.find((d) => d.id === attempt.domain)?.name}.`
                  : "Este porcentaje corresponde solo a las preguntas de este reto."}
            </p>
            <div className="result-counts">
              <span>
                <CheckCircle2 size={18} />
                {result.correct} correctas
              </span>
              <span>
                <XCircle size={18} />
                {result.incorrect.length} por reforzar
              </span>
            </div>
            <div className="result-actions">
              {result.incorrect.length > 0 && (
                <Button
                  disabled={blocked}
                  onClick={() => start("retry", attempt)}
                >
                  <RotateCcw size={16} />
                  Practicar mis {result.incorrect.length} errores
                </Button>
              )}
              <Button variant="outline" onClick={() => setViewId(null)}>
                Elegir otro reto
              </Button>
            </div>
            <small>
              Contenido v{attempt.contentVersion}. Resultado guardado. El repaso
              de errores crea un intento independiente y conserva este
              resultado.
            </small>
          </section>
          <section className="panel challenge-domains">
            <h2>¿Dónde puedes mejorar?</h2>
            <div className="challenge-domain-grid">
              {result.domains
                .filter((d) => d.total)
                .map((d) => (
                  <div key={d.id}>
                    <span>{d.name}</span>
                    <strong>
                      {d.correct}/{d.total} ·{" "}
                      {Math.round((d.correct / d.total) * 100)}%
                    </strong>
                    <div className="domain-track">
                      <i
                        style={{
                          width: `${(d.correct / d.total) * 100}%`,
                          background: d.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </section>
          <section className="challenge-review">
            <div className="section-heading">
              <div>
                <h2>Aprende de tus respuestas</h2>
                <p>
                  Abre una pregunta para ver tu respuesta y la explicación de
                  cada opción.
                </p>
              </div>
              <div className="mode-tabs">
                <button
                  className={onlyIncorrect ? "selected" : ""}
                  onClick={() => setOnlyIncorrect(true)}
                >
                  Incorrectas ({result.incorrect.length})
                </button>
                <button
                  className={!onlyIncorrect ? "selected" : ""}
                  onClick={() => setOnlyIncorrect(false)}
                >
                  Todas ({result.total})
                </button>
              </div>
            </div>
            {(onlyIncorrect ? result.incorrect : attempt.questionIds).map(
              (id) => (
                <QuestionReview
                  key={id}
                  id={id}
                  selected={attempt.answers[id]}
                />
              ),
            )}
            {onlyIncorrect && !result.incorrect.length && (
              <div className="empty-state panel">
                <CheckCircle2 size={30} />
                <h3>¡Todas correctas!</h3>
                <p>Puedes revisar las explicaciones en la pestaña Todas.</p>
              </div>
            )}
          </section>
        </>
      ) : question ? (
        <>
          <div className="session-progress">
            <span>
              {attempt.kind === "full"
                ? "Evaluación completa"
                : attempt.kind === "retry"
                  ? "Repaso de errores"
                  : "Reto de aprendizaje"}{" "}
              · {domains.find((d) => d.id === question.domain)?.name}
            </span>
            <span>
              Pregunta {attempt.cursor + 1} de {attempt.questionIds.length} ·{" "}
              {Object.keys(attempt.answers).length} confirmadas
            </span>
            <div>
              <i
                style={{
                  width: `${(Object.keys(attempt.answers).length / attempt.questionIds.length) * 100}%`,
                }}
              />
            </div>
          </div>
          <section className="panel challenge-question">
            <span className="card-overline">
              <Target size={16} />
              ELIGE UNA RESPUESTA
            </span>
            <h2 lang="en" ref={titleRef} tabIndex={-1}>
              {question.prompt}
            </h2>
            <fieldset
              className="challenge-options"
              disabled={!!submitted || blocked}
            >
              <legend className="sr-only">Opciones de respuesta</legend>
              {attempt.optionOrder[question.id].map((id, index) => {
                const option = question.options.find((o) => o.id === id)!;
                return (
                  <label
                    key={id}
                    className={`challenge-option ${(submitted ?? selection) === id ? "chosen" : ""} ${showFeedback && id === question.correctId ? "correct" : ""} ${showFeedback && submitted === id && id !== question.correctId ? "incorrect" : ""}`}
                  >
                    <input
                      type="radio"
                      name={question.id}
                      value={id}
                      checked={(submitted ?? selection) === id}
                      onChange={() => setSelection(id)}
                    />
                    <span className="option-letter">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span lang="en">{option.text}</span>
                    {showFeedback && id === question.correctId && (
                      <CheckCircle2 size={18} aria-label="Respuesta correcta" />
                    )}
                    {showFeedback &&
                      submitted === id &&
                      id !== question.correctId && (
                        <XCircle
                          size={18}
                          aria-label="Tu respuesta incorrecta"
                        />
                      )}
                  </label>
                );
              })}
            </fieldset>
            {!submitted && (
              <div className="challenge-confirm">
                <p>
                  {attempt.kind === "full"
                    ? "Podrás revisar las respuestas al completar la evaluación."
                    : "Confirma tu elección para descubrir la explicación."}
                </p>
                <Button disabled={!selection || blocked} onClick={confirm}>
                  {attempt.kind === "full" &&
                  attempt.cursor === attempt.questionIds.length - 1
                    ? "Finalizar evaluación"
                    : "Confirmar respuesta"}
                  <ArrowRight size={16} />
                </Button>
              </div>
            )}
            {showFeedback && (
              <div className="challenge-feedback">
                <div
                  role="status"
                  className={`feedback-heading ${submitted === question.correctId ? "is-correct" : "is-incorrect"}`}
                >
                  {submitted === question.correctId ? (
                    <CheckCircle2 size={22} />
                  ) : (
                    <Lightbulb size={22} />
                  )}
                  <strong>
                    {submitted === question.correctId
                      ? "¡Correcto! Refuerza la conexión."
                      : "Una oportunidad para aprender."}
                  </strong>
                </div>
                <AnswerExplanation id={question.id} selected={submitted!} />
                <Button disabled={blocked} onClick={next}>
                  {attempt.cursor === attempt.questionIds.length - 1
                    ? "Ver mi resultado"
                    : "Siguiente pregunta"}
                  <ArrowRight size={16} />
                </Button>
              </div>
            )}
          </section>
          <div className="session-end">
            <button className="text-button" onClick={() => setViewId(null)}>
              Pausar y volver al resumen <ArrowLeft size={14} />
            </button>
            <span>
              <ShieldCheck size={14} />
              Cada respuesta confirmada queda guardada
            </span>
          </div>
        </>
      ) : null}
    </>
  );
}
function AnswerExplanation({ id, selected }: { id: string; selected: string }) {
  const question = challengeQuestions.find((q) => q.id === id)!;
  const card = cards.find((c) => c.id === id)!;
  return (
    <div className="challenge-explanation">
      <p>
        <strong>La respuesta: {card.answer}</strong>
        <br />
        {card.explanation}
      </p>
      <div className="answer-block">
        <span>EN LA VIDA REAL</span>
        <p>{card.example}</p>
      </div>
      <div className="answer-block">
        <span>LA DISTINCIÓN CLAVE</span>
        <p lang="en">{card.confusion}</p>
      </div>
      <h3>Por qué encaja cada opción</h3>
      <ul>
        {question.options.map((option) => (
          <li key={option.id}>
            <strong lang="en">{option.text}</strong>
            <span className="explanation-tags">
              {option.id === question.correctId ? "Correcta" : "No corresponde"}
              {option.id === selected ? " · Tu elección" : ""}
            </span>
            <p>{option.explanation}</p>
          </li>
        ))}
      </ul>
      <div className="memory-note">
        <Lightbulb size={17} />
        <p>{card.mnemonic}</p>
      </div>
    </div>
  );
}
function QuestionReview({ id, selected }: { id: string; selected: string }) {
  const q = challengeQuestions.find((q) => q.id === id)!;
  const correct = selected === q.correctId;
  return (
    <details className="panel question-review">
      <summary>
        <span className={correct ? "review-correct" : "review-incorrect"}>
          {correct ? <CheckCircle2 size={19} /> : <XCircle size={19} />}
          <span className="sr-only">
            {correct ? "Correcta" : "Incorrecta"}:{" "}
          </span>
        </span>
        <span lang="en">{q.prompt}</span>
        <ChevronRight size={17} />
      </summary>
      <AnswerExplanation id={id} selected={selected} />
    </details>
  );
}
