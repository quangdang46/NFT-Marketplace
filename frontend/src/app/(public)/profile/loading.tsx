export default function ProfileLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="relative w-full h-[200px] md:h-[300px] rounded-xl bg-muted"></div>

      <div className="flex flex-col md:flex-row gap-6 -mt-16 md:-mt-20 px-4">
        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-muted border-4 border-background"></div>

        <div className="flex-1 space-y-4 pt-4 md:pt-20">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-4 bg-muted rounded w-1/4"></div>
          <div className="h-20 bg-muted rounded w-full"></div>

          <div className="flex gap-4">
            <div className="h-10 bg-muted rounded w-24"></div>
            <div className="h-10 bg-muted rounded w-24"></div>
          </div>
        </div>
      </div>

      <div className="h-12 bg-muted rounded-lg w-full max-w-2xl mx-auto"></div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array(8)
          .fill(null)
          .map((_, index) => (
            <div key={index} className="bg-card rounded-lg overflow-hidden">
              <div className="h-[200px] bg-muted"></div>
              <div className="p-4 space-y-2">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}

