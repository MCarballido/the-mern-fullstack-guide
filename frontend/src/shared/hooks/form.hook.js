import { useCallback, useReducer } from "react";

// returns a new state
const formReducer = (state, action) => {
  switch (action.type) {
    case "INPUT_CHANGE":
      let formIsValid = true;
      for (const inputId in state.inputs) {
        if (state.inputs[inputId])
          if (inputId === action.inputId)
            // esto se fija que si tenemos un falso se asegura que todo el formulario es falso
            formIsValid = formIsValid && action.isValid;
          else formIsValid = formIsValid && state.inputs[inputId].isValid;
      }
      return {
        ...state,
        inputs: {
          ...state.inputs,
          [action.inputId]: { value: action.value, isValid: action.isValid }
        },
        isValid: formIsValid
      };

    case "SET_DATA":
      return {
        inputs: action.inputs,
        isValid: action.formIsValid
      };

    default:
      return state;
  }
};

export const useForm = (initialInputs, initialFormValidity) => {
  const [formState, dispatch] = useReducer(
    formReducer,
    /* INITIAL STATE */ {
      inputs: initialInputs,
      isValid: initialFormValidity
    }
  );

  // cuando se ejecute este codigo, si modifica el state, va a re-renderizarse el componente
  // entonces esta funcion se va a volver a crear y como es una nueva funcion cambia el estado
  // y se re-renderiza entrando en un loop infinito
  // por eso le ponemos el useCallback para que la funcion se vuelva a crear solo cuando cambie
  // dichas dependencias en el []
  const inputHandler = useCallback((id, value, isValid) => {
    dispatch({ value, isValid, type: "INPUT_CHANGE", inputId: id });
  }, []); // dispatch seria una dependencia en el [] teoricamente, pero react se asegura que
  // el dispatch de useReducer nunca cambia asique podemos omitirlo a []

  const setFormData = useCallback((inputData, formValidity) => {
    dispatch({
      type: "SET_DATA",
      inputs: inputData,
      formIsValid: formValidity
    });
  }, []);

  return [formState, inputHandler, setFormData];
};
