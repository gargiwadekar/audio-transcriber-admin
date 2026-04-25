"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const router = useRouter();

  return (
    <Button
      variant="secondary"
      onClick={async () => {
        const response = await authClient.signOut();

        if (response.error) {
          toast.error(response.error.message || "Unable to log out.");
          return;
        }

        toast.success("Signed out successfully.");
        router.push("/login");
        router.refresh();
      }}
    >
      <LogOut className="h-4 w-4" />
      Logout
    </Button>
  );
}

