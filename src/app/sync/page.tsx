import Link from "next/link";
import { SYNC_REGISTRY } from "@/lib/sync/registry";

export default function SyncDocsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-10">
      <Link href="/" className="text-sm text-primary hover:underline">
        ← Marketplace home
      </Link>
      <h1 className="text-2xl font-bold text-slate-900">Synchronizations</h1>
      <p className="text-sm text-slate-600">
        HTTP stubs under <code className="rounded bg-slate-100 px-1">/api/sync/*</code>. Configure webhooks in production.
      </p>
      <ul className="divide-y rounded-lg border bg-white">
        {SYNC_REGISTRY.map((row) => (
          <li key={row.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm">
            <div>
              <p className="font-medium text-slate-900">{row.label}</p>
              <p className="text-xs text-slate-500">{row.service}</p>
            </div>
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-900">{row.status}</span>
          </li>
        ))}
      </ul>
      <p className="text-xs text-slate-500">
        POST <code className="rounded bg-slate-100 px-1">/api/sync/order</code> with <code>{"{ orderId }"}</code> · POST{" "}
        <code className="rounded bg-slate-100 px-1">/api/sync/catalog</code> after listing changes.
      </p>
    </div>
  );
}
