const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://jkthecoder:jkTheCoder@cluster0.va5hj.mongodb.net/taskbyd?retryWrites=true&w=majority', {
  useNewUrlParser:true,
  useUnifiedTopology:true
}).then( () => console.log('database connected ..!'))
.catch(err => console.log(err));