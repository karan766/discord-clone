// components/server/serverSidebar.tsx

import CurrentProfile from "@/lib/current-profile";
import { db } from "@/lib/db";
import { ChannelType, MemberRole } from "@/lib/generated/prisma/client";
import { redirect } from "next/navigation";
import ServerHeader from "@/components/server/server-header";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import ServerSerach from "@/components/server/server-search";
import { Hash, Mic, Video, ShieldAlert, ShieldCheck } from "lucide-react";
import ServerSection from "@/components/server/server-section";
import { Separator } from "@/components/ui/separator";
import ServerChannel from "@/components/server/server-channel";

import ServerMember from "@/components/server/server-member";
interface ServerSidebarProps {
  serverId: string;
}

const iconMap = {
  [ChannelType.TEXT]: <Hash className="mr-2 h-4 w-4" />,
  [ChannelType.AUDIO]: <Mic className="mr-2 h-4 w-4" />,
  [ChannelType.VIDEO]: <Video className="mr-2 h-4 w-4" />,
};

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: (
    <ShieldCheck className="w-4 h-4 mr-2 text-indigo-50" />
  ),
  [MemberRole.ADMIN]: <ShieldAlert className="mr-2 h-4 w-4 text-rose-500" />,
};

const ServerSidebar = async ({ serverId }: ServerSidebarProps) => {
  // Fetch the current profile
  const profile = await CurrentProfile();

  if (!profile) {
    redirect("/sign-in");
  }

  // Fetch the server data using the serverID and profileID
  const server = await db.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      channels: {
        orderBy: {
          createdAt: "asc",
        },
      },
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: "asc",
        },
      },
    },
  });

  // Extract text channels from the server
  const textChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.TEXT
  );

  // Extract audio channels from the server
  const audioChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.AUDIO
  );

  // Extract video channels from the server
  const videoChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.VIDEO
  );

  // Extract members from the server
  const members = server?.members.filter(
    (member) => member.profileId !== profile.id
  );

  if (!server) {
    redirect("/");
  }

  // Find role in the server
  const role = server.members.find(
    (member) => member.profileId === profile.id
  )?.role;

  return (
    <>
      <div className="text-primary flex h-full w-full flex-col bg-[#F2F3F5] dark:bg-[#2B2D31]">
        <ServerHeader server={server} role={role} />
        <ScrollArea className="flex-1 px-3">
          <div className="mt-2">
            <ServerSerach
              data={[
                {
                  label: "Text Channels",
                  type: "channel",
                  data: textChannels?.map((channel) => ({
                    id: channel.id,
                    name: channel.name,
                    icon: iconMap[channel.type],
                  })),
                },
                {
                  label: "Voice Channels",
                  type: "channel",
                  data: audioChannels?.map((channel) => ({
                    id: channel.id,
                    name: channel.name,
                    icon: iconMap[channel.type],
                  })),
                },
                {
                  label: "Video Channels",
                  type: "channel",
                  data: videoChannels?.map((channel) => ({
                    id: channel.id,
                    name: channel.name,
                    icon: iconMap[channel.type],
                  })),
                },
                {
                  label: "Members",
                  type: "member",
                  data: members?.map((member) => ({
                    id: member.id,
                    name: member.profile.name,
                    icon: roleIconMap[member.role],
                  })),
                },
              ]}
            />
          </div>
          
          <Separator className="my-2 rounded-md bg-zinc-300 dark:bg-zinc-700" />
          {!!textChannels?.length && (
            <>
              <div className="mb-2">
                <ServerSection
                  label="Text Channels"
                  role={role}
                  sectionType="channels"
                  channelType={ChannelType.TEXT}
                />
                {textChannels.map((channel) => (
                  <ServerChannel
                    key={channel.id}
                    role={role}
                    channel={channel}
                    server={server}
                  />
                ))}
              </div>
            </>
          )}
          {!!audioChannels?.length && (
            <>
              <div className="mb-2">
                <ServerSection
                  label="Voice Channels"
                  role={role}
                  sectionType="channels"
                  channelType={ChannelType.AUDIO}
                />
                {audioChannels.map((channel) => (
                  <ServerChannel
                    key={channel.id}
                    role={role}
                    channel={channel}
                    server={server}
                  />
                ))}
              </div>
            </>
          )}
          {!!videoChannels?.length && (
            <>
              <div className="mb-2">
                <ServerSection
                  label="Video Channels"
                  role={role}
                  sectionType="channels"
                  channelType={ChannelType.VIDEO}
                />
                {videoChannels.map((channel) => (
                  <ServerChannel
                    key={channel.id}
                    role={role}
                    channel={channel}
                    server={server}
                  />
                ))}
              </div>
            </>
          )}
          {!!members?.length && (
            <>
              <div className="mb-2">
                <ServerSection
                  label="Members"
                  role={role}
                  sectionType="members"
                  server={server}
                />
                {members.map((member) => (
                  <ServerMember
                    key={member.id}
                    member={member}
                    server={server}
                  />
                ))}
              </div>
            </>
          )}

          
        </ScrollArea>
      </div>
    </>
  );
};

export default ServerSidebar;
