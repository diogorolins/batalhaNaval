import React from "react";
import { withRouter } from "react-router-dom";
import io from "socket.io-client";

import { getUserId, getToken } from "../../services/AuthService";
import ApiService from "../../services/ApiService";

import ReceivedInvitesArea from "../../components/home/receivedInvitesArea/ReceivedInvitesArea";
import LoggedUsersArea from "../../components/home/loggedUsersArea/loggedUsersArea";
import ProfileArea from "../../components/home/profileArea/ProfileArea";
import ChatArea from "../../components/home/chatArea/ChatArea";
import Header from "../../components/general/header/Header";
import Footer from "../../components/general/footer/Footer";

import "./index.css";

class Home extends React.Component {
  state = {
    socket: "",
    player: {
      id: "",
      name: "",
      email: "",
    },
    loggedPlayers: [],
    invitesReceived: [],
    invitesSent: [],
    messages: [],
  };

  async componentDidMount() {
    var API_SOCKET = "https://new-battleship-socket.herokuapp.com/";
    if (process.env.NODE_ENV === "development")
      API_SOCKET = "http://localhost:3002";
    await this.getPlayer();
    await this.setState({
      socket: io(`${API_SOCKET}?player=${JSON.stringify(this.state.player)}`),
    });
    await this.state.socket.on("players.logged", (players) =>
      this.setLoggedPlayers(players)
    );
    await this.state.socket.on("invite.send", (invites) => {
      this.setInvites(invites);
    });
    await this.state.socket.on("message", (messages) => {
      this.setState({ messages });
    });
  }

  setInvites = (invites) => {
    const invitesReceived = invites.filter(
      (i) => i.to.id === this.state.player.id && i.status === "pending"
    );
    this.setState({ invitesReceived });

    const invitesSent = invites.filter(
      (i) => i.from.id === this.state.player.id && i.status === "pending"
    );
    this.setState({ invitesSent });
  };

  setLoggedPlayers = (players) => {
    const loggedPlayers = players.filter(
      (m) => m.email !== this.state.player.email
    );
    this.setState({ loggedPlayers });
  };

  getPlayer = async () => {
    const playerId = getUserId();
    try {
      const response = await ApiService.getPlayer(playerId, getToken());
      this.setState({
        player: {
          id: response.data.id,
          name: response.data.name,
          email: response.data.email,
        },
      });
    } catch (err) {
      console.log(err);
    }
  };

  sendInvite = (playerId) => {
    const invite = {
      from: this.state.player,
      to: this.state.loggedPlayers.filter((p) => p.id === playerId)[0],
      status: "pending",
    };
    this.state.socket.emit("invite.send", invite);
  };

  sendChatMessage = (messageContent) => {
    if (messageContent.trim()) {
      const message = {
        id: this.state.player.id,
        name: this.state.player.name,
        messageContent,
      };
      this.state.socket.emit("message", message);
    }
  };

  render() {
    const {
      socket,
      player,
      loggedPlayers,
      invitesReceived,
      invitesSent,
      messages,
    } = this.state;
    return (
      <div className="grid">
        <Header />
        <main className="content">
          <ProfileArea socket={socket} player={player} />
          <section className="boxes">
            <LoggedUsersArea
              loggedPlayers={loggedPlayers}
              invitesSent={invitesSent}
              sendInvite={this.sendInvite}
            />
            <ReceivedInvitesArea invitesReceived={invitesReceived} />
            <ChatArea
              sendChatMessage={this.sendChatMessage}
              messages={messages.reverse()}
              player={player}
            />
          </section>
        </main>
        <Footer />
      </div>
    );
  }
}
export default withRouter(Home);
