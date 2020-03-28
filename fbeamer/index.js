'use strict'

//const request = require('request');
const crypto = require('crypto');
const axios = require('axios');

class FBeamer{
    constructor({pageAccessToken , VerifyToken, appSecret}){    
        this.pageAccessToken = pageAccessToken;
        this.VerifyToken = VerifyToken;  
        this.appSecret = appSecret;

    }
    registerHook(req, res) 
        { 
            const params = req.query;
            const mode = params['hub.mode'], token = params['hub.verify_token'], challenge = params['hub.challenge'];   
            try {
                
                if (mode === 'subscribe' && token === this.VerifyToken) {
                    console.log("Webhook is registered.");
                    return res.send(challenge); 
                } else {
                    throw "Could not register webhook!";
                    return res.sendStatus(200); 
                }
            } 
            catch(e) { 
                console.log(e);
            } 
    }
    verifySignature(request, response, buffer) {
        return (request, response, buffer) => {
          if (request.method === 'POST') {
            try {
              const signature = request.headers['x-hub-signature'].substr(5);
              const hash = crypto.createHmac('sha1', this.appSecret).update(buffer, 'utf-8').digest('hex');
              if (signature !== hash)
                throw 'Error verifying x hub signature';
            }
            catch (error) {
              console.log(error);
            }
          }
        }
    }
    incoming(request, response, callback) {
        response.sendStatus(200);
        // Extract the body of the POST request
        if (request.body.object === 'page' && request.body.entry) {
          const data = request.body;
          const messageObj = data.entry;
          console.log(messageObj[0].messaging[0].message.nlp.entities)
          if (!messageObj[0].messaging)
            console.log("Error message");
            
          else return callback(messageObj[0].messaging);
        }
    }
    messageHandler(obj) {
        const sender = obj[0].sender.id;
        const message = obj[0].message.text;
        const obj2 = {
          sender,
          type: 'text',
          content: message
        }
        return obj2;
    }

    sendMessage(msgType, id, text) {
        const payload = {
          "messaging_type": msgType,
          "recipient": {
            "id": id
          },
          "message": {
            "text": text
          }
        };
        return new Promise((resolve, reject) => {
          axios({
            method: 'POST',
            url: `https://graph.facebook.com/v6.0/me/messages?access_token=${this.pageAccessToken}`,
            headers: { 'Content-Type': 'application/json' },
            data: payload
          }, (error, response, body) => {
            if (!error && response.statusCode === 200) {
              resolve({
                mid: body.message_id
              });
            } else {
              reject(error);
            }
          });
        });
      }

     // Send a text message
     /*
	txt(id, text, messaging_type = 'RESPONSE') {
		let obj = {
			messaging_type,
			recipient: {
				id
			},
			message: {
				text
			}
		}

		this.sendMessage(obj)
			.catch(error => console.log(error));
	}

	// Send an image message
	img(id, url, messaging_type = 'RESPONSE') {
		let obj = {
			messaging_type,
			recipient: {
				id
			},
			message: {
				attachment: {
					type: 'image',
					payload: {
						url
					}
				}
			}
		}

		this.sendMessage(obj)
			.catch(error => console.log(error));
	}
        
 */   
}

module.exports = FBeamer;