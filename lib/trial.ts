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

export type Plan = "trial" | "starter" | "pro" | "team" | "expired" | "pilot";

export function daysLeftInTrial(createdAt: Date): number {
  const ms      = TRIAL_DAYS * 24 * 60 * 60 * 1000;
  const elapsed = Date.now() - createdAt.getTime();
  return Math.max(0, Math.ceil((ms - elapsed) / (24 * 60 * 60 * 1000)));
}

export function planLabel(plan: Plan): string {
  return { trial: "Free Trial", starter: "Starter", pro: "Pro", team: "Team", expired: "Expired", pilot: "Pilot" }[plan] ?? plan;
}

export function planColor(plan: Plan): string {
  return { trial: "#f59e0b", starter: "#2a5fd8", pro: "#0d9488", team: "#0d9488", expired: "#dc2626", pilot: "#0c2340" }[plan] ?? "#9aa0a6";
}
