import { useState } from "react";

interface Props {
  places: string[];
  heading: string;
  onFunction: (place: string) => void;
}

function ListGroup({ places, heading, onFunction }: Props) {
  const [selectedIndex, setSelectedIndex] = useState(-1);

  return (
    <>
      <h1>{heading}</h1>
      {places.length === 0 && <p>No List Found</p>}
      <ul className="list-group">
        {places.map((place, i) => (
          <li
            key={place}
            className={
              i === selectedIndex ? "list-group-item active" : "list-group-item"
            }
            onClick={() => {
              setSelectedIndex(i);
              onFunction(place);
            }}
          >
            {place}
          </li>
        ))}
      </ul>
    </>
  );
}

export default ListGroup;
