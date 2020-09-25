import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/auth-context";
import Button from "../../shared/components/FormElements/Button";
import Input from "../../shared/components/FormElements/Input";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useForm } from "../../shared/hooks/FormHook";
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from "../../utils/validators";
import { useHttpClient } from "../../shared/hooks/HttpHook";
import "./PlaceForm.css";
import { useHistory } from "react-router-dom";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";
import PickMap from "../../shared/components/FormElements/PickMap";

const NewPlace = () => {
  const authContext = useContext(AuthContext);
  const history = useHistory();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  // default static coordinates future add geolocation
  const [coords, setCoords] = useState({ lat: -7.9089162, lng: 112.6174301 });
  const [formState, inputHandler] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      image: {
        value: null,
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const coordsHandler = (position) => {
    setCoords(position);
  };

  const submitHandler = async (event) => {
    // send data to server
    event.preventDefault();
    console.log(authContext.userId);
    const { title, description, address } = formState.inputs;
    try {
      const formData = new FormData();
      formData.append("title", title.value);
      formData.append("address", address.value);
      formData.append("description", description.value);
      formData.append("image", formState.inputs.image.value);
      formData.append("location", JSON.stringify(coords));
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/places`,
        "POST",
        formData,
        {
          Authorization: "Bearer " + authContext.token,
        }
      );
      history.push("/");
    } catch (error) {}
    console.log(formState.inputs);
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <form className="place-form" onSubmit={submitHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
        <Input
          id="title"
          element="input"
          type="text"
          label="Title"
          onInput={inputHandler}
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid title."
        />
        <ImageUpload
          id="image"
          onInput={inputHandler}
          errorText={"Please input a valid image"}
        />
        <PickMap
          id="pick-maps"
          center={coords}
          zoom={1}
          onCoords={coordsHandler}
        />
        <Input
          id="description"
          element="textarea"
          label="Description"
          onInput={inputHandler}
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please enter a valid description (at least 5 characters)."
        />
        <Input
          id="address"
          element="input"
          type="text"
          label="Address"
          onInput={inputHandler}
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid address."
        />
        <Button type="submit" disabled={!formState.isValid}>
          ADD PLACE
        </Button>
      </form>
    </React.Fragment>
  );
};

export default NewPlace;
