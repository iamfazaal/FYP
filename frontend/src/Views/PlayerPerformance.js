import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Content from "../Dashboard/Content";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Chip from "@material-ui/core/Chip";
import SportsCricketIcon from "@material-ui/icons/SportsCricket";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import axios from "axios";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  headerContainer: {
    position: "relative",
    height: "100px",
  },
  header: {
    display: "flex",
    position: "absolute",
    width: "calc(100%)",
    top: "-70px",
    alignItems: "flex-end",
    "& > *": {
      margin: `${theme.spacing(3)}px ${theme.spacing(1)}px`,
    },
  },
  spacer: {
    flexGrow: "1",
  },
  avatar: {
    border: `3px solid white`,
    width: theme.spacing(13),
    height: theme.spacing(13),
    boxShadow: theme.shadows[3],
  },
  actionGroup: {
    display: "flex",
    width: "330px",
    justifyContent: "space-between",
    marginRight: 0,
  },
  summaryCards: {
    display: "flex",
    flexWrap: "wrap",
  },
  summaryCard: {
    margin: theme.spacing(1),
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  tripCard: {
    margin: theme.spacing(1),
    padding: theme.spacing(2),
  },
}));

export function SummaryCard({ title, value, component }) {
  const classes = useStyles();

  return (
    <Paper elevation={2} className={classes.summaryCard}>
      <Typography color={"textSecondary"} variant="h5" gutterBottom>
        {title}
      </Typography>
      {component || (
        <Typography color={"primary"} variant="h3">
          {value}
        </Typography>
      )}
    </Paper>
  );
}

export default function PlayerPerformance({ id }) {
  const { playerId } = useParams();
  let history = useHistory();
  const [row, setRows] = useState(history.location.state);
  console.log(row);

  const classes = useStyles();
  const loading = false;

  if (loading) {
    return (
      <Content>
        <CircularProgress />
      </Content>
    );
  }

  const trips = 4;
  const distance = 0;
  const fare = 0;
  return (
    <Content>
      <div
        style={{
          height: "200px",
          backgroundPosition: "center",
          backgroundSize: "cover",
          filter: "contrast(75%)",
          backgroundImage: "url(/img/stadium.jpg)",
        }}
      />
      <div className={classes.headerContainer}>
        <div className={classes.header}>
          <Avatar
            // alt={driver.name}
            // src={require(`../assets/${row.id}.png`)}
            src={`~../assets/${row.id}.png`}

            classes={{ root: classes.avatar, circle: classes.circle }}
          />
          <Typography variant={"h5"}>{row.playerName}</Typography>
          <Chip variant={"outlined"} icon={<SportsCricketIcon />} />
        </div>
      </div>
      <div className={classes.summaryCards}>
        <SummaryCard
          title={"Carrer Score"}
          value={Math.ceil(row.overall * 100)}
        />
        <SummaryCard
          title={"Recent Score"}
          value={Math.ceil(row.recent * 100)}
        />
        <SummaryCard title={"Home Score"} value={Math.ceil(row.home * 100)} />
        <SummaryCard title={"Away Score"} value={Math.ceil(row.away * 100)} />
      </div>
      <div className={classes.summaryCards}>
        {" "}
        <SummaryCard title={"Projected Score"} value={Math.ceil(row.predictionScore * 100)} />
      </div>
    </Content>
  );
}
