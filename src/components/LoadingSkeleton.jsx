import React from 'react';

// Skeleton for movie card
export const MovieCardSkeleton = () => {
  return (
    <div className="relative group cursor-pointer animate-pulse">
      <div className="aspect-[2/3] bg-gradient-to-br from-dark/80 via-dark/60 to-dark/80 rounded-lg overflow-hidden">
        <div className="w-full h-full bg-gradient-to-r from-dark/50 via-dark/30 to-dark/50 animate-shimmer" 
             style={{ backgroundSize: '200% 100%' }} />
      </div>
      <div className="mt-2 space-y-2">
        <div className="h-4 bg-dark/60 rounded w-3/4 animate-shimmer" />
        <div className="h-3 bg-dark/40 rounded w-1/2 animate-shimmer" />
      </div>
    </div>
  );
};

// Skeleton for movie row
export const MovieRowSkeleton = () => {
  return (
    <div className="mb-8">
      <div className="h-6 bg-dark/60 rounded w-48 mb-4 animate-shimmer" />
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => (
          <MovieCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
};

// Skeleton for hero section
export const HeroSkeleton = () => {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background skeleton */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark via-dark/95 to-dark animate-pulse">
        <div className="w-full h-full bg-gradient-to-r from-dark/50 via-dark/30 to-dark/50 animate-shimmer" 
             style={{ backgroundSize: '200% 100%' }} />
      </div>
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/80 to-transparent" />
      
      {/* Content skeleton */}
      <div className="absolute bottom-32 left-8 md:left-16 lg:left-24 max-w-2xl z-10 space-y-4">
        {/* Title skeleton */}
        <div className="h-12 bg-dark/60 rounded w-3/4 animate-shimmer mb-4" />
        
        {/* Info badges skeleton */}
        <div className="flex gap-4 mb-4">
          <div className="h-8 bg-dark/60 rounded w-24 animate-shimmer" />
          <div className="h-8 bg-dark/60 rounded w-32 animate-shimmer" />
          <div className="h-8 bg-dark/60 rounded w-20 animate-shimmer" />
        </div>
        
        {/* Description skeleton */}
        <div className="space-y-2 mb-6">
          <div className="h-4 bg-dark/40 rounded w-full animate-shimmer" />
          <div className="h-4 bg-dark/40 rounded w-5/6 animate-shimmer" />
          <div className="h-4 bg-dark/40 rounded w-4/6 animate-shimmer" />
        </div>
        
        {/* Buttons skeleton */}
        <div className="flex gap-4">
          <div className="h-12 bg-dark/60 rounded w-32 animate-shimmer" />
          <div className="h-12 bg-dark/60 rounded w-32 animate-shimmer" />
        </div>
      </div>
      
      {/* Navigation dots skeleton */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-2 h-2 rounded-full bg-white/30 animate-pulse" />
        ))}
      </div>
    </div>
  );
};

// Skeleton for categories page
export const CategoriesPageSkeleton = () => {
  return (
    <div className="min-h-screen pt-20 px-4 md:px-8 lg:px-16">
      {/* Header skeleton */}
      <div className="mb-8 space-y-4">
        <div className="h-8 bg-dark/60 rounded w-64 animate-shimmer" />
        <div className="h-4 bg-dark/40 rounded w-96 animate-shimmer" />
      </div>
      
      {/* Filters skeleton */}
      <div className="mb-8 flex gap-2 flex-wrap">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-10 bg-dark/60 rounded-full w-24 animate-shimmer" />
        ))}
      </div>
      
      {/* Movies grid skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {[...Array(12)].map((_, i) => (
          <MovieCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
};

// Skeleton for modal
export const ModalSkeleton = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-dark/95 rounded-xl overflow-hidden animate-pulse">
        {/* Header skeleton */}
        <div className="relative h-[40vh] bg-gradient-to-br from-dark/80 via-dark/60 to-dark/80">
          <div className="w-full h-full bg-gradient-to-r from-dark/50 via-dark/30 to-dark/50 animate-shimmer" 
               style={{ backgroundSize: '200% 100%' }} />
        </div>
        
        {/* Content skeleton */}
        <div className="p-8 space-y-6">
          <div className="h-8 bg-dark/60 rounded w-2/3 animate-shimmer" />
          <div className="flex gap-4">
            <div className="h-10 bg-dark/60 rounded w-32 animate-shimmer" />
            <div className="h-10 bg-dark/60 rounded w-32 animate-shimmer" />
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-dark/40 rounded w-full animate-shimmer" />
            <div className="h-4 bg-dark/40 rounded w-5/6 animate-shimmer" />
            <div className="h-4 bg-dark/40 rounded w-4/6 animate-shimmer" />
          </div>
        </div>
      </div>
    </div>
  );
};
