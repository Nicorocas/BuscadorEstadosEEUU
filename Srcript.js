<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <!--The viewport meta tag is used to improve the presentation and behavior of the samples
      on iOS devices-->
    <meta name="viewport" content="initial-scale=1, maximum-scale=1,user-scalable=no">
    <title></title>

    <link rel="stylesheet" href="http://js.arcgis.com/3.8/js/dojo/dijit/themes/claro/claro.css">
    <link rel="stylesheet" href="https://js.arcgis.com/3.27/esri/css/esri.css">
    <link rel="stylesheet" href="css/layout.css"/>

    <script>var dojoConfig = { parseOnLoad: true };</script>
    <script src="https://js.arcgis.com/3.27/"></script>

    <style>
       #search {
            display: block;
            position: absolute;
            z-index: 2;
            top: 10px;
            right: 10px;
          }
        #BasemapGalerry{
            position:absolute;
            z-index: 50;
        }  
    </style>
    <script>

    var map;
    var tb;
    require([
        "esri/map",
        "dojo/on",

        "esri/layers/FeatureLayer",
        "esri/dijit/Legend",
        "esri/dijit/Search",
        "esri/dijit/OverviewMap",


        "dijit/layout/TabContainer",
        "dijit/layout/ContentPane",
        "dijit/layout/BorderContainer",
        "dojo/domReady!"],
        function(
          Map, on,
          FeatureLayer, Legend,Search,OverviewMap,

        ) {


        on(dojo.byId("progButtonNode"),"click",fQueryEstados);
        
        function fQueryEstados(){
         alert("Evento del botón Seleccionar ciudades");
        }

        map = new Map("map", {
          basemap: "topo",
          center: [-100.45,37.75], // long, lat
          zoom: 4,
          sliderStyle: "small"
        });

        map.on("load",function(evt){
          map.resize();
          map.reposition();

        });
        /// Pues empezamos cargando capas
        var lista_featureLayer = [fc1,fc2,fc3,fc4]
        var fc1 = new FeatureLayer("http://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer/0")
        var fc2 = new FeatureLayer("http://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer/1")
        var fc3 = new FeatureLayer("http://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer/2")
        fc3.setOpacity(0.30)
        var fc4 = new FeatureLayer("http://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer/3")
        fc4.setOpacity(0.30)
        map.addLayers([fc1,fc2,fc3,fc4])
        /// capas cargadas, hora de añadir los primeros Widgets:
        /// El primero la leyenda:
        var legend = new Legend({
          map: map
        }, "legendDiv");
        /// Segundo Widget Shearch
        var s = new Search({
          map: map
        },"search");
        /// Tercer Widget Overview
        var overviewMapDijit = new OverviewMap({
          map: map,
          attachTo: "bottom-right",
          color:" #D84E13",
          opacity: .40,
          visible: true
  });
      });



    </script>

  </head>

  <body class="claro">
    <div id="mainWindow"
         data-dojo-type="dijit.layout.BorderContainer"
         data-dojo-props="design:'headline', gutters:false"
         style="width:100%; height:100%;">

      <div id="header"
           data-dojo-type="dijit.layout.ContentPane" data-dojo-props="region:'top'">

        Master GIS ESRI España
       <div id="subheader">Nombre Apellidos</div>

      </div>
      <div data-dojo-type="dijit.layout.ContentPane" id="leftPane" data-dojo-props="region:'left'">
        <div data-dojo-type="dijit.layout.TabContainer">
          <div data-dojo-type="dijit.layout.ContentPane" data-dojo-props="title:'Buscar', selected:true">
            <div id="search"></div>
          </div>
          <div data-dojo-type="dijit.layout.ContentPane" data-dojo-props="title:'Leyenda', selected:true">
            
            <div id="legendDiv"></div>
          </div>
          <div data-dojo-type="dijit.layout.ContentPane" data-dojo-props="title:'Buscar', selected:true">
            <div id="search"></div>
          </div>
         

        </div>
      </div>

      <div id="map" data-dojo-type="dijit.layout.ContentPane" data-dojo-props="region:'center'">

      </div>

      <div id="footer" data-dojo-type="dijit.layout.ContentPane" data-dojo-props="region:'bottom'">

        <label for="dtb">Introduzca el nombre de un estado:</label> <input id="dtb" data-dojo-type="dijit/form/TextBox" value="Washington" />
        <button id="progButtonNode" type="button">Ir al estado</button>
      </div>

    </div>
  </body>

</html>
