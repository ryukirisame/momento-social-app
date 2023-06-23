import "./register.scss";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [err, setErr] = useState(null);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleRegisterClick = async (e) => {
    e.preventDefault();
    const registrationData = {
      username,
      name,
      email,
      password,
    };

    // console.log(registrationData);
    try {
      await axios.post(
        "http://localhost:8800/api/auth/register",
        registrationData
      );
      navigate("/login");
    } catch (err) {
      setErr(err.response.data);
    }
  };

  console.log(err);

  return (
    <div className="register">
      <div className="card">
        <div className="top">
          <h1>Register</h1>
          <form>
            <input
              type="text"
              placeholder="Username"
              onChange={handleUsernameChange}
              value={username}
            />
            <input
              type="text"
              placeholder="Name"
              onChange={handleNameChange}
              value={name}
            />
            <input
              type="text"
              placeholder="Email"
              onChange={handleEmailChange}
              value={email}
            />
            <input
              type="password"
              placeholder="Password"
              onChange={handlePasswordChange}
              value={password}
            />
            {/* <input type="password" placeholder="Confirm password" /> */}
            {err && err}
            <button onClick={handleRegisterClick}>Register</button>
          </form>
        </div>

        <div className="bottom">
          <span>Already have an account?</span>

          <Link to="/login">
            <button>Login</button>
          </Link>
        </div>
      </div>
    </div>
  );
};
