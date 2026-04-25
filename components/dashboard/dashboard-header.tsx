import { CalendarDays } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { LogoutButton } from "@/components/dashboard/logout-button";

export function DashboardHeader({
  adminEmail,
}: {
  adminEmail: string;
}) {
  return (
    <header className="flex flex-col gap-4 border-b border-slate-200 bg-white/80 px-6 py-5 backdrop-blur md:flex-row md:items-center md:justify-between">
      <div className="space-y-2">
        <Badge>Secure admin login</Badge>
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Audio Transcription Dashboard</h2>
          <p className="mt-1 flex items-center gap-2 text-sm text-slate-500">
            <CalendarDays className="h-4 w-4" />
            Logged in as {adminEmail}
          </p>
        </div>
      </div>
      <LogoutButton />
    </header>
  );
}
