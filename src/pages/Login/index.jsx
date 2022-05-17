import "./index.css";

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userLogin } from "../../services/usersService";
import logo from "../../assets/logo.svg";
import { getItem, setItem } from "../../utils/storage";
import Input from "../../components/Input";
import Button from "../../components/Button";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!email || !password) {
        console.log("Preencha todos os campos!");
        return;
      }
      const response = await userLogin(email, password);
      const { token } = response.data;
      setItem("token", token);
      navigate("/home");
      setError("");
    } catch (error) {
      setError(error.response.data);
    }
  };

  useEffect(() => {
    const token = getItem("token");
    if (token) {
      navigate("/home");
    }
  }, []);

  return (
    <div className="page-login-container">
      <img src={logo} alt="" className="logo" />
      <div className="text-container">
        <h1>
          Controle suas <strong>finanças</strong>, sem planilha chata.
        </h1>
        <p>
          Organizar as suas finanças nunca foi tão fácil, com o DINDIN, você tem
          tudo num único lugar e em um clique de distância.
        </p>

        <Link to="/cadastre-se">Cadastre-se</Link>
      </div>
      <form action="" className="form-login" onSubmit={handleSubmit}>
        <div className="input-container">
          <h2>Login</h2>
          <Input
            label="E-mail"
            id="login-email"
            type="text"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            label="Password"
            id="login-password"
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="error-container">
          {error && <div className="error">{error}</div>}
        </div>

        <Button text="Entrar" />
      </form>
    </div>
  );
}

export default Login;
