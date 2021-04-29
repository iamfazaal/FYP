import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.svm import SVC
from sklearn.neural_network import MLPClassifier
from sklearn.naive_bayes import GaussianNB
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
# from Player import *
import math as math
import pandas as pd
from numpy import inf
import json
from sklearn.metrics import roc_auc_score , roc_curve
from sklearn.metrics import confusion_matrix
import matplotlib.pyplot as plt


class Player:
    def __init__(self, ID, player_name, overall_matches, overall_innings, overall_runs, overall_average, strike_rate, centuries, fifties, thirties, home_matches, home_innings, home_runs,
                 home_average, home_strike_rate, home_100s, home_50s, home_30s, away_matches, away_innings, away_runs, away_average, away_strike_rate, away_100s, away_50s, away_30s,
                 form_matches, form_innings, form_runs, form_average, form_strike_rate, recent_100s, recent_50s, recent_30s):
        self.ID = ID
        self.player_name = player_name
        self.overall_matches = overall_matches
        self.overall_innings = overall_innings
        self.overall_runs = overall_runs
        self.overall_average = overall_average
        self.strike_rate = strike_rate
        self.centuries = centuries
        self.fifties = fifties
        self.thirties = thirties
        self.home_matches = home_matches
        self.home_innings = home_innings
        self.home_runs = home_runs
        self.home_average = home_average
        self.home_strike_rate = home_strike_rate
        self.home_100s = home_100s
        self.home_50s = home_50s
        self.home_30s = home_30s
        self.away_matches = away_matches
        self.away_innings = away_innings
        self.away_runs = away_runs
        self.away_average = away_average
        self.away_strike_rate = away_strike_rate
        self.away_100s = away_100s
        self.away_50s = away_50s
        self.away_30s = away_30s
        self.form_matches = form_matches
        self.form_innings = form_innings
        self.form_runs = form_runs
        self.form_average = form_average
        self.form_strike_rate = form_strike_rate
        self.recent_100s = recent_100s
        self.recent_50s = recent_50s
        self.recent_30s = recent_30s

    def calculate_overall_score(self):
        if (self.overall_innings <= 0):
            return 0.0
        else:
            u = self.overall_innings / self.overall_matches
            v = (20 * self.centuries) + \
                (10 * self.fifties) + (5 * self.thirties)
            w = (0.3 * v) + (0.7 * self.overall_average)
            return u * w

    def calculate_home_score(self):
        if(self.home_innings <= 0):
            return 0.0
        else:
            u = self.home_innings / self.home_matches
            v = (20 * self.home_100s) + \
                (10 * self.home_50s) + (5 * self.home_30s)
            w = (0.3 * v) + (0.7 * self.home_average)
            return u * w

    def calculate_away_score(self):
        if(self.away_innings <= 0):
            return 0.0
        else:
            u = self.away_innings / self.away_matches
            v = (20 * self.away_100s) + \
                (10 * self.away_50s) + (5 * self.away_30s)
            w = (0.3 * v) + (0.7 * self.away_average)
            return u * w

    def calculate_recent_score(self):
        if(self.form_innings <= 0):
            return 0.0
        else:
            u = self.form_innings / self.form_matches
            v = (20 * self.recent_100s) + \
                (10 * self.recent_50s) + (5 * self.recent_30s)
            w = (0.3 * v) + (0.7 * self.form_average)
            return u * w

def batsmen_model(matches, innings, average, hundreds, fifties, thirties):
    if(innings <= 0):
        return 0.0
    else:
        u = innings / matches
        v = (20 * hundreds) + (10 * fifties) + (5 * thirties)
        w = (0.3 * v) + (0.7 * average)
        return u * w


def batsmen_model_form(matches, innings, average, runs, hundreds, fifties, thirties, strike_rate):
    if(innings <= 0):
        return 0.0
    else:
        u = innings / matches
        v = (20 * hundreds) + (10 * fifties) + (5 * thirties)
        w = (0.5 * v) + (0.2 * strike_rate) + (0.5 * runs)
        return u * w


def fetch_player_pre(player_data):
    try:
        pre_data = []

        for i, row in player_data.iterrows():
            careerScore = batsmen_model(row['overall_innings'] + 10, row['overall_innings'],
                                             row['overall_average'], row['centries'], row['fifties'] , row['thirties'])
            awayScore = batsmen_model(row['away_innings'] + 2, row['away_innings'],
                                           row['away_average'], row['away_100s'], row['away_50s'],row['away_30s'])

            homeScore = batsmen_model(row['home_innings'] + 2, row['home_innings'],
                                           row['home_average'], row['home_100s'], row['home_50s'] , row['home_30s'])

            recentScore = batsmen_model(row['form_innings'] + 2, row['form_innings'],
                                             row['form_average'], row['recent_100s'], row['recent_50s'], row['recent_30s'])
              
            pre_data.append(
                    [careerScore, recentScore, awayScore, homeScore])
    finally:
        return pre_data


def fetch_player_post(player_data):
    recent_performance = []
    post_data = []

    for i, row in player_data.iterrows():
        recentScore=batsmen_model_form(row['form_innings'] + 2, row['form_innings'],
                                             row['form_average'], row['form_runs'], row['recent_100s'], row['recent_50s'], row['recent_30s'], row['form_strike_rate'])
        recent_performance.append([recentScore])


    rs_perfromance=np.array(recent_performance)
    rs_perfromance[rs_perfromance == inf]=0
    mean_performance=sum(rs_perfromance[:, 0]) / len(recent_performance)
    for recent_performance in rs_perfromance:
        if(recent_performance < mean_performance):
            post_data.append(0)
        else:
            post_data.append(1)

    return post_data


def feature_scale(players, max_carrer_score, max_recent_score, max_away_score, max_home_score):

    for player in players:
        careerScore=player[0]
        recentScore=player[1]
        awayScore=player[2]
        homeScore=player[3]

        normalized_career_score=careerScore / max_carrer_score
        player[0]=normalized_career_score

        if(recentScore != 0):
            normalized_recent_score=recentScore / max_recent_score
            player[1]=normalized_recent_score

        if(awayScore != 0):
            normalized_away_score=awayScore / max_away_score
            player[2]=normalized_away_score

        if(homeScore != 0):
            normalized_home_score=homeScore / max_home_score
            player[3]=normalized_home_score

    return players


def performance_rate(prediction, test_data):
    error_rate=0
    for index, pred in enumerate(prediction):
        if(pred != test_data[index]):
            error_rate += 1
    return 1/2 * (math.log((1-(error_rate / len(prediction))) / (error_rate / len(prediction))))

def get_players_by_multiple_ids(ids_list, unique_player_data_frame):
    players_data_list=[]
    for id in ids_list:
        player_detail_by_id=unique_player_data_frame[
            unique_player_data_frame['ID'] == id]
        if (len(player_detail_by_id) > 0):
            players_data_list.append(player_detail_by_id)
   
    return players_data_list

def initialise():

    bastmen_pre_record = pd.read_csv('C:/Users/fazaa/Desktop/FYP_Prototype_V2/backend/app/data-files/player_pre.csv')
    bastmen_post_record = pd.read_csv('C:/Users/fazaa/Desktop/FYP_Prototype_V2/backend/app/data-files/player_post.csv')

    # Feature
    player_pre_perfromance = fetch_player_pre(bastmen_pre_record)
    
    # Label
    player_post_perfromance = fetch_player_post(bastmen_post_record)


    np_pre_players = np.array(player_pre_perfromance)
    np_post_players = np.array(player_post_perfromance)

    np_pre_players[np_pre_players == inf] = 0 


    max_carrer_score = np.max(np_pre_players[:,0])
    max_recent_score = np.max(np_pre_players[:, 1])
    max_away_score = np.max(np_pre_players[:, 2])
    max_home_score = np.max(np_pre_players[:, 3])

    np_pre_players = feature_scale(
        np_pre_players, max_carrer_score,max_recent_score, max_away_score, max_home_score)
    
    # Train_test_split 
    feature_train, feature_test, target_train, target_test = train_test_split(
        np_pre_players, np_post_players, test_size=0.3, random_state=42)

    # Train NaiveBayes model
    gnb = GaussianNB()
    gnb.fit(feature_train, target_train)
    pred_nb = gnb.predict(feature_test)

    # Train Multi-layerPerceptron model
    mlp_clf = MLPClassifier(solver='lbfgs', alpha=1e-5,
                            hidden_layer_sizes=(5, 2), random_state=1)
    mlp_clf.fit(feature_train, target_train)
    pred_mlp = mlp_clf.predict(feature_test)

    # Train SVM model
    svm_clf = SVC(C=1000, kernel='sigmoid', gamma=0.001, probability=True)
    svm_clf.fit(feature_train, target_train)
    pred_svm = svm_clf.predict(feature_test)


    amt_say_nb = performance_rate(pred_nb, target_test)

    amt_say_mlp = performance_rate(pred_mlp, target_test)

    amt_say_svm = performance_rate(pred_svm, target_test)

    return  gnb, mlp_clf, svm_clf, amt_say_mlp, amt_say_nb, amt_say_svm, max_home_score, max_away_score,max_recent_score,  max_carrer_score, feature_train, feature_test, target_train, target_test


nb, mlp, svm,  mlp_say, nb_say, svm_say, max_home_score, max_away_score,max_recent_score,  max_carrer_score, feature_train, feature_test, target_train, target_test = initialise()



def builtFeatures(player):

    careerScore = player.calculate_overall_score()

    awayScore = player.calculate_away_score()

    homeScore = player.calculate_home_score()

    recentScore = player.calculate_recent_score()

    return [careerScore, recentScore, awayScore, homeScore]


prediction_proba = []


def prediction_engine(player_list):

    nb_pred_prob = nb.predict_proba(player_list)
    mlp_pred_prob = mlp.predict_proba(player_list)
    svm_pred_prob = svm.predict_proba(player_list)

    return nb_pred_prob, mlp_pred_prob, svm_pred_prob


def hybrid_algo(nb_pred_prob, mlp_pred_prob, svm_pred_prob):

    final_predictions = []

    for index, initial_nb_pred in enumerate(nb_pred_prob):
        print(initial_nb_pred)
        weighted_nb_prediction0 = nb_say * (nb_pred_prob[index][0])
        weighted_nb_prediction1 = nb_say * (nb_pred_prob[index][1])

        weighted_mlp_prediction0 = mlp_say * (mlp_pred_prob[index][0])
        weighted_mlp_prediction1 = mlp_say * (mlp_pred_prob[index][1])

        weighted_svm_prediction0 = svm_say * (svm_pred_prob[index][0])
        weighted_svm_prediction1 = svm_say * (svm_pred_prob[index][1])

        mean_weighted_prediction0 = (weighted_mlp_prediction0 + weighted_nb_prediction0 +
                                     weighted_svm_prediction0 ) / 3
        mean_weighted_prediction1 = (weighted_mlp_prediction1 + weighted_nb_prediction1 +
                                     weighted_svm_prediction1 ) / 3

        prediction_proba.append(mean_weighted_prediction1)
        print(mean_weighted_prediction0)
        print(mean_weighted_prediction1)

        confidence = (nb_pred_prob[index][1] + mlp_pred_prob[index]
                      [1] + svm_pred_prob[index][1]) / 3
        final_predictions.append([1, confidence])
    return final_predictions

# Build players with provided data.
def build_player(player):
    in_player = Player(player["ID"], player['player_name'], player['overall_innings'] + 10, player['overall_innings'], player['overall_runs'], player['overall_average'],
                                     player['strike_rate'], player['centuries'], player['fifties'],player['thirties'], player[
                                         'home_innings'] + 2, player['home_innings'], player['home_runs'], player['home_average'],
                                     player['home_strike_rate'], player['home_100s'], player['home_50s'],player['home_30s'], player['away_innings'] + 2, player[
        'away_innings'], player['away_runs'], player['away_average'], player['away_strike_rate'],
        player['away_100s'], player['away_50s'] ,player['away_30s'], player['form_innings'] + 2, player['form_innings'], player['form_runs'], player['form_average'], player['form_strike_rate'], player['recent_100s'], player['recent_50s'], player['recent_30s'])
    return in_player


def analyse_players(players):
    print("Analyzing Players")
    select_players = []
    tot_predictions = []
    for player in players:
        player = player.to_dict(orient='records')
        player = player[0]
        player = build_player(player)
        select_players.append(builtFeatures(player))

    if(len(select_players) > 0):
        select_players = feature_scale(
                select_players, max_carrer_score, max_recent_score, max_away_score, max_home_score)

        nb_pred_prob , mlp_pred_prob, svm_pred_prob = prediction_engine(select_players)
        tot_predictions = hybrid_algo(
                nb_pred_prob, mlp_pred_prob, svm_pred_prob)

    score_array = [[0 for x in range(8)]
                        for y in range(len(tot_predictions))]
    print(select_players)
    for index, prediction in enumerate(tot_predictions):
        player = players[index].to_dict(orient='records')
        x = player[0]
        score_array[index][0] = x['ID']
        score_array[index][1] = prediction[0]
        score_array[index][2] = prediction[1]
        score_array[index][3] = select_players[index][0]
        score_array[index][4] = select_players[index][1]
        score_array[index][5] = select_players[index][2]
        score_array[index][6] = select_players[index][2]
        if(select_players[index][1] > 0):
            score_array[index][7] = 1
        else:
            score_array[index][7] = 0
    return score_array

def generate_roc():
    prediction_engine(feature_test)
    hybrid_algo()
    breakpoint()
    auc = roc_auc_score(target_test, prediction_proba)
    print('AUC: %.3f' % auc)
    fpr, tpr, thresholds = roc_curve(target_test, prediction_proba)
    plt.plot([0, 1], [0, 1], linestyle='--')
    plt.plot(fpr, tpr, marker='.')
    # show the plot
    plt.show()

# generate_roc()
