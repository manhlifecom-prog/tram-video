import type { GraphicSpec } from "./graphic-spec";
export type StudioBrief = {
  chatEngine?: "fast" | "codex" | "instant" | "local";
  id: string;
  workspaceId: string;
  updatedAt: string;
  messages: { role: "user" | "assistant"; text: string }[];
  title: string;
  instructions: string;
  aspect: "inherit" | "9:16" | "16:9" | "1:1";
  pace: "inherit" | "calm" | "balanced" | "fast";
};
export type StudioPlan = "shared" | "private";
export type JobStatus =
  | "queued"
  | "processing"
  | "preflight"
  | "review"
  | "revision"
  | "approved"
  | "failed";
export type StudioAsset = {
  id: string;
  file: string;
  name: string;
  description: string;
  mime: "image/png" | "image/jpeg" | "image/webp";
  bytes: number;
};
export type Concept = {
  footageTone?: "natural" | "lift-shadows";
  assets?: StudioAsset[];
  renderer?: "remotion" | "ffmpeg";
  name: string;
  color: string;
  font: "Arial" | "Helvetica" | "Verdana" | "Be Vietnam Pro";
  pace: "calm" | "balanced" | "fast";
  aspect: "9:16" | "16:9" | "1:1";
  audience: string;
  instructions: string;
  glossary: string;
  reference: string;
};
export type Workspace = {
  onboarding?: { stage: "concept" | "calibration" | "validation" | "handoff"; notes: string; updatedAt: string; conceptVersion: number; calibrationJobs: string[]; validationJobs: string[] };
  id: string;
  name: string;
  appName: string;
  plan: StudioPlan;
  createdAt: string;
  tokenHash: string;
  concept: Concept;
  conceptVersion: number;
};
export const editLayouts = [
  "speaker",
  "overlay",
  "product",
  "creator",
  "custom",
  "image",
  "title",
  "stat",
  "steps",
  "comparison",
  "iceberg",
  "timeline",
  "quote",
] as const;
export type EditPlan = {
  title: string;
  summary: string;
  scenes: {
    start: number;
    end: number;
    caption: string;
    visual: string;
    graphic?: GraphicSpec;
    assetId?: string;
    layout?: (typeof editLayouts)[number];
    items?: string[];
  }[];
};
export type Revision = {
  director?: "codex" | "local";
  renderer?: "remotion" | "ffmpeg";
  version: number;
  file: string;
  createdAt: string;
  plan?: EditPlan;
};
export type StudioJob = {
  directorNotes?: string;
  analysis?: SourceAnalysis;
  quality?: { checkedAt: string; captionCoverage: number; retainedRatio?: number; issues: string[] };
  id: string;
  workspaceId: string;
  title: string;
  instructions: string;
  brief?: StudioBrief;
  source: string;
  sourceFingerprint?: string;
  sourceName: string;
  bytes: number;
  status: JobStatus;
  createdAt: string;
  updatedAt: string;
  concept: Concept;
  conceptVersion: number;
  phase: string;
  error?: string;
  feedback: { text: string; at: string; version: number }[];
  renders: Revision[];
  transcript?: string;
  plan?: EditPlan;
  leaseUntil?: number;
};
export type StudioSettings = {
  sharedSetup: number;
  privateSetup: number;
  monthly: number;
};
export type StudioState = {
  socialApps?: Partial<Record<import("./publishing-types").SocialPlatform, import("./publishing-types").SocialApp>>;
  socialSelections?: import("./publishing-types").SocialSelection[];
  publications?: import("./publishing-types").Publication[];
  socialChannels?: import("./publishing-types").SocialChannel[];
  socialOAuth?: import("./publishing-types").SocialOAuth[];
  briefs?: StudioBrief[];
  version: 1;
  admin?: { passwordHash: string };
  sessions: { hash: string; expires: number }[];
  workspaces: Workspace[];
  jobs: StudioJob[];
  settings: StudioSettings;
};
export type PublicWorkspace = Omit<Workspace, "tokenHash">;
export type StudioView = {
  role: "admin" | "client";
  workspaces: PublicWorkspace[];
  jobs: StudioJob[];
  settings: StudioSettings;
  worker: { online: boolean; at?: string; ai: boolean; aiMode?: "local" | "cloud" };
};
export const defaultConcept: Concept = {
  renderer: "remotion",
  name: "Concept đầu tiên",
  color: "#f2663b",
  font: "Be Vietnam Pro",
  pace: "balanced",
  aspect: "9:16",
  audience: "",
  instructions:
    "Giữ lời nói tự nhiên, phụ đề rõ ràng, không thêm thông tin ngoài clip.",
  glossary: "",
  reference: "",
};
export const statusLabels: Record<JobStatus, string> = {
  queued: "Chờ xử lý",
  processing: "Đang dựng",
  preflight: "Cần kiểm tra nội dung",
  review: "Chờ duyệt",
  revision: "Yêu cầu sửa",
  approved: "Hoàn thành",
  failed: "Cần kiểm tra",
};

export type SourceAnalysis = {
  engine?: "local" | "cloud";
  timingRecovery?: "speech-regions-v1";
  source: string;
  duration: number;
  revision: number;
  createdAt: string;
  primaryText: string;
  segments: { start: number; end: number; text: string }[];
  words?: { start: number; end: number; word: string }[];
  observations: { at: number; description: string; keepSource: boolean }[];
  confirmedAt?: string;
};
