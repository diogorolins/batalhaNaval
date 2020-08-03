import React from "react";
import { withRouter } from "react-router-dom";

class GameConfig extends React.Component {
  state = {
    invite: "",
  };
  componentDidMount() {
    this.setState({ invite: this.props.location.state.invite });
  }

  render() {
    const { invite } = this.state;
    return <h1>{invite.id}</h1>;
  }
}

export default withRouter(GameConfig);
