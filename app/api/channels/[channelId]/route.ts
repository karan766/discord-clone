import currentProfile from "@/lib/current-profile";
import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { MemberRole } from "@/lib/generated/prisma/client";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ channelId: string }> }
) {
  try {
    const profile = await currentProfile();
    const {channelId} = await params;

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);

    const serverId = searchParams.get("serverId"); // Ensure serverId is passed as a query parameter

    if (!serverId) {
      return new NextResponse("Server ID is missing", { status: 400 });
    }

    // Check if the channel ID is provided
    if (!channelId) {
      return new NextResponse("Channel ID is missing", { status: 400 });
    }

    // Delete the channel in the database
    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          delete: {
            id: channelId,
            name: {
              not: "general", 
            },
          },
        },
      },
    });

    
    return NextResponse.json(server);

  } catch (error) {
    console.error("Error deleting channel:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}



export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ channelId: string }> }
) {
  try {
    const profile = await currentProfile();
    const { name, type } = await req.json();
    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");
    const { channelId } = await params;

    if (!profile) return new NextResponse("Unauthorized", { status: 401 });
    if (!serverId) return new NextResponse("Server ID is missing", { status: 400 });
    if (name === "general") return new NextResponse("Name cannot be 'general'", { status: 400 });

    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          update: {
            where: {
              id: channelId,
              NOT: { name: "general" },
            },
            data: { name, type },
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.error("Error updating channel:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
