interface PriceInfoProps {
  currentPrice: string
  ethPrice: string
}

export default function PriceInfo({ currentPrice, ethPrice }: PriceInfoProps) {
  return (
    <div className="mb-6">
      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Price</div>
      <div className="text-2xl font-bold text-gray-900 dark:text-white">{currentPrice}</div>
      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Mint fee: {ethPrice}</div>
    </div>
  )
}

