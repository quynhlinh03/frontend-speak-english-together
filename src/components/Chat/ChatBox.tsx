import React, { useEffect, useState, useRef } from "react";
import { useChannel } from "ably/react";

// Define the shape of the message
interface Message {
  connectionId: string;
  data: string;
}

const ChatBox: React.FC = () => {
  const inputBoxRef = useRef<HTMLTextAreaElement>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);

  const [messageText, setMessageText] = useState("");
  const [receivedMessages, setMessages] = useState<Message[]>([]);
  const messageTextIsEmpty = messageText.trim().length === 0;

  const { channel, ably } = useChannel("chat-demo", (message: Message) => {
    const history = receivedMessages.slice(-199);
    setMessages([...history, message]);
  });

  const sendChatMessage = (messageText: string) => {
    channel.publish({ name: "chat-message", data: messageText });
    setMessageText("");
    if (inputBoxRef.current) {
      inputBoxRef.current.focus();
    }
  };

  const handleFormSubmission = (event: React.FormEvent) => {
    event.preventDefault();
    sendChatMessage(messageText);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.charCode !== 13 || messageTextIsEmpty) {
      return;
    }
    sendChatMessage(messageText);
    event.preventDefault();
  };

  const messages = receivedMessages.map((message, index) => {
    const author = message.connectionId === ably.connection.id ? "me" : "other";
    return (
      <span key={index} className="chat-message" data-author={author}>
        {message.data}
      </span>
    );
  });

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [receivedMessages]);

  return (
    <div className="chat-chatHolder">
      <div className="chat-chatText">
        {messages}
        <div ref={messageEndRef}></div>
      </div>
      <form onSubmit={handleFormSubmission} className="chat-form">
        <textarea
          ref={inputBoxRef}
          value={messageText}
          placeholder="Type a message..."
          onChange={(e) => setMessageText(e.target.value)}
          onKeyPress={handleKeyPress}
          className="chat-textarea"
        ></textarea>
        <button
          type="submit"
          className="chat-button"
          disabled={messageTextIsEmpty}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatBox;
