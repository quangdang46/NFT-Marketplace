"use client"
import type { NFTData } from "@/types/nft"
import MintStages from "./mint-stages"
import MintProgress from "./mint-progress"
import PriceInfo from "./price-info"
import MintForm from "./mint-form"

interface NFTInfoProps {
  data: NFTData
  onUpdateData: (data: NFTData) => void
}

export default function NFTInfo({ data, onUpdateData }: NFTInfoProps) {
  const handleStageSelect = (index: number) => {
    const updatedStages = [...data.mintStages].map((stage, i) => ({
      ...stage,
      active: i === index,
    }))

    onUpdateData({
      ...data,
      mintStages: updatedStages,
    })
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="bg-green-500 text-black dark:text-white text-xs font-bold px-2 py-1 rounded">ABS</div>
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{data.title}</h1>
      </div>

      <MintStages stages={data.mintStages} onStageSelect={handleStageSelect} />

      <MintProgress totalMinted={data.totalMinted} totalSupply={data.totalSupply} />

      <PriceInfo currentPrice={data.currentPrice} ethPrice={data.ethPrice} />

      <MintForm mintTimeText="You can mint in 2h 33m 26s" />
    </div>
  )
}

