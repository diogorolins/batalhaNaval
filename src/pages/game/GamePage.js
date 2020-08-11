import React from "react";
import { withRouter } from "react-router-dom";

import "./index.css";

import { mockGame } from "../../services/mockGame";
import { mockPlayer } from "../../services/mockPlayer";

import MyTableBoard from "../../components/game/myTableBoard/MyTableBoard";
import RivalTableBoard from "../../components/game/rivalTableBoard/RivalTableBoard";
import Header from "../../components/general/header/Header";
import Footer from "../../components/general/footer/Footer";

class Game extends React.Component {
  state = {
    games: [],
    strikeField: "",
    player: "",
    myShips: "",
  };
  async componentDidMount() {
    //this.setState({ game: this.props.location.state.game });
    await this.setState({ games: mockGame, player: mockPlayer });
    await this.fillShips();
  }

  fillShips = () => {
    this.setState({
      myShips: this.state.games.filter(
        (s) => s.player.id === this.state.player.id
      ),
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

  render() {
    const { strikeField, myShips } = this.state;
    return (
      <div className="grid">
        <Header />
        <main className="gameContent">
          <section className="game">
            <div className="game__title">Meu Jogo</div>
            <MyTableBoard
              fillStrikeField={this.fillStrikeField}
              strikeField={strikeField}
              myShips={myShips}
            />
          </section>
          <section className="game">
            <div className="game__title">Jogo do Adversário</div>
            <RivalTableBoard />
          </section>
        </main>
        <Footer />
      </div>
    );
  }
}
export default withRouter(Game);
