const express = require('../');
const path = require('path');
const html = require('../lib/html');
const app = express();
const fs = require('fs');
app.engine('html',html);
app.set('views',path.resolve('views'));
app.set('view engine','html');
app.get('/',function(req,res,next){
    res.render('index',{title:'hello',user:{name:'jason'}});
});
app.listen(3000);