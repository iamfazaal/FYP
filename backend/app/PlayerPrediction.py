import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
import pandas as pd

def custom_accuracy(y_test, y_pred, thresold):
    right = 0
    l = len(y_pred)
    for i in range(0, l):
        if(abs(y_pred[i]-y_test[i]) <= thresold):
            right += 1
    return ((right/l)*100)


def predict_player(player_id, country_id, opposition_team_id, venue_id):

    # Importing the dataset
    player_data = pd.read_csv(
        'C:/Users/fazaa/Desktop/FYP_Prototype_V2/backend/app/data-files/player_performance_analysis_data_with_numbers.csv')

    X = player_data.iloc[:, [3, 4, 5, 6]].values
    y = player_data.iloc[:, 14].values

    #Split data set for train and test
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.25, random_state=0)

    #Feature Scaling
    sc = StandardScaler()
    X_train = sc.fit_transform(X_train)
    X_test = sc.transform(X_test)

    #Training the data
    reg = RandomForestRegressor(n_estimators=100, max_features=None)
    reg.fit(X_train, y_train)

    # Testing the dataset on trained model
    y_pred = reg.predict(X_test)
    score = reg.score(X_test, y_test)*100
    print("R square value:", score)
    print("Custom accuracy:", custom_accuracy(y_test, y_pred, 20))

    new_prediction = reg.predict(sc.transform(
        np.array([[player_id, country_id, opposition_team_id, venue_id]])))
    print("Prediction score:", new_prediction)
    return new_prediction
