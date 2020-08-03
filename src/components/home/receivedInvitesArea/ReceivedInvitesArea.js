import React from "react";

import HighlightOffOutlinedIcon from "@material-ui/icons/HighlightOffOutlined";
import CheckCircleOutlineOutlinedIcon from "@material-ui/icons/CheckCircleOutlineOutlined";
import DraftsTwoToneIcon from "@material-ui/icons/DraftsTwoTone";
import MailTwoToneIcon from "@material-ui/icons/MailTwoTone";
import Link from "@material-ui/core/Link";

import "./index.css";

const ReceivedInvitesArea = (props) => {
  const { invitesReceived, denyInvite, acceptInvite } = props;

  return (
    <div className="invites">
      <div className="invites__title">
        <MailTwoToneIcon />
        <h1 className="invites__title">Convites Recebidos</h1>
      </div>

      {invitesReceived.map((i, index) => (
        <div key={index} className="invites__list">
          <div>
            <DraftsTwoToneIcon color="primary" />
          </div>
          <div className="invites__list___from">{i.from.name}</div>
          <div className="invites__list___icons">
            <Link href="#" onClick={() => acceptInvite(i)}>
              <CheckCircleOutlineOutlinedIcon htmlColor="green" />
            </Link>
          </div>
          <div className="invites__list___icons">
            <Link href="#" onClick={() => denyInvite(i)}>
              <HighlightOffOutlinedIcon color="error" />
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReceivedInvitesArea;
