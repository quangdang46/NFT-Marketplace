import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function CollectionNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <h1 className="text-6xl font-bold bg-gradient-to-r from-primary to-purple-600 text-transparent bg-clip-text mb-6">
        404
      </h1>
      <h2 className="text-2xl font-bold mb-4">Collection Not Found</h2>
      <p className="text-muted-foreground max-w-md mb-8">
        The collection youre looking for doesnt exist or has been moved.
      </p>
      <Button asChild>
        <Link href="/create" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Create
        </Link>
      </Button>
    </div>
  );
}

