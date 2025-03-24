"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, RefreshCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <h1 className="text-6xl font-bold bg-gradient-to-r from-red-500 to-orange-500 text-transparent bg-clip-text mb-6">
        Error
      </h1>
      <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
      <p className="text-muted-foreground max-w-md mb-8">
        {error.message ||
          "An unexpected error occurred. Please try again later."}
      </p>
      <div className="flex gap-4">
        <Button
          onClick={reset}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RefreshCcw className="h-4 w-4" />
          Try Again
        </Button>
        <Button asChild>
          <Link href="/" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
