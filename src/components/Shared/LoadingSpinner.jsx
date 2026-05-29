const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      
      <span className="loading loading-ring loading-lg text-blue-600"></span>
      
      <p className="text-blue-600 font-semibold animate-pulse">
        SportFlow is loading...
      </p>
    </div>
  );
};

export default LoadingSpinner;