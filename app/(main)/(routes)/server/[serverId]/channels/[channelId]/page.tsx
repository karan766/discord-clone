import currentProfile from "@/lib/current-profile";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import ChatMessages from "@/components/chat/chat-messages";
import ChatInput from "@/components/chat/chat-input";
import ChatHeader from "@/components/chat/chat-header";
import {  ChannelType } from "@/lib/generated/prisma/client";
import { MediaRoom } from "@/components/media-room";



const ChannelIDPage = async ({
  params,
}: {
  params: Promise<{ channelId: string; serverId: string }>;
}
  ) => {

  const profile = await  currentProfile();
  if (!profile) {
    return redirect("/sign-in");
  }

  const { channelId, serverId } = await params;

  const channel = await db.channel.findUnique({
    where: {
      id: channelId,
    },
  });

  // Find member using serverID and profileID
  const member = await db.member.findFirst({
    where: {
      serverId: serverId,
      profileId: profile.id,
    },
    include: {
      profile: true,
    },
  });

  // Redirect if channel or member is NULL
  if (!channel || !member) {
    return redirect("/");
  }

  return (
    <>
      <div className="flex h-full flex-col bg-white dark:bg-[#313338]">
        <ChatHeader
          serverId={channel.serverId}
          name={channel.name}
          type="channel"
        />
        {channel.type === ChannelType.TEXT && (
          <>
          <ChatMessages
          name={channel.name}
          member={member}
          chatId={channelId}
          apiUrl="/api/messages"
          socketUrl="/api/socket/messages"
          socketQuery={{ channelId, serverId }}
          paramValue={channelId}
          paramKey="channelId"
          type="channel"
        />
        <ChatInput
         name={channel.name}
         type="channel"
         apiUrl="/api/socket/messages"
         query={{
          channelId: channel.id,
          serverId: channel.serverId,
        }}
        />
          </>
        )}
        {channel.type === ChannelType.AUDIO && (
          <>
          <MediaRoom chatId={channelId} video={false} audio={true} />
          </>
        )}
        {channel.type === ChannelType.VIDEO && (
          <>
          <MediaRoom chatId={channelId} video={true} audio={true} />
          </>
        )}
        
      </div>
    </>
  );
};

export default ChannelIDPage;