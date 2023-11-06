import React from "react";

type MessageInputProps = {
  onSend: (message: string) => void;
};

const MessageInput: React.FC<MessageInputProps> = ({ onSend }) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      onSend(event.currentTarget.value);
      event.currentTarget.value = "";
    }
  };

  return (
    <div className="box">
      <div className="control">
        <input
          className="input"
          type="text"
          placeholder="Say something..."
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
};

export default MessageInput;
