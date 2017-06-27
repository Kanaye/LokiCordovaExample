var Loki = require('lokijs');
var LokiCordovaFs = require('loki-cordova-fs-adapter');

function createTodo(todo) {
  var div = document.createElement('div');
  div.textContent = todo.text;
  div.setAttribute('id', todo.$loki);
  var del = document.createElement('button');
  del.textContent = 'x';
  div.appendChild(del);
  return div;
}

document.addEventListener('deviceready', function() {
  // Get Elements
  var todoContainer = document.querySelector('.todos');
  var add = document.querySelector('.add');
  var newTodoText = document.querySelector('.new-todo');
  // init adapter
  var adapter = new LokiCordovaFs({ prefix: 'todos' });
  var db;

  function init() {
    // get or add collection
    var todos = db.getCollection('todos') || db.addCollection('todos');
    // find all todos and render them to the dom
    todos.find().forEach(function(todo) {
      todoContainer.appendChild(createTodo(todo));
    });
    // Delete handler for todos
    todoContainer.addEventListener('click', function(e) {
      if (e.target.nodeName === 'BUTTON') {
        var id = e.target.parentElement.getAttribute('id');
        // find todo object and remove it
        var todo = todos.findOne({ $loki: Number(id) });
        todos.remove(todo);
        // remove the element
        todoContainer.removeChild(e.target.parentElement);
        // save the db
        db.save();
      }
    });
    // add handler
    add.addEventListener('click', function() {
      // check if the new todo has a text
      if (newTodoText.value.trim().length > 0) {
        var value = newTodoText.value.trim();
        // reset text field
        newTodoText.value = '';
        var todo = { text: value };
        // insert the new todo
        todos.insert(todo);
        // render it to the dom
        todoContainer.appendChild(createTodo(todo));
        // save db
        db.save();
      }
    });
  }
  // create db
  db = new Loki('todos.db', {
    adapter: adapter,
    autoload: true,
    autoloadCallback: init
  });
}, false);
