import React from "react";

import HighlightOffOutlinedIcon from "@material-ui/icons/HighlightOffOutlined";
import CheckCircleOutlineOutlinedIcon from "@material-ui/icons/CheckCircleOutlineOutlined";
import DraftsTwoToneIcon from "@material-ui/icons/DraftsTwoTone";
import MailTwoToneIcon from "@material-ui/icons/MailTwoTone";
import Link from "@material-ui/core/Link";

import "./index.css";

const ReceivedInvitesArea = (props) => {
  const { invitesReceived } = props;

  return (
    <div className="invites">
      <div className="invites__title">
        <MailTwoToneIcon />
        <h1 className="invites__title">Convites Recebidos</h1>
      </div>

      {invitesReceived.map((i) => (
        <div key={i} className="invites__list">
          <div>
            <DraftsTwoToneIcon color="primary" />
          </div>
          <div className="invites__list___txt">{i.from.name}</div>
          <div className="invites__list___icons">
            <Link href="#">
              <CheckCircleOutlineOutlinedIcon htmlColor="green" />
            </Link>
          </div>
          <div className="invites__list___icons">
            <Link href="#">
              <HighlightOffOutlinedIcon color="error" />
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReceivedInvitesArea;
