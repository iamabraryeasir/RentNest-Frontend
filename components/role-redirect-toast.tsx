"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "@/components/ui/toast";

export function RoleRedirectToast() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const toastMessage = searchParams.get("toast");

    if (toastMessage) {
      toast.add({
        title: "Access notice",
        description: toastMessage,
        type: "warning",
      });
    }
  }, [pathname, searchParams]);

  return null;
}
