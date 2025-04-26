import React from 'react'
import  currentProfile  from '@/lib/current-profile';
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import NavigationAction from './navigation-action';
import { Separator } from "@/components/ui/separator";
import {ScrollArea} from "@/components/ui/scroll-area";
import NavigationItem from './navigation-item';
import  { Fragment } from 'react';
import { UserButton } from '@clerk/nextjs';
import {ModeToggle} from "@/components/mode-toggle";

const NavigationSidebar = async() => {

    const profile = await currentProfile();
    if (!profile) {
        return redirect("/")
    }

    const server = await db.server.findMany({
        where: {
            members: {
                some: {
                    profileId: profile.id,
                },
            },
        },
    });


  return (
    <div className='className="text-primary flex size-full flex-col items-center space-y-4 py-3 dark:bg-[#1E1F22]'>
     <NavigationAction/>
     <Separator className="mx-auto h-[2px] !w-14 rounded-md bg-zinc-300 dark:bg-zinc-700" />
     <ScrollArea className="w-full flex-1">
          {server.map((server) => (
            <Fragment key={server.id}>
              <div className="mb-4">
                <NavigationItem
                  id={server.id}
                  name={server.name}
                  imageUrl={server.imageUrl}
                />
              </div>
            </Fragment>
          ))}
        </ScrollArea>
        <div className='pb-3 mt-auto flex items-center flex-col gap-y-4'>
           <ModeToggle/>
           <UserButton appearance={{ elements: { avatarBox: "size-[48px]" } }} />
        </div>
    </div>
  )
}

export default NavigationSidebar
