
import { db } from "@/lib/db";
import  currentProfile  from "@/lib/current-profile";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ serverId: string }> }
) {
  
  try {
    const profile = await currentProfile();
    const {serverId} = await params;
   

   if (!profile) {
      return new Response("Unauthorized", { status: 401 });
    }

    if (!serverId) {
      return new Response("Server ID is required", { status: 400 });
    }

     const server = await db.server.update({
        where: {
            id: serverId,
            profileId: {
              not: profile.id, // Ensure that the admin is not leaving the server
            },
            members: {
              some: {
                profileId: profile.id,
              },
            },
          },
          data: {
            members: {
              deleteMany: {
                profileId: profile.id,
              },
            },
          },
     })

    return NextResponse.json(server);

  } catch (error) {
    console.error("Error leaving server:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }

}
