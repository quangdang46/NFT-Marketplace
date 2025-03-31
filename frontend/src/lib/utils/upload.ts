/* eslint-disable @typescript-eslint/no-explicit-any */
import client from "@/lib/api/apolloClient";
import { GetSignedUrlDocument } from "@/lib/api/graphql/generated";
import { pinata } from "@/lib/api/pinata";

export const uploadImage = async (file: File, retries = 3): Promise<string> => {
  if (!file) {
    throw new Error("No file selected");
  }

  let attempt = 0;
  while (attempt < retries) {
    try {
      // Vô hiệu hóa cache để đảm bảo lấy signed URL mới mỗi lần gọi
      const { data } = await client.query({
        query: GetSignedUrlDocument,
        fetchPolicy: "no-cache", // Không sử dụng cache
      });
      if (!data.getSignedUrl) {
        throw new Error("Failed to get signed URL");
      }

      const upload = await pinata.upload.public
        .file(file)
        .url(data.getSignedUrl);
      const fileUrl = await pinata.gateways.public.convert(upload.cid);
      return fileUrl;
    } catch (e: any) {
      if (e.message.includes("duplicate file id") && attempt < retries - 1) {
        console.warn(
          `Duplicate file id detected, retrying (${attempt + 1}/${retries})...`
        );
        attempt++;
        continue; // Thử lại với signed URL mới
      }
      console.error("Upload failed:", e);
      throw new Error(`Failed to upload file: ${e.message}`);
    }
  }

  throw new Error(
    "Max retries reached: Failed to upload file due to duplicate file id"
  );
};
