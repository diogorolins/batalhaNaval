import React from "react";

import CircularProgress from "@material-ui/core/CircularProgress";
import DraftsTwoToneIcon from "@material-ui/icons/DraftsTwoTone";
import MailTwoToneIcon from "@material-ui/icons/MailTwoTone";
import Divider from "@material-ui/core/Divider";

import "./index.css";

const SentInvitesArea = (props) => {
  const { invitesSent } = props;

  return (
    <div className="invites">
      <div className="invites__title">
        <MailTwoToneIcon />
        <h1 className="invites__title">Histórico de Convites</h1>
      </div>

      {invitesSent.map((i, index) => (
        <React.Fragment key={index}>
          <div className="invites__list">
            <div>
              <DraftsTwoToneIcon color="primary" />
            </div>
            <div className="invites__list___to">{i.to.name}</div>
            {i.status === "pending" ? (
              <div className="invites__list___loader">
                <h1>Pendente</h1> <CircularProgress size={20} />
              </div>
            ) : (
              <div className="invites__list___deny">
                <h1>Negado</h1>
              </div>
            )}
          </div>
          <div className="invites__list___divider">
            <Divider />
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

export default SentInvitesArea;
