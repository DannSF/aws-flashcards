import { useEffect, useRef } from "react";
import type { LucideIcon } from "lucide-react";
import { Check, ChevronRight, Sparkles, X } from "lucide-react";
import { cards } from "../data/cards";
import type { UserProgress } from "../types";
import { localDay } from "../lib/progress";
export function Stat({
  label,
  value,
  icon: Icon,
  color,
  note,
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  note: string;
}) {
  return (
    <div className="stat-card">
      <div className="stat-top">
        <span>{label}</span>
        <span className={`stat-icon ${color}`}>
          <Icon size={19} />
        </span>
      </div>
      <strong>{value}</strong>
      <small>{note}</small>
    </div>
  );
}
export function WeekActivity({
  progress,
  now,
}: {
  progress: UserProgress;
  now: Date;
}) {
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - 6 + i);
    return d;
  });
  const studied = new Set(
    progress.history.map((h) => localDay(new Date(h.at))),
  );
  return (
    <div className="week-activity">
      {days.map((d) => (
        <div key={localDay(d)}>
          <span>{d.toLocaleDateString("es", { weekday: "narrow" })}</span>
          <i
            className={`${studied.has(localDay(d)) ? "done" : ""} ${localDay(d) === localDay(now) ? "today" : ""}`}
            aria-label={`${d.toLocaleDateString("es")}: ${studied.has(localDay(d)) ? "con actividad" : "sin actividad"}`}
          >
            {studied.has(localDay(d)) ? <Check size={13} /> : <span />}
          </i>
        </div>
      ))}
    </div>
  );
}
export function ActivityChart({
  progress,
  now,
}: {
  progress: UserProgress;
  now: Date;
}) {
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - 6 + i);
    return {
      date: d,
      count: progress.history.filter(
        (h) => localDay(new Date(h.at)) === localDay(d),
      ).length,
    };
  });
  const max = Math.max(5, ...days.map((d) => d.count));
  return (
    <div
      className="activity-chart"
      role="img"
      aria-label={days
        .map((d) => `${d.date.toLocaleDateString("es")}: ${d.count} repasos`)
        .join("; ")}
    >
      {days.map((d) => (
        <div key={localDay(d.date)}>
          <strong>{d.count}</strong>
          <div className="bar-area">
            <i style={{ height: `${Math.max((d.count / max) * 100, 2)}%` }} />
          </div>
          <span>{d.date.toLocaleDateString("es", { weekday: "short" })}</span>
        </div>
      ))}
    </div>
  );
}
export function WeakCards({
  progress,
  onSelect,
}: {
  progress: UserProgress;
  onSelect: (id: string) => void;
}) {
  const counts = progress.history
    .filter((h) => h.rating <= 2)
    .reduce<Record<string, number>>(
      (a, h) => ({ ...a, [h.cardId]: (a[h.cardId] ?? 0) + 1 }),
      {},
    );
  const weak = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  return weak.length ? (
    <div className="weak-list">
      {weak.map(([id, n]) => (
        <button onClick={() => onSelect(id)} key={id}>
          <span>{cards.find((c) => c.id === id)?.answer}</span>
          <strong>
            {n} {n === 1 ? "repaso difícil" : "repasos difíciles"}
            <ChevronRight size={14} />
          </strong>
        </button>
      ))}
    </div>
  ) : (
    <div className="empty-state">
      <Sparkles size={27} />
      <p>
        {progress.history.length
          ? "¡Buen trabajo! Aún no hay valoraciones Again o Hard."
          : "Al estudiar, aquí encontrarás los conceptos que más te cuestan."}
      </p>
    </div>
  );
}
export function Dialog({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    d?.showModal();
    return () => d?.close();
  }, []);
  return (
    <dialog
      ref={ref}
      className="dialog"
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          const r = e.currentTarget.getBoundingClientRect();
          if (
            e.clientX < r.left ||
            e.clientX > r.right ||
            e.clientY < r.top ||
            e.clientY > r.bottom
          )
            onClose();
        }
      }}
    >
      <div className="dialog-header">
        <h2>{title}</h2>
        <button
          className="icon-button"
          aria-label="Cerrar diálogo"
          onClick={onClose}
          autoFocus
        >
          <X size={20} />
        </button>
      </div>
      {children}
    </dialog>
  );
}
