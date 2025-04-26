import { currentUser } from "@clerk/nextjs/server";
import {db} from "@/lib/db";


export const initialProfile = async () => {
    const user = await currentUser();
    if (!user) {
       return null;
    }
    // Check if the user already has a profile in the database
    // If not, create a new profile with the user's information
    const userId = user.id;
    
    const profile = await db.profile.findFirst({
        where: {
          userId,
        }
      });
    // If the profile already exists, return it
    // Otherwise, create a new profile and return it
    if (profile) {
        return profile;
    }
    // Create a new profile if it doesn't exist
    const newProfile = await db.profile.create({
        data: {
            userId,
            name: `${user.firstName} ${user.lastName}`   ,
            imageUrl: user.imageUrl,
            email : user.emailAddresses[0]?.emailAddress,
        },
    });
    // Return the new profile
    if (newProfile) {
        return newProfile;
    }
    return null;
    
};