/**
 * Shared trial / subscription helpers used by the demo and upgrade pages.
 */

export const TRIAL_DAYS = 14;
export const DAILY_LIMIT: Record<string, number> = {
  trial:   10,
  starter: 50,
  pro:     Infinity,
  team:    Infinity,
};

export type Plan = "trial" | "starter" | "pro" | "team" | "expired";

export function daysLeftInTrial(createdAt: Date): number {
  const ms      = TRIAL_DAYS * 24 * 60 * 60 * 1000;
  const elapsed = Date.now() - createdAt.getTime();
  return Math.max(0, Math.ceil((ms - elapsed) / (24 * 60 * 60 * 1000)));
}

export function planLabel(plan: Plan): string {
  return { trial: "Free Trial", starter: "Starter", pro: "Pro", team: "Team", expired: "Expired" }[plan] ?? plan;
}

export function planColor(plan: Plan): string {
  return { trial: "#f59e0b", starter: "#6d5fff", pro: "#00d4a8", team: "#9d94ff", expired: "#ef4444" }[plan] ?? "#6868a0";
}
