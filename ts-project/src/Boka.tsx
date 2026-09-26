import { ReactNode } from "react";
import BookingDay from "./components/BookingDay";
import "./Boka.css";
import { useLocation } from "react-router-dom";

function GenerateTimes(nrOfTimes: number) {
  const times: ReactNode[] = [];
  for (let timeslotI = 0; timeslotI < nrOfTimes; timeslotI++) {
    times.push(<div className="timeBox">14:30</div>);
  }
  return times;
}

function GenerateDaysforWeek() {
  const days: ReactNode[] = Array<ReactNode>(7);
  const nrOfTimesArray: number[] = [3, 4, 8, 2, 6, 11, 1];
  for (let i = 0; i < days.length; i++) {
    const idag = new Date();
    idag.setDate(idag.getDate() + i);
    days[i] = (
      <div className="col dayColumn" key={i}>
        <h5
          style={{
            marginBottom: "10px",
            marginTop: "10px",
            fontWeight: "bold",
          }}
        >
          {idag.toDateString().substring(0, 10)}
        </h5>
        {GenerateTimes(nrOfTimesArray[i])}
      </div>
    );
  }
  return days;
}

const Boka = () => {
  const fData = useLocation().state;
  console.log(fData);
  const today = new Date();
  return (
    <div
      className="row"
      style={{
        marginTop: "2vh",
        marginLeft: "2vw",
        marginRight: "2vw",
      }}
    >
      {GenerateDaysforWeek()}
    </div>
  );
};

export default Boka;
