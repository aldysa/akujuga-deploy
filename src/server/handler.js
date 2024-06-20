const predictClassification = require('../services/inferenceService');
const crypto = require('crypto');

async function postPredictHandler(request, h) {
  const { image } = request.payload;
  const model_angka = request.server.app['angka'];
  const model_huruf = request.server.app['huruf'];
 
  const { confidenceScoreMerged, temp_label, suggestion } = await predictClassification(model_angka, model_huruf, image);
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();
 
  const data = {
    "id": id,
    "result": temp_label,
    "suggestion": suggestion,
    "confidenceScore": confidenceScoreMerged,
    "createdAt": createdAt
  }
  await storeData(id, data);

  const response = h.response({
    status: 'success',
    message: confidenceScoreMerged > 99 ? 'Model is predicted successfully.' : 'Model is predicted successfully but under threshold. Please use the correct picture',
    data
  })
  response.code(201);
  return response;
}
 
module.exports = postPredictHandler;