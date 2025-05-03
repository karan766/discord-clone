
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import  CurrentProfile  from "@/lib/current-profile";



const InviteCodePage = async ({
  params,
}: {
  params: Promise<{
    inviteCode: string;
  }>;
}) => {
  // Fetch the current profile
  const profile = await CurrentProfile();
  

  // Check if the profile is null or undefined
  if (!profile) {
    redirect("/");
  }

  // Extract the inviteCode from the params
  const { inviteCode } = await params;

  // Check if the inviteCode is null or undefined
  if (!inviteCode) {
    redirect("/");
  }

  // Check if user already exists in the server
  const existingInServer = await db.server.findFirst({
    where: {
      inviteCode,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  // If the user already exists in the server, redirect to the server page
  if (existingInServer) {
    redirect(`/server/${existingInServer.id}`);
  }

  try {
    // Check if the server with the given inviteCode exists
    const server = await db.server.update({
      where: {
        inviteCode,
      },
      data: {
        members: {
          create: [
            {
              profileId: profile.id,
            },
          ],
        },
      },
    });

    // If the server with the given inviteCode exist, redirect to the home page
    if (server) {
      redirect(`/server/${server.id}`);
    }
  } catch (error) {
   
    console.error("Error no server found:", error);
    redirect("/"); 
  }

  return null;
};

export default InviteCodePage;