export default function Loading() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[50vh]">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-10 h-10 border-4 border-crimson border-t-transparent rounded-full animate-spin"></div>
        <p className="text-text-secondary text-sm font-medium">Loading Admin Data...</p>
      </div>
    </div>
  );
}
