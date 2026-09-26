import React from "react";
import "./Priser.css";
import "./components/PrisListItem";
import PrisLititem from "./components/PrisListItem";

const Priser = () => {
  const listor = [];
  const sqlresult: { [date: string]: [string, number][] } = {
    Hårklippning: [
      ["Herr", 300],
      ["Dam", 300],
      ["Barn", 100],
    ],
    Skägg: [
      ["Clean Shave", 100],
      ["Trimma", 150],
    ],
  };
  for (const category in sqlresult) {
    listor.push(
      <PrisLititem prisOnamn={sqlresult[category]} titel={category} />
    );
  }
  return (
    <div
      className=""
      style={{
        marginLeft: "17vw",
        marginRight: "15vw",
        marginTop: "10vh",
      }}
    >
      {listor}
    </div>
  );
};

export default Priser;
