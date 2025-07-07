import { SendHorizonal } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addUserMessage,
  addModelMessage,
  setTyping,
} from "../chat";
import axiosClient from "../utils/axiosClient";

export default function AIChat({ problem }) {
  const { title, description, testCases, startCode } = problem;
  const dispatch = useDispatch();
  const { messages, isTyping } = useSelector((state) => state.chat);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);
  const handleSend = async () => {
    if (!input.trim()) return;

    dispatch(addUserMessage(input));
    dispatch(setTyping(true));
    const updatedMessages = [
      ...messages,
      { role: "user", parts: [{ text: input }] },
    ];

    setInput("");

    try {
      const res = await axiosClient.post("/ai/chat", {
        messages: updatedMessages,
        title,
        description,
        testCases,
        startCode,
      });

      dispatch(addModelMessage(res.data.message));
    } catch (err) {
      console.error("AI error:", err.message);
      dispatch(addModelMessage("⚠️ Sorry, something went wrong."));
    } finally {
      dispatch(setTyping(false));
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <div className="flex flex-col h-full w-full bg-gray-950/50 text-white">
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`chat ${msg.role === "user" ? "chat-end" : "chat-start"}`}
          >
            <div
              className={`chat-bubble whitespace-pre-wrap break-words transition-all duration-300 ease-in-out ${
                msg.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700/40 text-white"
              }`}
            >
              {msg.parts?.[0]?.text || ""}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="chat chat-start animate-pulse">
            <div className="chat-bubble bg-gray-700/50 text-white">Typing...</div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="border-t border-base-content/10 p-3 flex items-center gap-2">
        <input
          type="text"
          placeholder="Ask something about this DSA problem..."
          className="input input-bordered w-full bg-gray-950 text-white placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring focus:ring-primary/40"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          className="btn btn-primary btn-square bg-blue-600 border-blue-600"
          onClick={handleSend}
        >
          <SendHorizonal size={20} className="text-white" />
        </button>
      </div>
    </div>
  );
}
