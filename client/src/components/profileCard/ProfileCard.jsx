import React from "react";
import "./profileCard.scss";
import { Link } from "react-router-dom";

export const ProfileCard = ({ profile }) => {
  return (
    <div className="profileCard">
      <Link
        to={`/profile/${profile.id}`}
        style={{
          textDecoration: "none",
          margin: "0px",
        }}
      >
        <div className="user">
          <img src={"/uploads/" + profile.profilePic} alt="profile pic" />
          <span>{profile.name}</span>
        </div>
      </Link>
    </div>
  );
};
