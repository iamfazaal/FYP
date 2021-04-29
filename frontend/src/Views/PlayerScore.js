import React, { useState, useEffect } from "react";
import {
  useDisclosure,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/core";
import Select from "react-select";
import { makeStyles } from "@material-ui/core/styles";
import Content from "../Dashboard/Content";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import Link from "@material-ui/core/Link";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import SportsCricketIcon from "@material-ui/icons/SportsCricket";
import Typography from "@material-ui/core/Typography";
import axios from "axios";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit">Fazal</Link> {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
  },
  image: {
    backgroundImage: "url(img/stadium.jpg)",
    backgroundRepeat: "no-repeat",
    backgroundColor:
      theme.palette.type === "dark"
        ? theme.palette.grey[900]
        : theme.palette.grey[50],
    backgroundSize: "cover",
    backgroundPosition: "center",
    width: "100%",
    paddingTop: "40px",
  },
  paper: {
    margin: theme.spacing(8, 8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  label: {
    margin: theme.spacing(1, 0, 1),
  },
  card: {
    margin: theme.spacing(1),
    flexGrow: 1,
    padding: theme.spacing(3),
    textAlign: "center",
  },
}));

const PlayerScore = () => {
  const [country, setCountry] = React.useState("");
  const [countries, setCountries] = useState([]);
  const [players, setPlayers] = useState([]);
  const [venues, setVenues] = useState([]);
  const [toSubmitData, setToSubmitData] = useState({});
  const [selectedPlayerData, setSelectedPlayerData] = useState({});
  const [isDataReceived, setIsDataReceived] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [finalPredictedResultData, setFinalPredictedResultData] = useState();
  const classes = useStyles();

  let toSelectCountriesData = [];
  let toSelectPlayer = [];
  let toSelectVenuesList = [];

  // const handleSubmit = async (event) => {
  //   event.preventDefault();
  //   console.log(toSubmitData);
  //   await getPredictionData();
  // };

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

  const getAllPlayers = async () => {
    const response = await fetch("http://localhost:8000/players");
    const players = await response.json();
    let allPlayersData = players.data;
    for (let player in players.data) {
      toSelectPlayer.push(allPlayersData[player]);
    }
    setPlayers(toSelectPlayer);
  };

  const getAllVenues = async () => {
    const response = await fetch("http://localhost:8000/venues");
    const jsonResponse = await response.json();
    let allVenuesData = jsonResponse.data;
    for (let venueId in jsonResponse.data) {
      // toSelectVenuesList.push(allVenuesData[venue])
      let currentVenue = allVenuesData[venueId];
      toSelectVenuesList.push({ id: venueId, value: currentVenue });
    }
    setVenues(toSelectVenuesList);
  };

  const getPredictionData = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8000/predict-score",
        toSubmitData
      );
      setFinalPredictedResultData(Math.ceil(res.data.data));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllCountries();
    getAllPlayers();
    getAllVenues();
  }, []);

  useEffect(() => {
    if (toSubmitData.playerId) {
      let data = players.find((x) => x.ID === toSubmitData.playerId);
      let playerCountryData = countries.find((y) => y.value === data.team);
      setToSubmitData({
        ...toSubmitData,
        playerTeamId: parseInt(playerCountryData.id),
        // playerTeam: parseInt()
      });
      setSelectedPlayerData(data);
    }
  }, [toSubmitData.playerId]);

  const handleChange = (event) => {};

  const handleChangePlayer = (event) => {
    setToSubmitData({
      ...toSubmitData,
      playerId: event.value,
      playerName: event.label,
    });
  };

  const handleOppositionCountryChange = (event) => {
    setToSubmitData({
      ...toSubmitData,
      oppositionTeamId: parseInt(event.value),
      oppositionTeam: event.label,
    });
  };

  const handleVenueChange = (event) => {
    setToSubmitData({
      ...toSubmitData,
      venueId: parseInt(event.value),
      vanue: event.label,
    });
  };

  const handlePredict = (event) => {
    event.preventDefault();
    console.log(toSubmitData);
  };

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid container justify="center" className={classes.image}>
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Grid className={classes.paper}>
            <Avatar className={classes.avatar}>
              <SportsCricketIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Player Score Projection
            </Typography>
            <form className={classes.form}>
              <div className={classes.label}>
                <label>
                  Player Name:
                  <Select
                    onChange={handleChangePlayer}
                    options={players.map((p) => {
                      return {
                        label: p.player_name,
                        value: p.ID,
                      };
                    })}
                  />
                </label>
              </div>
              <div className={classes.label}>
                <label>
                  Country:
                  <Select
                    inputValue={selectedPlayerData.team}
                    onChange={handleChange}
                    onMenuClose
                    options={countries.map((p) => {
                      return {
                        label: p.value,
                        value: p.id,
                      };
                    })}
                  />
                </label>
              </div>
              <div className={classes.label}>
                <label>
                  Opposition:
                  <Select
                    onChange={handleOppositionCountryChange}
                    options={countries.map((c) => {
                      return {
                        label: c.value,
                        value: c.id,
                      };
                    })}
                  />
                </label>
              </div>
              <div className={classes.label}>
                <label>
                  Venue:
                  <Select
                    onChange={handleVenueChange}
                    // options={venues}
                    options={venues.map((c) => {
                      return {
                        label: c.value,
                        value: c.id,
                      };
                    })}
                  />
                </label>
              </div>
              <Button
                onClick={getPredictionData}
                className={classes.submit}
                variant="contained"
                color="primary"
              >
                PREDICT
              </Button>
              {finalPredictedResultData && (
                <Paper elevation={4} className={classes.card}>
                  <Typography color={"textSecondary"} variant="h5" gutterBottom>
                    Projected Score
                  </Typography>
                  <Typography color={"primary"} variant="h3">
                    {finalPredictedResultData}
                  </Typography>
                </Paper>
              )}
            </form>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default PlayerScore;
