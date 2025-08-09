const SkeletonBubble = ({ 
  align = "left", 
  width = "w-1/2", 
  delay = 0,
  lines = 1 
}) => {
  const baseClasses = "rounded-lg mb-4 relative overflow-hidden";
  const bubbleAlign = align === "left" ? "self-start bg-cyan-100" : "self-end bg-blue-100";

  return (
    <div 
      className={`flex ${align === "left" ? "justify-start" : "justify-end"} opacity-0 animate-fade-in`}
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
      <div className={`${baseClasses} ${bubbleAlign} ${width} px-4 py-3`}>
        {/* Multiple skeleton lines for more realistic text simulation */}
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={`h-4 bg-gray-300 rounded animate-shimmer mb-2 last:mb-0 ${
              index === lines - 1 && lines > 1 ? 'w-3/4' : 'w-full'
            }`}
            style={{ 
              animationDelay: `${delay + index * 100}ms`,
              animationDuration: '2s',
              animationIterationCount: 'infinite'
            }}
          />
        ))}
        
        {/* Shimmer overlay effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer-overlay"></div>
      </div>
    </div>
  );
};

const TypingIndicator = ({ delay = 0 }) => {
  return (
    <div 
      className="flex justify-start opacity-0 animate-fade-in mb-4"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
      <div className="bg-cyan-100 px-4 py-3 rounded-lg">
        <div className="flex items-center space-x-1 h-5">
          <div className="w-2 h-2 bg-gray-500 rounded-full animate-typing-dot animation-delay-0"></div>
          <div className="w-2 h-2 bg-gray-500 rounded-full animate-typing-dot animation-delay-150"></div>
          <div className="w-2 h-2 bg-gray-500 rounded-full animate-typing-dot animation-delay-300"></div>
        </div>
      </div>
    </div>
  );
};

const ChatSkeletonLoader = () => {
  return (
    <div className="flex flex-col">
      {/* Welcome message simulation */}
      <SkeletonBubble align="left" width="w-4/5" delay={0} lines={2} />
      
      {/* User response simulation */}
      <SkeletonBubble align="right" width="w-2/5" delay={300} lines={1} />
      
      {/* Bot response simulation */}
      <SkeletonBubble align="left" width="w-3/5" delay={600} lines={3} />
      
      {/* User follow-up */}
      <SkeletonBubble align="right" width="w-1/2" delay={900} lines={1} />
      
      {/* Bot detailed response */}
      <SkeletonBubble align="left" width="w-4/6" delay={1200} lines={2} />
      
      {/* Current typing indicator */}
      <TypingIndicator delay={1500} />

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -200px 0;
          }
          100% {
            background-position: calc(200px + 100%) 0;
          }
        }

        @keyframes shimmer-overlay {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes typing-dot {
          0%, 60%, 100% {
            transform: translateY(0);
            opacity: 0.4;
          }
          30% {
            transform: translateY(-10px);
            opacity: 1;
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-shimmer {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }

        .animate-shimmer-overlay {
          animation: shimmer-overlay 2s infinite;
        }

        .animate-typing-dot {
          animation: typing-dot 1.4s infinite ease-in-out;
        }

        .animation-delay-0 {
          animation-delay: 0ms;
        }

        .animation-delay-150 {
          animation-delay: 150ms;
        }

        .animation-delay-300 {
          animation-delay: 300ms;
        }
      `}</style>
    </div>
  );
};

export default ChatSkeletonLoader;