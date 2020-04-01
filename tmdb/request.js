"use strict";

const axios = require("axios");
const appid = ""
const apikey = "";
const tmdb = require('./index.js');

const getRecipe = (intent) => {
	return new Promise(async (resolve, reject) => {
		try{
			var link = "https://api.edamam.com/search?"

			const recipeConditions = await axios.get(
				link,
				{
				params: {
                    q: intent.food,
                    app_id:appid,
					app_key: apikey,			
                    from: 0,
					to:3,
					diet: intent.diet,
					health :intent.health,
					cuisineType:intent.cuisineType,
					mealType:intent.mealType,
					dishType:intent.dishType
				}
			});
			resolve(recipeConditions.data)
		}
		catch(error){
			reject(error);
		}
	});
}

module.exports = getRecipe;