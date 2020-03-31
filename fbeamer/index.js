'use strict'

//const request = require('request');
const crypto = require('crypto');
const axios = require('axios');
const request = require('request');
const apiVersion = 'v6.0';

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
    incoming(req, res, cb) {
      // Extract the body of the POST request
      let data = req.body;
      if (data.object === 'page') {
        // Iterate through the page entry Array
        data.entry.forEach(pageObj => {
          // Iterate through the messaging Array
          pageObj.messaging.forEach(msgEvent => {
            let messageObj = {
              sender: msgEvent.sender.id,
              timeOfMessage: msgEvent.timestamp,
              message: msgEvent.message
            }
            cb(messageObj);
          });
        });
      }
      res.sendStatus(200);
    }
    
    messageHandler(obj) {
      let sender = obj.sender;
      let message = obj.message;
      if (message.text) {
        let obj = {
          sender,
          type: 'text',
          content : message.text
        }
        return  obj;
      }
    }

    sendMessage (payload) {
      return new Promise ((resolve, reject) => {
        request ({
          uri: `https://graph.facebook.com/${apiVersion}/me/messages`,
          qs: {
            access_token: this.pageAccessToken
          },
          method: 'POST',
          json: payload
        }, (error, response, body) => {
          if(!error && response.statusCode === 200) {
            resolve ({
              mid: body.message_id
            });
          } else {
            reject(error);
          }
        });
      });
    }

    txt (id, text, messaging_type = 'RESPONSE') {
      /* this is an object for creating the payload according to table 1*/
      let obj = {
        messaging_type, 
        recipient : {
          id
        },
        message: {
          text
        }
      }
      return this.sendMessage(obj);
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
 
}

module.exports = FBeamer;
