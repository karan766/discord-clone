import currentProfilePages from "@/lib/current-profile-pages";
import { db } from "@/lib/db";
import { NextApiResponseServerIo } from "@/types";
import { NextApiRequest } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Fetch the current profile of the user
    const profile = await currentProfilePages(req);

    if (!profile) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Destructure the request body to get the content and fileURL
    const { content, fileUrl } = req.body;

    // Destructure the request body to get the serverID and channelID
    const { serverId, channelId } = req.query;

    // Check if the serverID is provided
    if (!serverId) {
      return res.status(400).json({ error: "Missing serverId" });
    }

    // Check if the channelID is provided
    if (!channelId) {
      return res.status(400).json({ error: "Missing channelId" });
    }

    // Check if the content is provided
    if (!content) {
      return res.status(400).json({ error: "Missing content" });
    }

    // Fetch server using serverID
    const server = await db.server.findFirst({
      where: {
        id: serverId as string,
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      include: {
        members: true,
      },
    });

    // Check if the server is found
    if (!server) {
      return res.status(404).json({ error: "Server not found" });
    }

    // Find the channel using channelId
    const channel = await db.channel.findFirst({
      where: {
        id: channelId as string,
        serverId: serverId as string,
      },
    });

    // Check if the channel is found
    if (!channel) {
      return res.status(404).json({ error: "Channel not found" });
    }

    // Find if the user is a member of the server
    const members = server.members.find(
      (member) => member.profileId !== profile.id
    );

    // Check if the user is a member of the server
    if (!members) {
      return res.status(401).json({ error: "Member not found" });
    }

    // Create a new message in the database
    const message = await db.message.create({
      data: {
        content,
        fileUrl,
        channelId: channelId as string,
        memberId: members.id,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    // Create a key for the channel to emit the message event
    const channelKey = `chat:${channelId}:messages`;

    // Emit a new message event to all connected clients
    res?.socket?.server?.io?.emit(channelKey, message);

    // Send the message as a response
    return res.status(200).json(message);
  } catch (error) {
   
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}