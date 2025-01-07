import React from "react";

export default function Button({
  labeled,
  icon,
  floated,
  position,
  type,
  color,
  label,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      type={type}
      className={`ui ${position ? position : "left"} ${
        floated && "floated"
      }  button  ${labeled && "labeled"} ${icon && "icon"}   ${
        color ? color : "primary"
      }`}
    >
      {icon && icon}
      {label}
    </button>
  );
}
