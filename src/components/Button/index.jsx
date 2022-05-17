import React from "react";
import "./styles.css";

function Button(props) {
  return (
    <button
      className={`button-component ${props.className && props.className}`}
      id={props.id && props.id}
      onClick={props.onClick && props.onClick}
      name={props.name && props.name}
      value={props.value && props.value}
      style={{ backgroundColor: props.backgroundColor }}
    >
      {props.img && <img src={props.img} alt="" />}
      {props.text}
    </button>
  );
}

export default Button;
