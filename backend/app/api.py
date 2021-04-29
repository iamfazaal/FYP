from fastapi import FastAPI, requests
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional


# New Code Snippets
import pandas as pd
import os

import sys

# insert at 1, 0 is the script path (or '' in REPL)
sys.path.insert(
    1, 'C:/Users/fazaa/Desktop/FYP_Prototype_V2/backend/app',)
# Importing the Common.py file
import PlayerPerfromance

sys.path.insert(
    1, 'C:/Users/fazaa/Desktop/FYP_Prototype_V2/backend/app/PlayerPerfromance.py',)
# Importing the Common.py file
import PlayerPrediction



app = FastAPI()

origins = [
    "http://localhost:3000",
    "localhost:3000"
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


@app.get("/countries", tags=["countries"])
async def read_countries() -> dict:
    countries_data = pd.read_csv(
        'C:/Users/fazaa/Desktop/FYP_Prototype_V2/backend/app/data-files/unique_team_dataframe_with_id.csv')
    # breakpoint()
    data = dict(zip(countries_data.ID, countries_data.team))
    return {"data": data}
    # return {"message": "Welcome to your todo list."}


@app.get("/players", tags=["players"])
async def read_players() -> dict:
    players_data_frame = pd.read_csv(
        'C:/Users/fazaa/Desktop/FYP_Prototype_V2/backend/app/data-files/unique_player_records.csv')
    # data = dict(zip(players_data_frame.ID, players_data_frame.player_name))
    columns = ['ID', 'player_name', 'team']
    players_data_frame['metadata'] = players_data_frame[columns].to_dict(
        orient='records')
    data = list(players_data_frame['metadata'])
    return {"data": data}


@app.get("/sl-players", tags=["SLPlayers"])
async def read_SLplayers() -> dict:
    players_data_frame = pd.read_csv(
        'C:/Users/fazaa/Desktop/FYP_Prototype_V2/backend/app/data-files/unique_player_records.csv')
    columns = ['ID', 'player_name']
    players_data_frame.query(
        'ID == [413,324,790,555,1604,1164,1272,1266,1165,757,746,847,1163,1393,103,1191,776,775,412,1265,345,777,758,1342,1271,798,641,1603,842]', inplace=True)
    players_data_frame['metadata'] = players_data_frame[columns].to_dict(
        orient='records')
    data = list(players_data_frame['metadata'])
    return {"data": data}


@app.get("/venues", tags=["venues"])
async def read_venues() -> dict:
    venue_data_frame = pd.read_csv(
        'C:/Users/fazaa/Desktop/FYP_Prototype_V2/backend/app/data-files/unique_venue_dataframe_with_id.csv')
    data = dict(zip(venue_data_frame.ID, venue_data_frame.venue))
    return {"data": data}


class PredictScore(BaseModel):
    oppositionTeam: str
    oppositionTeamId: int
    playerId: int
    playerName: str
    playerTeamId: int
    vanue: Optional[str] = ""
    venueId: Optional[int] = ""


@app.post("/predict-score", tags=["score"])
async def predict_score(item: PredictScore):
    predicted_result = PlayerPrediction.predict_player(
        item.playerId, item.playerTeamId, item.oppositionTeamId, item.venueId)
    return {
        "data": predicted_result[0]
    }


@app.post("/player-performance", tags=["player-performance"])
async def Player_performance(ids: list):
    unique_player_record_data_frame = pd.read_csv(
        'C:/Users/fazaa/Desktop/FYP_Prototype_V2/backend/app/data-files/unique_player_records.csv')
    players_data_list = PlayerPerfromance.get_players_by_multiple_ids(
        ids, unique_player_record_data_frame)
    return {
        "data": PlayerPerfromance.analyse_players(players_data_list)
    }
