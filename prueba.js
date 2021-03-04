 var map, serviceAreaTask, params, clickpoint;

    require([
      "esri/map", "esri/config", 
      "esri/tasks/ServiceAreaTask", "esri/tasks/ServiceAreaParameters", "esri/tasks/FeatureSet",
      "esri/symbols/SimpleMarkerSymbol", "esri/symbols/SimpleLineSymbol", "esri/symbols/SimpleFillSymbol",
      "esri/geometry/Point", "esri/graphic",
      "dojo/parser", "dojo/dom", "dijit/registry", 
      "esri/Color", "dojo/_base/array",
      "dijit/layout/BorderContainer", "dijit/layout/ContentPane", 
      "dijit/form/HorizontalRule", "dijit/form/HorizontalRuleLabels", "dijit/form/HorizontalSlider",
      "dojo/domReady!"
    ], function(
      Map, esriConfig, 
      ServiceAreaTask, ServiceAreaParameters, FeatureSet, 
      SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol,
      Point, Graphic,
      parser, dom, registry,
      Color, arrayUtils
    ) {
      parser.parse();

      //This sample requires a proxy page to handle communications with the ArcGIS Server services. You will need to  
      //replace the url below with the location of a proxy on your machine. See the 'Using the proxy page' help topic 
      //for details on setting up a proxy page.
      esriConfig.defaults.io.proxyUrl = "/proxy/";
      
      map = new Map("map", { 
        basemap: "streets",
        center: [-122.447, 37.781],
        zoom: 15
      });

      map.on("click", mapClickHandler);

      params = new ServiceAreaParameters();
      params.defaultBreaks= [1];
      params.outSpatialReference = map.spatialReference;
      params.returnFacilities = false;
      
      serviceAreaTask = new ServiceAreaTask("https://sampleserver3.arcgisonline.com/ArcGIS/rest/services/Network/USA/NAServer/Service Area");
            
      registry.byId("hslider").on("change", updateHorizontalLabel);
      updateHorizontalLabel();

      // Create function that updates label when changed
      function updateHorizontalLabel() {
        // Get access to nodes/widgets we need to get/set values
        var hSlider = registry.byId("hslider");
        var label = dom.byId("decValue");
        // Update label
        label.innerHTML = hSlider.get("value");
        params.defaultBreaks = [ hSlider.value / 60 ];
        if (clickpoint) {
          mapClickHandler(clickpoint);
        }
      }
      
      function mapClickHandler(evt) {
        clickpoint = evt;
        map.graphics.clear(); //clear existing graphics
        //define the symbology used to display the results and input point
        var pointSymbol = new SimpleMarkerSymbol(
          "diamond",
          20,
          new SimpleLineSymbol(
            "solid",
            new Color([88,116,152]), 2
          ),
          new Color([88,116,152,0.45])
        );
        var inPoint = new Point(evt.mapPoint.x, evt.mapPoint.y, map.spatialReference);
        var location = new Graphic(inPoint, pointSymbol);

        map.graphics.add(location);
        var features = [];
        features.push(location);
        var facilities = new FeatureSet();
        facilities.features = features;
        params.facilities = facilities;

        //solve 
        serviceAreaTask.solve(params,function(solveResult){
          var polygonSymbol = new SimpleFillSymbol(
            "solid",  
            new SimpleLineSymbol("solid", new Color([232,104,80]), 2),
            new Color([232,104,80,0.25])
          );
          arrayUtils.forEach(solveResult.serviceAreaPolygons, function(serviceArea){
            serviceArea.setSymbol(polygonSymbol);
            map.graphics.add(serviceArea);
          });
          
        }, function(err){
          console.log(err.message);
        });
      }
    });