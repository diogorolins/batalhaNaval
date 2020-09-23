import React from "react";
import { withRouter } from "react-router-dom";
import io from "socket.io-client";

import "./index.css";

import { getUser, getToken } from "../../services/AuthService";
import ApiService from "../../services/ApiService";
import { checkShipIsComplete } from "../../services/ShipUtilService";
import Snack from "../../services/SnackService";
import BackDropBox from "../../services/BackDropService";
import { sockedURL } from "../../services/SocketService";

import Header from "../../components/general/header/Header";
import Footer from "../../components/general/footer/Footer";
import TableBoardConfig from "../../components/gameConfig/TableBoardConfig/TableBoardConfig";
import ListOfShips from "../../components/gameConfig/ListOfShips/ListOfShips";

class GameConfig extends React.Component {
  state = {
    player: {
      id: "",
      name: "",
      email: "",
      status: "free",
    },
    invite: "",
    ships: [],
    shipSelected: "",
    cellsDone: [],
    ship: "",
    selectedCells: [],
    selectedShips: [],
    gameReadyToStart: false,
    snack: {
      open: false,
      severity: "error",
      message: "",
    },
    backDrop: {
      open: false,
    },
  };
  socket = "";

  componentDidMount() {
    this.socket = io(`${sockedURL}/gameConfig`);
    this.setState({
      invite: this.props.location.state.invite,
      //invite: mockInvite,
    });
    this.getShips();
    this.getPlayer();
    this.checkSocket();
  }

  componentWillUnmount() {
    this.socket.disconnect();
  }

  checkSocket = () => {
    this.socket.on("game.canStart", (games) => {
      this.checkIfGameCanStart(games);
    });
  };

  checkIfGameCanStart = (games) => {
    const correctGames = games.filter((g) => g.id === this.state.invite.id);

    if (correctGames.length > 0) {
      this.goToGamePage(correctGames);
    }
  };

  goToGamePage = (games) => {
    this.props.history.push({
      pathname: "/game",
      state: { game: games[0].id, player: this.state.player },
    });
  };

  startGame = () => {
    this.insertGame();
    this.setState({ backDrop: { open: true } });
  };

  insertGame = async () => {
    let game = {
      id: this.state.invite.id,
      player: {
        id: this.state.player.id,
        ships: this.state.selectedShips,
      },
    };
    await ApiService.createGame(game, getToken());
    this.socket.emit("create.game", game);
  };

  getPlayer = async () => {
    const playerEmail = getUser();

    try {
      const response = await ApiService.getPlayer(playerEmail, getToken());
      this.setState({
        player: {
          id: response.data.id,
          name: response.data.name,
          email: response.data.email,
          status: "free",
        },
      });
    } catch (err) {
      console.log(err);
    }
  };

  getShips = async () => {
    const response = await ApiService.getShips(getToken());
    this.setState({
      ships: response.data,
      shipSelected: String(response.data[0].id),
      ship: response.data[0],
    });
  };

  handleChangeShip = (event) => {
    this.setState({
      shipSelected: event.target.value,
      ship: this.state.ships.filter(
        (s) => String(s.id) === event.target.value
      )[0],
    });
  };

  goToNextShip = () => {
    if (checkShipIsComplete(this.state.selectedCells, this.state.ship)) {
      if (!this.verifyNextFreeShip(this.state.ship)) {
        this.setState({
          cellsDone: this.allSelectedCells(),
          selectedShips: [
            ...this.state.selectedShips,
            this.shipWithPositions(),
          ],
          gameReadyToStart: true,
        });
        return;
      }

      this.setState({
        cellsDone: this.allSelectedCells(),
        selectedShips: [...this.state.selectedShips, this.shipWithPositions()],
        selectedCells: [],
        shipSelected: String(this.verifyNextFreeShip(this.state.ship).id),
        ship: this.verifyNextFreeShip(this.state.ship),
      });
    } else {
      this.changeSnack("Formato de barco inválido.", "error", true);
    }
  };

  shipWithPositions = () => {
    let shipCells = this.state.ship;
    shipCells.position = this.state.selectedCells;
    shipCells.destroyed = false;
    return shipCells;
  };

  allSelectedCells = () => {
    let selectedCells = [];
    selectedCells = selectedCells.concat(
      this.state.cellsDone,
      this.state.selectedCells
    );
    return selectedCells;
  };

  verifyNextFreeShip = (actualShip) => {
    const allShipsSelected = [...this.state.selectedShips, actualShip];

    const leftShips = this.state.ships.filter(
      (item) => !allShipsSelected.some((item2) => item2.id === item.id)
    );
    if (leftShips) return leftShips[0];
  };

  selectCell = (cell) => {
    if (
      !this.state.selectedCells.includes(cell) &&
      !this.state.cellsDone.includes(cell) &&
      !this.state.gameReadyToStart
    ) {
      this.setState({ selectedCells: [...this.state.selectedCells, cell] });
    } else {
      this.setState({
        selectedCells: this.state.selectedCells.filter((c) => c !== cell),
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
      ships,
      ship,
      shipSelected,
      selectedCells,
      cellsDone,
      selectedShips,
      gameReadyToStart,
      snack,
      backDrop,
    } = this.state;

    return (
      <>
        <BackDropBox open={backDrop.open} />
        <div className="grid">
          <Header />
          <Snack close={this.closeSnack} snack={snack} />
          <main className="content">
            <section className="configGame">
              <ListOfShips
                ships={ships}
                handleChangeShip={this.handleChangeShip}
                shipSelected={shipSelected}
                ship={ship}
                selectedShips={selectedShips}
              />
              <TableBoardConfig
                selectCell={this.selectCell}
                selectedCells={selectedCells}
                goToNextShip={this.goToNextShip}
                cellsDone={cellsDone}
                gameReadyToStart={gameReadyToStart}
                startGame={this.startGame}
              />
            </section>
          </main>
          <Footer />
        </div>
      </>
    );
  }
}

export default withRouter(GameConfig);
