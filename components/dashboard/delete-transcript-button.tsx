"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { deleteTranscriptAction } from "@/actions/transcript-actions";
import { Button } from "@/components/ui/button";

export function DeleteTranscriptButton({
  transcriptId,
}: {
  transcriptId: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="destructive"
      size="sm"
      disabled={isPending}
      onClick={() => {
        if (!window.confirm("Delete this transcript permanently?")) {
          return;
        }

        startTransition(async () => {
          try {
            await deleteTranscriptAction(transcriptId);
            toast.success("Transcript deleted.");
            router.push("/dashboard");
            router.refresh();
          } catch (error) {
            toast.error(
              error instanceof Error ? error.message : "Unable to delete transcript.",
            );
          }
        });
      }}
    >
      <Trash2 className="h-4 w-4" />
      {isPending ? "Deleting..." : "Delete"}
    </Button>
  );
}

