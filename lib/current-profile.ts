// lib/currentProfile.ts

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export default async function currentProfile() {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const profile = await db.profile.findFirst({
    where: {userId}
  });

  return profile;
}