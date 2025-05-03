"use client";
import React, { use } from "react";
import { Member, Profile } from "@/lib/generated/prisma/client";
import UserAvatar from "../user-avatar";
import ActionTooltip from "../action-tooltip";
import { ShieldCheck, ShieldAlert, FileIcon, Edit, Trash } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { get } from "http";
import { cn } from "@/lib/utils";
import{
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
 import axios from "axios";
import * as z from "zod";
import qs from "query-string";
import {useForm} from "react-hook-form";
import{zodResolver} from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useModal } from "@/hooks/use-modal-store";
import {useParams,useRouter} from "next/navigation";


interface ChatItemProps {
  id: string;
  content: string;
  member: Member & {
    profile: Profile;
  };
  timestamp: string;
  fileUrl: string;
  deleted: boolean;
  currentMember: Member;
  isUpdated: boolean;
  socketUrl: string;
  socketQuery: Record<string, string>;
}

const roleIconMap = {
  GUEST: null,
  MODERATOR: <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />,
  ADMIN: <ShieldAlert className="h-4 w-4 ml-2 text-rose-500" />,
};

const fromSchema= z.object({
  content: z.string().min(1),
})

const ChatItem = ({
  id,
  content,
  member,
  timestamp,
  fileUrl,
  deleted,
  currentMember,
  isUpdated,
  socketUrl,
  socketQuery,
}: ChatItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const {onOpen}= useModal();
  const params = useParams();
  const router = useRouter();

  const onMemberClick =() => {
     if(member.id === currentMember.id){
      return ;
     }
     router.push(`/server/${params?.serverId}/conversations/${member.id}`);
  }

   useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && event.keyCode===27) {
        setIsEditing(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isEditing]);
    

  const from = useForm<z.infer<typeof fromSchema>>({
    resolver: zodResolver(fromSchema),
    defaultValues: {
      content: content,
    },
  });

  useEffect(() => {
    from.reset({
      content: content,
    });
  }, [content, from]);

  const isLoading = from.formState.isSubmitting;
  const onSubmit = async (values: z.infer<typeof fromSchema>) => {
    try{
      const url = qs.stringifyUrl({
        url: `${socketUrl}/${id}`,
        query: socketQuery,
      });
      
      await axios.patch(url, values);

      from.reset();
      setIsEditing(false);

    }catch(error){
      console.log(error);
    }
  }

  const [fileType, setFileType] = useState<string | null>(null);

  useEffect(() => {
    const fetchFileType = async () => {
      const response = await fetch(fileUrl, { method: "HEAD" });

      const contentType = response.headers.get("Content-Type");
      
      if (contentType) {
        setFileType(contentType.split("/")[0]); 
      }
    };

    fetchFileType();
  }, [fileUrl]);
  

  const isPDF = fileType === "application" && fileUrl;

  const isImage = fileType === "image" && fileUrl;
  const isAdmin = currentMember.role === "ADMIN";
  const isModerator = currentMember.role === "MODERATOR";
  const isOwner = currentMember.id === member.id;
  // const isOwner = currentMember.id=== member.profile.userId;

  
  const canDeleteMessage = !deleted && (isAdmin || isModerator || isOwner);
  
  const canEditMessage = !deleted && (isAdmin || isModerator || isOwner) && !fileUrl;
  console.log(canEditMessage);


  return (
    <div className="relative group flex items-center hover:bg-black/5 p-4 transition w-full">
      <div className="group flex gap-x-2 items-start w-full">
        <div onClick={onMemberClick}  className="cursor-pointer hover:drop-shadow-md transition">
          <UserAvatar 
          src={member.profile.imageUrl} className="h-8 w-8" />
        </div>
        <div className="dlex flex-col w-full">
          <div className="flex items-center gap-x-2">
            <div className="flex items-center">
              <p onClick={onMemberClick}  className="font-semibold text-sm hover:underline">
                {member.profile.name}
              </p>
              <ActionTooltip lable={member.role}>
                {roleIconMap[member.role]}
              </ActionTooltip>
            </div>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {timestamp}
            </span>
          </div>

          {/* Handle Image */}
          {isImage && (
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary h-48 w-48"
            >
              <Image
                src={fileUrl}
                alt={"download"}
                fill
                className="object-cover"
              />
            </a>
          )}

          {isPDF && (
            <div className="bg-black/20 dark:bg-zinc-700 mt-2 flex items-center gap-3 rounded-md p-3 w-fit">
              <FileIcon className="h-8 w-8 text-indigo-500 fill-indigo-500" />
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-indigo-500 hover:underline dark:text-indigo-400"
              >
                PDF File
              </a>
            </div>
          )}
          {!fileUrl && !isEditing && (
            <p
              className={cn(
                "text-sm text-zinc-600 dark:text-zinc-300",
                deleted &&
                  "italic text-zinc-500 dark:text-zinc-400 text-xs mt-1"
              )}
            >
              {content}
              {isUpdated && !deleted && (
                <span className="text-[10px] mx-2 text-zinc-500 dark:text-zinc-400">
                  (edited)
                </span>
              )}
            </p>
          )}
          {!fileUrl && isEditing && (
            <Form {...from}>
              <form
                onSubmit={from.handleSubmit(onSubmit)}
                className="flex items-center w-full gap-x-2 pt-2"
              >
                <FormField
                  control={from.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <div className="relative w-full">
                        <Input
                        className="p-2 bg-zinc-200/50 dark:bg-zinc-700/50 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                          disabled={isLoading}
                          placeholder="Edited message"
                          {...field}
                        />
                        </div>
                       
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button 
                disabled={isLoading}
                 size="sm" 
                 variant="primary" 
                 type="submit">
                  Save
                </Button>
              </form>
              <span className="text-[10px] mt-1 text-zinc-400">
                Press escape to cancel, enter to save
              </span>
            </Form>
          )}
        </div>
      </div>
      {canDeleteMessage && (
        <div className="hidden group-hover:flex items-center gap-x-2 absolute p-1 -top-2 right-5 bg-white dark:bg-zinc-800 border rounded-sm
           "
        >
          {canEditMessage && (
            <ActionTooltip lable="Edit">
              <Edit
              onClick={() => setIsEditing(true)}
               className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition" />
            </ActionTooltip>
          )}
          {canDeleteMessage && (
            <ActionTooltip lable="Delete">
              <Trash
                className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
                onClick={() => onOpen("deleteMessage", { apiUrl: `${socketUrl}/${id}`, query :socketQuery})}
              />
            </ActionTooltip>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatItem;
