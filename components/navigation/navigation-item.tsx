
"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import ActionToolTip from "@/components/action-tooltip";

interface NavigationItemProps {
  id: string;
  name: string;
  imageUrl: string;
}

const NavigationItem = ({ id, name, imageUrl }: NavigationItemProps) => {
  // Get the params from the URL and the router object from next/navigation
  const params = useParams();
  const router = useRouter();

  // Handle the click event to navigate to the server page
  const onClick = () => {
    router.push(`/server/${id}`);
  };

  return (
    <>
      <ActionToolTip lable={name} side="right" align="center">
        <button onClick={onClick} className="group relative flex items-center">
          <div
            className={cn(
              "bg-primary absolute left-0 w-[4px] rounded-r-full transition-all",
              params?.serverId === id
                ? "h-[36px]"
                : "h-[8px] group-hover:h-[20px]"
            )}
          />
          <div
            className={cn(
              "group relative mx-3 flex size-[48px] overflow-hidden rounded-[24px] transition-all group-hover:rounded-[16px]",
              params?.serverId === id &&
                "bg-primary/10 text-primary rounded-[16px]"
            )}
          >
            <Image
              fill
              priority
              src={imageUrl}
              alt="Channel"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              unoptimized
              key={imageUrl}
            />
          </div>
        </button>
      </ActionToolTip>
    </>
  );
};

export default NavigationItem;