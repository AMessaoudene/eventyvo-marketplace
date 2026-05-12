"use client";

import * as React from "react";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PRODUCTS } from "@/data/catalog";
import { setVendorId } from "@/lib/order-storage";

const vendorOptions = Array.from(new Map(PRODUCTS.map((p) => [p.vendorId, p.vendorName])).entries());

export default function VendorOnboardingPage() {
  const [step, setStep] = React.useState(0);
  const [business, setBusiness] = React.useState("");
  const [taxId, setTaxId] = React.useState("");
  const [vendorPick, setVendorPick] = React.useState(vendorOptions[0]?.[0] ?? "");

  const finish = () => {
    if (!business.trim()) {
      toast.error("Business name required");
      return;
    }
    setVendorId(vendorPick);
    localStorage.setItem(
      "eventyvo-marketplace-kyc",
      JSON.stringify({ business, taxId, status: "pending_review", at: new Date().toISOString() }),
    );
    void fetch("/api/sync/catalog", { method: "POST" }).catch(() => {});
    toast.success("KYC submitted (demo). Vendor ID saved for seller order view.");
    setStep(3);
  };

  return (
    <div className="mx-auto max-w-lg space-y-6 px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-900">Vendor onboarding & KYC</h1>
      <Card>
        <CardHeader>
          <CardTitle>Step {Math.min(step + 1, 3)} of 3</CardTitle>
          <CardDescription>Collect business details; production uses document upload + manual review.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === 0 ? (
            <div className="space-y-2">
              <Label>Legal business name</Label>
              <Input value={business} onChange={(e) => setBusiness(e.target.value)} placeholder="Atlas Events LLC" />
            </div>
          ) : null}
          {step === 1 ? (
            <div className="space-y-2">
              <Label>Tax / registration ID</Label>
              <Input value={taxId} onChange={(e) => setTaxId(e.target.value)} placeholder="NIF / EIN / VAT" />
            </div>
          ) : null}
          {step === 2 ? (
            <div className="space-y-2">
              <Label>Link to demo vendor profile</Label>
              <select
                className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-sm"
                value={vendorPick}
                onChange={(e) => setVendorPick(e.target.value)}
              >
                {vendorOptions.map(([id, name]) => (
                  <option key={id} value={id}>
                    {name} ({id})
                  </option>
                ))}
              </select>
              <p className="text-xs text-slate-500">In production this is your verified company from fennec-back.</p>
            </div>
          ) : null}
          {step === 3 ? (
            <p className="text-sm text-slate-600">
              You can manage listings in <strong>eventyvo-b2b</strong> marketplace module once catalog sync is wired.{" "}
              <Link href="/vendor/orders" className="text-primary underline">
                Seller orders
              </Link>
            </p>
          ) : null}
        </CardContent>
      </Card>
      {step < 3 ? (
        <div className="flex justify-between gap-2">
          <Button type="button" variant="outline" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
            Back
          </Button>
          {step < 2 ? (
            <Button
              type="button"
              onClick={() => {
                if (step === 0 && !business.trim()) {
                  toast.error("Enter business name");
                  return;
                }
                if (step === 1 && !taxId.trim()) {
                  toast.error("Enter tax / registration ID");
                  return;
                }
                setStep((s) => s + 1);
              }}
            >
              Next
            </Button>
          ) : (
            <Button type="button" onClick={finish}>
              Submit KYC
            </Button>
          )}
        </div>
      ) : null}
    </div>
  );
}
