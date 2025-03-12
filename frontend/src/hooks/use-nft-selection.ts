import { useState, useCallback } from "react";
import { NFT } from "@/types/nft"; // Import kiểu NFT

interface UseNFTSelectionProps {
  initialNFTs: NFT[]; // Sử dụng kiểu NFT thay vì { selected: boolean }[]
  onVisibleNFTsChange: (nfts: NFT[]) => void; // Trả về NFT[] thay vì { selected: boolean }[]
}

export function useNFTSelection({
  initialNFTs,
  onVisibleNFTsChange,
}: UseNFTSelectionProps) {
  const [itemCount, setItemCount] = useState("0");
  const [sliderValue, setSliderValue] = useState([100]);
  const [isSliding, setIsSliding] = useState(false);

  // Xử lý thay đổi số lượng item từ input
  const handleItemCountChange = useCallback(
    (value: string) => {
      const count = Number.parseInt(value) || 0;
      const normalizedCount = Math.min(Math.max(count, 0), initialNFTs.length);
      setItemCount(normalizedCount.toString());

      setSliderValue([
        Math.floor((normalizedCount / initialNFTs.length) * 100),
      ]);
      onVisibleNFTsChange(
        initialNFTs.map((nft, index) => ({
          ...nft, // Giữ nguyên các thuộc tính của nft
          selected: index < normalizedCount, // Chỉ cập nhật selected
        }))
      );
    },
    [initialNFTs, onVisibleNFTsChange]
  );

  // Xử lý thay đổi slider
  const handleSliderChange = useCallback(
    (value: number[]) => {
      setSliderValue(value);
      const percentage = value[0] / 100;
      const itemsToShow = Math.max(
        0,
        Math.floor(percentage * initialNFTs.length)
      );

      setItemCount(itemsToShow.toString());
      onVisibleNFTsChange(
        initialNFTs.map((nft, index) => ({
          ...nft, // Giữ nguyên các thuộc tính của nft
          selected: index < itemsToShow, // Chỉ cập nhật selected
        }))
      );
    },
    [initialNFTs, onVisibleNFTsChange]
  );

  const handleSliderDragStart = useCallback(() => {
    setIsSliding(true);
  }, []);

  const handleSliderDragEnd = useCallback(() => {
    setIsSliding(false);
  }, []);

  return {
    itemCount,
    sliderValue,
    isSliding,
    handleItemCountChange,
    handleSliderChange,
    handleSliderDragStart,
    handleSliderDragEnd,
  };
}
