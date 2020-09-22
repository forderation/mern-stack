import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Button from "../../shared/components/FormElements/Button";
import Input from "../../shared/components/FormElements/Input";
import Card from "../../shared/components/UIElements/Card";
import { useForm } from "../../shared/hooks/FormHook";
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from "../../utils/validators";
import "./PlaceForm.css";
const DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empire State Building",
    description: "One of the most famous sky scrapers in the world!",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg",
    address: "20 W 34th St, New York, NY 10001",
    location: {
      lat: 40.7484405,
      lng: -73.9878584,
    },
    creator: "u1",
  },
  {
    id: "p2",
    title: "Empire State Building",
    description: "One of the most famous sky scrapers in the world!",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg",
    address: "20 W 34th St, New York, NY 10001",
    location: {
      lat: 40.7484405,
      lng: -73.9878584,
    },
    creator: "u2",
  },
];

const UpdatePlace = (props) => {
  const placeId = useParams().placeId;

  const [isLoading, setLoadingState] = useState(true);

  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
    },
    false
  );
  const editPlace = DUMMY_PLACES.find((place) => place.id === placeId);
  const updateSubmitHandler = (event) => {
    event.preventDefault();
    console.log(formState.inputs);
  };
  useEffect(() => {
    if (editPlace) {
      setFormData(
        {
          title: {
            value: editPlace.title,
            isValid: true,
          },
          description: {
            value: editPlace.description,
            isValid: true,
          },
        },
        true
      );
    }
    setLoadingState(false);
  }, [editPlace, setFormData]);
  if (!editPlace) {
    return (
      <div className="center">
        <Card>
        <h2>Could not find place</h2>
        </Card>
      </div>
    );
  }
  if (isLoading) {
    return (
      <div className="center">
        <h2>Loading ...</h2>
      </div>
    );
  }
  return (
    <form className="place-form" onSubmit={updateSubmitHandler}>
      <Input
        id="title"
        element="input"
        type="text"
        label="title"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid title."
        onInput={inputHandler}
        initialValue={formState.inputs.title.value}
        initialValid={formState.inputs.title.isValid}
      />
      <Input
        id="description"
        element="textarea"
        label="Description"
        validators={[VALIDATOR_MINLENGTH(5)]}
        errorText="Please enter a valid description minimum 5 character."
        onInput={inputHandler}
        initialValue={formState.inputs.description.value}
        initialValid={formState.inputs.description.isValid}
      />
      <Button type="submit" disabled={!formState.isValid}>
        UPDATE PLACE
      </Button>
    </form>
  );
};

export default UpdatePlace;
