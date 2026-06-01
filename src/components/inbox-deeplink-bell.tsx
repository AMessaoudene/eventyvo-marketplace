"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import { getPlatformInboxUrl } from "@/lib/platform-inbox-url";

export function InboxDeeplinkBell() {
  const href = getPlatformInboxUrl();
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50"
      aria-label="Notifications — opens Eventyvo inbox"
      title="Notifications (Eventyvo)"
    >
      <Bell className="h-4 w-4" aria-hidden />
    </Link>
  );
}
