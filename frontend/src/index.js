import React from "react";
import { render } from "react-dom";
import AppBarAndDrawer from "./AppBarAndDrawer/AppBarAndDrawer";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Dashboard } from "./Dashboard/Dashboard";
import { Home } from "./Home/Home";
import { PlayerPerformance , PlayerRank, PlayerScore } from "./Views/index";
import { ThemeProvider } from "@material-ui/core/styles";
import { useTheme } from "./theme";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import People from "./Views/ReduxTable/people";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import peopleReducer from "./Views/ReduxTable/peopleSlice";


function App() {
  const [currentTheme, setCurrentTheme] = useTheme();
  const store = configureStore({
    reducer: {
      people: peopleReducer,
    },
  });
  return (
    <>
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <ThemeProvider theme={currentTheme}>
        <Provider store={store}>
            <Router>
              <div>
                <AppBarAndDrawer
                  currentTheme={currentTheme}
                  setCurrentTheme={setCurrentTheme}
                />
                <Switch>
                  <Route path="/dashboard">
                    <Dashboard />
                  </Route>
                  <Route path="/player-projection">
                    <PlayerScore />
                  </Route>
                  <Route exact path="/player-performance">
                    <PlayerRank />
                  </Route>
                  <Route exact path="/player-performance/result">
                    <People/>
                  </Route>
                  <Route path={`/player-performance/result/:playerId`}>
                    <PlayerPerformance/>
                  </Route>
                  <Route path="/">
                    <Home />
                  </Route>
                </Switch>
              </div>
            </Router>
            </Provider>
      </ThemeProvider>
    </MuiPickersUtilsProvider>
  </>
    // <ThemeProvider>
    //   <Dashboard/>
    // </ThemeProvider>
  );
}

const rootElement = document.getElementById("root");
render(<App />, rootElement);
