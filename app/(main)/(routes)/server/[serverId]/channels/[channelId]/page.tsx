import currentProfile from "@/lib/current-profile";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import ChatHeader from "@/components/chat/chat-header";

const ChannelIDPage = async ({
  params,
}: {
  params: Promise<{ channelId: string; serverId: string }>;
}) => {

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
      </div>
    </>
  );
};

export default ChannelIDPage;