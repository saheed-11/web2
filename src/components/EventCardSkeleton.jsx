import Skeleton from './Skeleton';

const EventCardSkeleton = () => {
  return (
    <div className="card group overflow-hidden">
      {/* Image Skeleton */}
      <Skeleton className="h-48 mb-4 -mt-6 -mx-6" />

      {/* Title Skeleton */}
      <Skeleton className="h-8 w-3/4 mb-3" variant="text" />

      {/* Details Skeletons */}
      <div className="space-y-2 mb-4">
        <Skeleton className="h-5 w-1/2" variant="text" />
        <Skeleton className="h-5 w-1/3" variant="text" />
        <Skeleton className="h-5 w-2/3" variant="text" />
        <Skeleton className="h-5 w-1/2" variant="text" />
      </div>

      {/* Description Skeleton */}
      <div className="mb-4 space-y-2">
        <Skeleton className="h-4 w-full" variant="text" />
        <Skeleton className="h-4 w-full" variant="text" />
        <Skeleton className="h-4 w-3/4" variant="text" />
      </div>

      {/* Buttons Skeleton */}
      <div className="flex gap-3">
        <Skeleton className="h-12 flex-1" />
        <Skeleton className="h-12 flex-1" />
      </div>
    </div>
  );
};

export default EventCardSkeleton;
