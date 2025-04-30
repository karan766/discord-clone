import { Hash } from "lucide-react";
import MobileToggle from "@/components/mobile-toogle";
import UserAvatar from "@/components/user-avatar";


interface ChatHeaderProps {
  serverId: string;
  name: string;
  type: "channel" | "conversation";
  imageUrl?: string;
}

const ChatHeader = ({ serverId, name, type, imageUrl }: ChatHeaderProps) => {
  return (
    <>
      <div className="text-md flex h-12 items-center gap-x-2 border-b-2 border-neutral-200 px-3 font-semibold dark:border-neutral-800">
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
      </div>
    </>
  );
};

export default ChatHeader;