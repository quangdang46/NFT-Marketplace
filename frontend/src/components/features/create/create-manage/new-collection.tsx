"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { redirect } from "next/navigation";

export default function NewCollection() {
  return (
    <Card className="bg-[#111119] border-zinc-800 text-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-medium">New Collection</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-400 mb-6">
          Create a Single Edition (ERC-1155) or a Unique Edition (ERC-721)
          collection
        </p>

        <Button
          className="w-full bg-pink-600 hover:bg-pink-700 text-white"
          onClick={() => {
            redirect("/create/collection");
          }}
        >
          Create New Collection
        </Button>
      </CardContent>
    </Card>
  );
}
