import React from "react";

import "./index.css";

import { typeMessage } from "../../../services/MessagesService";

const GameMessages = (props) => {
  const { messages } = props;

  return (
    <div className="messages">
      {messages.map((m, index) => (
        <div
          key={index}
          className={typeMessage.filter((t) => t.type === m.type)[0].class}
        >
          {m.message}
        </div>
      ))}
    </div>
  );
};

export default GameMessages;
