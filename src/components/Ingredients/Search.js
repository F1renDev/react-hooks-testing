import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

import Card from "../UI/Card";
import "./Search.css";

const Search = React.memo((props) => {
  const { onLoadIngredients } = props;
  const [enteredFilter, setEnteredFilter] = useState("");
  const inputRef = useRef();

  // hook for side effects
  // gets executed after the component render cycle
  // takes a second parametr: array discribing dependencies
  // meaning that it will only update or send request if only
  // somethig from the dependecies changed
  // if an empty array is passed, useEffect acts like componentDidMount and runs only once
  // if nothing is passed, useEffect acts like componentDidUpdate
  // and runs after every component update
  useEffect(() => {
    const timer = setTimeout(() => {
      if (enteredFilter === inputRef.current.value) {
        const queryParams =
          enteredFilter.length === 0
            ? ""
            : `?orderBy="title"&equalTo="${enteredFilter}"`;
        axios
          .get(
            "https://react-hooks-study.firebaseio.com/ingredients.json" +
              queryParams
          )
          .then((response) => {
            const loadedIngredients = [];
            Object.keys(response.data).map((item) => {
              return loadedIngredients.push({
                id: item,
                title: response.data[item].title,
                amount: response.data[item].amount
              });
            });
            props.onLoadIngredients(loadedIngredients);
          })
          .catch((err) => console.log(err));
      }
    }, 500);
    //returning the clean-up function
    return () => {
      clearTimeout(timer);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enteredFilter, onLoadIngredients, inputRef]);

  return (
    <section className='search'>
      <Card>
        <div className='search-input'>
          <label>Filter by Title</label>
          <input
            ref={inputRef}
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
