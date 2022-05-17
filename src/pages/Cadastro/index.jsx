import "./index.css";

import React, { useState } from "react";
import { userCadastro } from "../../services/usersService";
import { Link } from "react-router-dom";

function Cadastro() {
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
      return console.log(response);
    } catch (err) {
      setError(err.response.data.mensagem);
      console.log(error);
    }
  };

  return (
    <div>
      <form action="" className="form-login" onSubmit={handleSubmit}>
        <h1>Cadastro</h1>
        <label htmlFor="name">Nome</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, [e.target.name]: e.target.value })
          }
        />
        <label htmlFor="email">E-mail</label>
        <input
          type="text"
          name="email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, [e.target.name]: e.target.value })
          }
        />
        <label htmlFor="password">Senha</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, [e.target.name]: e.target.value })
          }
        />
        <label htmlFor="confirmPassword">Confirmação de senha </label>
        <input
          type="password"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={(e) =>
            setForm({ ...form, [e.target.name]: e.target.value })
          }
        />

        <button>Cadastrar</button>
      </form>
    </div>
  );
}

export default Cadastro;
