import React from 'react'
import  currentProfile  from '@/lib/current-profile'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'

interface ServerPageProps {
  params:{
    serverId:string
  }
}

const ServerPage = async(
  {
    params,
  }: {
    params: Promise<{ serverId: string }>;
  }
) => {
  const profile = await currentProfile();
  const {serverId}= await params;

  if(!profile){
    return redirect('/sign-in')
  }
  const server = await db.server.findUnique({
    where: {
      id: serverId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
    include:{
      channels:{
        where:{
          name:"general"
        },
        orderBy:{
          createdAt:"asc"
        }
      },
    }
  });
     
       const initialChannel = server?.channels[0];

       if(initialChannel?.name !== "general"){
        return null;
       }

  return (
     redirect(`/server/${serverId}/channels/${initialChannel?.id}`)
  )
}

export default ServerPage
