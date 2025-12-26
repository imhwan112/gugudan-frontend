import { HandThumbUpIcon, HandThumbDownIcon } from "@heroicons/react/24/outline";
import { HandThumbUpIcon as HandThumbUpSolid, HandThumbDownIcon as HandThumbDownSolid } from "@heroicons/react/24/solid";

export function ChatMessage({ message_id, role, content, onFeedback, user_feedback }: { message_id?: number; role: "USER" | "ASSISTANT"; content: string; user_feedback?: "LIKE" | "DISLIKE" | null; onFeedback?: (msgId: number, score: "LIKE" | "DISLIKE") => void }) {
  const isUser = role === "USER";
  return (
    <div className={`flex w-full mb-4 animate-in fade-in slide-in-from-bottom-2 duration-300 ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`flex gap-3 max-w-[85%] ${isUser ? "flex-row-reverse" : "flex-row"}`}>
        {/* Profile Icon */}
        <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold ${isUser ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"}`}>
          {isUser ? "나" : "AI"}
        </div>
        
        {/* Bubble */}
        <div
          className={`px-4 py-2.5 rounded-2xl text-[15px] leading-relaxed shadow-sm whitespace-pre-wrap
            ${isUser 
              ? "bg-blue-600 text-white rounded-tr-none" 
              : "bg-white border border-gray-200 text-gray-800 rounded-tl-none"
            }`}
        >
          {content || (
             <div className="flex gap-1 py-2">
               <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
               <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]" />
               <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]" />
             </div>
          )}
          {!isUser && content && message_id && onFeedback && (
            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-100">
              <button onClick={() => onFeedback(message_id, "LIKE")} className="p-1 hover:bg-gray-100 rounded transition-colors group">
                {user_feedback === "LIKE" ? (
                  <HandThumbUpSolid className="w-3.5 h-3.5 text-blue-500" />
                ) : (
                  <HandThumbUpIcon className="w-3.5 h-3.5 text-gray-400 group-hover:text-blue-500" />
                )}              
                </button>
                <button onClick={() => onFeedback(message_id, "DISLIKE")} className="p-1 hover:bg-gray-100 rounded transition-colors group">
                {user_feedback === "DISLIKE" ? (
                  <HandThumbDownSolid className="w-3.5 h-3.5 text-blue-500" />
                ) : (
                  <HandThumbDownIcon className="w-3.5 h-3.5 text-gray-400 group-hover:text-blue-500" />
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}