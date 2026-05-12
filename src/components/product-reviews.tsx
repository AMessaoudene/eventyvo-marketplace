"use client";

import * as React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Product, Review } from "@/data/catalog";

const key = (slug: string) => `eventyvo-marketplace-reviews-${slug}`;

export function ProductReviews({ product }: { product: Product }) {
  const [reviews, setReviews] = React.useState<Review[]>(product.reviews);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(key(product.slug));
      const extra = raw ? (JSON.parse(raw) as Review[]) : [];
      const merged = [...product.reviews];
      for (const e of extra) {
        if (!merged.some((m) => m.id === e.id)) merged.push(e);
      }
      setReviews(merged);
    } catch {
      setReviews(product.reviews);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- seed reviews from catalog; slug identifies product
  }, [product.slug]);

  const [author, setAuthor] = React.useState("");
  const [text, setText] = React.useState("");
  const [rating, setRating] = React.useState(5);

  const submit = () => {
    if (!author.trim() || !text.trim()) {
      toast.error("Name and review text required");
      return;
    }
    const r: Review = {
      id: crypto.randomUUID(),
      author: author.trim(),
      rating,
      text: text.trim(),
      at: new Date().toISOString().slice(0, 10),
    };
    const next = [...reviews, r];
    setReviews(next);
    const existing = (() => {
      try {
        const raw = localStorage.getItem(key(product.slug));
        return raw ? (JSON.parse(raw) as Review[]) : [];
      } catch {
        return [];
      }
    })();
    localStorage.setItem(key(product.slug), JSON.stringify([...existing, r]));
    setText("");
    toast.success("Review posted (demo — moderation TBD)");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reviews</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <ul className="space-y-4">
          {reviews.map((r) => (
            <li key={r.id} className="border-b border-slate-100 pb-3 last:border-0">
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium">{r.author}</span>
                <span className="text-amber-600">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span>
              </div>
              <p className="mt-1 text-sm text-slate-700">{r.text}</p>
              <p className="mt-1 text-xs text-slate-400">{r.at}</p>
            </li>
          ))}
        </ul>
        <div className="space-y-3 rounded-lg border border-dashed border-slate-200 p-4">
          <p className="text-sm font-medium text-slate-800">Write a review</p>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="ra">Name</Label>
              <Input id="ra" value={author} onChange={(e) => setAuthor(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rr">Rating</Label>
              <Input
                id="rr"
                type="number"
                min={1}
                max={5}
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="rt">Review</Label>
            <textarea
              id="rt"
              className="min-h-[80px] w-full rounded-md border border-slate-200 p-2 text-sm"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
          <Button type="button" onClick={submit}>
            Submit review
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
