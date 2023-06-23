import "./leftbar.scss";
import Friends from "../../assets/1.png";

import Following from "../../assets/followers.png";
import Follower from "../../assets/people.png";
import Discover from "../../assets/discover.png";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import { Link } from "react-router-dom";

export const LeftBar = () => {
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="leftbar">
      <div className="container">
        <div className="menu">
          <Link
            to={`/profile/${currentUser.id}`}
            style={{
              textDecoration: "none",
              margin: "0px",
            }}
          >
            <div className="user">
              <img
                src={"/uploads/" + currentUser.profilePic}
                alt="profile pic"
              />
              <span>{currentUser.name}</span>
            </div>
          </Link>
          <Link
            to={`/followers`}
            style={{
              textDecoration: "none",
              margin: "0px",
            }}
          >
            <div className="item">
              <img src={Follower} alt="" />
              <span>Followers</span>
            </div>
          </Link>
          <Link
            to={`/followings`}
            style={{
              textDecoration: "none",
              margin: "0px",
            }}
          >
            <div className="item">
              <img src={Following} alt="" />
              <span>Followings</span>
            </div>
          </Link>
          <Link
            to={`/discoverPeople`}
            style={{
              textDecoration: "none",
              margin: "0px",
            }}
          >
            <div className="item">
              <img src={Discover} alt="" />
              <span>Discover People</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};
