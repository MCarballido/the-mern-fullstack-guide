import React, { useState, useContext } from "react";

import "./Auth.css";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import { useForm } from "../../shared/hooks/form.hook";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE
} from "../../shared/util/validators";
import Card from "../../shared/components/UIElements/Card";
import { AuthContext } from "../../context/auth-context";

const Auth = () => {
  const auth = useContext(AuthContext);

  const [isLoginMode, setIsLoginMode] = useState(true);

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
    } else {
      try {
        const response = await fetch("http://localhost:5000/api/users/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name: reducerState.inputs.name.value,
            email: reducerState.inputs.email.value,
            password: reducerState.inputs.passw.value
          })
        });

        const responseData = response.json();

        console.log(responseData);
      } catch (err) {
        console.error(err);
      }
    }

    auth.login();
  };

  const switchModeHandler = () => {
    if (isLoginMode)
      setFormAction(
        {
          ...reducerState.inputs,
          name: {
            value: "",
            isValid: false
          }
        },
        false
      );
    else
      setFormAction(
        {
          ...reducerState.inputs,
          name: undefined
        },
        reducerState.inputs.email.isValid && reducerState.inputs.passw.isValid
      );

    setIsLoginMode(prevMode => !prevMode);
  };

  return (
    <Card className="auth">
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
  );
};

export default Auth;
