import Link from "next/link";
import { ArrowLeft, FileAudio } from "lucide-react";
import { notFound } from "next/navigation";

import { CopyTranscriptButton } from "@/components/dashboard/copy-transcript-button";
import { DeleteTranscriptButton } from "@/components/dashboard/delete-transcript-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { prisma } from "@/lib/prisma";

type TranscriptDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function TranscriptDetailsPage({
  params,
}: TranscriptDetailsPageProps) {
  const { id } = await params;

  const transcript = await prisma.transcript.findUnique({
    where: {
      id,
    },
  });

  if (!transcript) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Button asChild variant="ghost" className="-ml-3 w-fit">
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4" />
              Back to dashboard
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
              Transcript details
            </h1>
            <p className="text-sm text-slate-500">
              Review the transcript text, copy it, or remove the record if needed.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <CopyTranscriptButton transcriptText={transcript.transcriptText} />
          <DeleteTranscriptButton transcriptId={transcript.id} />
        </div>
      </div>
      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <CardHeader>
            <CardTitle>Metadata</CardTitle>
            <CardDescription>This record stores transcript text and upload details only.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Transcript ID</p>
              <p className="mt-2 break-all text-sm font-medium text-slate-900">{transcript.id}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">File name</p>
              <p className="mt-2 text-sm font-medium text-slate-900">{transcript.fileName}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Upload date</p>
              <p className="mt-2 text-sm font-medium text-slate-900">
                {formatDate(transcript.uploadDate)}
              </p>
            </div>
            <Badge variant="secondary" className="w-fit">
              <FileAudio className="mr-1 h-3 w-3" />
              Audio discarded after transcription
            </Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Transcript text</CardTitle>
            <CardDescription>Plain text transcript generated from the uploaded audio clip.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-sm leading-7 text-slate-700 whitespace-pre-wrap">
              {transcript.transcriptText}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
