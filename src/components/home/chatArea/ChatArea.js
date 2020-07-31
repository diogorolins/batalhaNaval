import React, { useState } from "react";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import ChatTwoToneIcon from "@material-ui/icons/ChatTwoTone";

import "./index.css";

const ChatArea = (props) => {
  const { sendChatMessage, messages, player } = props;
  const [message, updateMessage] = useState("");

  const fillMessage = (event) => {
    updateMessage(event.target.value);
  };

  const clearMessageAndSend = () => {
    sendChatMessage(message);
    updateMessage("");
  };

  const getEnter = (event) => {
    if (event.charCode === 13) {
      clearMessageAndSend();
    }
  };

  return (
    <div className="chat">
      <div className="chat__title">
        <ChatTwoToneIcon />
        <h1 className="chat__title">Chat Interativo</h1>
      </div>
      <div className="chat___messages">
        {messages.map((m, index) => (
          <div
            className={
              m.id === player.id
                ? "chat__messages___user"
                : "chat__messages___other"
            }
            key={index}
          >
            <strong>{m.name}:</strong> {m.messageContent}
          </div>
        ))}
      </div>
      <div className="chat__text">
        <TextField
          variant="outlined"
          id="message"
          name="message"
          label="Digite sua Mensagem"
          className="chat__text___field"
          value={message}
          onChange={fillMessage}
          onKeyPress={getEnter}
        />
        <Button
          variant="contained"
          className="chat__text___button"
          onClick={clearMessageAndSend}
        >
          Enviar
        </Button>
      </div>
    </div>
  );
};

export default ChatArea;
