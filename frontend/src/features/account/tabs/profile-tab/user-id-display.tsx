"use client"

interface UserIdDisplayProps {
  id: string
}

export default function UserIdDisplay({ id }: UserIdDisplayProps) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-medium">User Id</h2>
      <div className="bg-[#2a2a3a] px-3 py-1 rounded text-gray-400">{id}</div>
    </div>
  )
}

