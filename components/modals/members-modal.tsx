"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal-store";
import { DialogDescription } from "@radix-ui/react-dialog";
import { ServerWithMembersWithProfiles } from "@/types";
import { ScrollArea } from "../ui/scroll-area";
import  UserAvatar  from "../user-avatar";
import { ShieldCheck, ShieldQuestion,MoreVertical ,Check , Gavel ,User } from "lucide-react";
import { ShieldAlert } from "lucide-react";
import { useState } from "react";
import qsa from "query-string";
import {
    DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuTrigger,
  DropdownMenuSubTrigger,

} from "@/components/ui/dropdown-menu";
import { MemberRole } from "@/lib/generated/prisma/client";
import { set } from "zod";
import axios from "axios";
import { useRouter } from "next/navigation";


const roleIconMap ={
    "GUEST": null,
    "MODERATOR": <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500"/>,
    "ADMIN": <ShieldAlert className="h-4 w-4 ml-2 text-rose-500"/>,
}


const MembersModal = () => {
    const router = useRouter();
  const { type, data, isOpen, onOpen, onClose } = useModal();
  const [loadingId, setLoadingId] = useState("") ;
  const { server } = data as { server:  ServerWithMembersWithProfiles  };

  const onChangeRole = async (memberId: string, role: MemberRole) => {
    
    try {
        setLoadingId(memberId);
        const url = qsa.stringifyUrl({
            url: `/api/members/${memberId}`,
            query: {
                serverId: server?.id,
            }
        });

        const response = await axios.patch(url, {
            role,
          });
        router.refresh();
        onOpen("members", { server: response.data });


    } catch (error) {
      console.log(error);
    } finally {
      setLoadingId("");
    }
}

const  OnKickUser = async (memberId: string) => {
    try {
      
      setLoadingId(memberId);
      const url = qsa.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: { serverId: server?.id },
      });
      const response = await axios.delete(url);
      router.refresh();
  
      onOpen("members", {
        server: response.data,
      });
    } catch (error) {
      console.error("Error kicking member:", error);
    } finally {
  
      setLoadingId("");
    }
  };


  const isModalOpen = type === "members" && isOpen;

  return (
    <>
      <Dialog open={isModalOpen} onOpenChange={onClose}>
        <DialogContent className="overflow-hidden bg-white  text-black">
          <DialogHeader className="px-6 pt-8">
            <DialogTitle className="text-center text-2xl font-bold">
            Manage Members
            </DialogTitle>
            <DialogDescription className="text-center text-zinc-500">
                 {server?.members?.length} Members
            </DialogDescription>
          </DialogHeader>
         <ScrollArea className="mt-8 max-h-[420px] pr-6">
            {server?.members?.map((member) => (
              <div key={member.id} className="flex items-center gap-x-2 mb-6">
                <UserAvatar src={member.profile.imageUrl} />
                <div className="flex flex-col gap-y-1 ">
                    <div className="text-xs pl-2 font-semibold flex items-center">
                        {member.profile.name}
                        {roleIconMap[member.role]}
                    </div>
       <p className="text-xs pl-2 text-zinc-500">
       {member.profile.email}
       </p>
                </div>
                {server.profileId!== member.profile.id && (
                    
                        loadingId !== member.id && (
                            <div className="ml-auto ">
                                  <DropdownMenu>
                            <DropdownMenuTrigger className="focus:outline-none">
                              <MoreVertical className="size-4 text-zinc-500" />
                              <DropdownMenuContent side="left">
                                <DropdownMenuSub>
                                  <DropdownMenuSubTrigger className="flex items-center">
                                    <ShieldQuestion className="mr-2 size-4" />
                                    <span>Role</span>
                                  </DropdownMenuSubTrigger>
                                  <DropdownMenuPortal>
                                    <DropdownMenuSubContent>
                                      <DropdownMenuItem
                                        onClick={() =>
                                          onChangeRole(member.id, "GUEST")
                                        }
                                      >
                                        <User className="mr-2 size-4" />
                                        Guest
                                        {member.role === "GUEST" && (
                                          <Check className="ml-auto size-4" />
                                        )}
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() =>
                                          onChangeRole(member.id, "MODERATOR")
                                        }
                                      >
                                        <ShieldCheck className="mr-2 size-4" />
                                        Moderator
                                        {member.role === "MODERATOR" && (
                                          <Check className="ml-auto size-4" />
                                        )}
                                      </DropdownMenuItem>
                                    </DropdownMenuSubContent>
                                  </DropdownMenuPortal>
                                </DropdownMenuSub>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => OnKickUser(member.id)}
                                >
                                  <span className="flex items-center gap-x-2 font-semibold text-rose-500">
                                    <Gavel className="mr-2 size-4 text-rose-500" />
                                    Kick
                                  </span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenuTrigger>
                          </DropdownMenu>
                            </div>
                        )
                )}
                  
              </div>
            ))}
         </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MembersModal;