import React from "react";
import { withRouter } from "react-router-dom";
import io from "socket.io-client";

import { getUserId, getToken } from "../../services/AuthService";
import ApiService from "../../services/ApiService";

import ReceivedInvitesArea from "../../components/home/receivedInvitesArea/ReceivedInvitesArea";
import LoggedUsersArea from "../../components/home/loggedUsersArea/loggedUsersArea";
import ProfileArea from "../../components/home/profileArea/ProfileArea";
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
  };
  async componentDidMount() {
    await this.getPlayer();
    await this.setState({
      socket: io(
        `http://localhost:3002?player=${JSON.stringify(this.state.player)}`
      ),
    });
    this.state.socket.on("players.logged", (players) =>
      this.setLoggedPlayers(players)
    );
    this.state.socket.on("invite.send", (invites) => this.setInvites(invites));
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

  render() {
    const {
      socket,
      player,
      loggedPlayers,
      invitesReceived,
      invitesSent,
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
            <div className="boxes__chat">Chat em construção</div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }
}
export default withRouter(Home);
