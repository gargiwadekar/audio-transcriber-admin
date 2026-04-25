"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { useMemo, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SearchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState(searchParams.get("query") ?? "");
  const [date, setDate] = useState(searchParams.get("date") ?? "");

  const hasFilters = useMemo(
    () => Boolean(searchParams.get("query") || searchParams.get("date")),
    [searchParams],
  );

  function applyFilters() {
    const params = new URLSearchParams(searchParams.toString());

    if (search.trim()) {
      params.set("query", search.trim());
    } else {
      params.delete("query");
    }

    if (date) {
      params.set("date", date);
    } else {
      params.delete("date");
    }

    startTransition(() => {
      router.push(`/dashboard?${params.toString()}`);
    });
  }

  function clearFilters() {
    setSearch("");
    setDate("");
    startTransition(() => {
      router.push("/dashboard");
    });
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 md:flex-row md:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          placeholder="Search by transcript content or file name"
          className="pl-10"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>
      <Input type="date" className="md:w-48" value={date} onChange={(event) => setDate(event.target.value)} />
      <Button onClick={applyFilters} disabled={isPending}>
        {isPending ? "Applying..." : "Apply filters"}
      </Button>
      {hasFilters ? (
        <Button variant="ghost" onClick={clearFilters} disabled={isPending}>
          <X className="h-4 w-4" />
          Clear
        </Button>
      ) : null}
    </div>
  );
}

