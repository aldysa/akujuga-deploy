const predictClassification = require('../services/inferenceService');
const crypto = require('crypto');
const storeData = require('../services/storeData');

async function postPredictHandler(request, h) {
  const { image } = request.payload;
  //const model_angka = request.server.app['angka'];
  //const model_huruf = request.server.app['huruf'];
 
  const { model_angka } = request.server.app;
  const { model_huruf } = request.server.app;

  if (!model_angka){
    console.log('model tidak ada');
}
  const { confidenceScore, label, suggestion } = await predictClassification(model_angka, model_huruf, image);
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();
 
  const data = {
    "id": id,
    "result": label,
    "suggestion": suggestion,
    "confidenceScore": confidenceScore,
    "createdAt": createdAt
  }
  
  await storeData(id, data);
  console.log(data)

  const response = h.response({
    status: 'success',
    message: confidenceScore > 99 ? 'Model is predicted successfully.' : 'Model is predicted successfully but under threshold. Please use the correct picture',
    data
  })
  response.code(201);
  return response;
}
 
module.exports = postPredictHandler;
