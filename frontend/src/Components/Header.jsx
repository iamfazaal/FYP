import React, { useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Input,
  InputGroup,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure
} from "@chakra-ui/core";
import { useEffect } from 'react';
import Select from 'react-select'



const Header = () => {
  // Declare a new state variable, which we'll call "count"
  const [count, setCount] = useState(0);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [country, setCountry] = React.useState("");
  const [countries, setCountries] = useState([])
  const [players, setPlayers] = useState([])
  const [venues, setVenues] = useState([])
  const [toSubmitData, setToSubmitData] = useState({})
  const [selectedPlayerData, setSelectedPlayerData] = useState({})
  const [isDataReceived, setIsDataReceived] = useState(false)
  const {isOpen, onOpen, onClose} = useDisclosure()
  const [finalPredictedResultData, setFinalPredictedResultData] = useState(0)


  let toSelectCountriesData = []
  let toSelectPlayer = []
  let toSelectVenuesList = []


  const handleSubmit = async (event) => {
    event.preventDefault()
    console.log(toSubmitData);
    await getPredictionData();
  }

  const getAllCountries = async () => {
    const response = await fetch("http://localhost:8000/countries")
    const countries = await response.json()
    for (let countryId in countries.data) {
      let countryData = countries.data
      let currentCountry = countryData[countryId]
      toSelectCountriesData.push({id: countryId, value: currentCountry})
      // toSelectCountriesData.push(<option key={countryId} value={countryId}>{currentCountry}</option>);
    }
    setCountries(toSelectCountriesData)
  }

  const getAllPlayers = async () => {
    const response = await fetch("http://localhost:8000/players")
    const players = await response.json()
    let allPlayersData = players.data
    for (let player in players.data){
      toSelectPlayer.push(allPlayersData[player])
    }
    setPlayers(toSelectPlayer)
  }

  const getAllVenues =  async () => {
    const response = await fetch("http://localhost:8000/venues")
    const jsonResponse = await response.json()
    let allVenuesData = jsonResponse.data
    for (let venueId in jsonResponse.data){
      // toSelectVenuesList.push(allVenuesData[venue])
      let currentVenue = allVenuesData[venueId]
      toSelectVenuesList.push({id: venueId, value: currentVenue})
    }
    setVenues(toSelectVenuesList)
  }

  const getPredictionData = async () => {
    const response = await fetch("http://localhost:8000/predict-score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(toSubmitData)
    });
    
    console.log(response);
    debugger
    setFinalPredictedResultData(response)
    setIsDataReceived(true)
  }


  useEffect(() => {
    getAllCountries();
    getAllPlayers();
    getAllVenues();
  }, [])

  useEffect(() => {
    if (toSubmitData.playerId) {
      let data = players.find(x => x.ID === toSubmitData.playerId);
      let playerCountryData = countries.find(y => y.value === data.team)
      setToSubmitData({
        ...toSubmitData,
        playerTeamId: parseInt(playerCountryData.id)
        // playerTeam: parseInt()
      })
      setSelectedPlayerData(data)
    }
  },[toSubmitData.playerId])

  const handleChange = (event) => {
  }

  const handleChangePlayer = (event) => {
    setToSubmitData({
      ...toSubmitData,
      'playerId': event.value,
      'playerName': event.label,
    })
  }

  const handleOppositionCountryChange = event => {
    setToSubmitData({
      ...toSubmitData,
      'oppositionTeamId': parseInt(event.value),
      'oppositionTeam': event.label
    })
  }

  const handleVenueChange = (event) => {
    setToSubmitData({
      ...toSubmitData,
      'venueId': parseInt(event.value),
      'vanue': event.label,
    })
  }


  const handlePredict = (event) => {
    event.preventDefault()
    console.log(toSubmitData);
  }

  return (
    <div>
    <form onSubmit={handleSubmit}>
      <h1>Player Performance Analysis</h1>

      <label>
        Player Name:
        <Select
          onChange={handleChangePlayer}
          options={
            players.map((p) => {
               return {
                label: p.player_name,
                value: p.ID,
               }
            })
         }
        />
      </label>

      <label>
        Country:
        <select onChange={handleChange} value={selectedPlayerData.team} >
          {countries.map((option) => (
            <option itemID={option.id} value={option.value} disabled>{option.value}</option>
          ))}
        </select>
      </label>

      <label>
        Opposition:
        <Select
          onChange={handleOppositionCountryChange}
          options={
            countries.map((c) => {
               return {
                label: c.value,
                value: c.id,
               }
            })
         }
        />
      </label>


      <label>
        Venue:
        <Select
          onChange={handleVenueChange}
          // options={venues}
          options={
            venues.map((c) => {
               return {
                label: c.value,
                value: c.id,
               }
            })
         }
        />
      </label>
      <button onSubmit={handleSubmit}>PREDICT</button>
    </form>

    {/* {isDataReceived && ( */}
      <Modal  isOpen={isDataReceived} onClose={onClose}>
      <ModalOverlay/>
      <ModalContent>
        <ModalHeader>Update Todo</ModalHeader>
        <ModalCloseButton/>
        <ModalBody>
          <label>
            {finalPredictedResultData}
          </label>
          {/* <InputGroup size="md">
            <Input
              pr="4.5rem"
              type="text"
              placeholder="Add a todo item"
              aria-label="Add a todo item"
              // value={todo}
              // onChange={e => setTodo(e.target.value)}
            />
          </InputGroup> */}
        </ModalBody>

        <ModalFooter>
          {/* <Button h="1.5rem" size="sm" onClick={updateTodo}>Update Todo</Button> */}
        </ModalFooter>
      </ModalContent>
    </Modal>
    {/* )} */}
    </div>
  );
}

export default Header;