const express = require('../');
const app = express();
/**
app.use(function(req,res,next){
    console.log('Ware1:',Date.now());
    next();
});
app.get('/',function(req,res,next){
    res.end('1');
});
const user = express.Router();
user.use(function(req,res,next){
    console.log('Ware2',Date.now());
    next();
});
user.use('/2',function(req,res,next){
    res.end('2');
});
app.use('/user',user);
app.use(function(err,req,res,next){
    res.end('catch '+err);
});
app.listen(3000,function(){
    console.log('server started at port 3000');
});
 **/
//----------------------------
app.use(function(req,res,next){
    console.log('Ware1:',Date.now());
    next('wrong');
});
app.get('/',function(req,res,next){
    res.end('1');
});
const user = express.Router();
user.use(function(req,res,next){
    console.log('Ware2',Date.now());
    next();
});
user.use('/2',function(req,res,next){
    res.end('2');
});
app.use('/user',user);
app.use(function(err,req,res,next){
    res.end('catch '+err);
});
app.listen(3000,function(){
    console.log('server started at port 3000');
});
