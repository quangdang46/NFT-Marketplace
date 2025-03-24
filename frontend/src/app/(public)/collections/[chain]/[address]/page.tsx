import Collections from "@/features/collections/Collections";
import type { Metadata } from "next";

// Kiểu chính xác cho params trong dynamic route
interface PageProps {
  params: {
    chain?: string;
    address?: string;
  };
}

// Đảm bảo kiểu trả về của generateMetadata là Promise<Metadata>
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  return {
    title: `Chain: ${params?.chain}`,
  };
}

// Component chính
export default function Page({ params }: PageProps) {
  return (
    <>
      <div>{params?.chain}</div>
      <Collections />
    </>
  );
}
