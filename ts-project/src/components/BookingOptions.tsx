import React, { useState, ChangeEvent } from "react";
import "../Boka.css";
interface Props {
  name: string;
  price: number;
  tiddettar: number;
  id: string;
  onCheckboxChange: (id: string, isChecked: boolean) => void;
}
const BookingOptions = ({
  name,
  price,
  tiddettar,
  id,
  onCheckboxChange,
}: Props) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    const checkStatus: boolean = event.target.checked;
    setIsChecked(checkStatus);
    onCheckboxChange(id, checkStatus);
  };

  return (
    <div className="optionBox optionBoxWidth">
      <div style={{ width: "50%" }}>
        <strong>{name}</strong>
      </div>
      <span style={{ margin: "auto" }}>{tiddettar}min</span>
      <div style={{ width: "70px", textAlign: "right" }}>
        <span
          style={{
            marginLeft: "auto",
            marginRight: "10px",
          }}
        >
          {price} kr
        </span>
      </div>
      <input
        type="checkbox"
        checked={isChecked}
        id={id}
        onChange={handleCheckboxChange}
        name="bookingOptionSelects"
      />
    </div>
  );
};

export default BookingOptions;
