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
    const { conversationId } = req.query;

   
    if (!conversationId) {
      return res.status(400).json({ error: "Missing conversationId" });
    }

    // Check if the content is provided
    if (!content) {
      return res.status(400).json({ error: "Missing content" });
    }

    const conversation =await db.conversation.findFirst({
      where: {
        id: conversationId as string,
        OR: [
          {
            memberOne: {
              profileId: profile.id,
            },
          },
          {
            memberTwo: {
              profileId: profile.id,
            },
          },
        ],
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    })

    if(!conversation){
      return res.status(404).json({error: "Conversation not found"});
    }
    
    const member = conversation.memberOne.profileId === profile.id ? conversation.memberOne : conversation.memberTwo;

    // Check if the user is a member of the server
    if (!member) {
      return res.status(401).json({ error: "Member not found" });
    }

    // Create a new message in the database
    const message = await db.directMessage.create({
      data: {
        content,
        fileUrl,
        conversationId: conversation.id,
        memberId: member.id,
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
    const channelKey = `chat:${conversationId}:messages`;

    // Emit a new message event to all connected clients
    res?.socket?.server?.io?.emit(channelKey, message);

    // Send the message as a response
    return res.status(200).json(message);
  } catch (error) {
   
    console.error("[DIRECT_MESSAGES_POST]",error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}