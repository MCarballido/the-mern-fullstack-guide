import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import "./PlaceForm.css";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElements/Card";
import { useForm } from "../../shared/hooks/form.hook";
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from "../../shared/util/validators";

const DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empire State Building",
    description: "A shitty building",
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
    description: "A not so shitty building",
    imageUrl: "https://dam.ngenespanol.com/wp-content/uploads/2019/06/empire-state.png",
    address: "20 W 34th St, New York, NY 10001, United States",
    location: {
      lat: 40.7354591,
      lng: -74.0019199
    },
    creator: "u2"
  }
];

const UpdatePlace = () => {
  const [isLoading, setIsLoading] = useState(true);

  const placeId = useParams().placeId; // .placeId pq la ruta es :placeId

  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: "",
        isValid: false
      },
      descr: {
        value: "",
        isValid: false
      }
    },
    false
  );

  const identifiedPlace = DUMMY_PLACES.find(p => p.id === placeId);

  useEffect(() => {
    if (identifiedPlace)
      setFormData(
        {
          title: {
            value: identifiedPlace.title,
            isValid: true
          },
          descr: {
            value: identifiedPlace.description,
            isValid: true
          }
        },
        true
      );

    setIsLoading(false);
  }, [setFormData, identifiedPlace]);
  // setFormData nunca va a cambiar porque en form.hooks.js lo wrappeamos en useCallback
  // identifiedPlace se va a "ejecutar" siempre pero no va a ser siempre el mismo

  const placeUpdateSubmitHandler = event => {
    event.preventDefault();
    console.log(formState.inputs);
  };

  if (!identifiedPlace)
    return (
      <div className="center">
        <Card>
          <h2>Could not find place!</h2>
        </Card>
      </div>
    );

  if (isLoading)
    return (
      <div className="center">
        <Card>
          <h2>Loading...</h2>
        </Card>
      </div>
    );

  return (
    // arreglo temporal hasta que tengamos backend
    <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
      <Input
        id="title"
        element="input"
        type="text"
        label="Title"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid title."
        onInput={inputHandler}
        initialValue={formState.inputs.title.value}
        initialIsValid={formState.inputs.title.isValid}
      />
      <Input
        id="descr"
        element="textarea"
        label="Description"
        validators={[VALIDATOR_MINLENGTH(5)]}
        errorText="Please enter a valid description (min. 5 characters)."
        onInput={inputHandler}
        initialValue={formState.inputs.descr.value}
        initialIsValid={formState.inputs.descr.isValid}
      />
      <Button type="submit" disabled={!formState.isValid}>
        UPDATE PLACE
      </Button>
    </form>
  );
};

export default UpdatePlace;
