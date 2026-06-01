/**
 * Pattern A — main Eventyvo inbox (`eventyvo-docs/CROSS_APP_NOTIFICATION_BELL.md`).
 * Set `NEXT_PUBLIC_EVENTYVO_APP_URL` in production.
 */
export function getPlatformInboxUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_EVENTYVO_APP_URL ||
    process.env.NEXT_PUBLIC_FRONTEND_URL ||
    "https://app.eventyvo.com";
  const base = raw.replace(/\/$/, "");
  return `${base}/home`;
}
