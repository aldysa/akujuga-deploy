require('dotenv').config();
 
const Hapi = require('@hapi/hapi');
const routes = require('../server/routes');
const loadModel = require('../services/loadModel');
 
(async () => {
    const server = Hapi.server({
        port: 3000,
        host: '0.0.0.0',
        routes: {
            cors: {
              origin: ['*'],
            },
        },
    });
 
    const model_angka = await loadModel('angka');
    const model_huruf = await loadModel('huruf');

    server.app.model = {
        'angka': model_angka,
        'huruf': model_huruf
    };
 
    server.route(routes);
 
    server.ext('onPreResponse', function (request, h) {
        const response = request.response;
 
         if (response instanceof InputError) {
             const newResponse = h.response({
                 status: 'fail',
                 message: `${response.message} Silakan gunakan foto lain.`
             })
             newResponse.code(response.statusCode)
             return newResponse;
         }
 
        if (response.isBoom) {
            const newResponse = h.response({
                status: 'fail',
                message: response.message
            })
            newResponse.code(response.statusCode)
            return newResponse;
        }
 
        return h.continue;
    });
 
    await server.start();
    console.log(`Server start at: ${server.info.uri}`);
})();