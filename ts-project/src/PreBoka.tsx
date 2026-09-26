import React, { FormEvent, useState } from "react";
import BookingOptions from "./components/BookingOptions";
import { useNavigate } from "react-router-dom";

const PreBoka = () => {
  type FormValues = {
    [key: string]: boolean;
  };
  const [formValues, setFormValues] = useState<FormValues>({}); //klippning 300,
  const navigate = useNavigate();

  const handleCheckboxChange = (id: string, isChecked: boolean) => {
    setFormValues({ ...formValues, [id]: isChecked });
  };

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    for (let key in formValues) {
      if (formValues[key] === true) {
        navigate("/boka/tider", { state: formValues });
        break;
      }
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="optionDiv">
        <BookingOptions
          name="Klippning"
          price={300}
          tiddettar={60}
          id="hk"
          onCheckboxChange={handleCheckboxChange}
        />
        <BookingOptions
          name="Klippning + Skägg"
          price={350}
          tiddettar={60}
          id="hks"
          onCheckboxChange={handleCheckboxChange}
        />
        <BookingOptions
          name="Skägg Mustasch Vaxning"
          price={200}
          tiddettar={60}
          id="smv"
          onCheckboxChange={handleCheckboxChange}
        />
        <BookingOptions
          name="Skägg"
          price={150}
          tiddettar={15}
          id="s"
          onCheckboxChange={handleCheckboxChange}
        />
        <BookingOptions
          name="Barn"
          price={200}
          tiddettar={30}
          id="b"
          onCheckboxChange={handleCheckboxChange}
        />
        <BookingOptions
          name="Pensionär"
          price={200}
          tiddettar={30}
          id="p"
          onCheckboxChange={handleCheckboxChange}
        />
      </div>
      <div
        className="d-flex justify-content-center"
        style={{ marginTop: "30px" }}
      >
        <input className="fortsattKnapp" type="submit" value="Fortsätt"></input>
      </div>
    </form>
  );
};

export default PreBoka;
