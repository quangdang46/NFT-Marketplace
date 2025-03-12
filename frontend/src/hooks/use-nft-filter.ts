"use client"

import { useState, useEffect, useCallback } from "react"
import type { NFT } from "@/types/shop/nft"

export function useNFTFilter(initialNFTs: NFT[], onFilterChange: (nfts: NFT[]) => void) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortOption, setSortOption] = useState("low-to-high")
  const [priceRange, setPriceRange] = useState<[number, number]>([0.02, 0.04])

  // Sử dụng useCallback để tránh tạo lại hàm này mỗi khi render
  const applyFilters = useCallback(() => {
    let result = [...initialNFTs]

    // Tìm kiếm
    if (searchTerm) {
      result = result.filter((nft) => nft.id.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    // Sắp xếp
    switch (sortOption) {
      case "low-to-high":
        result.sort((a, b) => Number.parseFloat(a.price) - Number.parseFloat(b.price))
        break
      case "high-to-low":
        result.sort((a, b) => Number.parseFloat(b.price) - Number.parseFloat(a.price))
        break
      case "recent":
        result.sort((a, b) => Number.parseInt(b.id.substring(1)) - Number.parseInt(a.id.substring(1)))
        break
      case "oldest":
        result.sort((a, b) => Number.parseInt(a.id.substring(1)) - Number.parseInt(b.id.substring(1)))
        break
    }

    // Lọc theo khoảng giá
    result = result.filter((nft) => {
      const price = Number.parseFloat(nft.price)
      return price >= priceRange[0] && price <= priceRange[1]
    })

    return result
  }, [searchTerm, sortOption, priceRange, initialNFTs])

  // Xử lý tìm kiếm và sắp xếp
  useEffect(() => {
    const filteredResults = applyFilters()
    onFilterChange(filteredResults)
  }, [applyFilters, onFilterChange])

  return {
    searchTerm,
    setSearchTerm,
    sortOption,
    setSortOption,
    priceRange,
    setPriceRange,
  }
}

