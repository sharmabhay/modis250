import ee
import folium

import tensorflow as tf
from tensorflow.keras.layers import *
from tensorflow.keras.optimizers import *

ee.Authenticate()
ee.Initialize()

i1 = ee.ImageCollection("COPERNICUS/S2_SR").first()
print(i1.getInfo())
print(i1.bandNames().getInfo())

print(tf.__version__)

# compile the model
model = tf.keras.Sequential()
opt = SGD(learning_rate=0.01, momentum=0.9)
model.compile(optimizer=opt, loss='binary_crossentropy')

# compile the model
model2 = tf.keras.Sequential()
model2.compile(optimizer='sgd', loss='mse')

# compile the model
model3 = tf.keras.Sequential()
model3.compile(optimizer='sgd', loss='binary_crossentropy', metrics=['accuracy'])

# fit the model
model.fit(X, y, epochs=100, batch_size=32)

# fit the model
# verbose=2 to get simple report of model performance in each epoch
model.fit(X, y, epochs=100, batch_size=32, verbose=0)

# evaluate the model
# verbose=0 to turn off all output
loss = model.evaluate(X, y, verbose=0)

# make a prediction
yhat = model.predict(X)
