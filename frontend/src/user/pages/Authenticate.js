import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/auth-context";
import Button from "../../shared/components/FormElements/Button";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";
import Input from "../../shared/components/FormElements/Input";
import Card from "../../shared/components/UIElements/Card";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useForm } from "../../shared/hooks/FormHook";
import { useHttpClient } from "../../shared/hooks/HttpHook";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../utils/validators";
import "./Authenticate.css";
const Authenticate = (props) => {
  const authContext = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [isLoginMode, setLoginMode] = useState(true);
  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const switchModeHandler = () => {
    if (!isLoginMode) {
      // Sign in mode
      setFormData(
        { ...formState.inputs, name: undefined },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      // Sign up mode
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: "",
            isValid: false,
          },
          image: {
            value: null,
            isValid: false,
          },
        },
        false
      );
    }
    setLoginMode((prevState) => !prevState);
  };
  const submitFormHandler = async (event) => {
    event.preventDefault();
    if (isLoginMode) {
      try {
        const responseData = await sendRequest(
          "http://localhost:5000/api/users/login",
          "POST",
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          {
            "Content-Type": "application/json",
          }
        );
        authContext.login(responseData.user.id);
      } catch (err) {}
    } else {
      try {
        const formData = new FormData();
        formData.append("name", formState.inputs.name.value);
        formData.append("email", formState.inputs.email.value);
        formData.append("password", formState.inputs.password.value);
        formData.append("image", formState.inputs.image.value);
        const responseData = await sendRequest(
          "http://localhost:5000/api/users/signup",
          "POST",
          formData
        );
        authContext.login(responseData.user.id);
      } catch (err) {}
    }
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Card className="authentication" style={{ width: "40rem" }}>
        {isLoading && <LoadingSpinner asOverlay />}
        <h2 className="center">
          Welcome to our places page <br />{" "}
          {isLoginMode ? "Sign In" : "Sign Up"} Required
        </h2>
        <hr />
        <form onSubmit={submitFormHandler}>
          {!isLoginMode && (
            <React.Fragment>
              <Input
                element="input"
                id="name"
                type="text"
                label="Your Name"
                validators={[VALIDATOR_REQUIRE()]}
                placeholder="Enter your name here"
                errorText="Please enter a name"
                onInput={inputHandler}
              ></Input>
              <ImageUpload
                id="image"
                center
                errorText={"Please input a valid image"}
                onInput={inputHandler}
              />
            </React.Fragment>
          )}
          <Input
            id="email"
            element="input"
            type="text"
            label="Email"
            placeholder="Enter your email here"
            validators={[VALIDATOR_REQUIRE(), VALIDATOR_EMAIL()]}
            onInput={inputHandler}
            errorText="Please enter a valid email."
          />
          <Input
            id="password"
            element="input"
            label="Password"
            type="password"
            placeholder="Enter your password here"
            validators={[VALIDATOR_MINLENGTH(6)]}
            onInput={inputHandler}
            errorText="Please enter a valid password. at least 6 characters"
          />
          <Button type="submit" disabled={!formState.isValid}>
            {isLoginMode ? "Sign In" : "Sign Up"}
          </Button>
          <Button type="button" inverse onClick={switchModeHandler}>
            Switch to {!isLoginMode ? "Sign In" : "Sign Up"} Mode
          </Button>
        </form>
      </Card>
    </React.Fragment>
  );
};

export default Authenticate;
