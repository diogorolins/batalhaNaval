import React from "react";

import PeopleOutlineIcon from "@material-ui/icons/PeopleOutline";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Button from "@material-ui/core/Button";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import "./index.css";

const LoggedUsersArea = (props) => {
  const { loggedPlayers, invitesSent, sendInvite } = props;
  return (
    <div className="users">
      <div className="users__title">
        <PeopleOutlineIcon />
        <h1 className="users__title">Usuários conectados</h1>
      </div>
      <div className="users__list">
        {loggedPlayers.map((i) => (
          <Accordion key={i.id} className="users__list___item">
            <AccordionSummary
              expandIcon={i.status === "free" ? <ExpandMoreIcon /> : ""}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <AccountCircleIcon
                htmlColor={i.status === "free" ? "green" : "red"}
              />
              <h1>
                {i.name}
                {i.status !== "free" && " está jogando"}
              </h1>
            </AccordionSummary>
            {i.status === "free" && (
              <AccordionDetails>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={() => sendInvite(i.id)}
                  disabled={
                    invitesSent.filter(
                      (s) => s.to.id === i.id && s.status === "Pendente"
                    ).length
                      ? true
                      : false
                  }
                >
                  Convidar
                </Button>
              </AccordionDetails>
            )}
          </Accordion>
        ))}
      </div>
    </div>
  );
};

export default LoggedUsersArea;
