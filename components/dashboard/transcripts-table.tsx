import Link from "next/link";
import { ArrowUpRight, FileAudio } from "lucide-react";

import { EmptyState } from "@/components/ui/empty-state";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate, truncateText } from "@/lib/utils";
import { type TranscriptListItem } from "@/types/transcript";

export function TranscriptsTable({
  transcripts,
}: {
  transcripts: TranscriptListItem[];
}) {
  if (!transcripts.length) {
    return (
      <EmptyState
        icon={FileAudio}
        title="No transcripts to show"
        description="Try uploading a short audio clip, or clear the current filters to see more results."
      />
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <CardTitle>Recent uploads</CardTitle>
          <CardDescription>
            Browse recent transcripts and open any item for the full text.
          </CardDescription>
        </div>
        <Badge variant="secondary">{transcripts.length} results</Badge>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left">
          <thead>
            <tr className="border-b border-slate-200 text-xs uppercase tracking-[0.18em] text-slate-500">
              <th className="pb-3 font-medium">File</th>
              <th className="pb-3 font-medium">Transcript preview</th>
              <th className="pb-3 font-medium">Uploaded</th>
              <th className="pb-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {transcripts.map((transcript) => (
              <tr key={transcript.id} className="border-b border-slate-100 last:border-b-0">
                <td className="py-4">
                  <div className="font-medium text-slate-900">{transcript.fileName}</div>
                  <div className="text-sm text-slate-500">{transcript.id}</div>
                </td>
                <td className="py-4 text-sm leading-6 text-slate-600">
                  {truncateText(transcript.transcriptText, 110)}
                </td>
                <td className="py-4 text-sm text-slate-500">{formatDate(transcript.uploadDate)}</td>
                <td className="py-4 text-right">
                  <Button asChild variant="secondary" size="sm">
                    <Link href={`/dashboard/transcripts/${transcript.id}`}>
                      View details
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
