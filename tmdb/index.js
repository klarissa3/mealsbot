

const extractEntity = (nlp, entity) => {
    /*if(nlp.confidence >= 0.8 ){
        entity = nlp.entities
    }*/
    entity = nlp.entities
}

module.exports = nlpData => {
    return new Promise((resolve, reject) =>
    {
        let intent = extractEntity(nlpData, 'intent');
        resolve(intent);
    });
}