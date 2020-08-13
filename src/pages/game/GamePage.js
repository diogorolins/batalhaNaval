import React from "react";
import { withRouter } from "react-router-dom";
import io from "socket.io-client";

import "./index.css";

import { table } from "../../services/TableGameServices";
import Snack from "../../services/SnackService";
import { sockedURL } from "../../services/SocketService";

import MyTableBoard from "../../components/game/myTableBoard/MyTableBoard";
import RivalTableBoard from "../../components/game/rivalTableBoard/RivalTableBoard";
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
  };
  socket = "";

  componentDidMount() {
    this.socket = io(`${sockedURL}/game`);
    const game = this.createGame(this.props.location.state.game);
    this.setState(
      {
        game,
        player: this.props.location.state.player,
      },
      () => {
        this.checkIfisMyTurn();
        this.fillShips();
        this.checkSocket();
      }
    );
  }

  checkSocket = () => {
    this.socket.on("game.strike", (strikes) => {
      this.receiveStrikes(strikes);
    });
  };

  checkIfisMyTurn = () => {
    if (this.state.player.id === this.state.game.players[1].id) {
      this.setState({ myTurn: false });
    } else {
      this.setState({ myTurn: true });
    }
  };

  receiveStrikes = (strikes) => {
    const gameStrikes = strikes.filter((s) => s.gameId === this.state.game.id);
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

  createGame = (games) => {
    const objectGame = {
      id: games[0].id,
      players: [
        {
          id: games[0].player.id,
          ships: games[0].player.ships,
        },
        {
          id: games[1].player.id,
          ships: games[1].player.ships,
        },
      ],
    };
    return objectGame;
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
    this.changeSnack(`Você acertou um barco`, "success", true);
    const strike = {
      gameId: this.state.game.id,
      playerId: this.state.player.id,
      position: this.state.strikeField,
      hit: true,
    };
    this.socket.emit("game.strike", strike);
    this.setState({
      strikes: [...this.state.strikes, strike],
      strikesMade: [...this.state.strikesMade, strike],
      myTurn: false,
    });
  };

  strikeMissShip = () => {
    this.changeSnack("Você errou o alvo", "error", true);
    const strike = {
      gameId: this.state.game.id,
      playerId: this.state.player.id,
      position: this.state.strikeField,
      hit: false,
    };

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

  render() {
    const {
      strikeField,
      myShips,
      snack,
      myTurn,
      strikesReceived,
      strikesMade,
    } = this.state;
    return (
      <div className="grid">
        <Header />
        <Snack close={this.closeSnack} snack={snack} />
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
