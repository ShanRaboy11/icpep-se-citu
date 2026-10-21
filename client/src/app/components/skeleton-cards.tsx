import { Skeleton, SkeletonGate } from "./skeleton";

export function EventCardSkeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg ${className}`}
    >
      <Skeleton className="aspect-16/10 w-full shrink-0 rounded-none" />
      <div className="flex flex-1 flex-col gap-3 p-6">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <div className="mt-2 flex gap-2">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function AnnouncementCardSkeleton() {
  return (
    <div className="mx-auto mb-10 h-auto max-w-4xl overflow-hidden rounded-[25px] border border-primary1/15 bg-white shadow-lg md:h-80">
      <div className="h-full md:flex">
        <Skeleton className="h-48 w-full rounded-none md:h-full md:w-1/3" />
        <div className="flex flex-col gap-3 p-4 sm:p-6 md:w-2/3">
          <Skeleton className="h-7 w-20 rounded-[10px]" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="mt-auto h-4 w-32" />
        </div>
      </div>
    </div>
  );
}

export function MerchCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-md">
      <Skeleton className="aspect-square w-full rounded-none" />
      <div className="space-y-3 p-6">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="mt-4 h-12 w-full rounded-xl" />
      </div>
    </div>
  );
}

export function OfficerCardSkeleton() {
  return <Skeleton className="aspect-3/4 w-full max-w-72 rounded-3xl" />;
}

export function DetailCardSkeleton({ lines = 3, className = "" }: { lines?: number; className?: string }) {
  return (
    <div className={`space-y-4 rounded-3xl border border-primary1/15 bg-white p-6 shadow-lg sm:p-8 ${className}`}>
      <Skeleton className="h-7 w-40" />
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={`h-4 ${i === lines - 1 ? "w-2/3" : "w-full"}`} />
      ))}
    </div>
  );
}

export function ListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <SkeletonGate loading>
      <div className="divide-y divide-gray-100">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-6 py-4 sm:px-8">
            <Skeleton className="h-12 w-12 shrink-0 rounded-xl" />
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <Skeleton className="hidden h-8 w-24 rounded-full sm:block" />
          </div>
        ))}
      </div>
    </SkeletonGate>
  );
}

export function FormCardSkeleton({ fields = 3 }: { fields?: number }) {
  return (
    <SkeletonGate loading>
      <div className="space-y-6">
        {Array.from({ length: fields }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-12 w-full rounded-2xl" />
          </div>
        ))}
      </div>
    </SkeletonGate>
  );
}
