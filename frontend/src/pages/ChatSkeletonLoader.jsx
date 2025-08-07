const SkeletonBubble = ({ align = "left", width = "w-1/2" }) => {
  const baseClasses = "h-12 rounded-lg animate-pulse mb-5 md:h-16";
  const bubbleAlign = align === "left" ? "self-start bg-cyan-100" : "self-end bg-blue-100";

  return (
    <div className={`flex ${align === "left" ? "justify-start" : "justify-end"}`}>
      <div className={`${baseClasses} ${bubbleAlign} ${width}`}></div>
    </div>
  );
};

const ChatSkeletonLoader = () => {
  return (
    <div className="flex flex-col">
      <SkeletonBubble align="left" width="w-3/5" />
      <SkeletonBubble align="right" width="w-2/5" />
      <SkeletonBubble align="left" width="w-2/3" />
      <SkeletonBubble align="right" width="w-1/2" />
      <SkeletonBubble align="left" width="w-1/3" />
    </div>
  );
};

export default ChatSkeletonLoader