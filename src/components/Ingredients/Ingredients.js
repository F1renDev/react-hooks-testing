import React, { useCallback, useReducer, useMemo } from "react";
import axios from "axios";

import IngredientForm from "./IngredientForm";
import Search from "./Search";
import IngredientList from "./IngredientList";
import ErrorModal from "../UI/ErrorModal";

const ingredientReducer = (currentIngredients, action) => {
  switch (action.type) {
    case "SET":
      return action.ingredients;
    case "ADD":
      return [...currentIngredients, action.ingredient];
    case "DELETE":
      return currentIngredients.filter((item) => item.id !== action.id);
    default:
      throw new Error("Should not get here!");
  }
};

const httpReducer = (currentHttpState, action) => {
  switch (action.type) {
    case "SEND":
      return { loading: true, error: null };
    case "RESPONSE":
      return { ...currentHttpState, loading: false };
    case "ERROR":
      return { loading: false, error: action.errorMessage };
    case "CLEAR":
      return { ...currentHttpState, error: null };
    default:
      throw new Error("Should not get here!");
  }
};

const Ingredients = () => {
  const [httpState, dispatchHttp] = useReducer(httpReducer, {
    loading: false,
    error: null
  });
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  // const [userIngredients, setUserIngredients] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState();

  //useCallback will return a memoized version of the callback
  // that only changes if one of the inputs has changed.
  const filteredIngredientsHandler = useCallback((filteredIngredients) => {
    dispatch({ type: "SET", ingredients: filteredIngredients });
  }, []);

  const addIngredientHandler = useCallback((ingredient) => {
    dispatchHttp({ type: "SEND" });
    axios
      .post(
        "https://react-hooks-study.firebaseio.com/ingredients.json",
        ingredient
      )
      .then((response) => {
        dispatchHttp({ type: "RESPONSE" });
        // setUserIngredients((prevIngredients) => [
        //   ...prevIngredients,
        //   { id: response.data.name, ...ingredient }
        // ]);
        dispatch({
          type: "ADD",
          ingredient: { id: response.data.name, ...ingredient }
        });
      })
      .catch((err) => console.log(err));
  }, []);

  const removeIngredientHandler = useCallback((id) => {
    dispatchHttp({ type: "SEND" });
    axios
      .delete(`https://react-hooks-study.firebaseio.com/ingredients/${id}.json`)
      .then((response) => {
        dispatchHttp({ type: "RESPONSE" });
        // setUserIngredients((prevIngredients) =>
        //   prevIngredients.filter((item) => item.id !== id)
        // );
        dispatch({ type: "DELETE", id: id });
      })
      .catch((err) => {
        dispatchHttp({ type: "ERROR", errorMessage: "Something went wrong!" });
      });
  }, []);

  const clearError = useCallback(() => {
    dispatchHttp({ type: "CLEAR" });
  }, []);

  const ingredientList = useMemo(() => {
    return (
      <IngredientList
        ingredients={userIngredients}
        onRemoveItem={removeIngredientHandler}
      />
    );
  }, [userIngredients, removeIngredientHandler]);
  return (
    <div className='App'>
      {httpState.error ? (
        <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>
      ) : null}
      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={httpState.loading}
      />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        {ingredientList}
      </section>
    </div>
  );
};

export default Ingredients;
