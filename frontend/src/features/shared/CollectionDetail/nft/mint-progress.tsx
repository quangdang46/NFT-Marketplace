import { Progress } from "@/components/ui/progress"

interface MintProgressProps {
  totalMinted: number
  totalSupply: number
}

export default function MintProgress({ totalMinted, totalSupply }: MintProgressProps) {
  const percentMinted = (totalMinted / totalSupply) * 100

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 bg-green-500 rounded-full"></div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Live</span>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">Total Minted</div>
      </div>
      <div className="mb-1">
        <Progress value={percentMinted} className="h-2 bg-gray-200 dark:bg-gray-700" />
      </div>
      <div className="flex justify-end text-sm text-gray-600 dark:text-gray-400">
        {percentMinted.toFixed(0)}% ({totalMinted}/{totalSupply})
      </div>
    </div>
  )
}

