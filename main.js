require('dotenv').config();

let express = require('express');
let app = express();

let user = require('./controllers/userController');
let log = require('./controllers/logController');
let sequelize = require('./db');

sequelize.sync();

//Middlewear
app.use(express.json()); //TODO: test out other middlewear functions https://expressjs.com/en/api.html#express.json
app.use( require('./middleware/cors') );

app.use('/user', user);

//authenticated route
app.use( require('./middleware/authCheck') )
app.use("/log", log);

app.listen( 3000, function(){
    console.log('App is listeneing on port 3000!');
});