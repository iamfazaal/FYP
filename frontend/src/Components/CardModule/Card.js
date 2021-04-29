import React, { useState } from "react";
import Paper from "@material-ui/core/Paper";
import clsx from "clsx";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  img: {
    height: 128,
    margin: "auto",
    display: "block",
    maxWidth: "100%",
    border: "solid 6px transparent",
    borderRadius: "50%",
    "&:hover": { borderColor: "rgb(99, 204, 131)" },
  },
}));

function Card(props) {
  const classes = useStyles();

  const dragStart = (e) => {
    const target = e.target;
    e.dataTransfer.setData(
      "cardId",
      `{"target": "${target.id}", "id": "${props.id}", "type": "${props.type}", "title": "${props.title}", "board_id": "${props.boardId}" }`
    );
  };

  const dragOver = (e) => {
    e.stopPropagation();
  };
  return (
    <Grid item xs={4}>
      <div
        key={props.id}
        id={props.id}
        className={props.className}
        draggable={props.draggable}
        onDragStart={dragStart}
        onDragOver={dragOver}
        style={{ textAlign: "center" }}
      >
        <div>
          <div className={classes.image}>
            <img
              src={require(`../../assets/${props.id}.png`)}
              className={classes.img}
              alt={props.title}
            />
          </div>
          <h5 style={{ marginTop: "20px" }}>{props.title}</h5>
        </div>
      </div>
    </Grid>
  );
}

export default Card;
