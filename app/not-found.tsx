import Link from "next/link";
import { FileQuestion } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md space-y-4 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-50 text-blue-600">
          <FileQuestion className="h-8 w-8" />
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950">Transcript not found</h1>
        <p className="text-sm leading-6 text-slate-500">
          The transcript you requested does not exist or may have been deleted.
        </p>
        <Button asChild>
          <Link href="/dashboard">Return to dashboard</Link>
        </Button>
      </div>
    </main>
  );
}

