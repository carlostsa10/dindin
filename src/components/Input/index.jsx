import React from "react";
import "./styles.css";

function Input(props) {
  return (
    <div className="input-component">
      <label htmlFor={props.id}>{props.label}</label>
      <input
        id={props.id}
        type={props.type}
        onChange={props.onChange}
        name={props.name}
        value={props.value}
        onFocus={props.onFocus && props.onFocus}
        pattern={props.pattern && props.pattern}
      />
    </div>
  );
}

export default Input;
