import React from "react";
import { useParams } from "react-router-dom";

import PlaceList from "../components/PlacesList";

const DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empire State Building",
    description: "A building",
    imageUrl: "https://dam.ngenespanol.com/wp-content/uploads/2019/06/empire-state.png",
    address: "20 W 34th St, New York, NY 10001, United States",
    location: {
      lat: 40.7354591,
      lng: -74.0019199
    },
    creator: "u1"
  },
  {
    id: "p2",
    title: "Empire State Building",
    description: "A building",
    imageUrl: "https://dam.ngenespanol.com/wp-content/uploads/2019/06/empire-state.png",
    address: "20 W 34th St, New York, NY 10001, United States",
    location: {
      lat: 40.7354591,
      lng: -74.0019199
    },
    creator: "u2"
  }
];

const UserPlaces = () => {
  const uid = useParams().uid;
  const loadedPlaces = DUMMY_PLACES.filter(place => place.creator === uid);
  return <PlaceList items={loadedPlaces} />;
};

export default UserPlaces;
