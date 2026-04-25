import Link from "next/link";
import { AudioLines, Clock3, FileText, History, Sparkles } from "lucide-react";
import { endOfDay, startOfDay } from "date-fns";

import { SearchFilters } from "@/components/dashboard/search-filters";
import { StatsCard } from "@/components/dashboard/stats-card";
import { TranscriptsTable } from "@/components/dashboard/transcripts-table";
import { UploadTranscriptDialog } from "@/components/dashboard/upload-transcript-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { formatDate, truncateText } from "@/lib/utils";

type DashboardPageProps = {
  searchParams: Promise<{
    query?: string;
    date?: string;
  }>;
};

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const params = await searchParams;
  const query = params.query?.trim();
  const date = params.date?.trim();

  const where = {
    ...(query
      ? {
          OR: [
            { fileName: { contains: query, mode: "insensitive" as const } },
            { transcriptText: { contains: query, mode: "insensitive" as const } },
          ],
        }
      : {}),
    ...(date
      ? {
          uploadDate: {
            gte: startOfDay(new Date(date)),
            lte: endOfDay(new Date(date)),
          },
        }
      : {}),
  };

  const [totalCount, recentTranscripts, latestTranscript] = await Promise.all([
    prisma.transcript.count(),
    prisma.transcript.findMany({
      where,
      orderBy: {
        uploadDate: "desc",
      },
      take: 10,
    }),
    prisma.transcript.findFirst({
      orderBy: {
        uploadDate: "desc",
      },
    }),
  ]);

  const recentUploads = recentTranscripts.slice(0, 4);

  return (
    <div className="space-y-6">
      <section className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
        <Card className="overflow-hidden border-blue-100 bg-[linear-gradient(135deg,#ffffff_0%,#f8fbff_58%,#ebf3ff_100%)]">
          <CardContent className="flex flex-col gap-6 p-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-4">
              <Badge>AI-powered speech-to-text management</Badge>
              <div className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
                  Upload and manage transcripts
                </h1>
                <p className="max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                  Convert short audio clips into text, keep them searchable, and review recent uploads from one dashboard.
                </p>
              </div>
            </div>
            <UploadTranscriptDialog />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Last upload</CardTitle>
            <CardDescription>The most recent transcript saved in the dashboard.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {latestTranscript ? (
              <>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm font-medium text-slate-500">File name</p>
                  <p className="mt-2 text-base font-semibold text-slate-950">
                    {latestTranscript.fileName}
                  </p>
                  <p className="mt-2 text-sm text-slate-500">
                    Uploaded {formatDate(latestTranscript.uploadDate)}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600 line-clamp-4">
                    {truncateText(latestTranscript.transcriptText, 180)}
                  </p>
                </div>
                <Button asChild variant="secondary" className="w-full">
                  <Link href={`/dashboard/transcripts/${latestTranscript.id}`}>
                    Open transcript
                  </Link>
                </Button>
              </>
            ) : (
              <p className="text-sm text-slate-500">
                No uploads yet. Add a short audio file to see it here.
              </p>
            )}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <StatsCard
          title="Total transcripts"
          value={String(totalCount)}
          description="All saved transcript records."
          icon={FileText}
        />
        <StatsCard
          title="Search results"
          value={String(recentTranscripts.length)}
          description="Items matching the current filters."
          icon={Sparkles}
        />
        <StatsCard
          title="Latest upload"
          value={latestTranscript ? formatDate(latestTranscript.uploadDate) : "No uploads yet"}
          description="Most recent transcript timestamp."
          icon={Clock3}
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <Card>
          <CardHeader>
            <CardTitle>Recent uploads</CardTitle>
            <CardDescription>A quick list of the latest transcript entries.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentUploads.length ? (
              recentUploads.map((transcript) => (
                <Link
                  key={transcript.id}
                  href={`/dashboard/transcripts/${transcript.id}`}
                  className="flex items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 transition hover:border-blue-200 hover:bg-blue-50/40"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-slate-900">{transcript.fileName}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {truncateText(transcript.transcriptText, 90)}
                    </p>
                  </div>
                  <p className="shrink-0 text-xs text-slate-500">
                    {formatDate(transcript.uploadDate)}
                  </p>
                </Link>
              ))
            ) : (
              <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500">
                Recent uploads will appear here after you transcribe your first audio clip.
              </p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>How this dashboard is used</CardTitle>
            <CardDescription>A simple workflow for short audio transcription.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <AudioLines className="h-5 w-5 text-blue-600" />
              <p className="mt-3 font-medium text-slate-900">Upload audio</p>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                Add a short MP3, WAV, or M4A clip for transcription.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <Sparkles className="h-5 w-5 text-blue-600" />
              <p className="mt-3 font-medium text-slate-900">Review text</p>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                Check the generated transcript and open the full detail view.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <History className="h-5 w-5 text-blue-600" />
              <p className="mt-3 font-medium text-slate-900">Search history</p>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                Filter by date or search by file name and transcript text.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-950">All transcripts</h2>
            <p className="text-sm text-slate-500">
              Search by content or file name, filter by date, and open the full transcript.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600">
            <AudioLines className="h-4 w-4 text-blue-600" />
            Sorted by newest first
          </div>
        </div>
        <SearchFilters />
        <TranscriptsTable transcripts={recentTranscripts} />
      </section>
    </div>
  );
}
