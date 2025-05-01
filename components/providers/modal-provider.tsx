"use client"

import CreateServerModal from "@/components/modals/create-server-modal";
import React from "react";
import { useEffect , useState} from "react";
import InviteModal from "@/components/modals/invite-modal";
import EditServerModal from "../modals/edit-server-modal";
import MembersModal from "@/components/modals/members-modal";
import CreateChannel from "@/components/modals/create-channel-modal";
import LeaveModalServer from "@/components/modals/leave-server-modal";
import DeleteServerModal from "../modals/delete-server-modal";
import DeleteChannelModal from "../modals/delete-channel-modal";
import MessageFileModal from "../modals/message-file-modal";
import EditChannelModal from "../modals/edit-channel-modal";

export const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <>
            <CreateServerModal />
            <InviteModal /> 
            <EditServerModal/>
            <MembersModal/>
            <CreateChannel/>
            <LeaveModalServer/>
            <DeleteServerModal/>
            <DeleteChannelModal/>
            <EditChannelModal/>
            <MessageFileModal/>
        </>
    )
}