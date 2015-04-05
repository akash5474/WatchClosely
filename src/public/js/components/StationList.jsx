// import React from 'react';
// import StationCard from './StationCard.jsx';
// import StationMap from './StationMap.jsx';
// // import request from 'superagent';
// import oboe from 'oboe';

// export default React.createClass({
  // getInitialState: function() {
  //   return {
  //     stations: [],
  //     stationKeys: [],
  //     time: new Date().toString()
  //   };
  // },
  // componentWillMount: function() {
  //   oboe('/api/v1/citibike/stations')
  //     .node('stationBeanList.*', (station) => {
  //       this.setState({
  //         stations: this.state.stations.push(station)
  //       });
  //       // console.log(station);
  //     })
  //     .done((results) => {
  //       console.log('citibike json results', results);
  //       let stations = results.stationBeanList;
  //       let keys = Object.keys(stations[0]);

  //       this.setState({
  //         stations: stations,
  //         stationKeys: keys,
  //         time: results.executionTime
  //       });
  //     });
  // // },
  // render: function() {
  //   return (
  //     <div className="row">
  //       <div className="small-4 columns"></div>
  //       <div className="small-8 columns">
  //         <StationMap />
  //       </div>
  //     </div>
  //   )
    // return (
    //   <div className="row">
    //     <div className="small-4 columns">
    //       <ul className="side-nav">{
    //         this.state.stations.map((station) => {
    //           return (
    //             <li key={station.id}>
    //               <StationCard station={station} />
    //             </li>
    //           )
    //         })
    //       }</ul>
    //     </div>
    //     <div className="small-8 columns">
    //       <ul className="inline-list">
    //         {this.state.stationKeys.map((key, idx) => {
    //           return (<li key={idx}>{key}</li>)
    //         })}
    //       </ul>
    //       <StationMap stations={this.state.stations}/>
    //     </div>
    //   </div>
    // )
  // }
// });

// request.get('/api/v1/citibike/stations')
// .end((err, res) => {
//   if (err) {
//     console.log('ERROR:', err);
//     console.log(err.stack);
//     return;
//   }
//   console.log(res.body);
// });