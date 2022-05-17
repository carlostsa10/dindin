import React, { useEffect, useState } from "react";
import "./styles.css";
import iconClose from "../../assets/iconClose.svg";
import Input from "../../components/Input";
import Button from "../../components/Button";
import {
  addTransactions,
  editTransaction,
} from "../../services/transactionsService";
import { userEdit } from "../../services/usersService";
import { format } from "date-fns";

function Modal(props) {
  const [error, setError] = useState("");
  const categories = props.categories;
  const [form, setForm] = useState({
    tipo: "saida",
    descricao: "",
    valor: "",
    data: "",
    categoria_id: "",
  });
  const [formUser, setformUser] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
  });

  const [entrada, setEntrada] = useState(false);
  const [saida, setSaida] = useState(true);

  const handleDropdownChange = (e) => {
    const option = categories.find(
      (category) => category.descricao === e.target.value
    );

    setForm({
      ...form,
      ["categoria_id"]: option.id,
    });
  };

  const findCategory = (id) => {
    const category = categories.find((category) => category.id === id);
    return category.descricao;
  };

  const handleClick = (e) => {
    e.preventDefault();
    e.target.value === "saida" ? setSaida(!saida) : setEntrada(!entrada);
    e.target.value === "entrada" ? setSaida(!saida) : setEntrada(!entrada);
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUserChange = (e) => {
    setformUser({ ...formUser, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const newValue = form.valor.includes(".")
        ? form.valor.replace(".", "")
        : form.valor * 100;
      const callback =
        props.text === "Adicionar Registro"
          ? addTransactions(
              form.tipo,
              form.descricao === "" ? "-" : form.descricao,
              newValue,
              format(new Date(form.data), "yyyy-MM-dd"),
              form.categoria_id
            )
          : editTransaction(
              props.transactionID,
              form.tipo,
              form.descricao === "" ? "-" : form.descricao,
              newValue,
              form.data,
              form.categoria_id
            );
      const response = await callback;
      setForm({
        tipo: "saida",
        descricao: "",
        valor: "",
        data: "",
        categoria_id: "",
      });
      props.onClickExit();
      props.reloadTransactions();
      setError("");
    } catch (error) {
      setError(error.response.data);
    }
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    if (!formUser.senha || !formUser.confirmarSenha) {
      setError("Preencha todos os campos");
      return;
    }
    if (formUser.senha !== formUser.confirmarSenha) {
      return console.log("Senhas não conferem!");
    }

    try {
      const response = await userEdit(
        formUser.nome,
        formUser.email,
        formUser.senha
      );
      console.log(response);
      setformUser({
        nome: "",
        email: "",
        senha: "",
        confirmarSenha: "",
      });
      props.onClickExit();
      props.realoadUser();
      setError("");
    } catch (error) {
      setError(error.response.data.mensagem);
    }
  };

  useEffect(() => {
    if (props.text === "Editar Perfil") {
      setformUser({
        nome: props.user.nome,
        email: props.user.email,
        senha: "",
        confirmarSenha: "",
      });
    }
    if (props.transaction) {
      if (props.transaction.tipo === "entrada") {
        setEntrada(!entrada);
        setSaida(!saida);
      }

      setForm({
        tipo: props.transaction.tipo,
        descricao: props.transaction.descricao,
        valor: (props.transaction.valor / 100).toFixed(2),
        data: format(new Date(props.transaction.data), "dd/MM/yyyy"),
        categoria_id: props.transaction.categoria_id,
      });
    }
  }, []);

  return (
    <div className="modal ">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{props.text}</h2>
          <img
            src={iconClose}
            alt=""
            onClick={() => {
              props.onClick();
              setError("");
            }}
          />
        </div>
        {props.text !== "Editar Perfil" ? (
          <div className="modal-body">
            <div className="modal-header-buttons">
              <Button
                name="tipo"
                text="Entrada"
                id="in-btn"
                value="entrada"
                onClick={handleClick}
                backgroundColor={entrada ? "#3a9ff1" : "#b9b9b9"}
              />
              <Button
                name="tipo"
                text="Saída"
                id="out-btn"
                value="saida"
                onClick={handleClick}
                backgroundColor={saida ? "#FF576B" : "#b9b9b9"}
              />
            </div>

            <form onSubmit={handleSubmit}>
              <Input
                label="Valor"
                id="modal-valor"
                type="number"
                name="valor"
                value={form.valor}
                onChange={handleChange}
              />
              <div className="">
                <label htmlFor="dropdown">Categorias</label>
                <select id="dropdown" onChange={handleDropdownChange}>
                  <option defaultValue>
                    {props.transaction &&
                      findCategory(props.transaction.categoria_id)}
                  </option>
                  {categories.map((category) => (
                    <option key={category.id}>{category.descricao}</option>
                  ))}
                </select>
              </div>

              <Input
                label="Data"
                id="modal-data"
                type="text"
                name="data"
                value={form.data}
                onChange={handleChange}
                onFocus={(e) => (e.target.type = "date")}
              />
              <Input
                label="Descrição"
                id="modal-descricao"
                type="text"
                name="descricao"
                value={form.descricao}
                onChange={handleChange}
              />
              <div className="error-container">
                {error && <div className="error">{error}</div>}
              </div>
              <Button text="Confirmar" id="confirmar" />
            </form>
          </div>
        ) : (
          <div className="modal-body">
            <form onSubmit={handleUserSubmit} className="hight-100">
              <div className="modal-inputs-user">
                <Input
                  label="Nome"
                  id="modal-nome"
                  type="text"
                  name="nome"
                  value={formUser.nome}
                  onChange={handleUserChange}
                />
                <Input
                  label="E-mail"
                  id="modal-email"
                  type="email"
                  name="email"
                  value={formUser.email}
                  onChange={handleUserChange}
                />
                <Input
                  label="Senha"
                  id="modal-senha"
                  type="password"
                  name="senha"
                  value={formUser.senha}
                  onChange={handleUserChange}
                />
                <Input
                  label="Confirmação de senha"
                  id="modal-confirmacao-de-senha"
                  type="password"
                  name="confirmarSenha"
                  value={formUser.confirmarSenha}
                  onChange={handleUserChange}
                />
              </div>
              <div className="error-container">
                {error && <div className="error">{error}</div>}
              </div>
              <Button text="Confirmar" id="confirmar" />
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default Modal;
