"use client"

import { Clock } from "lucide-react"
import type { MintStage } from "@/types/nft"

interface MintStagesProps {
  stages: MintStage[]
  onStageSelect: (index: number) => void
}

export default function MintStages({ stages, onStageSelect }: MintStagesProps) {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Mint Stages</h2>

      {stages.map((stage, index) => (
        <div
          key={index}
          className={`mb-3 p-4 rounded-lg cursor-pointer transition-all duration-200 border
            ${
              stage.active
                ? "bg-pink-100 dark:bg-pink-950/50 border-pink-500"
                : "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border-transparent"
            }`}
          onClick={() => onStageSelect(index)}
        >
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center gap-2">
              <Clock className={`h-4 w-4 ${stage.active ? "text-pink-500" : "text-gray-400 dark:text-gray-500"}`} />
              <span
                className={`text-sm font-medium ${stage.active ? "text-pink-500" : "text-gray-600 dark:text-gray-300"}`}
              >
                {stage.name}
              </span>
              {stage.isPublic && (
                <span className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 px-2 py-0.5 rounded">
                  Public
                </span>
              )}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {stage.status}{" "}
              <span className="font-mono">
                {stage.time.days}:{stage.time.hours}:{stage.time.minutes}:{stage.time.seconds}
              </span>
            </div>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">{stage.details}</div>
        </div>
      ))}
    </div>
  )
}

