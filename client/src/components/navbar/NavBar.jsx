import "./navbar.scss";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { DarkModeContext } from "../../context/darkModeContext";
import { AuthContext } from "../../context/authContext";
import { makeRequest } from "../../axios";
import LogoutIcon from "@mui/icons-material/Logout";

export const NavBar = () => {
  const { toggleDarkMode, darkMode } = useContext(DarkModeContext);

  const { currentUser, setCurrentUser } = useContext(AuthContext);

  const [searchFriends, setSearchFriends] = useState("");
  const navigate = useNavigate();

  const handleSearchFriends = (e) => {
    e.preventDefault();
    console.log(searchFriends);
    searchFriends.trim();
    if (searchFriends.length !== 0) navigate("/findFriends/" + searchFriends);
    setSearchFriends("");
  };

  const handleLogout = async (e) => {
    try {
      await makeRequest.post("/auth/logout").then((res) => {
        console.log(res);
        setCurrentUser(null);
        return res.data;
      });
    } catch (err) {}
  };

  return (
    <div className="navbar">
      <div className="left">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="logo">Momento</span>
        </Link>

        {darkMode ? (
          <WbSunnyOutlinedIcon
            onClick={toggleDarkMode}
            className="nav-bar-icon"
          />
        ) : (
          <DarkModeOutlinedIcon
            onClick={toggleDarkMode}
            className="nav-bar-icon"
          />
        )}

        <div className="search">
          <form onSubmit={handleSearchFriends}>
            <input
              type="text"
              placeholder="Search"
              value={searchFriends}
              onChange={(e) => setSearchFriends(e.target.value)}
            />

            <button type="submit">
              <SearchOutlinedIcon />
            </button>
          </form>
        </div>
      </div>

      <div className="right">
        <div className="logout" onClick={handleLogout}>
          <LogoutIcon />
          <span onClick={handleLogout}>Logout</span>
        </div>
      </div>
    </div>
  );
};
