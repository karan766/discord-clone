



"use client";

import { useEffect, useState } from "react";
import {
  LiveKitRoom,
  GridLayout,
  ParticipantTile,
  ControlBar,
  RoomAudioRenderer,
  useTracks,
  LayoutContextProvider,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import "@livekit/components-styles";
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

interface MediaRoomProps {
  chatId: string;
  video: boolean;
  audio: boolean;
}

export const MediaRoom = ({ chatId, video, audio }: MediaRoomProps) => {
  const { user } = useUser();
  const [token, setToken] = useState("");

  useEffect(() => {
    const fetchToken = async () => {
      const name =
        (user?.firstName && user?.lastName
          ? `${user.firstName} ${user.lastName}`
          : user?.username) || "Guest";

      try {
        const response = await fetch(
          `/api/livekit?room=${chatId}&username=${encodeURIComponent(name)}`
        );
        const data = await response.json();
        setToken(data.token);
      } catch (error) {
        console.error("Error fetching token:", error);
      }
    };

    if (user) {
      fetchToken();
    }
  }, [user, chatId]);

  if (!token) {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <Loader2 className="h-7 w-7 animate-spin text-zinc-500" />
        <p className="text-xs text-zinc-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-screen" data-lk-theme="default">
      <LiveKitRoom
        token={token}
        serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
        video={video}
        audio={audio}
        connect={true}
      >
        <VideoLayout />
      </LiveKitRoom>
    </div>
  );
};

function VideoLayout() {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false }
  );

  return (
    <LayoutContextProvider>
      <div className="flex flex-col h-full w-full">
        <RoomAudioRenderer />

        <GridLayout
          tracks={tracks}
          className="flex-1"
        >
          <ParticipantTile />
        </GridLayout>

        <ControlBar
          controls={{
            microphone: true,
            camera: true,
            screenShare: true,
            chat: true,
            leave: false, // 👈 this hides the Leave button
          }}
        />
      </div>
    </LayoutContextProvider>
  );
}
