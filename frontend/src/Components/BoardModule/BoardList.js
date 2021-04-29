import React from "react";
import Board from "./Board";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import axios from "axios";
import { useHistory } from "react-router-dom";

// const res = await axios.post(
//   `${Utils.getBaseApiUrl()}/v1/assignments`,
//   assignmentToSave
// );
// localStorage.setItem('assignmentId', res.data.id);
// props.history.push(`/assignments/` + res.data.id + `/questions`);

function BoardList({ boards }) {
  
  let history = useHistory();
  const analyse = async () => {
   const  playerIds = boards[1].cards.map(elm => parseInt(elm.id))
    try {
      const res = await axios.post("http://localhost:8000/player-performance" , playerIds);
      let data = [];
      debugger
      res.data.data.forEach((o) =>
        data.push({
          id: o[0],
          playerName:boards[1].cards.find(x => x.id == o[0]).title,
          overall: o[3],
          recent: o[4],
          away: o[5],
          home: o[6],
          predictionScore :o[2]
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

  return (
    <div>
      <Grid container spacing={3} style={{ justifyContent: "center" }}>
        {boards && boards.map((item) => <Board key={item.id} {...item} />)}
        <Button
          variant="contained"
          color="primary"
          onClick={analyse}
          // disabled={boards[1].cards.length == 0 ? true : false}
        >
          Analyse
        </Button>
      </Grid>
    </div>
  );
}

export default BoardList;
