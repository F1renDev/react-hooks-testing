import React, { useState, useEffect } from "react";
import axios from 'axios';

import Card from "../UI/Card";
import "./Search.css";

const Search = React.memo((props) => {
  const [enteredFilter, setEnteredFilter] = useState("");

useEffect(()=>{
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
        //...
      })
      .catch((err) => console.log(err));
}, [enteredFilter])

  return (
    <section className='search'>
      <Card>
        <div className='search-input'>
          <label>Filter by Title</label>
          <input
            type='text'
            value={enteredFilter}
            onChange={(event) => setEnteredFilter(event.target.value)}
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;
