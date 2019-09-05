import React, { useState, useEffect } from "react";
import axios from "axios";

import IngredientForm from "./IngredientForm";
import Search from "./Search";
import IngredientList from "./IngredientList";

const Ingredients = () => {
  const [userIngredients, setUserIngredients] = useState([]);

  // hook for side effects
  // gets executed after the component render cycle
  useEffect(() => {
    axios
      .get("https://react-hooks-study.firebaseio.com/ingredients.json")
      .then((response) => {
        const loadedIngredients = [];
        Object.keys(response.data).map((item) => {
          return loadedIngredients.push({
            id: item,
            title: response.data[item].title,
            amout: response.data[item].amount
          });
        });
        setUserIngredients(loadedIngredients);
      })
      .catch((err) => console.log(err));
  }, []);

  const addIngredientHandler = (ingredient) => {
    axios
      .post(
        "https://react-hooks-study.firebaseio.com/ingredients.json",
        ingredient
      )
      .then((response) => {
        console.log(response.data);
        setUserIngredients((prevIngredients) => [
          ...prevIngredients,
          { id: response.data.name, ...ingredient }
        ]);
      })
      .catch((err) => console.log(err));
  };

  const removeIngredientHandler = (id) => {
    setUserIngredients((prevIngredients) =>
      prevIngredients.filter((item) => item.id !== id)
    );
  };

  return (
    <div className='App'>
      <IngredientForm onAddIngredient={addIngredientHandler} />

      <section>
        <Search />
        <IngredientList
          ingredients={userIngredients}
          onRemoveItem={removeIngredientHandler}
        />
      </section>
    </div>
  );
};

export default Ingredients;
