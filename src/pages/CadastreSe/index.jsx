import "./styles.css";

import React, { useEffect, useState } from "react";
import { userCadastro } from "../../services/usersService";
import logo from "../../assets/logo.svg";
import Button from "../../components/Button";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/Input";
import { getItem } from "../../utils/storage";

//Ajeitar o CSS DOS INPUTS ( QUNADO DIGITA o CONTAINER ALARGA um pouco)

function CadastreSe() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (
        !form.email ||
        !form.name ||
        !form.password ||
        !form.confirmPassword
      ) {
        console.log("Preencha todos os campos!");
        return;
      }
      if (form.password !== form.confirmPassword) {
        return console.log("Senhas diferentes!");
      }

      const response = await userCadastro(form);
      navigate("/login");
      return;
    } catch (err) {
      setError(err.response.data.mensagem);
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const token = getItem("token");
    if (token) {
      navigate("/home");
    }
  }, []);

  return (
    <div className="container-background-picture">
      <img src={logo} alt="" className="logo" />
      <main className="form-container">
        <form action="" className="form-cadastre-se" onSubmit={handleSubmit}>
          <h1>Cadastre-se</h1>
          <Input
            label="Nome"
            id="input-name"
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
          />
          <Input
            label="E-mail"
            id="input-email"
            type="text"
            name="email"
            value={form.email}
            onChange={handleChange}
          />
          <Input
            label="Senha"
            id="input-senha"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
          />
          <Input
            label="Confirmação de senha"
            id="input-confirmar-senha"
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
          />
          <Button text="Cadastrar" />
          <Link to="/login">Já tem cadastro? Clique aqui!</Link>
        </form>
      </main>
    </div>
  );
}

export default CadastreSe;
