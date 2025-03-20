"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
      <div className="flex flex-col items-center gap-4 text-center">
        <h2 className="text-2xl font-semibold">Đã xảy ra lỗi</h2>
        <p className="text-sm text-muted-foreground max-w-[500px]">
          {error.message || "Đã có lỗi xảy ra. Vui lòng thử lại sau."}
        </p>
        <Button variant="default" onClick={() => reset()}>
          Thử lại
        </Button>
      </div>
    </div>
  );
}
