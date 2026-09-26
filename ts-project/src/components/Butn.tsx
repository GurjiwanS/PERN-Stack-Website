import React from "react";

interface Props {
  children: string;
  onClic: () => void;
  color?: "primary" | "dark" | "light";
}

const Butn = ({ children, onClic, color = "dark" }: Props) => {
  return (
    <button type="button" className={"btn btn-" + color} onClick={onClic}>
      {children}
    </button>
  );
};

export default Butn;
