import React from "react";
import MapBox from "./components/MapBox";

const Startsida = () => {
  return (
    <div
      className="d-flex flexwrapper justifypctophone"
      style={{
        backgroundColor: "",
        marginTop: "13vh",
        marginLeft: "5vw",
        marginRight: "5vw",
      }}
    >
      <div className="flex-grow-0">
        <MapBox />
      </div>
      <div className="vr align-self-center vrstyle"></div>
      <div
        className="align-self-center"
        style={{
          backgroundColor: "",
          width: "300px",
          height: "21vh",
        }}
      >
        <h4 className="text-center fs-2" style={{ whiteSpace: "nowrap" }}>
          Öppettider:
        </h4>
        <p className="text-center fs-4" style={{ whiteSpace: "nowrap" }}>
          <br />
          Mån-Lör: 10-21
          <br />
          Sön: 11-20
        </p>
      </div>
      <div className="vr align-self-center vrstyle"></div>
      <div
        className="align-self-center"
        style={{
          backgroundColor: "",
          width: "300px",
          height: "21vh",
        }}
      >
        <h4 className="text-center fs-2" style={{ whiteSpace: "nowrap" }}>
          Kontakta:
        </h4>
        <p className="text-center fs-4" style={{ whiteSpace: "nowrap" }}>
          <br />
          example@mail.com
          <br />
        </p>
      </div>
    </div>
  );
};

export default Startsida;
