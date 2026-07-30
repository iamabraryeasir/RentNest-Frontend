"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-hot-toast";

export function RoleRedirectToast() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const toastMessage = searchParams.get("toast");

    if (toastMessage) {
      toast(
        `Access notice: ${toastMessage}`,
        {
          icon: "⚠️",
        },
      );
    }
  }, [pathname, searchParams]);

  return null;
}
