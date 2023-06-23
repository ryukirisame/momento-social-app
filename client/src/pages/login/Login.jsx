import { Link, useNavigate } from "react-router-dom";
import "./login.scss";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";

export const Login = () => {
  const { login } = useContext(AuthContext);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState(null);

  const navigate = useNavigate();

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const loginData = {
      username,
      password,
    };

    try {
      await login(loginData);
      navigate("/");
    } catch (e) {
      setErr(e.response.data);
      console.log(e);
    }
  };

  // console.log(err);

  return (
    <div className="login">
      <div className="card">
        <div className="top">
          <h1>Login</h1>
          <form>
            <input
              type="text"
              placeholder="Username"
              onChange={handleUsernameChange}
              value={username}
            />
            <input
              type="password"
              placeholder="Password"
              onChange={handlePasswordChange}
              value={password}
            />
            {err && err}
            <button onClick={handleLogin}>Login</button>
          </form>
        </div>

        <div className="bottom">
          <span>Don't have an account?</span>

          <Link to="/register">
            <button>Register</button>
          </Link>
        </div>
      </div>
    </div>
  );
};
