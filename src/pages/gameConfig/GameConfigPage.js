import React from "react";
import { withRouter } from "react-router-dom";
import io from "socket.io-client";
import { sockedURL } from "../../services/SocketService";

class GameConfig extends React.Component {
  state = {
    invite: "",
  };
  componentDidMount() {
    this.getSocketMessages();
  }

  getSocketMessages = () => {
    const socket = io(sockedURL);
    const invite = this.props.location.state.invite;

    // socket.emit("player.game", invite.from.name);
  };

  render() {
    const { invite } = this.state;
    return (
      <>
        <h1>{invite.id}</h1>)
      </>
    );
  }
}

export default withRouter(GameConfig);
