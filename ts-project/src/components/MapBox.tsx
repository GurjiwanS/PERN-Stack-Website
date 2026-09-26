import React from "react";

function MapBox() {
  const iframeStyle = {
    border: "0",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.25)",
  };

  return (
    <iframe
      width="400px"
      height="400px"
      style={iframeStyle}
      loading="lazy"
      allowFullScreen
      src="https://www.google.com/maps/embed/v1/place?q=place_id:ChIJ60Sgm3KfX0YRhpBfugB5ids&key=AIzaSyBxE54BuYjyVGuV-Gbumg7rCy1asdVXH7w"
    ></iframe>
  );
}

export default MapBox;
