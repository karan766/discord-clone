// import React from "react";
// import { redirect } from "next/navigation";
// import { db } from "@/lib/db";
// import currentProfile from "@/lib/current-profile";
// import { getOrCreateConversation } from "@/lib/conversation";
// import ChatHeader from "@/components/chat/chat-header";
// import ChatMessages from "@/components/chat/chat-messages";
// import ChatInput from "@/components/chat/chat-input";
// import{ MediaRoom} from "@/components/media-room";

// interface MemberIDPageProps {
//   params: Promise<{
//     memberId: string;
//     serverId: string;
//   }>;
//   searchParams: { video?: boolean | undefined };
// }
// const MemberIdPage = async ({ params, searchParams }: MemberIDPageProps) => {
//   const profile = await currentProfile();
//   const { serverId, memberId } = await params;

//   if (!profile) {
//     return redirect("/sign-in");
//   }

//   const currentMember = await db.member.findFirst({
//     where: {
//       serverId: serverId,
//       profileId: profile.id,
//     },
//     include: {
//       profile: true,
//     },
//   });

//   if (!currentMember) {
//     return redirect("/");
//   }

//   const conversation = await getOrCreateConversation(
//     currentMember.id,
//     memberId
//   );

//   if (!conversation) {
//     return redirect(`/server/${serverId}`);
//   }

//   const { memberOne, memberTwo } = conversation;

//   const otherMember =
//     memberOne.profileId === profile.id ? memberTwo : memberOne;

//   return (
//     <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
//       <ChatHeader
//         imageUrl={otherMember.profile.imageUrl}
//         name={otherMember.profile.name}
//         serverId={serverId}
//         type="conversation"
//       />
//       {searchParams?.video && (
//         <MediaRoom
//           chatId={conversation.id}
//           video={true}
//           audio={true}
          
          
//         />
//       )}
//       {!searchParams?.video && (
//         <>
//           <ChatMessages
//             member={currentMember}
//             name={otherMember.profile.name}
//             chatId={conversation.id}
//             apiUrl="/api/direct-messages"
//             paramKey="conversationId"
//             paramValue={conversation.id}
//             socketQuery={{ conversationId: conversation.id }}
//             socketUrl="/api/socket/direct-messages"
//             type="conversation"
//           />
//           <ChatInput
//             name={otherMember.profile.name}
//             type="conversation"
//             apiUrl="/api/socket/direct-messages"
//             query={{
//               conversationId: conversation.id,
//             }}
//           />
//         </>
//       )}
//     </div>
//   );
// };

// export default MemberIdPage;


import React from "react";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import currentProfile from "@/lib/current-profile";
import { getOrCreateConversation } from "@/lib/conversation";
import ChatHeader from "@/components/chat/chat-header";
import ChatMessages from "@/components/chat/chat-messages";
import ChatInput from "@/components/chat/chat-input";
import { MediaRoom } from "@/components/media-room";

// ✅ FIXED types
interface MemberIdPageProps {
  params: {
    memberId: string;
    serverId: string;
  };
  searchParams: {
    video?: string;
  };
}

const MemberIdPage = async ({ params, searchParams }: MemberIdPageProps) => {
  const profile = await currentProfile();
  const { serverId, memberId } = params;

  if (!profile) {
    return redirect("/sign-in");
  }

  const currentMember = await db.member.findFirst({
    where: {
      serverId,
      profileId: profile.id,
    },
    include: {
      profile: true,
    },
  });

  if (!currentMember) {
    return redirect("/");
  }

  const conversation = await getOrCreateConversation(currentMember.id, memberId);

  if (!conversation) {
    return redirect(`/server/${serverId}`);
  }

  const { memberOne, memberTwo } = conversation;
  const otherMember = memberOne.profileId === profile.id ? memberTwo : memberOne;

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        imageUrl={otherMember.profile.imageUrl}
        name={otherMember.profile.name}
        serverId={serverId}
        type="conversation"
      />
      {searchParams?.video && (
        <MediaRoom
          chatId={conversation.id}
          video={true}
          audio={true}
        />
      )}
      {!searchParams?.video && (
        <>
          <ChatMessages
            member={currentMember}
            name={otherMember.profile.name}
            chatId={conversation.id}
            apiUrl="/api/direct-messages"
            paramKey="conversationId"
            paramValue={conversation.id}
            socketQuery={{ conversationId: conversation.id }}
            socketUrl="/api/socket/direct-messages"
            type="conversation"
          />
          <ChatInput
            name={otherMember.profile.name}
            type="conversation"
            apiUrl="/api/socket/direct-messages"
            query={{
              conversationId: conversation.id,
            }}
          />
        </>
      )}
    </div>
  );
};

export default MemberIdPage;
