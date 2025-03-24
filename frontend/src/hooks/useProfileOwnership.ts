"use client"

import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "../store/store"

export function useProfileOwnership(profileAddress: string) {
  const [isOwner, setIsOwner] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const currentUser = useSelector((state: RootState) => state.user.user)

  useEffect(() => {
    // Nếu profileAddress là "me", thì đây chắc chắn là profile của người dùng hiện tại
    if (profileAddress === "me") {
      setIsOwner(true)
      setIsLoading(false)
      return
    }

    // Kiểm tra xem người dùng đã đăng nhập chưa
    if (!currentUser) {
      setIsOwner(false)
      setIsLoading(false)
      return
    }

    // So sánh địa chỉ ví của người dùng hiện tại với địa chỉ profile đang xem
    // Trong thực tế, bạn cần chuẩn hóa địa chỉ ví (lowercase, checksum, v.v.)
    const isProfileOwner =
      currentUser.address.toLowerCase() === profileAddress.toLowerCase() ||
      // Trường hợp đặc biệt cho demo: nếu profileAddress là "user-1" và currentUser.id cũng là "user-1"
      (profileAddress === "user-1" && currentUser.id === "user-1")

    setIsOwner(isProfileOwner)
    setIsLoading(false)
  }, [profileAddress, currentUser])

  return { isOwner, isLoading }
}

