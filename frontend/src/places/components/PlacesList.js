import React from "react";

import "./PlacesList.css";
import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import PlaceItem from "./PlaceItem";

const PlacesList = props => {
  return props.items.length ? (
    <ul className="place-list">
      {props.items.map(place => (
        <PlaceItem
          key={place.id}
          id={place.id}
          image={place.imageUrl}
          title={place.title}
          description={place.description}
          address={place.address}
          creatorId={place.creator}
          coordinates={place.location}
        />
      ))}
    </ul>
  ) : (
    <div className="place-list center">
      <Card>
        <h2>No places found. Maybe create one?</h2>
        <Button to="/places/new">Share Place</Button>
      </Card>
    </div>
  );
};

export default PlacesList;