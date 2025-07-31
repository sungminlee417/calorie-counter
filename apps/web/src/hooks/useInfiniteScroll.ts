import { useEffect, useRef } from "react";

interface UseInfiniteScrollProps {
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  threshold?: number;
}

/**
 * Custom hook for infinite scroll functionality
 * @param hasNextPage - Whether there's a next page available
 * @param isFetchingNextPage - Whether currently fetching next page
 * @param fetchNextPage - Function to fetch next page
 * @param threshold - Intersection threshold (default: 1.0)
 * @returns Ref to attach to the bottom element for triggering infinite scroll
 */
const useInfiniteScroll = ({
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  threshold = 1.0,
}: UseInfiniteScrollProps) => {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;

    const el = bottomRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold }
    );

    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, threshold]);

  return bottomRef;
};

export default useInfiniteScroll;
