var bodyParser = require('body-parser');
var mongoose = require('mongoose');

// connect to the database
mongoose.connect('mongodb://test:test12@ds029638.mlab.com:29638/todo');

// create a schema - this is like a blue print
var todoSchema = new mongoose.Schema({
    item: String
});

// create a model for the Schema
// Model name will be the collection name in the MongoDB
var Todo = mongoose.model('Todo', todoSchema); // Naming convention - always start with Caps

// save item to the database
// var itemOne = Todo({item: 'buy flowers'}).save(function(err) {
//     if (err) throw err;
//     console.log('item saved');
// });

// var data = [{item: 'get milk'}, {item: 'walk dog'}, {item: 'kick some coding ass'}];

var urlencodedParser = bodyParser.urlencoded({ extended: false });

module.exports = function (app) {

app.get ('/todo', function (req, res) {
    // get data from MongoDB and pass it to the view
    Todo.find({}, function(err, data) {
        if (err) throw err;
        res.render('todo', {todos: data});
    });
    // res.render('todo', {todos: data});
});

app.post('/todo', urlencodedParser, function (req,res) {
    // get data from the view and add it to MongoDB
    var newTodo = Todo(req.body).save(function (err, data) {
        if (err) throw err;
        res.json(data);
    })
    // data.push(req.body);
    // res.json(data);
});

app.delete('/todo/:item', function (req, res) {
    // delete the requested item from MongoDB
    Todo.find({item: req.params.item.replace(/\-/g, " ")}).remove(function (err,data) {
        if (err) throw err;
        res.json(data);

    });
    // data = data.filter(function (todo) {
    //     return todo.item.replace(/ /g, '-') !== req.params.item
    // });
    // res.json(data);
});

};