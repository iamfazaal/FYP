import React, { useState, useEffect } from "react";
import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import SportsCricketIcon from "@material-ui/icons/SportsCricket";
import Select from "react-select";
import axios from "axios";
import { useHistory } from "react-router-dom";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href=""></Link>
      {""}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
  },
  image: {
    backgroundImage: "url(img/wallpaper2-min.PNG)",
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
}));

export function Dashboard() {
  const classes = useStyles();
  const [players, setPlayers] = useState([]);
  const [toSubmitData, setToSubmitData] = useState({});
  let history = useHistory();

  let toSelectPlayer = [];

  const getAllPlayers = async () => {
    const response = await fetch("http://localhost:8000/players");
    const players = await response.json();
    // let allPlayersData = players.data;
    // for (let player in players.data) {
    //   toSelectPlayer.push(allPlayersData[player]);
    // }
    setPlayers(players.data);
  };

  const handleChangePlayer = (event) => {
    let playerIds = [];
    event.map((a) => playerIds.push(a.value));
    setToSubmitData(playerIds);
  };

  const analyse = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8000/player-performance",
        toSubmitData
      );
      let data = [];
      debugger;
      res.data.data.forEach((o) =>
      data.push({
          id: o[0],
          playerName: players.find((x) => x.ID == o[0]).player_name,
          overall: o[3],
          recent: o[4],
          away: o[5],
          home: o[6],
          predictionScore: o[2],
        })
      );
      history.push({
        pathname: "/player-performance/result",
        state: data,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllPlayers();
  }, []);

  const options = [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
  ];

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid container justify="center" className={classes.image}>
        <Grid
          item
          xs={12}
          sm={8}
          md={5}
          component={Paper}
          direction="row"
          elevation={6}
          square
        >
          <Grid className={classes.paper}>
            <Avatar className={classes.avatar}>
              <SportsCricketIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Player Perfromance
            </Typography>
            <form className={classes.form} noValidate>
              <Select
                // defaultValue={[options[0], options[1]]}
                isMulti
                name="colors"
                // options={options}
                onChange={handleChangePlayer}
                className="basic-multi-select"
                classNamePrefix="select"
                options={players.map((p) => {
                  return {
                    label: p.player_name,
                    value: p.ID,
                  };
                })}
              />

              <Button
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={analyse}
              >
                Analyse
              </Button>
              <Box mt={5}>
                <Copyright />
              </Box>
            </form>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
