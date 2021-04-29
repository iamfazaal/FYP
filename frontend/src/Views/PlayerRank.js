import React, { useReducer, useEffect, useState } from "react";
import BoardList from "../Components/BoardModule/BoardList";
import { Context } from "../context";
import reducer from "../reducer";
// import BASE_STATE from "../utils/BaseState";
import "../Main.css";
import Content from "../Dashboard/Content";
import axios from "axios";

function PlayerRank() {
  const [countries, setCountries] = useState([]);
  const [slPlayers, setSLplayers] = useState([]);
  const [state, dispatch] = useReducer(
    reducer,
    JSON.parse(localStorage.getItem("boards"))
  );
  console.log(state);


  let toSelectCountriesData = [];
  const getAllCountries = async () => {
    const response = await fetch("http://localhost:8000/countries");
    const countries = await response.json();
    for (let countryId in countries.data) {
      let countryData = countries.data;
      let currentCountry = countryData[countryId];
      toSelectCountriesData.push({ id: countryId, value: currentCountry });
      // toSelectCountriesData.push(<option key={countryId} value={countryId}>{currentCountry}</option>);
    }
    setCountries(toSelectCountriesData);
  };

  const fetchPlayers = async () => {
    try {
      const res = await axios.get("http://localhost:8000/sl-players");
      const BASE_STATE = [
        {
          id: "board-1",
          type: 1,
          className: "board",
          boardName: "Players",
          color: "grey",
          cards:
            res.data.data.map((o) => {
              return {
                id: `${o.ID}`,
                className: "card",
                draggable: "true",
                type: 1,
                title: `${o.player_name}`,
              };
            }),
        },
        {
          id: "board-2",
          type: 2,
          className: "board",
          boardName: "Selected Players",
          color: "green",
          cards: [],
        },
      ];
      localStorage.setItem("boards", JSON.stringify(BASE_STATE));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchPlayers();
    localStorage.setItem("boards", JSON.stringify(state));
  }, [state]);

  return (
    <Context.Provider
      value={{
        dispatch,
      }}
    >
      <Content>
        <BoardList boards={state}></BoardList>
      </Content>
    </Context.Provider>
  );
}

export default PlayerRank;
