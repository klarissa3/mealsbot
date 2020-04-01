MEALS BOT

This chatbot aims to suggest 3 meals and recipes accoring to parameters entered by the user.


Getting Started 

This project is link to a Facebook page. It is then not possible to run it on an other local machine without the corresponding Facebook account and Facebook page.
However, it is possible to adapt this project to your purpose. 

To do so, first create Facebook account and a Facebook page.

Facebook Developper : 
Go to developper.facebook.com
Create a new App and link it to your Facebook page.
Get the page access token by generating a token.
Create a verify token by generating a random string using  crypto.ranadomBytes(64).toString('hex').
Go to your app dashboard on developper.facebook.com, settings, basic section to get the app secret key.
Paste the information in development.json file.

Wit.ai:
Create an account on wit.ai and create a new App for your Facebook page.
Train your bot.
Get the App ID and server acess token.
Integrate wit.ai in Built-in NLP.

Edaman API:
Go to developper.edemam.com
Sign up to Meal Recommendation Engine.
Get the API ID and API key.
Paste the information in tmdb/index.js.
Paste the API key in development.json.   

Prerequisites

The packages below are to install before running the project :
express
axios
request 
crypto
nodemon
ngork

Installing

STEP 1 : Run your program

Go to your terminal and run the server.js file 
> nodemon server.js

In an other terminal, generate a private https with ngork
> ngrok http 3000

STEP 2 : Register your Webhook

Go to your app Dashboard in the facebook developper page.
Find the webhook options and fill the callback URL with your HTTPS provided from ngrok.
Copy paste your verify token.
Click messages in the subscritpion field.

You can now send messages to your bot !


To begin, say "Hello" to the bot.
It will ask you if you are interested in breakfast, lunch, snack or dinner recipes according to the current time. 

Say "Yes I would" to have recommendations.
Say "No thanks" to be able to ask anything else.

It is possible to ask :

Food : pizza, apples, tomatoes... 
MealType: breakfast, lunch, snack, dinner
DishType: sweets, starters, soup, side dish, sandwiches...
CuisineType: American, Indian, French, Nordic, South East Asian...
Diet: balanced, high-fiber, high-protein, low-carb...
Health: fish-free, dairy-free, vegan, vegetarian, kosher...

Examples :

User : "Can I have a vegan recipe please ?"
MealsBot : "Here are my 3 suggestions for you:" 
            "recipe 1..." "recipe 2..." "recipe 3..."
            "image 1" "image 2" "image 3"

User : "I would like to eat a low-fat pizza"
MealsBot : "Here are my 3 suggestions for you:" 
            "recipe 1..." "recipe 2..." "recipe 3..."
            "image 1" "image 2" "image 3"


Authors 

Antoine THIOL
Klarissa TU
