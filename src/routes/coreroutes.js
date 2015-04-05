import request from 'superagent';

export default function(server) {
  server.get('/', (req, res) => {
    res.render('index', {});
  });

  server.get('/api/v1/citiBike/stations', (req, res) => {
    // request.get('http://www.citibikenyc.com/stations/json')
    //   .pipe(res)
    request.get('http://www.citibikenyc.com/stations/json')
    .end((err, citiBikeRes) => {
      if (err) return res.send(404);
      console.log(citiBikeRes.body.stationBeanList.length);
      res.json(citiBikeRes.body);
    });
  });
};