// Importing 3 decision trees from google storage
var b1 = ee.Blob("gs://modis250m/GEE-sampling/code/trees/unsatDFLC3/tree01.txt").string();
var b2 = ee.Blob("gs://modis250m/GEE-sampling/code/trees/unsatDFLC3/tree02.txt").string();
var b3 = ee.Blob("gs://modis250m/GEE-sampling/code/trees/unsatDFLC3/tree03.txt").string();

// Creating a classifier from the decision trees
var trainedClassifierAll = ee.Classifier.decisionTreeEnsemble(
  ee.List([b1, b2, b3])
);
print(trainedClassifierAll);
print(trainedClassifierAll.schema());

// Selecting the required image bands by comparing with the classifier bands
var dataset = ee.ImageCollection('MODIS/006/MOD09GA').first().select(
  ['SensorAzimuth', 'SolarZenith', 'sur_refl_b01', 'sur_refl_b02', 'SensorZenith', 'SolarAzimuth'], 
  trainedClassifierAll.schema()
);
print(dataset);

// Extracting the image bands by name and adding layers to the map
var result = dataset.classify(trainedClassifierAll);
Map.centerObject(result);
Map.addLayer(result);
Map.addLayer(dataset);
