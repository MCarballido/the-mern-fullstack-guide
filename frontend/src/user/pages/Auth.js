import React, { useState, useContext } from "react";

import "./Auth.css";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import { useForm } from "../../shared/hooks/form.hook";
import { useHttpClient } from "../../shared/hooks/http.hook";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE
} from "../../shared/util/validators";
import Card from "../../shared/components/UIElements/Card";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { AuthContext } from "../../context/auth-context";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";

const Auth = () => {
  const auth = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [reducerState, inputChangeAction, setFormAction] = useForm(
    {
      email: {
        value: "",
        isValid: false
      },
      passw: /* id */ {
        value: "",
        isValid: false
      }
    },
    false
  );

  const onSubmitHandler = async event => {
    event.preventDefault();

    if (isLoginMode) {
      try {
        const responseData = await sendRequest(
          "http://localhost:5000/api/users/login",
          "POST",
          JSON.stringify({
            email: reducerState.inputs.email.value,
            password: reducerState.inputs.passw.value
          }),
          {
            "Content-Type": "application/json"
          }
        );

        auth.login(responseData.user.id);
      } catch (err) {
        console.error(err);
      }
    } else {
      try {
        const formData = new FormData();
        formData.append("name", reducerState.inputs.name.value);
        formData.append("email", reducerState.inputs.email.value);
        formData.append("password", reducerState.inputs.passw.value);
        formData.append("image", reducerState.inputs.image.value);

        const responseData = await sendRequest(
          "http://localhost:5000/api/users/signup",
          "POST",
          formData // automatically applies "multipart/form-data" header
        );

        auth.login(responseData.user.id);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const switchModeHandler = () => {
    if (isLoginMode)
      setFormAction(
        {
          ...reducerState.inputs,
          name: {
            value: "",
            isValid: false
          },
          image: {
            value: null,
            isValid: false
          }
        },
        false
      );
    else
      setFormAction(
        {
          ...reducerState.inputs,
          name: undefined,
          image: undefined
        },
        reducerState.inputs.email.isValid && reducerState.inputs.passw.isValid
      );

    setIsLoginMode(prevMode => !prevMode);
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Card className="auth">
        {isLoading && <LoadingSpinner asOverlay />}
        <h2>Login</h2>
        <hr />
        <form onSubmit={onSubmitHandler}>
          {!isLoginMode && (
            <Input
              id="name"
              element="input"
              type="text"
              label="Your Name"
              onInput={inputChangeAction}
              errorText="Please enter a valid name."
              validators={[VALIDATOR_REQUIRE()]}
            />
          )}
          {!isLoginMode && (
            <ImageUpload
              center
              id="image"
              onInput={inputChangeAction}
              errorText="Please provide and image."
            />
          )}
          <Input
            id="email"
            element="input"
            type="email"
            label="E-Mail"
            onInput={inputChangeAction}
            errorText="Please enter a valid email address."
            validators={[VALIDATOR_EMAIL()]}
          />
          <Input
            id="passw"
            element="input"
            type="password"
            label="Password"
            onInput={inputChangeAction}
            errorText="Please enter a valid password. (Must contain 6 characters)"
            validators={[VALIDATOR_MINLENGTH(6)]}
          />
          <Button type="submit" disabled={!reducerState.isValid}>
            {isLoginMode ? "LOG IN" : "SIGN UP"}
          </Button>
        </form>
        <Button inverse onClick={switchModeHandler}>
          SWITCH TO {isLoginMode ? "SIGN UP" : "LOG IN"}
        </Button>
      </Card>
    </React.Fragment>
  );
};

export default Auth;
