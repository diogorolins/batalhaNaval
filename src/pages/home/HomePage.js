import React from "react";
import { withRouter } from "react-router-dom";
import io from "socket.io-client";
import { v4 as uuidv4 } from "uuid";

import { getUserId, getToken } from "../../services/AuthService";
import ApiService from "../../services/ApiService";
import { sockedURL } from "../../services/SocketService";
import Snack from "../../services/SnackService";
import DialogBox from "../../services/DialogService";
import BackDropBox from "../../services/BackDropService";

import SentInvitesArea from "../../components/home/SentInvitesArea/SentInvitesArea";
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
    snack: {
      open: false,
      severity: "error",
      message: "",
    },
    dialog: {
      open: false,
      title: "",
      content: "",
      accept: "",
    },
    loggedPlayers: [],
    invitesReceived: [],
    invitesSent: [],
    inviteAccept: "",
    backDrop: {
      open: false,
    },
  };

  async componentDidMount() {
    await this.getPlayer();
    this.getSocketMessages();
  }

  getSocketMessages = async () => {
    this.setState({
      socket: io(`${sockedURL}?player=${JSON.stringify(this.state.player)}`),
    });
    await this.state.socket.on("players.logged", (players) =>
      this.setLoggedPlayers(players)
    );
    await this.state.socket.on("invite.send", (invites) => {
      this.setInvites(invites);
    });
    await this.state.socket.on("invite.accept", (invite) => {
      this.checkIfMyInviteWasAccepted(invite);
    });
    await this.state.socket.on("invite.gameCanStart", (inviteId) => {
      this.checkIfGameCanStart(inviteId);
    });
  };

  setInvites = (invites) => {
    const invitesReceived = invites.filter(
      (i) => i.to.id === this.state.player.id && i.status === "Pendente"
    );
    this.setState({ invitesReceived });

    const invitesSent = invites.filter(
      (i) => i.from.id === this.state.player.id
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
      id: uuidv4(),
      from: this.state.player,
      to: this.state.loggedPlayers.filter((p) => p.id === playerId)[0],
      status: "Pendente",
    };
    this.state.socket.emit("invite.send", invite);
  };

  clearSentInvites = () => {
    this.state.socket.emit("invite.clear", this.state.player.id);
  };

  denyInvite = (invite) => {
    this.state.socket.emit("invite.deny", invite);
  };

  acceptInvite = (invite) => {
    if (this.state.loggedPlayers.find((l) => l.id === invite.from.id)) {
      this.setState({ inviteAccept: invite });
      this.changeDialog(
        true,
        "Pronto pra começar",
        `Clique para iniciar um jogo com ${invite.from.name}?`,
        "JOGAR"
      );
    } else {
      this.changeSnack(
        "O usuário se desconectou , tente mais tarde.",
        "error",
        true
      );
    }
  };

  startGame = async () => {
    await this.state.socket.emit("invite.accept", this.state.inviteAccept);
    this.closeDialog();
    if (this.state.inviteAccept.from.id === this.state.player.id) {
      this.props.history.push({
        pathname: "/gameconfig",
        state: { invite: this.state.inviteAccept },
      });
      await this.state.socket.emit(
        "invite.gameCanStart",
        this.state.inviteAccept
      );
    } else {
      this.setState({ backDrop: { open: true } });
    }
  };

  checkIfGameCanStart = (inviteId) => {
    console.log(inviteId);
    if (inviteId === this.state.player.id) {
      this.props.history.push({
        pathname: "/gameconfig",
        state: { invite: this.state.inviteAccept },
      });
    }
  };

  checkIfMyInviteWasAccepted = (invite) => {
    if (invite.from.id === this.state.player.id) {
      this.setState({ inviteAccept: invite });
      this.changeDialog(
        true,
        "Seu convite foi aceito!",
        `Clique para iniciar um jogo com ${invite.to.name}?`,
        "JOGAR"
      );
    }
  };

  closeDialog = () => {
    this.changeDialog(false, "", "", "");
  };

  changeDialog = (open, title, content, accept) => {
    this.setState({
      dialog: {
        open,
        title,
        content,
        accept,
      },
    });
  };

  closeSnack = () => {
    this.changeSnack("", "error", false);
  };

  changeSnack = (message, severity, open) => {
    this.setState({
      snack: {
        message,
        severity,
        open,
      },
    });
  };

  render() {
    const {
      socket,
      player,
      loggedPlayers,
      invitesReceived,
      invitesSent,
      snack,
      dialog,
      backDrop,
    } = this.state;
    return (
      <>
        <BackDropBox open={backDrop.open} />
        <div className="grid">
          <Header />

          <Snack close={this.closeSnack} snack={snack} />
          <DialogBox dialog={dialog} success={this.startGame} />

          <main className="content">
            <ProfileArea socket={socket} player={player} />
            <section className="boxes">
              <LoggedUsersArea
                loggedPlayers={loggedPlayers}
                invitesSent={invitesSent}
                sendInvite={this.sendInvite}
              />
              <ReceivedInvitesArea
                invitesReceived={invitesReceived}
                denyInvite={this.denyInvite}
                acceptInvite={this.acceptInvite}
              />
              <SentInvitesArea
                invitesSent={invitesSent.reverse()}
                clearSentInvites={this.clearSentInvites}
              />
            </section>
          </main>
          <Footer />
        </div>
      </>
    );
  }
}
export default withRouter(Home);
