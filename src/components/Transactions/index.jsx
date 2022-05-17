import React, { useState } from "react";
import "./styles.css";
import iconeEditar from "../../assets/iconeEditar.svg";
import iconeLixeira from "../../assets/iconeLixeira.svg";
import iconSetaDelete from "../../assets/iconSetaDelete.svg";
import Button from "../../components/Button";

function Transactions(props) {
  const [deleleItem, setDeleleItem] = useState(false);

  return (
    <tr>
      <td className="data-column">{props.date}</td>
      <td>{props.day}</td>
      <td>{props.description}</td>
      <td>{props.category.descricao}</td>
      <td className={props.moneyIn ? "moneyIn" : "moneyOut"}>{`R$ ${(
        props.value / 100
      ).toFixed(2)}`}</td>
      <td className="position-relative">
        <img
          className="img-position"
          src={iconeEditar}
          alt=""
          onClick={props.onClick}
        />
      </td>
      <td>
        <img
          src={iconeLixeira}
          alt=""
          onClick={() => setDeleleItem(!deleleItem)}
        />
        {deleleItem && (
          <div className="delete-transaction">
            <img src={iconSetaDelete} alt="" className="icon-seta-delete" />
            <h4>Apagar item?</h4>
            <div className="transactions-delete-buttons">
              <Button
                text="Sim"
                className="color-blue-delete"
                onClick={props.onClickDelete}
              />
              <Button
                text="Não"
                className="color-red-delete"
                onClick={() => setDeleleItem(!deleleItem)}
              />
            </div>
          </div>
        )}
      </td>
    </tr>
  );
}

export default Transactions;
