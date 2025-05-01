import { db } from "@/lib/db";
import { getAuth } from "@clerk/nextjs/server";
import { NextApiRequest } from "next";

export default async function currentProfile(req: NextApiRequest) {
  const { userId } = getAuth(req);

  if (!userId) {
    return null;
  }

  const profile = await db.profile.findFirst({
    where: { 
        userId
    },
  });

  return profile;
}