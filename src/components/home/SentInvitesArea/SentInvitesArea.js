import React from "react";

import CircularProgress from "@material-ui/core/CircularProgress";
import DraftsTwoToneIcon from "@material-ui/icons/DraftsTwoTone";
import MailTwoToneIcon from "@material-ui/icons/MailTwoTone";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";

import "./index.css";

const SentInvitesArea = (props) => {
  const { invitesSent, clearSentInvites } = props;

  return (
    <div className="invites">
      <div className="invites__title">
        <MailTwoToneIcon />
        <h1 className="invites__title">Histórico de Convites</h1>
      </div>
      <Button fullWidth onClick={clearSentInvites}>
        Limpar Histórico
      </Button>

      {invitesSent.map((i, index) => (
        <React.Fragment key={index}>
          <div className="invites__list">
            <div>
              <DraftsTwoToneIcon color="primary" />
            </div>
            <div className="invites__list___to">{i.to.name}</div>
            {i.status === "Pendente" ? (
              <div className="invites__list___loader">
                <h1>{i.status}</h1> <CircularProgress size={20} />
              </div>
            ) : (
              <div
                className={
                  i.status === "Negado"
                    ? "invites__list___deny"
                    : "invites__list___accept"
                }
              >
                <h1>{i.status}</h1>
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
