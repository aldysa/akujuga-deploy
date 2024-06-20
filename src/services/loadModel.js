const tf = require('@tensorflow/tfjs-node');
  
async function loadModel(modelType) {
    let model;
    if (modelType === 'angka') {
        model = await tf.loadLayersModel(process.env.MODEL_URL_ANGKA);

    } else if (modelType === 'huruf') {
        model = await tf.loadLayersModel(process.env.MODEL_URL_HURUF);
    }
    return model;
}

module.exports = loadModel;