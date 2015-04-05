// import React from 'react';
// import oboe from 'oboe';

// export default (function() {
//   var fetchStationInterval = null;

//   return React.createClass({
//     getDefaultProps: function () {
//       return {
//         initialZoom: 13,
//         mapCenterLat: 40.724224,
//         mapCenterLng: -73.981452
//       };
//     },
//     processData: function(station) {
//       this.makeStationMarker(station);

//       this.setState({
//         stations: this.state.stations.push(station)
//       });
//     },
//     makeStationMarker: function(station) {
//       let map = this.state.map;
//       let center = map.getCenter();
//       // console.log(map.getCenter());
//       let latDist = Math.pow(center.k - station.latitude, 2);
//       let longDist = Math.pow(center.D - station.longitude, 2);
//       let dist = Math.sqrt(latDist + longDist) * 1000;

//       if ( dist > 6 ) {
//         if ( station.marker ) {
//           station.marker.infoWindow.close();
//           station.marker.infoWindow = null;
//           station.marker.setMap(null);
//           station.marker = null;
//         }
//         return;
//       } else if ( station.marker ) {
//         station.marker.infoWindow.close();
//         return;
//       }

//       let infoWindowStr = '<div><span><span class="label">Name</span> '
//         + station.stationName
//         + '</span><br><span><span class="label">Available</span> '
//         + station.availableBikes + '</span></div>';

//       let coords = new google.maps.LatLng(station.latitude, station.longitude)
//       let infoWindow = new google.maps.InfoWindow({
//         content: infoWindowStr
//       });
//       let marker = new google.maps.Marker({
//         position: coords,
//         map: map
//       });

//       marker.infoWindow = infoWindow;

//       google.maps.event.addListener(marker, 'click', () => {
//         if ( this.state.openedInfoWindow ) {
//           this.state.openedInfoWindow.close();
//         }

//         marker.infoWindow.open(map, marker);

//         this.setState({
//           openedInfoWindow: marker.infoWindow
//         });
//       });

//       station.marker = marker;
//       // return marker;
//     },
//     setFetchStationTimeout: function() {
//       if ( !fetchStationInterval ) {
//         fetchStationInterval = setInterval(() => {
//           console.log('getStations');
//           this.getStations();
//         }, 3000);
//       }
//     },
//     getStations: function() {
//       oboe('/api/v1/citibike/stations')
//         .node('stationBeanList.*', this.processData)
//         .done((results) => {
//           console.log('citibike json results', results);
//           let stations = results.stationBeanList;
//           let keys = Object.keys(stations[0]);
//           console.log(keys);
//           this.setState({
//             stations: stations,
//             // stationKeys: keys,
//             time: results.executionTime
//           });
//         });
//     },
//     getInitialState: function () {
//       return {
//         stations: [],
//         time: new Date().toString()
//         // openedInfoWindow: null
//       }
//     },
//     componentDidMount: function () {
//       let mapOptions = {
//         center: this.mapCenterLatLng(),
//         zoom: this.props.initialZoom
//       };
//       let map = new google.maps.Map(this.getDOMNode(), mapOptions);

//       google.maps.event.addListener(map, 'dragend', () => {
//         this.state.stations.forEach((station) => {
//           this.makeStationMarker(station);
//         });
//         console.log('yoyo');
//       });

//       this.setState({map: map});
//       this.getStations();
//     },
//     mapCenterLatLng: function () {
//       let props = this.props;

//       return new google.maps.LatLng(props.mapCenterLat, props.mapCenterLng);
//     },
//     // componentDidUpdate: function () {
//     //   let map = this.state.map;
//     //   console.log('update');
//     // },
//     render: function () {
//       let style = {
//         width: '600px',
//         height: '700px'
//       };

//       // this.setFetchStationTimeout();

//       return (
//         <div className='map' style={style}></div>
//       );
//     }
//   });
// })();