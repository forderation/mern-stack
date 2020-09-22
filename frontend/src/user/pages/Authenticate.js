import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/auth-context";
import Button from "../../shared/components/FormElements/Button";
import Input from "../../shared/components/FormElements/Input";
import Card from "../../shared/components/UIElements/Card";
import { useForm } from "../../shared/hooks/FormHook";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../utils/validators";
import "./Authenticate.css";
const Authenticate = (props) => {
  const authContext = useContext(AuthContext);

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
        },
        false
      );
    }
    setLoginMode((prevState) => !prevState);
  };
  const submitFormHandler = (event) => {
    event.preventDefault();
    authContext.login();
    console.log("send login post to server ...");
    console.log(formState.inputs);
  };

  return (
    <Card className="authentication" style={{ width: "40rem" }}>
      <h2 className="center">
        Welcome to our places page <br /> {isLoginMode ? "Sign In" : "Sign Up"}{" "}
        Required
      </h2>
      <hr />
      <form onSubmit={submitFormHandler}>
        {!isLoginMode && (
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
          validators={[VALIDATOR_MINLENGTH(5)]}
          onInput={inputHandler}
          errorText="Please enter a valid password. at least 5 characters"
        />
        <Button type="submit" disabled={!formState.isValid}>
          {isLoginMode ? "Sign In" : "Sign Up"}
        </Button>
        <Button type="button" inverse onClick={switchModeHandler}>
          Switch to {isLoginMode ? "Sign In" : "Sign Up"} Mode
        </Button>
      </form>
    </Card>
  );
};

export default Authenticate;
