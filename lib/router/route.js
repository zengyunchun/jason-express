const methods = require('methods');
const flatten = require('array-flatten');
const slice = Array.prototype.slice;
const Layer = require('./layer');
function Route(path){
    this.path = path;
    this.methods = {};
    this.stack = [];
}

methods.forEach(function(method){
    Route.prototype[method] = function(){
        const handlers = Array.from(arguments);
        for(let i=0;i<handlers.length;i++){
            let layer = new Layer('/',handlers[i]);
            layer.method = method;
            this.stack.push(layer);
        }
        this.methods[method] = true;
        return this;
    }
});
Route.prototype._handles_method = function(method){
    return this.methods[method.toLowerCase()];
}

Route.prototype.dispatch = function(req,res,out){
    let idx = 0,self=this;
    function next(err){
        if(err){
            return out(err);
        }
        if(idx >= self.stack.length){
            return out(err);
        }
        let layer = self.stack[idx++];
        if(layer.method == req.method.toLowerCase()){
            layer.handle_request(req,res,next);
        }else{
            next();
        }
    }
    next();
}
module.exports = Route;