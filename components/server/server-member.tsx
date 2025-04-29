"use client"
import { Member, Server, Profile } from "@/lib/generated/prisma/client";
import { MemberRole } from "@/lib/generated/prisma/client";
import { ShieldAlert, ShieldCheck } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import UserAvatar from "../user-avatar";

interface ServerMemberProps {
    member:Member &{profile:Profile};
    server:Server;
}

const rolreIconMap = {
    [MemberRole.GUEST]: null,
    [MemberRole.MODERATOR]: (
        <ShieldCheck className="w-4 h-4 mr-2 text-indigo-500" />
    ),
    [MemberRole.ADMIN]: <ShieldAlert className="mr-2 h-4 w-4 text-rose-500" />,
};

const ServerMember = ({
    member,
    server,
}:ServerMemberProps
) => {
    const params = useParams();
    const router = useRouter();

    const icon = rolreIconMap[member.role];

  return (
    <button className={cn(
          "group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
          params?.memberId === member.id &&
            "bg-zinc-700/20 dark:bg-zinc-700",
    )}>
        <UserAvatar src={member.profile.imageUrl} className="h-8 w-8 md:h-8 md:w-8"/>
        <p>
            {member.profile.name}
        </p>
        {icon}
    </button>
  )
}

export default ServerMember
