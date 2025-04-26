"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal-store";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, Copy, RefreshCw } from "lucide-react";
import { useOrigin } from "@/hooks/use-origin";
import { useState } from "react";
import axios from "axios";

const InviteModal = () => {
  const { type, data, isOpen, onOpen, onClose } = useModal();
  const origin = useOrigin();

  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const { server } = data;

  const inviteURL = `${origin}/invite/${server?.inviteCode}`;

  const isModalOpen = type === "invite" && isOpen;

  const onCopy = () => {
    navigator.clipboard.writeText(inviteURL);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const onGenerateNewLink = async () => {
    try {
      setLoading(true);

      const response = await axios.patch(
        `/api/servers/${server?.id}/invite-code`
      );

      onOpen("invite", {
        server: {
          ...response.data,
        },
      });
    } catch (error) {
      console.error("Error generating new invite link:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={isModalOpen} onOpenChange={onClose}>
        <DialogContent className="overflow-hidden bg-white p-0 text-black">
          <DialogHeader className="px-6 pt-8">
            <DialogTitle className="text-center text-2xl font-bold">
              Invite Friends
            </DialogTitle>
          </DialogHeader>
          <div className="p-6">
            <Label className="dark:text-secondary/70 text-sm font-bold text-zinc-500 uppercase">
              Server Invite Link
            </Label>
            <div className="mt-2 flex items-center gap-x-2">
              <Input
                readOnly
                value={inviteURL}
                disabled={loading}
                className="border-0 bg-zinc-300/50 text-black selection:bg-transparent selection:text-black focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-zinc-300/50"
              />
              <Button
                size={"icon"}
                onClick={onCopy}
                disabled={loading}
                className="bg-zinc-300/50 hover:bg-zinc-300/50 dark:bg-zinc-300/50"
              >
                {copied ? (
                  <>
                    <Check className="size-4 text-black" />
                  </>
                ) : (
                  <>
                    <Copy className="size-4 text-black" />
                  </>
                )}
              </Button>
            </div>
            <Button
              variant={"primary"}
              size={"sm"}
              onClick={onGenerateNewLink}
              disabled={loading}
              className="mt-4 w-full cursor-pointer text-xs tracking-wider text-zinc-800"
            >
              Generate a new link
              <RefreshCw className="ml-2 size-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InviteModal;
