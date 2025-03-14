import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Expand } from "lucide-react"

interface MintFormProps {
  mintTimeText: string
}

export default function MintForm({ mintTimeText }: MintFormProps) {
  return (
    <>
      <div className="mb-6">
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Email Address (Optional)</div>
        <Input
          type="email"
          placeholder="hello@example.com"
          className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100"
        />
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          By clicking , you agree to the Magic Eden Terms of Service.
        </div>
      </div>

      {/* Mint Button */}
      <Button className="w-full bg-pink-600 hover:bg-pink-700 text-white py-6">{mintTimeText}</Button>

      {/* Explore Collection */}
      <Button
        variant="outline"
        className="w-full mt-4 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        Explore Collection
        <Expand className="ml-2 h-4 w-4" />
      </Button>
    </>
  )
}

