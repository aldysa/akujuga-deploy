const tf = require('@tensorflow/tfjs-node');
const InputError = require('../exceptions/InputError');
 
async function predictClassification(model_angka, model_huruf, image) {
    try {
        const tensor = tf.node
            .decodeJpeg(image)
            .resizeNearestNeighbor([32, 32])
            .expandDims()
            .toFloat()
 
        const classes = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
 
        const predictionAngka = model_angka.predict(tensor);
        const scoreAngka = await predictionAngka.data();
        const confidenceScoreAngka = Math.max(...scoreAngka) * 100;

        const predictionHuruf = model_huruf.predict(tensor);
        const scoreHuruf = await predictionHuruf.data();
        const confidenceScoreHuruf = Math.max(...scoreHuruf) * 100;
        
        const mergedScore = [...scoreAngka, ...scoreHuruf];
        const idx = mergedScore.indexOf(Math.max(...mergedScore));
        const temp_label = classes[idx];
        confidenceScoreMerged = Math.max(...mergedScore) * 100;

       // const classResult = tf.argMax(prediction, 1).dataSync()[0];
       // const label = classes[classResult];
 
        let suggestion;
        
        suggestion = 'Silakan upload ulang untuk menerjemahkan bahasa isyarat lainnya';

        return { confidenceScoreMerged, temp_label, suggestion };
    } catch (error) {
        throw new InputError(`Terjadi kesalahan input: ${error.message}`)
    }
}
 
module.exports = predictClassification;