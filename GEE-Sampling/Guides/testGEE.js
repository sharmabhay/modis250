// Region of interest
var region = ee.Geometry.Polygon(
    [[[-105.34, 40.08],
      [-105.34, 39.95],
      [-105.20, 39.95],
      [-105.20, 40.08]]]);

var collection = ee.ImageCollection('MODIS/MOD13Q1')
               .filterDate('2000-01-01', '2017-12-31')
               .filterBounds(region);

var ComputeRegionMean = function(img, list) {
list = ee.List(list)
var date = img.date().format('yyyy-MM-dd')
var region_mean = img.reduceRegion({
reducer: ee.Reducer.sum(),
geometry: region,
scale: 250,
maxPixels: 1e9
});
return list.add(ee.List([date, region_mean.get('sur_refl_b03')]));
};

ee.Dictionary(collection.iterate(ComputeRegionMean, ee.List([])))
var image_stats = ee.List(collection.iterate(ComputeRegionMean, ee.List([])))
var image_stats = ee.Dictionary(image_stats.flatten())
print(image_stats)
