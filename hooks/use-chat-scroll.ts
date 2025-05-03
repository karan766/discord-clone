
"use client";

import { useEffect, useState } from "react";

type ChatScrollProps = {
  chatRef: React.RefObject<HTMLDivElement | null>;
  bottomRef: React.RefObject<HTMLDivElement | null>;
  shouldLoadMore: boolean;
  loadMore: () => void;
  count: number;
};

export const useChatScroll = ({
  chatRef,
  bottomRef,
  shouldLoadMore,
  loadMore,
  count,
}: ChatScrollProps) => {
  const [hasInitialised, setHasInitialised] = useState(false);

  // Load more when scrolled to top
  useEffect(() => {
    const container = chatRef?.current;

    const handleScroll = () => {
      if (!container) return;

      if (container.scrollTop === 0 && shouldLoadMore) {
        loadMore();
      }
    };

    container?.addEventListener("scroll", handleScroll);

    return () => container?.removeEventListener("scroll", handleScroll);
  }, [chatRef, shouldLoadMore, loadMore]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    const container = chatRef?.current;
    const bottom = bottomRef?.current;

    if (!container || !bottom) return;

    const shouldAutoScroll = () => {
      if (!hasInitialised) {
        setHasInitialised(true);
        return true; // First render — scroll to bottom
      }

      const distanceFromBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight;

      return distanceFromBottom <= 1000;
    };

    if (shouldAutoScroll()) {
      requestAnimationFrame(() => {
        bottom.scrollIntoView({ behavior: "smooth", block: "end" });
      });
    }
  }, [count, hasInitialised, chatRef, bottomRef]);
};
