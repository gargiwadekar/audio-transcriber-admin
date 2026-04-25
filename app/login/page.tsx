import { redirect } from "next/navigation";
import { AudioLines, LockKeyhole, SearchCheck } from "lucide-react";

import { LoginForm } from "@/components/auth/login-form";
import { ADMIN_EMAIL, ADMIN_USERNAME } from "@/lib/constants";
import { getCurrentSession } from "@/lib/session";

export default async function LoginPage() {
  const session = await getCurrentSession();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-[2rem] border border-white/70 bg-white/70 shadow-[0_24px_80px_rgba(37,99,235,0.10)] backdrop-blur lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative overflow-hidden bg-[linear-gradient(160deg,#eff6ff_0%,#ffffff_55%,#f8fafc_100%)] p-8 sm:p-12">
          <div className="absolute -right-10 top-0 h-56 w-56 rounded-full bg-blue-200/30 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-slate-200/20 blur-3xl" />
          <div className="relative flex h-full flex-col justify-between gap-10">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-3 rounded-full border border-blue-100 bg-white/90 px-4 py-2 text-sm font-medium text-blue-700 shadow-sm">
              <AudioLines className="h-4 w-4" />
              Audio Transcription Dashboard
              </div>
              <div className="space-y-4">
                <h1 className="max-w-xl text-4xl font-semibold leading-tight tracking-tight text-slate-950 sm:text-5xl">
                  Convert short audio clips into searchable transcripts using AI.
                </h1>
                <p className="max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
                  Upload and manage transcripts from a single admin dashboard with secure login, quick search, and clean transcript history.
                </p>
                <div className="grid gap-3 pt-2 sm:grid-cols-2">
                  <div className="rounded-3xl border border-white/80 bg-white/85 p-5 shadow-sm">
                    <div className="mb-3 inline-flex rounded-2xl bg-blue-50 p-3 text-blue-600">
                      <LockKeyhole className="h-5 w-5" />
                    </div>
                    <p className="font-semibold text-slate-950">Secure admin login</p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      Sign in with your admin email or username to access transcript records.
                    </p>
                  </div>
                  <div className="rounded-3xl border border-white/80 bg-white/85 p-5 shadow-sm">
                    <div className="mb-3 inline-flex rounded-2xl bg-blue-50 p-3 text-blue-600">
                      <SearchCheck className="h-5 w-5" />
                    </div>
                    <p className="font-semibold text-slate-950">Searchable history</p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      Find transcripts by file name, transcript text, or upload date.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-white/80 bg-white/80 p-5 shadow-sm">
                <p className="text-sm font-medium text-slate-500">Admin email</p>
                <p className="mt-2 text-lg font-semibold text-slate-950">{ADMIN_EMAIL}</p>
              </div>
              <div className="rounded-3xl border border-white/80 bg-white/80 p-5 shadow-sm">
                <p className="text-sm font-medium text-slate-500">Admin username</p>
                <p className="mt-2 text-lg font-semibold text-slate-950">{ADMIN_USERNAME}</p>
              </div>
            </div>
          </div>
        </section>
        <section className="flex items-center justify-center bg-white px-6 py-10 sm:px-10">
          <LoginForm />
        </section>
      </div>
    </main>
  );
}
