// app/(setup)/page.tsx the main page of the app
import { initialProfile } from "@/lib/initial-profile";
import {db} from "@/lib/db";
import { redirect } from "next/navigation";
import InitialModal from "@/components/modals/initial-modal";

const SetupPage = async () => {
  const profile = await initialProfile();

  if (!profile) {
    redirect("/sign-in");
  }

  const server = await db.server.findFirst({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (server) {
    return redirect(`/server/${server.id}`);
  }

  return (
    <>
      <InitialModal />

    </>
  );
};

export default SetupPage;