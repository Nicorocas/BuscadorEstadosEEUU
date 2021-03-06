
    var map;
    var tb;
    require([
        "esri/map",
        "dojo/on",
        "dojo/dom",

        "esri/layers/FeatureLayer",
        "esri/dijit/Legend",
        "esri/dijit/Search",
        "esri/dijit/OverviewMap",

        "esri/dijit/BasemapGallery",
        "esri/dijit/Scalebar",

        "esri/toolbars/draw",
        "esri/dijit/Popup", 
        "esri/dijit/PopupTemplate",
        "dojo/dom-class", 
        "dojo/dom-construct",

        "esri/symbols/FillSymbol",
        "esri/symbols/SimpleLineSymbol",
        "dojo/_base/Color",
        "dojo/_base/array",

        "esri/graphic",
        "esri/tasks/locator",
        "esri/tasks/query",
        
        "esri/symbols/SimpleMarkerSymbol",
        "esri/symbols/TextSymbol",
        "esri/symbols/Font",


        "esri/tasks/GeometryService",
        "esri/tasks/BufferParameters",
        
        "dgrid/Selection",
        "dijit/form/Button",
        

        "dijit/layout/TabContainer",
        "dijit/layout/ContentPane",
        "dijit/layout/BorderContainer",
        "dojo/domReady!"],
        function(
          Map, on, dom,
          FeatureLayer, Legend,Search,OverviewMap,
          BasemapGallery, Scalebar,
          Draw, Popup,PopupTemplate,domClass, domConstruct,
          FillSymbol,SimpleLineSymbol,Color, array,
          Graphic, Locator,Query,
          SimpleMarkerSymbol, TextSymbol, Font,
          GeometryService,BufferParameters,
          Selection,Button,

        ) {
            // task locator 
            taskLocator = new Locator("http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer");

            on(dom.byId("progButtonNode"),"click",fQueryEstados);
            taskLocator.on("address-to-locations-complete",showResults);

            function fQueryEstados(){
                map.graphics.clear();
                

                var objAddress = {
                    "SingleLine" : dom.byId("dtb").value
                  };
                var params = {
                    address: objAddress,
                    outFields:['Loc_name']
                };

                taskLocator.addressToLocations(params);
            
            }
            // funcion para mostrar los resultados
            function showResults(candidates){// pinta un punto
                // Define the symbology used to display the results
                
                var symbolMarker = new SimpleMarkerSymbol();
                symbolMarker.setStyle(SimpleMarkerSymbol.STYLE_CROSS);
                
                symbolMarker.setSize(30)
                symbolMarker.setColor(new Color([0, 0,0, 0.75]));
                var font = new Font("14pt", Font.STYLE_BOLD, Font.VARIANT_NORMAL, "Arial");

                // loop through the array of AddressCandidate objects
                var geometryLocation;
                array.every(candidates.addresses, function (candidate) {
                    
                    // if the candidate was a good match
                    if (candidate.score > 90) {
                        

                        // retrieve attribute info from the candidate
                        var attributesCandidate = {
                            address: candidate.address,
                            score: candidate.score,
                            locatorName: candidate.attributes.Loc_name
                        };

                        /*Step: Retrieve the result's geometry*/
                            geometryLocation = candidate.location;


                          
                        /* Step: Display the geocoded location on the map
                        */
                        var graphicResult = new Graphic(geometryLocation, symbolMarker, attributesCandidate);
                        map.graphics.add(graphicResult);


                        // display the candidate's address as text
                        var sAddress = candidate.address;
                        var textSymbol = new TextSymbol(sAddress, font, new Color("#000000 "));
                        textSymbol.setOffset(0, -40);
                        map.graphics.add(new Graphic(geometryLocation, textSymbol));

                        // exit the loop after displaying the first good match
                        return false;
                    }
                });

                // Center and zoom the map on the result
                if (geometryLocation !== undefined) {
                    map.centerAndZoom(geometryLocation, 6);
                }
            }
            // /// Durisimos Pop up y template para la capa de estados
            
            // creamos el simbolo y el popup
            var symbolSelected =new FillSymbol(new SimpleLineSymbol(
                SimpleLineSymbol.STYLE_SOLID,));
                symbolSelected.setColor(new Color([255,255,0,0.5]))
            var symbolSelected1 =new FillSymbol(new SimpleLineSymbol(
                SimpleLineSymbol.STYLE_SOLID,));
                symbolSelected1.setColor(new Color([255,0,200,1]))
                
            
            var popup = new Popup({
                fillSymbol: symbolSelected,
                
                titleInBody: true
            }, domConstruct.create("div"));
            //Add the dark theme which is customized further in the <style> tag at the top of this page
           popup.maximize()
            domClass.add(popup.domNode, "dark");


            // aqui viene el template lo que sera la base del popup, tanto el formato como el contenido, En la Feature layer se pone infoTemplate: template

            var template = new PopupTemplate({
                title: "Estado de {state_name}",
                description: "Tiene un total de {pop2000} habitantes y una densidad de poblacion de {pop00_sqmi}. El area del estado es de {st_area}",
                fieldInfos: [{ //define field infos so we can specify an alias
                    fieldName: "st_area",
                    label: "Superficie total del estado",
                    visible:true
                },
                {
                    fieldName: "pop2000",
                    label: "Poblacion Total",
                    visible:true
                }],
                mediaInfos:[{ //define the bar chart
                    caption: "",
                    type:"barchart",
                    value:{
                        theme: "Dollar",
                        fields:["pop2000","st_area","pop00_sqmi"]
                    }
                }]
            });

            ///// siguiente template ahora de ciudades
            var template1 = new PopupTemplate({
                title: "Cuidad de {areaname}",
                description: "Tiene un total de {pop2000} habitantes. El area del estado es de {capital}",
                fieldInfos: [{ //define field infos so we can specify an alias
                    fieldName: "st_area",
                    label: "Superficie total del estado",
                    visible:true
                },
                {
                    fieldName: "pop2000",
                    label: "Poblacion Total",
                    visible:true
                }],
                mediaInfos:[{ //define the bar chart
                    caption: "",
                    type:"barchart",
                    value:{
                        theme: "Dollar",
                        fields:["pop2000","st_area","pop00_sqmi"]
                    }
                }]
            });
            //Cargamos el mapa
            map = new Map("map", {
            basemap: "dark-gray",
            center: [-100.45,37.75], // long, lat
            zoom: 4,
            sliderStyle: "small",
            infoWindow: popup
            });
            
            map.on("load",function(evt){
            map.resize();
            map.reposition();

            });
            //1 despues de añadir infowindow :popup a map, toca añadir una variable con los campos
            const CamposEstados = ["state_name", "pop2000", "pop00_sqmi" , "st_area"];
            const CamposCiudades = ["capital", "pop2000", "shape" , "areaname"];
            /// Pues empezamos cargando capas
            var lista_featureLayer = [fc1,fc2,fc3]
            var fc1 = new FeatureLayer("http://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer/0",{
                outFields: CamposCiudades,
                mode: FeatureLayer.MODE_ONDEMAND,
                outFields: ["*"],
                infoTemplate: template1,
            })
            var fc2 = new FeatureLayer("http://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer/1")
            //estados fc3 capa principal le establecemos los requisitos del popUp
            var fc3 = new FeatureLayer("http://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer/2",{
                outFields: CamposEstados,
                mode: FeatureLayer.MODE_ONDEMAND,
                outFields: ["*"],
                infoTemplate: template,
                
                
            })
            map.infoWindow.resize(155,75)
            fc3.setOpacity(0.30)
            
            
            
            map.addLayers([fc1,fc2,fc3])
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
                visible: true,
                

                });
            overviewMapDijit.resize(200,200)
            overviewMapDijit.startup();
            /// BasemapGallery
            var basemapGallery = new BasemapGallery({
                showArcGISBasemaps: true,
                map: map
                }, "basemapGallery");
                basemapGallery.startup();
            /// escala abajo
            var scalebar = new Scalebar({
                map: map,
                scalebarUnit: "dual"
                });
           
            /// A fliparselo, toca hacer un buffer que hace select a las ciudades
            // necesito una herramienta de Buffer en un boton, que al activarla empieze a dibujar, de esto sacara el buffer
             // funcion para hacer un bufer/////
             map.on("load", function () {
                    var BOTON = new Button({
                        label: "Selecionar con Buffer",
                        onClick: initDrawTool2,
                        
                    }, "progButtonNode2");});
             
             var tbDraw2;
            // funcion para diubjar
            function initDrawTool2() {
                /*
                 * Step: Implement the Draw toolbar
                 */
                popup.hide()
                tbDraw2 = new Draw(map);
                tbDraw2.on("draw-complete", doBuffer); 
                
                tbDraw2.activate(Draw.POINT);
                fc1.clearSelection();w
                map.graphics.clear();
                    
            }
           
            // funcion doBuffer
            function doBuffer(evtObj) {
            //las variables son
            tbDraw2.deactivate();
                var geometry = evtObj.geometry
            var geomService = new GeometryService("https://utility.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer");
            var bufferParams = new BufferParameters(); 
            bufferParams.distances = [70];
            bufferParams.unit = GeometryService.UNIT_KILOMETER;
            bufferParams.geometries = [geometry]
            bufferParams.outSpatialReference = map.spatialReference
            // La funcion es 
            var buffer = geomService.buffer(bufferParams);
            geomService.on('buffer-complete', showBuffer );
             // las geomterias que cogera el buffer para pintarlo bufferedGeometries
            }
            // La funcion showBuffer:
            function showBuffer(bufferedGeometries) {
                                          
      
                array.forEach(bufferedGeometries.geometries, function(geometry) {
                  var graphic = new Graphic(geometry, symbolSelected1);
                  map.graphics.add(graphic);
                  var geometria = bufferedGeometries.geometries[0]
                           selectEV(geometria);
                
                });
                
              }
            //funcion para seleccionar los elementos de featureLayer
            function selectEV(geometria) {

            // Define symbol for selected features (using JSON syntax for improved readability!) este formato json es compatible con
            var symbolSelected = new SimpleMarkerSymbol({
                "type": "esriSMS",
                "style": "esriSMSSquare",
                "color": [100, 0, 100, 128],
                "size": 6,
                "outline": {
                    "color": [255, 0, 200, 214],
                    "width": 1
                }
            }); 
            // ESTABLECER SIMBOLOGIA
            fc1.setSelectionSymbol(symbolSelected);
            // INICIAR LA QUERY
            var queryQuakes = new Query();
            queryQuakes.geometry = geometria;

            ///ahora cuando se realice la seleccion la siguiente formula se inicia 

            

            //Realizar seleccion


            fc1.selectFeatures(queryQuakes, FeatureLayer.SELECTION_NEW);
            }
            //// funcion limpiar     seleccion
            // primero un boton de limpiar que onclik active la funcion limpiar
            map.on("load", function () {
                    var BOTON = new Button({
                        label: "Borrar Selección",
                        onClick: limpiar,
                        
                    }, "progButtonNode3");});
            function limpiar() {
                map.graphics.clear();
                fc1.clearSelection();

            }
            
        });


