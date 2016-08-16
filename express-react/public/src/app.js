var todolist = {
    name: "todos",
    todos: [{
        completed: false,
        title: 'finish exercise'
    }, {
        completed: false,
        title: 'lean jsx'
    }, {
        completed: true,
        title: 'lean react'
    }]
};


var App = React.createClass({
    getInitialState: function() {
        return {
            addTaskTitle: '',
            todolist: todolist,
            type: 'all'
        }
    },


    changeHandel: function(event){
        this.setState({value: event.target.value});
    },


    addTaskHandel: function(event){
        let task = this.refs.addTask;
        if(task.value === ''){
            console.error("don't add empty task!");
            return false;
        }
        this.setState(function(){
            let todos = this.state.todolist.todos,
                todo = {
                    completed: false,
                    title: task.value
                };

            todos.push(todo);
            return todos;
        });
    },


    deleteTaskHandel: function(index){
        return function(){
            let todos = this.state.todolist.todos,
                todolist = {
                    todolist: {
                        name: "todos",
                        todos: []
                    }
                };

            todos.splice(index, 1),
                todolist.todolist.todos = todos;

            this.setState(todolist);
        }.bind(this);

    },

    switchTaskCompletedHandel: function(index){
        return function(){
            this.setState(function(){
                let todolist = this.state.todolist;

                todolist['todos'][index]['completed'] = !todolist['todos'][index]['completed'];

                return todolist;
            });
        }.bind(this);
    },

    switchListTypeHandel: function(){
        return function(hash, event){
            let type = '';

            switch(hash){
                case 'active':
                    type = 'active';
                    break;
                case 'completed':
                    type = 'completed';
                    break;
                default :
                    type = 'all';
                    break;
            }

            this.setState({type: type});
        }.bind(this);
    },

    clearCompleted: function(){
        return function(){
            let todolist = this.state.todolist,
                todos = todolist.todos.filter(function(todo){
                    return !todo.completed;
                });
            todolist.todos = todos;

            this.setState(todolist);
        }.bind(this);
    },

    render: function() {
        var todolist = this.state.todolist;
        // 计算还有多少个未完成的
        var lefted = todolist.todos.reduce(function(acc, todo) {
            return todo.completed ? acc : acc + 1;
        }, 0);
        let footer = todolist.todos.length ? <Footer lefted={lefted} type={this.state.type}
                                                     switchType={this.switchListTypeHandel()}
                                                     clearCom={this.clearCompleted()}/> : '';
        return <div ref="app">
            <section className="main">
                <Header title={todolist.name}/>
                <div className="add-taskItem-box">
                    <input ref="addTask" className="new-todo"
                           placeholder="What needs to be done?"
                           defaultValue={this.state.addTaskTitle}
                           onChange={this.changeHandel}/>
                    <button className="add-taskItem" onClick={this.addTaskHandel}>Add</button>
                </div>
                <TodoList todos={todolist.todos} type={this.state.type}
                          delTask={this.deleteTaskHandel}
                          comTask={this.switchTaskCompletedHandel}/>
                {footer}

            </section>
        </div>
    }
});



var Header = React.createClass({
    render: function() {
        return <header className="header">
            <h1>{this.props.title}</h1>
        </header>
    }
});


var TodoList = React.createClass({
    render: function() {
        let that = this;
        return <ul className="todo-list">
            {this.props.todos.map(function(todo, i) {
                switch(that.props.type){
                    case 'all' :
                        return <TodoItem data={todo} key={i}
                                         delTask={that.props.delTask(i)}
                                         comTask={that.props.comTask(i)}/>
                    case 'active' :
                        if(!todo.completed){
                            return <TodoItem data={todo} key={i}
                                             delTask={that.props.delTask(i)}
                                             comTask={that.props.comTask(i)}/>
                        }
                        break;
                    case 'completed' :
                        if(todo.completed){
                            return <TodoItem data={todo} key={i}
                                             delTask={that.props.delTask(i)}
                                             comTask={that.props.comTask(i)}/>
                        }
                        break;
                    default :
                        break;
                }


            })}
        </ul>
    }
});

var TodoItem = React.createClass({

    render: function() {
        var todo = this.props.data;
        let className = todo.completed ? "completed" : '';

        return <li className={className}>
            <div className="view">
                <input className="toggle" type="checkbox"
                       onClick={this.props.comTask}
                       checked={todo.completed}/>
                <label> {todo.title} </label>
                <button ref="deleteTask" className="destroy" onClick={this.props.delTask}>delete </button>
            </div>
        </li>
    }
});

var Footer = React.createClass({

    render: function() {
        // 类型按钮显示
        let type = ['', '', ''];
        switch(this.props.type){
            case 'active':
                type[1] = 'selected';
                break;
            case 'completed':
                type[2] = 'selected';
                break;
            default :
                type[0] = 'selected';
                break;
        }

        return <footer className="footer">
                    <span className="todo-count">
                        <strong> {this.props.lefted} </strong> <span> </span> <span> items </span> <span> left </span>
                    </span>
            <ul className="filters">
                <li> <a href="#" className={type[0]} onClick={this.props.switchType.bind(null, 'all')}> All </a> </li>
                <li> <a href="#" className={type[1]} onClick={this.props.switchType.bind(null, 'active')}> Active </a> </li>
                <li> <a href="#" className={type[2]} onClick={this.props.switchType.bind(null, 'completed')}> Completed </a> </li>
            </ul>
            <button className="clear-completed" onClick={this.props.clearCom}>
                Clear completed
            </button>
        </footer>
    }
});

ReactDOM.render(
    <App />,
    document.getElementById('AppRoot')
);