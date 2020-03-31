'use strict';
const min_conf = 0.3;
const TMDB = require('../config').TMDB;
const request = require('request');

const extractEntity = (nlp, entity) => {
    if(nlp[entity]){
        const ent = nlp[entity][0];
        if(ent && ent.confidence > min_conf) {
            return ent.value;
        } else {
            return null;
        }

    }
}

module.exports = nlpData => {
	return new Promise(function(resolve, reject) {
        let intent={
            health:null,
            food:null,
            diet:null,
            cuisineType:null,
            dishType:null,
            mealType:null

        }
        const entity = ['health','food','diet','cuisineType','dishType','mealType'] 
        entity.forEach( param =>{
            if(extractEntity(nlpData,  param)){
                intent[param]= extractEntity(nlpData,  param);
            }
        })		
		resolve(intent);
	});
}
