import { useState } from "react";
import Navbar from "./components/Navbar";
import "./App.css";
import Startsida from "./Startsida";
import { Routes, Route } from "react-router-dom";
import Boka from "./Boka";
import Priser from "./Priser";
import PreBoka from "./PreBoka";

function handlethis(place: string) {
  console.log(place);
}

function App() {
  let places = ["New York", "San Francisco", "Tokyo", "London", "Paris"];
  const [alertView, setAlertView] = useState(false);

  return (
    <div className="bgpic vh-100 overflow-scroll">
      <Navbar />
      <Routes>
        <Route path="/" Component={Startsida}></Route>
        <Route path="/boka" Component={PreBoka}></Route>
        <Route path="/priser" Component={Priser}></Route>
        <Route path="/boka/tider" Component={Boka}></Route>
      </Routes>
      {/*{alertView && (
        <AlertTwo
          onClk={() => {
            setAlertView(false);
          }}
        />
      )}
      <Butn color="light" onClic={() => setAlertView(true)}>
        button
        </Butn>*/}
    </div>
  );
}

export default App;
