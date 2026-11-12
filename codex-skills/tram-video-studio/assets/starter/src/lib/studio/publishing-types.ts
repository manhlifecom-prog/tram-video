export const socialPlatforms = ["facebook", "tiktok", "youtube", "instagram", "threads", "linkedin"] as const;
export type SocialPlatform = (typeof socialPlatforms)[number];
export const platformNames: Record<SocialPlatform, string> = {
  facebook: "Facebook", tiktok: "TikTok", youtube: "YouTube", instagram: "Instagram", threads: "Threads", linkedin: "LinkedIn",
};
export const publicationLabels = {
  draft: "Bản nháp", scheduled: "Đã hẹn giờ", publishing: "Đang đăng",
  published: "Đã đăng", blocked: "Cần xử lý", uncertain: "Cần kiểm tra trên kênh", cancelled: "Đã hủy",
};
export type Publication = {
  id: string; workspaceId: string; jobId: string; version: number;
  platform: SocialPlatform; channelId?: string;
  title: string; caption: string; scheduledAt: string;
  status: keyof typeof publicationLabels; createdAt: string; updatedAt: string;
  approvedAt?: string; error?: string; attemptAt?: string;
  remoteId?: string; remoteUrl?: string;
  madeForKids: boolean; containsSyntheticMedia: boolean;
};
export type SocialChannel = {
  id: string; workspaceId: string; remoteId: string;
  name: string; connectedAt: string; expiresAt?: number;
} & ({ platform: "youtube"; encryptedRefreshToken: string } | {
  platform: Exclude<SocialPlatform, "youtube">; encryptedCredentials: string;
});
export type PublicSocialChannel = {
  id: string; workspaceId: string; platform: SocialPlatform; remoteId: string;
  name: string; connectedAt: string; expiresAt?: number;
};
export type SocialOAuth = {
  hash: string; browserHash: string; workspaceId: string; expires: number;
  verifier: string; platform?: SocialPlatform; configHash?: string;
};
export type SocialApp = { clientId: string; encryptedSecret: string; redirectUri: string; updatedAt: string };
export type SocialCandidate = {
  id: string; remoteId: string; name: string; encryptedCredentials: string; expiresAt?: number;
};
export type SocialSelection = {
  id: string; workspaceId: string; platform: Exclude<SocialPlatform, "youtube">;
  expires: number; candidates: SocialCandidate[];
};
export type PublicConnectionChoice = Omit<SocialSelection, "candidates"> & {
  candidates: Pick<SocialCandidate, "id" | "name">[];
};
export type SocialProviderView = {
  platform: SocialPlatform; ready: boolean; configured: boolean;
  reason?: string; accountHint: string; publishingSupported: boolean;
};
export type PublishingView = {
  channels: PublicSocialChannel[]; posts: Publication[]; youtubeConfigured: boolean;
  providers: SocialProviderView[]; connectionChoices: PublicConnectionChoice[];
};
