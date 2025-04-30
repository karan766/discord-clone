"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal-store";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { ChannelType } from "@/lib/generated/prisma/client";
import { Hash, Mic, Video } from "lucide-react";
import qs from "query-string";
import { mutate } from "swr";


// Mapping of channel types to icons
const iconMap = {
  [ChannelType.TEXT]: (
    <Hash className="size-4 text-zinc-500 dark:text-zinc-400" />
  ),
  [ChannelType.AUDIO]: (
    <Mic className="size-4 text-zinc-500 dark:text-zinc-400" />
  ),
  [ChannelType.VIDEO]: (
    <Video className="size-4 text-zinc-500 dark:text-zinc-400" />
  ),
};

const DeleteChannelModal = () => {
  // This is the modal store for opening and closing the modal and getting the type of modal
  const { type, data, isOpen, onClose } = useModal();

  // Navigation hook
  const router = useRouter();


  // State to handle the loading state
  const [loading, setLoading] = useState(false);

  // Extract the channel data from the modal store
  const { channel , server } = data;

  // This is for opening the modal for inviting friends
  const isModalOpen = type === "deleteChannel" && isOpen;

  // Function to delete the channel
  const onConfirm = async () => {
    try {
     
      setLoading(true);

      const url = qs.stringifyUrl({
        url: `/api/channels/${channel?.id}`,
        query: {  
          serverId: server?.id
        },
      });
      
      await axios.delete(url);

      // Close the modal
      onClose();

      
      router.refresh();

      // Navigate to the server page
     mutate(`/server/${server?.id}`);
    } catch (error) {
      // Handle error
      console.error("Error deleting channel:", error);
    } finally {
      // Set the loading state to false
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={isModalOpen} onOpenChange={onClose}>
        <DialogContent
          className="overflow-hidden bg-white p-0 text-black"
          aria-describedby="Modal to display the delete channel confirmation"
        >
          <DialogHeader className="px-6 pt-8">
            <DialogTitle className="text-center text-2xl font-bold">
              Delete Channel
            </DialogTitle>
            <DialogDescription className="text-center text-zinc-500">
              Are you sure you want to do that? <br />
              <span className="my-2 inline-flex items-center justify-center gap-2 font-semibold text-indigo-500">
                {/* {channel && iconMap[channel.type]} */}
                {channel?.name}
              </span>{" "}
              will be permanently deleted.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="bg-gray-100 px-6 py-4">
            <div className="flex w-full items-center justify-between">
              <Button
                disabled={loading}
                onClick={onClose}
                variant={"ghost"}
                className="w-[48%] bg-gray-400/50 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              >
                Cancel
              </Button>
              <Button
                disabled={loading}
                onClick={onConfirm}
                variant={"primary"}
                className="w-[48%] bg-rose-500 hover:bg-rose-600"
              >
                Confirm
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DeleteChannelModal;