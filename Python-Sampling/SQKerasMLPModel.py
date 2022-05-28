# mlp for regression
import numpy as np
import pandas as pd
import tensorflow as tf
import sklearn as skl
import matplotlib.pyplot as plt

from numpy import *
from pandas import read_csv
from sklearn import preprocessing, linear_model
from sklearn.model_selection import train_test_split
from tensorflow.keras import Sequential
from tensorflow.keras.layers import Dense

# load the dataset
path = 'C:/Users/abhay_sharma/Desktop/NRCan/data/unsatDFFAPARLC/unsatDFFAPARLC1.csv'
df = read_csv(path)

# split into input and output columns with 100000 samples
X, y = df.values[1:100000, -1], df.values[1:100000, -1]

# split into train and test datasets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.33)
print(X_train.shape, X_test.shape, y_train.shape, y_test.shape)

# determine the number of input features
n_features = X_train.shape[1]

# define model
model = Sequential()
model.add(Dense(10, activation='relu', kernel_initializer='he_normal', input_shape=(n_features,)))
model.add(Dense(8, activation='relu', kernel_initializer='he_normal'))
model.add(Dense(1))

# compile the model
model.compile(optimizer='adam', loss='mse')

# fit the model
model.fit(X_train, y_train, epochs=100, batch_size=32, verbose=1)

# evaluate the model
error = model.evaluate(X_test, y_test, verbose=0)
print('MSE: %.3f, RMSE: %.3f' % (error, sqrt(error)))

# make a prediction and display it
FAPAR_pred = pd.Series(model.predict(X_test).flatten())
fig, ax = plt.subplots(1, 1, figsize=(15,15))
ax.scatter(X_test[:,0], FAPAR_pred, c='r')
ax.plot(np.linspace(0,3))

print(X_train.shape[1])
