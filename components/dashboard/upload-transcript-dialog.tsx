"use client";

import { useRef, useState } from "react";
import { LoaderCircle, UploadCloud } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useUploadTranscript } from "@/hooks/use-upload-transcript";
import {
  MAX_AUDIO_DURATION_SECONDS,
  MAX_AUDIO_FILE_SIZE_BYTES,
} from "@/lib/constants";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

export function UploadTranscriptDialog() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { isUploading, progress, reset, uploadTranscript } = useUploadTranscript();

  async function handleUpload() {
    if (!selectedFile) {
      toast.error("Please choose an audio file first.");
      return;
    }

    if (selectedFile.size > MAX_AUDIO_FILE_SIZE_BYTES) {
      toast.error("File size exceeds the 10 MB limit.");
      return;
    }

    try {
      const response = await uploadTranscript(selectedFile);
      toast.success(response.message);
      setSelectedFile(null);
      reset();
      setOpen(false);
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Upload failed.";
      toast.error(message);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) {
          setSelectedFile(null);
          reset();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button size="lg">
          <UploadCloud className="h-4 w-4" />
          Upload audio
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload an audio clip</DialogTitle>
          <DialogDescription>
            Accepted formats: MP3, WAV, or M4A. Maximum duration: under {MAX_AUDIO_DURATION_SECONDS + 1} seconds. Maximum size: 10 MB.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-6 space-y-5">
          <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-blue-200 bg-blue-50/60 px-6 py-10 text-center transition hover:border-blue-300 hover:bg-blue-50">
            <div className="rounded-2xl bg-white p-4 text-blue-600 shadow-sm">
              <UploadCloud className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900">
                {selectedFile ? selectedFile.name : "Click to choose an audio file"}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                The audio is transcribed and discarded immediately after processing.
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".mp3,.wav,.m4a,audio/*"
              className="hidden"
              onChange={(event) => {
                setSelectedFile(event.target.files?.[0] ?? null);
              }}
            />
          </label>
          {isUploading ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span className="inline-flex items-center gap-2">
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  Uploading and transcribing...
                </span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} />
            </div>
          ) : null}
          <div className="flex justify-end gap-3">
            <Button
              variant="ghost"
              onClick={() => {
                setOpen(false);
              }}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button onClick={handleUpload} disabled={isUploading || !selectedFile}>
              {isUploading ? "Processing..." : "Upload and transcribe"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

