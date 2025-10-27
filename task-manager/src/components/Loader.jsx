const Loading = () => {
  return (
    <div className='flex justify-center items-center min-h-[200px]'>
      <div className='flex space-x-2'>
        <div className='w-3 h-3 bg-gradient-to-r from-purple-600 to-blue-700 rounded-full animate-bounce'></div>
        <div className='w-3 h-3 bg-gradient-to-r from-purple-600 to-blue-700 rounded-full animate-bounce' style={{animationDelay: '0.1s'}}></div>
        <div className='w-3 h-3 bg-gradient-to-r from-purple-600 to-blue-700 rounded-full animate-bounce' style={{animationDelay: '0.2s'}}></div>
        <div className='w-3 h-3 bg-gradient-to-r from-purple-600 to-blue-700 rounded-full animate-bounce' style={{animationDelay: '0.3s'}}></div>
        <div className='w-3 h-3 bg-gradient-to-r from-purple-600 to-blue-700 rounded-full animate-bounce' style={{animationDelay: '0.4s'}}></div>
      </div>
    </div>
  );
};

export default Loading;