const SkeletonCard = () => {
  return (
    <div className="rounded-xl overflow-hidden h-full flex flex-col bg-surface-raised">
      {/* Artwork zone placeholder */}
      <div className="flex-1 flex items-center justify-center p-3 min-h-0">
        <div className="animate-shimmer w-24 h-24 rounded-lg" />
      </div>

      {/* Info strip placeholder */}
      <div className="bg-black/30 px-3 py-2 flex flex-col items-center gap-2">
        {/* Name bar */}
        <div className="animate-shimmer h-3 w-20 rounded-full" />
        {/* Badge bar */}
        <div className="flex gap-1">
          <div className="animate-shimmer h-4 w-10 rounded-full" />
          <div className="animate-shimmer h-4 w-10 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
