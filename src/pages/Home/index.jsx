import "./styles.css";

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.svg";
import iconPlus from "../../assets/iconPlus.svg";
import {
  deleteTransaction,
  getExtrato,
  getTransactions,
} from "../../services/transactionsService";
import { getUser } from "../../services/usersService";
import iconProfileAvatar from "../../assets/iconProfileAvatar.svg";
import iconLogOff from "../../assets/iconLogOff.svg";
import iconeFiltro from "../../assets/iconeFiltro.svg";
import Button from "../../components/Button";
import iconDataSeta from "../../assets/iconDataSeta.svg";
import iconDataSetaBaixo from "../../assets/iconDataSetaBaixo.svg";
import Transactions from "../../components/Transactions";
import { clearAll } from "../../utils/storage";
import { getCategories } from "../../services/categoriesService";
import Modal from "../../components/Modal";
import { format } from "date-fns";
import { pt } from "date-fns/locale";

function Home() {
  const navigate = useNavigate();
  const [transactionsArray, setTransactionArray] = useState([]);
  const [categories, setCategories] = useState([]);
  const [valueIn, setValueIn] = useState(0);
  const [valueOut, setValueOut] = useState(0);
  const [edit, setEdit] = useState(false);
  const [addTransaction, setAddTransaction] = useState(false);
  const [user, setUser] = useState({});
  const [editUser, setEditUser] = useState(false);
  const [transaction, setTransaction] = useState({});
  const [filter, setFilter] = useState(false);
  const [sorted, setSorted] = useState(false);
  const [clear, setClear] = useState(false);
  const [firstLogin, setFirstLogin] = useState(true);
  const [filterCategories, setFilterCategories] = useState([]);
  async function loadCategories() {
    try {
      const response = await getCategories();
      return setCategories(response.data);
    } catch (error) {
      console.log(error);
    }
  }
  async function loadTransactions() {
    try {
      const response = await getTransactions();
      return setTransactionArray(response.data);
    } catch (error) {
      console.log(error);
    }
  }
  async function getBalance() {
    const response = await getExtrato();
    const { data } = response;
    const entrada = data.filter(
      (transaction) => transaction.tipo === "entrada"
    );
    const saida = data.filter((transaction) => transaction.tipo === "saida");
    const newEntry = entrada[0] ? Number(entrada[0].total) : 0;
    const newOut = saida[0] ? Number(saida[0].total) : 0;
    setValueIn((newEntry / 100).toFixed(2));
    setValueOut((newOut / 100).toFixed(2));
    return;
  }

  if (firstLogin) {
    setFirstLogin(!firstLogin);
    loadCategories();
    loadTransactions();
    getBalance();
  }
  const handleLogOff = () => {
    clearAll();
    navigate("/login");
  };

  const currentUser = async () => {
    try {
      const response = await getUser();

      return setUser(response.data[0]);
    } catch (error) {
      console.log(error);
    }
  };
  const total = (valueIn, valueOut) => {
    const newValue = valueIn - valueOut;
    return newValue;
  };
  const handleSpanClick = (e) => {
    const span = e.target;
    span.children[0].classList.toggle("rotate-x");
    span.classList.toggle("active");
    span.classList.contains("desactive") && span.classList.remove("desactive");
  };

  const handlefilterIcon = () => {
    setFilter(!filter);
  };
  const handlefilter = async (...args) => {
    let localTransaction = await getTransactions();
    const localArray = [...localTransaction.data];
    const newArray = [...args];
    if (newArray.length > 0) {
      let filteredArray = [];
      const otherArray = newArray.forEach((item) => {
        filteredArray = [
          ...filteredArray,
          ...localArray.filter((transaction) => {
            return transaction.categoria_id === item;
          }),
        ];
      });
      return setTransactionArray(filteredArray);
    } else {
      return loadTransactions();
    }
  };

  const dayInPt = (date) => {
    const day = format(new Date(date), "EEEE", {
      locale: pt,
    });
    const firstLetterUpperCase = day.charAt(0).toUpperCase();
    const newDay = firstLetterUpperCase + day.slice(1);
    return newDay;
  };

  const handleDataClick = () => {
    const localArray = [...transactionsArray];
    const sortedDates = localArray.sort((a, b) =>
      sorted
        ? new Date(b.data) - new Date(a.data)
        : new Date(a.data) - new Date(b.data)
    );
    return setTransactionArray(sortedDates);
  };
  const handleFilterCategories = (category) => {
    let localArray = [...filterCategories];
    const index = localArray.indexOf(category);
    localArray.splice(index, 1);
    return setFilterCategories(localArray);
  };

  useEffect(() => {
    loadCategories();
    loadTransactions();
    currentUser();
    getBalance();
    return;
  }, []);

  useEffect(() => {
    getBalance();
    setSorted(!sorted);
  }, [transactionsArray]);

  return (
    <>
      <div className="container-home">
        <header>
          <img src={logo} alt="" className="logo" />
          <div className="user-container">
            <img
              src={iconProfileAvatar}
              alt=""
              onClick={() => setEditUser(!editUser)}
            />

            <h2>{user.nome}</h2>
            <img src={iconLogOff} alt="" onClick={handleLogOff} />
          </div>
        </header>

        <main className="main-content">
          <section className="">
            <section className="filter">
              <Button
                text="Filtrar"
                img={iconeFiltro}
                onClick={handlefilterIcon}
              />
            </section>

            <div className="transaction">
              <div className="transaction-content">
                {filter && (
                  <div className="filter-categories">
                    <h3 className="category-h3">Categoria</h3>

                    <div className="categories">
                      {categories.map((category) => (
                        <span
                          key={category.id}
                          className={`${clear ? "desactive" : ""} `}
                          onClick={(e) => {
                            handleSpanClick(e);
                            e.target.classList.contains("active")
                              ? setFilterCategories([
                                  ...filterCategories,
                                  category.id,
                                ])
                              : handleFilterCategories(category.id);
                          }}
                          value={category.id}
                        >
                          {category.descricao}
                          <img
                            src={iconPlus}
                            alt=""
                            className={`${clear ? "" : null}`}
                          />
                        </span>
                      ))}
                    </div>
                    <div className="filter-buttons">
                      <Button
                        text="Limpar Filtros"
                        className="desactive"
                        onClick={() => {
                          setClear(!clear);
                          handlefilter();
                          setFilterCategories([]);
                        }}
                      />
                      <Button
                        text="Aplicar Filtros"
                        className="active"
                        onClick={() => {
                          handlefilter(...filterCategories);
                        }}
                      />
                    </div>
                  </div>
                )}
                <div>
                  <table>
                    <thead>
                      <tr className="transaction-header">
                        <th className="width-171px">
                          <h3
                            onClick={handleDataClick}
                            className="posotion-relative cursor-pointer"
                          >
                            Data
                            <img
                              src={!sorted ? iconDataSeta : iconDataSetaBaixo}
                              alt=""
                              className="position-absolute"
                            />
                          </h3>
                        </th>
                        <th className="width-216px">
                          <h3>Dia da semana</h3>
                        </th>
                        <th className="width-159px">
                          <h3>Descrição</h3>
                        </th>
                        <th className="width-158px">
                          <h3>Categoria</h3>
                        </th>
                        <th className="width-153px">
                          <h3>Valor</h3>
                        </th>
                        <th className="width-35px"></th>
                        <th className="width-70px"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactionsArray.map((transaction) => (
                        <Transactions
                          key={transaction.id}
                          id={transaction.id}
                          date={format(
                            new Date(transaction.data),
                            "dd/MM/yyyy"
                          )}
                          day={dayInPt(transaction.data)}
                          description={
                            transaction.descricao ? transaction.descricao : "-"
                          }
                          category={categories.find(
                            (category) =>
                              category.id === transaction.categoria_id
                          )}
                          moneyIn={
                            transaction.tipo === "entrada" ? true : false
                          }
                          value={transaction.valor}
                          onClick={() => {
                            setTransaction(transaction);
                            setEdit(!edit);
                          }}
                          onClickDelete={() => {
                            deleteTransaction(transaction.id);
                            let localArray = [...transactionsArray];
                            const index = localArray.indexOf(transaction);
                            localArray.splice(index, 1);
                            setTransactionArray(localArray);
                            getBalance();
                          }}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="transaction-resume">
                <div className="resume">
                  <div className="border-bottom-gray resume-content">
                    <h2>Resumo</h2>
                    <div className="display-flex space-between">
                      <h3 className="font-weight-500">Entradas</h3>
                      <h3 className="font-weight-500 color-violet">
                        {`R$ ${valueIn}`}
                      </h3>
                    </div>
                    <div className="display-flex space-between ">
                      <h3 className="font-weight-500">Saídas</h3>
                      <h3 className="font-weight-500 color-orange">{`R$ ${valueOut}`}</h3>
                    </div>
                  </div>
                  <div className="display-flex space-between margin-botton">
                    <h3>Saldo </h3>
                    <h3
                      className={`font-weight-500 ${
                        total(valueIn, valueOut) >= 0
                          ? "color-blue"
                          : "color-red"
                      }`}
                    >{`R$ ${total(valueIn, valueOut).toFixed(2)}`}</h3>
                  </div>
                </div>
                <Button
                  text="Adicionar Registro"
                  onClick={() => setAddTransaction(!addTransaction)}
                />
              </div>
            </div>
          </section>
        </main>
      </div>
      {edit && (
        <Modal
          categories={categories}
          onClick={() => setEdit(!edit)}
          reloadTransactions={() => {
            loadTransactions();
            getBalance();
          }}
          text="Editar Registro"
          onClickExit={() => setEdit(!edit)}
          transaction={transaction}
          transactionID={transaction.id}
        />
      )}
      {addTransaction && (
        <Modal
          categories={categories}
          onClick={() => setAddTransaction(!addTransaction)}
          reloadTransactions={() => {
            loadTransactions();
            getBalance();
          }}
          text="Adicionar Registro"
          onClickExit={() => setAddTransaction(!addTransaction)}
        />
      )}
      {editUser && (
        <Modal
          categories={categories}
          onClick={() => setEditUser(!editUser)}
          reloadTransactions={loadTransactions}
          text="Editar Perfil"
          onClickExit={() => setEditUser(!editUser)}
          user={user}
          realoadUser={() => currentUser()}
        />
      )}
    </>
  );
}

export default Home;
