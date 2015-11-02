(function($, BB, DOMView, _){

    var Dispatcher = _.clone(BB.Events);

    var InputView = DOMView.extend({ //view for collecting new todos

        el : '.input-view',

        template : {
            '.save-todo' : {
                'on' : {
                    'click' : function(e){
                        e.preventDefault();
                        Dispatcher.trigger('newTodo', this.$el.find('input').val());
                    }
                }
            }
        }

    });


    var TodosCollection = BB.Collection.extend({ //collection of todos

        initialize : function(){
            this.listenEvents();
        },

        listenEvents : function(){
            Dispatcher.on('newTodo', this.addTodo, this);
            this.on('removeTodo', this.removeTodo, this);
        },

        addTodo : function(todo){
            this.add({
                todoName : todo
            })
        },

        removeTodo : function(todo){
            this.remove(todo);
        }
    });

    var TodosView = DOMView.extend({ //list of todos(<ul>)
        el : '.todo-list',

        model : new TodosCollection(),

        template : {
            '' : {//empty quotes means that this is $el of this view(<ul>)
                'each' : {//each helper iterates through the collection and builds views
                    'view' : function(model){  // for each model from collection create new view and add to the list
                        return new TodoView({
                            el : this.todoTpl.get(0).outerHTML,
                            model : model
                        })
                    }
                }
            }
        },

        initialize : function(){
            this.todoTpl = this.$el.find('.todo-item').detach();
        }
    });

    var TodoView = DOMView.extend({ //single _todo view (list element <li>)
        template : {
            '.todo-name' : {
                'text' : function(){
                    return this.model.get('todoName');
                }
            },
            '.todo-remove' : {
                'on' : {
                    'click' : function(e){
                        e.preventDefault();
                        this.model.trigger('removeTodo', this.model);
                    }
                }
            }
        }
    });

/**************************VIEWS INITIALIZATION******************************/
    var inputView = new InputView(),
        listView = new TodosView();
/****************************************************************************/


})(jQuery, Backbone, Backbone.DOMView, _);