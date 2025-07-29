import { useState, useCallback, useRef, useEffect } from "react";

interface UseInfiniteScrollOptions {
  initialBatchSize?: number;
  batchSize?: number;
  threshold?: number; // How many items from the end to trigger next batch
}

interface UseInfiniteScrollReturn<T> {
  visibleItems: T[];
  hasMore: boolean;
  isLoading: boolean;
  loadMore: () => void;
  reset: (newData: T[]) => void;
  observerRef: (node: HTMLDivElement | null) => void;
}

export function useInfiniteScroll<T>({
  initialBatchSize = 5,
  batchSize = 5,
  threshold = 2,
}: UseInfiniteScrollOptions = {}): UseInfiniteScrollReturn<T> {
  const [allData, setAllData] = useState<T[]>([]);
  const [visibleCount, setVisibleCount] = useState(initialBatchSize);
  const [isLoading, setIsLoading] = useState(false);

  const observer = useRef<IntersectionObserver | null>(null);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const visibleItems = allData.slice(0, visibleCount);
  const hasMore = visibleCount < allData.length;

  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) return;

    if (process.env.NODE_ENV === "development") {
      console.log("🔄 Loading more items:", {
        currentVisible: visibleCount,
        totalData: allData.length,
        batchSize,
        hasMore,
      });
    }

    setIsLoading(true);

    // Clear any existing timeout
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
    }

    // Add a small delay to simulate loading and prevent rapid firing
    loadingTimeoutRef.current = setTimeout(() => {
      const newCount = Math.min(visibleCount + batchSize, allData.length);
      if (process.env.NODE_ENV === "development") {
        console.log("✅ Loaded more items:", {
          oldCount: visibleCount,
          newCount,
          totalData: allData.length,
        });
      }
      setVisibleCount(newCount);
      setIsLoading(false);
    }, 100);
  }, [isLoading, hasMore, batchSize, allData.length, visibleCount]);

  const reset = useCallback(
    (newData: T[]) => {
      if (process.env.NODE_ENV === "development") {
        console.log("🔄 Resetting infinite scroll:", {
          newDataLength: newData.length,
          initialBatchSize,
          willShow: Math.min(initialBatchSize, newData.length),
        });
      }
      setAllData(newData);
      setVisibleCount(Math.min(initialBatchSize, newData.length));
      setIsLoading(false);
    },
    [initialBatchSize]
  );

  const observerRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observer.current) observer.current.disconnect();

      if (node && hasMore) {
        observer.current = new IntersectionObserver(
          (entries) => {
            const entry = entries[0];
            if (process.env.NODE_ENV === "development") {
              console.log("👁️ Intersection observed:", {
                isIntersecting: entry.isIntersecting,
                hasMore,
                isLoading,
                visibleCount,
                totalData: allData.length,
                willTrigger: entry.isIntersecting && hasMore && !isLoading,
              });
            }
            if (entry.isIntersecting && hasMore && !isLoading) {
              loadMore();
            }
          },
          {
            threshold: 0.1,
            rootMargin: "50px", // Start loading when element is 50px away from viewport
          }
        );

        observer.current.observe(node);
      }
    },
    [hasMore, isLoading, loadMore, visibleCount, allData.length]
  );

  // Auto-load more if page isn't scrollable and we have more data
  useEffect(() => {
    if (hasMore && !isLoading && visibleItems.length > 0) {
      const timer = setTimeout(() => {
        // Check if the page is scrollable
        const scrollHeight = document.documentElement.scrollHeight;
        const windowHeight = window.innerHeight;
        const scrollable = scrollHeight > windowHeight + 100; // 100px buffer

        if (!scrollable && hasMore && !isLoading) {
          if (process.env.NODE_ENV === "development") {
            console.log("🔄 Auto-loading more items (page not scrollable)", {
              scrollHeight,
              windowHeight,
              scrollable,
              hasMore,
              isLoading,
            });
          }
          loadMore();
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [hasMore, isLoading, visibleItems.length, loadMore]);

  // Cleanup timeout and observer on unmount
  useEffect(() => {
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);

  return {
    visibleItems,
    hasMore,
    isLoading,
    loadMore,
    reset,
    observerRef,
  };
}
