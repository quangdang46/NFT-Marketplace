import client from "@/lib/api/apolloClient";
import { GetSignedUrlDocument } from "@/lib/api/graphql/generated";
import { pinata } from "@/lib/api/pinata";

export const uploadImage = async (file: File) => {
  if (!file) {
    console.log("No file selected");
    return;
  }
  try {
    const { data } = await client.query({ query: GetSignedUrlDocument });
    const upload = await pinata.upload.public.file(file).url(data.getSignedUrl); // Upload the file with the signed URL
    const fileUrl = await pinata.gateways.public.convert(upload.cid);
    return fileUrl;
  } catch (e) {
    console.log(e);
  }
};
