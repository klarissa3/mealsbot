'use strict';
const express = require('express');
const conf = require('./config');
const FBeamer =  require('./fbeamer');
const server = express();
const bodyparser = require('body-parser');
const PORT = process.env.PORT || 3000;
const FB =  new FBeamer(conf.FB);
const tmdb = require('./tmdb');




server.get('/', (request, response) => FB.registerHook(request, response));
server.listen(PORT, () => console.log(`FBeamer Bot Service running on Port ${PORT}`));
server.post('/', bodyparser.json({ verify: FB.verifySignature.call(FB) }));
server.post('/', (request, response, data) => {
  return FB.incoming(request, response, data => {
    const userData = FB.messageHandler(data);
    FB.sendMessage("RESPONSE", userData.sender, "Bonjour");
    let entity =tmdb.nlpData
    console.log(entity)
    //messageObj[0].messaging[0].message.nlp.entities
    
  });
});