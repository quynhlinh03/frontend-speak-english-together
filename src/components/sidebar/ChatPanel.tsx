import { PaperAirplaneIcon } from "@heroicons/react/solid";
import { useMeeting, usePubSub } from "@videosdk.live/react-sdk";
import React, { useEffect, useRef, useState } from "react";
import { formatAMPM, json_verify, nameTructed } from "../../utils/helper";

interface ChatMessageProps {
  senderId: string;
  senderName: string;
  text: string;
  timestamp: number;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  senderId,
  senderName,
  text,
  timestamp,
}) => {
  const mMeeting = useMeeting();
  const localParticipantId = mMeeting?.localParticipant?.id;
  const localSender = localParticipantId === senderId;

  return (
    <div
      className={`flex ${localSender ? "justify-end" : "justify-start"} mt-4`}
      style={{
        maxWidth: "100%",
      }}
    >
      <div
        style={{backgroundColor: "rgba(31, 65, 114, 0.1)" }}
        className={`flex ${
          localSender ? "items-end" : "items-start"
        } flex-col py-1 px-2 rounded-2xl`}
      >
        <p style={{ color: "#868e96" }} className="text-xs">
          {localSender ? "You" : nameTructed(senderName, 15)}
        </p>
        <div>
          <p className="inline-block whitespace-pre-wrap break-words text-right text-black">
            {text}
          </p>
        </div>
        <div className="mt-1">
          <p className="text-xs italic" style={{ color: "#868e96" }}>
            {formatAMPM(new Date(timestamp))}
          </p>
        </div>
      </div>
    </div>
  );
};

const ChatInput: React.FC<{ inputHeight: number }> = ({ inputHeight }) => {
  const [message, setMessage] = useState("");
  const { publish } = usePubSub("CHAT");
  const input = useRef<HTMLInputElement>(null);

  return (
    <div
      className="w-full flex items-center px-2"
      style={{ height: inputHeight }}
    >
      <div className="relative  w-full">
        <span className="absolute inset-y-0 right-0 flex mr-2 rotate-90 ">
          <button
            disabled={message.length < 2}
            type="submit"
            className="p-1 focus:outline-none focus:shadow-outline"
            onClick={() => {
              const messageText = message.trim();
              if (messageText.length > 0) {
                publish(messageText, { persist: true });
                setTimeout(() => {
                  setMessage("");
                }, 100);
                input.current?.focus();
              }
            }}
          >
            <PaperAirplaneIcon
              className={`w-6 h-6 ${
                message.length < 2 ? "text-gray-500 " : "text-black"
              }`}
            />
          </button>
        </span>
        <input
          style={{ backgroundColor: "#FEFAF6", fontFamily: "Be Vietnam Pro, sans-serif" }}
          type="text"
          className="py-4 text-sm text-black rounded pr-10 pl-2 focus:outline-none w-full"
          placeholder="Write your message"
          autoComplete="off"
          ref={input}
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
          }}
          onKeyPress={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              const messageText = message.trim();

              if (messageText.length > 0) {
                publish(messageText, { persist: true });
                setTimeout(() => {
                  setMessage("");
                }, 100);
                input.current?.focus();
              }
            }
          }}
        />
      </div>
    </div>
  );
};

const ChatMessages: React.FC<{ listHeight: number }> = ({ listHeight }) => {
  const listRef = useRef<HTMLDivElement>(null);
  const { messages } = usePubSub("CHAT");

  const scrollToBottom = () => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return messages ? (
    <div ref={listRef} style={{ overflowY: "scroll", height: listHeight }}>
      <div className="p-4">
        {messages.map((msg, i) => {
          const { senderId, senderName, message, timestamp } = msg;
          return (
            <ChatMessage
              key={`chat_item_${i}`}
              senderId={senderId}
              senderName={senderName}
              text={message}
              timestamp={timestamp}
            />
          );
        })}
      </div>
    </div>
  ) : (
    <p>No messages</p>
  );
};

export const ChatPanel: React.FC<{ panelHeight: number }> = ({
  panelHeight,
}) => {
  const inputHeight = 72;
  const listHeight = panelHeight - inputHeight;

  return (
    <div>
      <ChatMessages listHeight={listHeight} />
      <ChatInput inputHeight={inputHeight} />
    </div>
  );
};
