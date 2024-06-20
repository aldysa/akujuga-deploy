const postPredictHandler = require('../server/handler');
 
const routes = [
  {
    path: '/predict',
    method: 'POST',
    handler: postPredictHandler,
    options: {
      payload: {
        allow: 'multipart/form-data',
        multipart: true
      }
    }
  },

  {
    path: '/',
    method: 'GET',
    handler: (request, h) => {
      return 'Hello, world!';
  },
    
  }


]
 
module.exports = routes;
