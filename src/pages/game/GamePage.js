import React from "react";
import { withRouter } from "react-router-dom";
import io from "socket.io-client";

import "./index.css";

import { getToken } from "../../services/AuthService";
import ApiService from "../../services/ApiService";
import { table } from "../../services/TableGameServices";
import Snack from "../../services/SnackService";
import { sockedURL } from "../../services/SocketService";
import DialogBox from "../../services/DialogService";

import MyTableBoard from "../../components/game/myTableBoard/MyTableBoard";
import RivalTableBoard from "../../components/game/rivalTableBoard/RivalTableBoard";
import GameMessages from "../../components/game/gameMessages/GameMessages";
import Header from "../../components/general/header/Header";
import Footer from "../../components/general/footer/Footer";

const col = table.col;
const rol = table.rol;

class Game extends React.Component {
  state = {
    game: "",
    strikeField: "",
    player: "",
    myShips: "",
    rivalShips: "",
    snack: {
      open: false,
      severity: "error",
      message: "",
    },
    strikesReceived: [],
    strikesMade: [],
    strikes: [],
    dialog: {
      open: false,
      title: "",
      content: "",
      accept: "",
    },
    messages: [],
  };
  socket = "";

  async componentDidMount() {
    this.socket = io(`${sockedURL}/game`);
    const game = await this.createGameModel(this.props.location.state.game);

    this.setState(
      {
        game,
        player: this.props.location.state.player,
      },
      () => {
        this.setState({ myTurn: this.isMyTurn() });
        this.fillShips();
        this.checkSocket();
      }
    );
  }

  componentWillUnmount() {
    this.socket.disconnect();
  }

  createGameModel = async (game) => {
    const response = await ApiService.getGame(game, getToken());

    const objectGame = {
      id: response.data.id,
      players: [
        {
          id: response.data.players[0].id,
          ships: response.data.players[0].ships,
        },
        {
          id: response.data.players[1].id,
          ships: response.data.players[1].ships,
        },
      ],
    };

    return objectGame;
  };

  checkSocket = () => {
    this.socket.on("game.strike", (strikes) => {
      this.receiveStrikes(strikes);
    });
    this.socket.on("game.messages", (messages) => {
      this.receiveMessages(messages);
    });
  };

  isMyTurn = () => {
    return this.state.player.id === this.state.game.players[1].id;
  };

  receiveMessages = (messages) => {
    this.setState({
      messages: messages.filter((m) => m.game === this.state.game.id).reverse(),
    });
  };

  receiveStrikes = (strikes) => {
    const gameStrikes = strikes.filter((s) => s.gameId === this.state.game.id);
    this.emitStrikeReceivedMessage(gameStrikes);
    this.checkIfShipWasDestroyed(gameStrikes, this.state.myShips, {
      message: "Seu barco foi Destruído!",
      status: "error",
    });
    this.checkIfIGameIsOver(gameStrikes, this.state.myShips, {
      message: "Você perdeu!!",
      status: "lose",
    });

    this.setState({
      strikes: gameStrikes,
      strikesMade: gameStrikes.filter(
        (sm) => sm.playerId === this.state.player.id
      ),
      strikesReceived: gameStrikes.filter(
        (sm) => sm.playerId !== this.state.player.id
      ),
      myTurn: gameStrikes.length ? true : this.state.myTurn,
    });
  };

  sendMessageToServer = (gameMessage, type) => {
    const message = {
      message: gameMessage,
      player: this.state.player,
      game: this.state.game.id,
      type,
    };
    this.socket.emit("game.messages", message);
  };

  emitStrikeReceivedMessage = (gameStrikes) => {
    if (gameStrikes.length) {
      this.changeSnack(
        `Você foi atacado na posição ${
          gameStrikes[gameStrikes.length - 1].position
        }! Acertou ${
          gameStrikes[gameStrikes.length - 1].hit ? "um barco!" : "a água!"
        }`,
        gameStrikes[gameStrikes.length - 1].hit ? "warning" : "info",
        true
      );
    }
  };

  buildStrikeValidations = () => {
    return [
      {
        description: "Check if strike is valid",
        validation: !this.checkStrikeIsValid(),
        action: () =>
          this.changeSnack("Esse ataque não é válido.", "error", true),
      },
      {
        description: "Check if strike made a goal",
        validation: this.checkIfStrikeHitShip(),
        action: () => this.strikeHitaShip(),
      },
      {
        description: "Check if strike missed a target",
        validation: this.checkStrikeIsValid()
          ? !this.checkIfStrikeHitShip()
          : false,
        action: () => this.strikeMissShip(),
      },
    ];
  };

  hitStrike = (a) => {
    const strikeValidations = this.buildStrikeValidations();
    strikeValidations.forEach((v) => {
      if (v.validation) {
        v.action();
      }
    });
    this.setState({ strikeField: "" });
  };

  strikeHitaShip = () => {
    this.changeSnack(`Você acertou um barco`, "warning", true);
    const strike = {
      gameId: this.state.game.id,
      playerId: this.state.player.id,
      position: this.state.strikeField,
      hit: true,
    };
    this.socket.emit("game.strike", strike);

    this.sendMessageToServer(
      `${this.state.player.name} acertou um barco na posição ${this.state.strikeField}`,
      "hit"
    );

    this.setState(
      {
        strikes: [...this.state.strikes, strike],
        strikesMade: [...this.state.strikesMade, strike],
        myTurn: false,
      },
      () => {
        if (
          this.checkIfShipWasDestroyed(
            this.state.strikesMade,
            this.state.rivalShips,
            {
              message: "Parabéns! Você destruiu um barco",
              status: "success",
            }
          )
        ) {
          this.sendMessageToServer(
            `${this.state.player.name} destruiu um barco.`,
            "destroy"
          );
        }
        this.checkIfIGameIsOver(this.state.strikesMade, this.state.rivalShips, {
          message: "Você venceu!!",
          status: "win",
        });
      }
    );
  };

  checkIfIGameIsOver = (gameStrikes, ships, message) => {
    const activeShips = ships.ships.filter((s) => !s.destroyed);
    if (message.status === "win") this.saveWinnerGame();
    if (!activeShips.length) {
      this.changeDialog(
        true,
        message.message,
        "Clique para voltar para a página principal.",
        "VOLTAR",
        message.status === "win" ? "dialogGreen" : "dialogRed"
      );
    }
  };

  saveWinnerGame = async () => {
    await ApiService.setWinner(
      this.state.game.id,
      this.state.player.id,
      getToken()
    );
  };

  checkIfShipWasDestroyed = (gameStrikes, ships, message) => {
    const activeShips = ships.ships.filter((s) => !s.destroyed);
    const sucessStrikes = gameStrikes
      .filter((g) => g.hit)
      .map((m) => m.position);

    for (let i = 0; i < activeShips.length; i++) {
      if (
        activeShips[i].position.filter(
          (item) => !sucessStrikes.some((item2) => item2 === item)
        ).length === 0
      ) {
        activeShips[i].destroyed = true;
      }
    }

    if (activeShips.filter((a) => a.destroyed).length) {
      this.changeSnack(message.message, message.status, true);
      return true;
    }
    return false;
  };

  strikeMissShip = () => {
    this.changeSnack("Você errou o alvo", "error", true);
    const strike = {
      gameId: this.state.game.id,
      playerId: this.state.player.id,
      position: this.state.strikeField,
      hit: false,
    };
    this.sendMessageToServer(
      `${this.state.player.name} acertou a água na posição ${this.state.strikeField}`,
      "missed"
    );
    this.socket.emit("game.strike", strike);

    this.setState({
      strikes: [...this.state.strikes, strike],
      strikesMade: [...this.state.strikesMade, strike],
      myTurn: false,
    });
  };

  checkIfStrikeHitShip = () => {
    const ships = this.state.rivalShips.ships.map((s) => {
      return { ...s, hit: s.position.includes(this.state.strikeField) };
    });
    const hitedShip = ships.filter((a) => a.hit);
    if (hitedShip.length) {
      return true;
    }
    return false;
  };

  checkStrikeIsValid = () => {
    var numbers = [];
    var letters = [];
    const strike = this.state.strikeField.split(" ");

    strike.forEach((s) => numbers.push(parseInt(s.replace(/[^0-9]/g, ""))));
    strike.forEach((s) => letters.push(s.replace(/[^A-Z]/g, "")));
    const numberExists = col.includes(parseInt(numbers.join("")));
    const letterExists = rol.includes(letters.join(""));

    if (numberExists && letterExists) {
      return true;
    }
    return false;
  };

  fillShips = () => {
    this.setState({
      myShips: this.state.game.players.filter(
        (s) => s.id === this.state.player.id
      )[0],
      rivalShips: this.state.game.players.filter(
        (s) => s.id !== this.state.player.id
      )[0],
    });
  };

  fillStrikeField = (event) => {
    const { value } = event.target;
    if (isNaN(value)) {
      this.setState({
        strikeField: value.toUpperCase(),
      });
    } else {
      this.setState({
        strikeField: value,
      });
    }
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

  closeDialog = () => {
    this.changeDialog(false, "", "", "");
  };

  changeDialog = (open, title, content, accept, style) => {
    this.setState({
      dialog: {
        open,
        title,
        content,
        accept,
        style,
      },
    });
  };

  backToHome = () => {
    this.props.history.push("/home");
  };

  render() {
    const {
      strikeField,
      myShips,
      snack,
      myTurn,
      strikesReceived,
      strikesMade,
      dialog,
      messages,
    } = this.state;
    return (
      <div className="grid">
        <Header />
        <Snack close={this.closeSnack} snack={snack} />
        <DialogBox dialog={dialog} success={this.backToHome} />
        <main className="gameContent">
          <section className="game">
            <div className="game__title">Meu Jogo</div>
            <MyTableBoard
              fillStrikeField={this.fillStrikeField}
              strikeField={strikeField}
              myShips={myShips}
              hitStrike={this.hitStrike}
              myTurn={myTurn}
              strikes={strikesReceived}
            />
          </section>
          <section className="game">
            <div className="game__title">Mensagens</div>
            <GameMessages messages={messages} />
          </section>
          <section className="game">
            <div className="game__title">Jogo do Adversário</div>
            <RivalTableBoard strikes={strikesMade} />
          </section>
        </main>
        <Footer />
      </div>
    );
  }
}
export default withRouter(Game);
