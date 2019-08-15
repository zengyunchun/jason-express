const express = require('../');
const app = express();
app.param('uid',function(req,res,next,val,name){
    req.user = {id:1,name:'jason'};
    next();
})
app.param('uid',function(req,res,next,val,name){
    req.user.name = 'zfpx2';
    next();
})
app.get('/user/:uid',function(req,res){
    console.log(req.user);
    res.end('user');
});
app.listen(3000);