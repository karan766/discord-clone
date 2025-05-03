import CurrentProfile  from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import {v4 as uuid} from "uuid";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ serverId: string }> }
) {
    try{
        const profile = await CurrentProfile();
        const {serverId} = await params;
        if (!profile) {
            return new Response("Unauthorized", { status: 401 });
        }
        if (!serverId) {
            return new Response("Server ID is required", { status: 400 });
        }
         const server =await db.server.update({
            where: {
                id: serverId,
                profileId: profile.id,
            },
            data: {
                inviteCode: uuid(),
            },
        });

        return NextResponse.json(server);
            
    } catch (error) {
        console.log("[SERVER_ID]", error);
        return new Response("Internal Server Error", { status: 500 });
    }
    return new Response("OK", { status: 200 });
}