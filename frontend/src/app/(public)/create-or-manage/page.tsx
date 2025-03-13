import CreateOrManage from "@/features/create-manage/CreateOrManage";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Create or Manage",
  description: "Create or Manage",
};
export default function page() {
  return <CreateOrManage />;
}
