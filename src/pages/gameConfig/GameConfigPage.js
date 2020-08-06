import React from "react";
import { withRouter } from "react-router-dom";

import "./index.css";

import ApiService from "../../services/ApiService";
import { getToken } from "../../services/AuthService";
import { checkShipIsComplete } from "../../services/ShipUtilService";
import { mockInvite } from "../../services/mockInvite";
import Snack from "../../services/SnackService";

import Header from "../../components/general/header/Header";
import Footer from "../../components/general/footer/Footer";
import TableBoardConfig from "../../components/gameConfig/TableBoardConfig/TableBoardConfig";
import ListOfShips from "../../components/gameConfig/ListOfShips/ListOfShips";

class GameConfig extends React.Component {
  state = {
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
  };

  async componentDidMount() {
    this.setState({
      //invite: this.props.location.state.invite,
      invite: mockInvite,
    });
    await this.getShips();
  }

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
    if (!this.verifyNextFreeShip(this.state.ship)) {
      this.setState({
        cellsDone: this.allSelectedCells(),
        selectedShips: [...this.state.selectedShips, this.state.ship],
        gameReadyToStart: true,
      });
      return;
    }
    if (checkShipIsComplete(this.state.selectedCells, this.state.ship)) {
      this.setState({
        cellsDone: this.allSelectedCells(),
        selectedShips: [...this.state.selectedShips, this.state.ship],
        selectedCells: [],
        shipSelected: String(this.verifyNextFreeShip(this.state.ship).id),
        ship: this.verifyNextFreeShip(this.state.ship),
      });
    } else {
      this.changeSnack("Formato de navio inválido.", "error", true);
    }
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
    } = this.state;

    return (
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
            />
          </section>
        </main>
        <Footer />
      </div>
    );
  }
}

export default withRouter(GameConfig);
