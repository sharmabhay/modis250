// list of classifier numbers
var classifierNumbers = ee.List([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
var classifierPath = ee.String("gs://modis250m/GEE-sampling/code/trees/unsatDFFAPARLC/unsatDFFAPARLC");
// var classifierPath = ee.String("gs://modis250m/GEE-sampling/code/trees/unsatDFLAILC/unsatDFLAILC");
var numTrees = ee.Number(10);

// gets the classifier of the randomForest in path
var getClassifier = function(path, lcNum, numTrees) {
  var path = ee.String(path);
  var lcNum = ee.String(lcNum);
  var numTrees = ee.Number(numTrees);

  return ee.Classifier.decisionTreeEnsemble(
    ee.List.sequence(0, numTrees.subtract(1)).map(function(treeNum) {
      return ee.Blob(path.cat(lcNum).cat(ee.String("/tree")).cat(ee.Number(numTrees).format("%02d")).cat(ee.String(".txt"))).string();
    })
  );
}

// make a classifier dictionary element
var makeClassifierElement = function(classifierPath, numTrees, classifierNumber) {
  var classifierPath = ee.String(classifierPath);
  var classifierNumber = ee.Number(classifierNumber);
  var numTrees = ee.Number(numTrees);

  return ee.Dictionary(["classifierNumber", classifierNumber,
                        "classifier", getClassifier(classifierPath, classifierNumber, numTrees)]);
}

// mask out numbers not in classifierNumbers
var applyClassifier = function(inputImage, classifierDictionary) {
  var inputImage = ee.Image(inputImage);
  var classifierDictionary = ee.Dictionary(classifierDictionary);

  return ee.Image(inputImage.updateMask(inputImage.select("LC_Type3").eq(ee.Number(classifierDictionary.get("classifierNumber"))))
                            .classify(classifierDictionary.get("classifier"), ee.String("classifiedImageClass").cat(classifierDictionary.get("classifierNumber"))));
}
/* Same code as:
var maskedClassifier = function(inputImage, classifierDictionary) {
  var inputImage = ee.Image(inputImage);
  var classifierDictionary = ee.Dictionary(classifierDictionary);

  // select the number mask and create a binary mask
  var numMask = inputImage.select("LC_Type3");
  var mask = numMask.eq(ee.Number(classifierDictionary.get("classifierNumber")));

  return inputImage.updateMask(mask).classify(classifierDictionary.get("classifier"),
                                              ee.String("classifiedImageClass").cat(classifierDictionary.get("classifierNumber")));
}
*/

// make a list of classifier dictionaries
var classifierDictionaryList = classifierNumbers.map(makeClassifierElement.bind(null, classifierPath, numTrees));
print(classifierDictionaryList);

// combine the MOD09 and MCD12 image bands
var MOD09GA = ee.ImageCollection('MODIS/006/MOD09GA').filterDate("2021-11-01", "2021-12-01")
                                                     .select(['SensorAzimuth', 'SolarZenith', 'sur_refl_b01', 'sur_refl_b02', 'SensorZenith', 'SolarAzimuth'],
                                                             ['vaa', 'sza', 'b01', 'b02', 'vza', 'saa'])
                                                     .mosaic();
var MCD12Q1 = ee.ImageCollection('MODIS/006/MCD12Q1').first().select(['LC_Type3']);
var inputImage = MOD09GA.addBands(MCD12Q1);
print(inputImage);

// apply classifiers to MODIS image
var classifiedImageList = classifierDictionaryList.map(applyClassifier.bind(null, inputImage));
print(classifiedImageList);
print(ee.ImageCollection(classifiedImageList));

// display the classified images on the map
Map.addLayer(ee.Image(classifiedImageList.get(0)));
Map.addLayer(ee.Image(classifiedImageList.get(1)));
Map.addLayer(ee.Image(classifiedImageList.get(2)));

// statements used for debugging
print(ee.String("Debugging Results: \n\n").cat(
      ee.String("Data Type of inputImage \n: ").cat(inputImage.name()).cat(ee.String("\n")).cat(
      ee.String("Data Type of classifierDictionaryList.get(0) \n: ").cat(classifierDictionaryList.get(0).name())).cat(ee.String("\n")).cat(
      ee.String("Data Type of ee.Dictionary(classifierDictionaryList).get(1) \n: ").cat(ee.Dictionary(classifierDictionaryList).get(1).name())))
);
print(ee.Classifier(ee.Dictionary(classifierDictionaryList.get(0)).get("classifier")).schema());
Map.addLayer(MCD12Q1, null, "MCD12Q1");
Map.addLayer(MOD09GA, null, "MOD09GA");
Map.addLayer(inputImage.select("LC_Type3").eq(ee.Number(ee.Dictionary(classifierDictionaryList.get(0)).get("classifierNumber"))), null, "Mask1");
