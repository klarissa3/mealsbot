'use strict';
const express = require('express');
const conf = require('./config');
const FBeamer =  require('./fbeamer');
const server = express();
const bodyparser = require('body-parser');
const PORT = process.env.PORT || 3000;
const FB =  new FBeamer(conf.FB);
const tmdb = require('./tmdb');
const getRecipe = require('./tmdb/request.js');


var today = new Date();
var time = today.getHours() + ":" + today.getMinutes()
let meal;
switch(true){
  case today.getHours() < 12:
    meal = 'breakfast'
    break;
  case today.getHours() >= 12 && today.getHours() < 15:
    meal = 'lunch'
    break;
  case today.getHours() >= 15 && today.getHours()<18 :
    meal = 'snack'
    break;
    case today.getHours() >=18:
    meal = 'dinner'
    break;
}


server.get('/', (request, response) => FB.registerHook(request, response));
server.listen(PORT, () => console.log(`FBeamer Bot Service running on Port ${PORT}`));
server.post('/', bodyparser.json({ verify: FB.verifySignature.call(FB) }));
server.post('/', (req, res, data) => {
	return FB.incoming(req, res, async data => {
		console.log(data)
		console.log(data.message.nlp.entities)
   
    
		let datas = FB.messageHandler(data);
		//console.log(data)
		try {
			if (datas.content === 'Hello') {
        await FB.txt(datas.sender, `Hey, it's ${time}, would you like to eat some ${meal} ? `);
        next('route');
      }
      else if (datas.content === 'Yes I would') {
        await FB.txt(datas.sender, `Alright ! Let me suggest you 3 ${meal} you'd love !!`);
        let  intent = meal
        console.log(intent)
        const recipe = await getRecipe(intent)
        const r = []
        if(recipe.hits){
          recipe.hits.forEach(element => {
            const result = {
              "Name":element.recipe.label,
              "HealthLabel":element.recipe.healthLabels,
              "Cautions":element.recipe.cautions,
              "Recipe":element.recipe.ingredientLines,
              "Calories":element.recipe.calories
            }
          r.push(result)
          console.log(result) 
          });
        }
    
        r.forEach(async element =>{
          await FB.img(datas.sender, element.Image)
          await FB.txt(datas.sender, ` Name : ${element.Name}  \nHealth Label : ${element.HealthLabel} \nCautions : ${element.Cautions} \nRecipe : ${element.Recipe} \nCalories :${element.Calories}`);
        })
			}
			else if (datas.content === 'No thanks'){
        await FB.txt(datas.sender, 'No problem. What kind of recipe would you like then ?');
      }
      else{
        let  intent = await tmdb(data.message.nlp.entities)
        console.log(intent)
        const recipe = await getRecipe(intent)
        const r = []
        if(recipe.hits){
          recipe.hits.forEach(element => {
            const result = {
              "Name":element.recipe.label,
              "HealthLabel":element.recipe.healthLabels,
              "Cautions":element.recipe.cautions,
              "Recipe":element.recipe.ingredientLines,
              "Calories":element.recipe.calories,
              "Image":element.recipe.image
            }
          r.push(result)
          console.log(result)
        
          });
        }
        await FB.txt(datas.sender, 'Here go my 3 suggestions for you :');
        r.forEach(async element =>{
          await FB.img(datas.sender, element.Image)
          await FB.txt(datas.sender, ` Name : ${element.Name}  \nHealth Label : ${element.HealthLabel} \nCautions : ${element.Cautions} \nRecipe : ${element.Recipe} \nCalories :${element.Calories}`);
          
        })
      
			}
    }
		catch(e) {
			console.log(e);
    }

   
  });  
});               
