import { redirect } from "next/navigation"

export default function ProfileIndexPage() {
  // Redirect to the user's own profile
  redirect("/profile/me")
}

