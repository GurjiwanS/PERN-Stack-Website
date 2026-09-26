import React from "react";
interface Props {
  onClk: () => void;
}

const AlertTwo = ({ onClk }: Props) => {
  return (
    <div
      className="alert alert-warning alert-dismissible fade show"
      role="alert"
    >
      <strong>Holy guacamole!</strong> You should check in on some of those
      fields below.
      <button
        type="button"
        className="btn-close"
        data-dismiss="alert"
        aria-label="Close"
        onClick={onClk}
      ></button>
    </div>
  );
};

export default AlertTwo;
