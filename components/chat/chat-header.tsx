import { Hash } from "lucide-react";
import MobileToggle from "@/components/mobile-toogle";
import UserAvatar from "@/components/user-avatar";
import { Socket } from "socket.io";
import SocketIndicator from "../socket-indicator";
import { ChatVideoButton } from "./chat-video-button";


interface ChatHeaderProps {
  serverId: string;
  name: string;
  type: "channel" | "conversation";
  imageUrl?: string;
}

const ChatHeader = ({ serverId, name, type, imageUrl }: ChatHeaderProps) => {
  return (
    <>
      <div className="text-md flex h-12 items-center p-1  border-b-2 border-neutral-200 px-3 font-semibold dark:border-neutral-800">
        <MobileToggle serverId={serverId} />
     
        <div className="flex items-center">
          {type === "channel" && (
            <Hash className="mr-2 size-5 text-zinc-500 dark:text-zinc-400" />
          )}
          {type === "conversation" && (
            <UserAvatar src={imageUrl} className="mr-2 size-8" />
          )}
          <p className="text-lg font-semibold text-black dark:text-white">
            {name}
          </p>
          
        </div>
        <div className=" flex ml-auto items-center justify-end size-16">
          {type ==="conversation"&& (
            <ChatVideoButton />
          )}
          <SocketIndicator />
        </div>
      </div>
      
    </>
  );
};

export default ChatHeader;