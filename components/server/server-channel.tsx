"use client"
import { ChannelType } from "@/lib/generated/prisma/client";
import { channel, MemberRole, Server } from "@/lib/generated/prisma/client";
import { Hash, Mic, Video } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter, useParams } from "next/navigation";
import ActionToolTip from '../action-tooltip';
import { Trash,Edit,Lock } from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";
import { ModalType } from "@/hooks/use-modal-store";

interface ServerChannelProps {
   channel:channel ;
   server:Server;
   role?:MemberRole;
    }

    const iconMap = {
      [ChannelType.TEXT]: Hash,
      [ChannelType.AUDIO]: Mic,
      [ChannelType.VIDEO]: Video,
    }

    

const ServerChannel = (
    { channel, server, role }: ServerChannelProps
) => {
     const params = useParams();
     const router = useRouter();
     const { onOpen } = useModal();

     const Icon = iconMap[channel.type];
     
     const onClick = () => {
      router.push(`/server/${params?.serverId}/channels/${channel.id}`);
    };
    const onAction = (e: React.MouseEvent, action: ModalType) => {
      e.stopPropagation();
      onOpen(action, { channel, server });
    }

  return (
    <button
      onClick={onClick}
      className={cn(
        "group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
      )}>
      <Icon className="w-5 h-5 text-zinc-500 dark:text-zinc-400"/>
      <p
          className={cn(
            "line-clamp-1 text-sm font-semibold text-zinc-500 transition group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300",
            params?.channelID === channel.id &&
              "text-primary dark:text-zinc-200 dark:group-hover:text-white"
          )}
        >
          {channel.name}
        </p>
        {channel.name !== "general" && role !== MemberRole.GUEST && (
          <>
            <div className="ml-auto flex items-center gap-x-2">
              <ActionToolTip lable="Edit">
                <Edit
                  onClick={(e) => onAction(e, "editChannel")}
                  className="hidden size-4 text-zinc-500 transition group-hover:block hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300"
                />
              </ActionToolTip>
              <ActionToolTip lable="Delete">
                <Trash
                  onClick={(e) => onAction(e, "deleteChannel")}
                  className="hidden size-4 text-rose-500 transition group-hover:block hover:text-rose-600 dark:text-rose-400 dark:hover:text-rose-500"
                />
              </ActionToolTip>
            </div>
          </>
        )}
        {channel.name === "general" && role !== MemberRole.GUEST && (
          <Lock className="ml-auto size-4 text-zinc-500 dark:text-zinc-400" />
        )}
    </button>
  )
}

export default ServerChannel
