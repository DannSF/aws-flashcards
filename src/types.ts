import type { Card } from "ts-fsrs";
export type DomainId = string;
export interface AWSService {
  id: string;
  name: string;
  category: string;
}
export interface Flashcard {
  id: string;
  service: string;
  domain: DomainId;
  category: string;
  question: string;
  answer: string;
  explanation: string;
  keywords: string[];
  example: string;
  confusion: string;
  mnemonic: string;
  difficulty: "Foundation" | "Applied";
  tags: string[];
}
export interface LearningDeck {
  id: string;
  name: string;
  cardIds: string[];
}
export type RecallRating = 1 | 2 | 3 | 4;
export interface ReviewRecord {
  cardId: string;
  at: string;
  rating: RecallRating;
  previousDue: string;
  nextDue: string;
}
export interface StudySession {
  id: string;
  startedAt: string;
  endedAt: string;
  reviews: number;
}
export interface ExamQuestion {
  id: string;
  domain: DomainId;
  prompt: string;
  options: { id: string; text: string; explanation: string }[];
  correctIds: string[];
  keywords: string[];
}
export interface ExamAttempt {
  id: string;
  startedAt: string;
  submittedAt: string;
  questionIds: string[];
  answers: Record<string, string[]>;
  score: number;
}
export interface UserProgress {
  version: 1;
  cards: Record<string, Card>;
  history: ReviewRecord[];
  sessions: StudySession[];
  exams: ExamAttempt[];
  dailyGoal: number;
  challenges?: ChallengeAttempt[];
}

export interface ChallengeAttempt {
  id: string;
  contentVersion: string;
  kind: "practice" | "full" | "retry";
  domain: DomainId | "all";
  startedAt: string;
  completedAt?: string;
  questionIds: string[];
  optionOrder: Record<string, string[]>;
  answers: Record<string, string>;
  cursor: number;
  parentId?: string;
}
