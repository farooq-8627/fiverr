import { Skeleton } from "@/components/Skelitons/skeleton";

export default function DashboardLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="w-full mb-8">
        {/* Menu Bar Skeleton */}
        <Skeleton className="h-16 w-full rounded-2xl mb-6" />

        {/* Content Skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-32 w-full rounded-lg" />
          <Skeleton className="h-32 w-full rounded-lg" />
          <Skeleton className="h-32 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}
