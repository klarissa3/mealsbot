'use strict';

if(process.env.NODE_ENV === 'production') { 
    module.exports = {
        FB: {
            pageAccessToken: process.env.pageAccessToken ,
            VerifyToken: process.env.VerifyToken,
            appSecret: process.env.appSecret 
        },
        TMDB: process.env.TMDB
    }
        
} else {
    module.exports = require('./development.json');
}