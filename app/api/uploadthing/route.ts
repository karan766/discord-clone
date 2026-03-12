import { createRouteHandler } from "uploadthing/next";

import { ourFileRouter } from "@/app/api/uploadthing/core";

// Export routes for Next App Router
// UploadThing will automatically use UPLOADTHING_TOKEN or UPLOADTHING_SECRET from env
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});