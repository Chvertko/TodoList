(function(){
    //globals 
const todoList = document.getElementById('todo-list')
const userSelect = document.getElementById('user-todo')
const form = document.querySelector('form')
let users = []
let todos = []

//Attach events
document.addEventListener('DOMContentLoaded', initApp)
form.addEventListener('submit',handleSubmit)

// Basic logic 
function getUserName(userId){
    const user = users.find(u => u.id === userId)
    return user.name
}
function printTodo({id,userId,title,complited}){
    const li = document.createElement('li')
    li.className = 'todo-item'
    li.dataset.id = id;
    li.innerHTML = `<span>${title} <i>by</i> <b>${getUserName(userId)}</b> </span>`
    

    const status = document.createElement('input')
    status.type = 'checkbox'
    status.checked = complited;
    status.addEventListener('change',handleTodoChange)


    const close = document.createElement('span')
    close.innerHTML = `&times;`
    close.className = 'close'
    close.addEventListener('click',handleClose)
    li.prepend(status)
    li.append(close)



    todoList.prepend(li)
}   
function createUserOption(user){
    const option = document.createElement('option')
    option.value = user.id
    option.innerText = user.name
    userSelect.append(option)
}
function alertError(error){
    alert(error.message)
}
// Event logic 
function initApp(){
    Promise.all([getAllTodos(),getAllUsers()]).then(values => {
        [todos,users] = values

        todos.forEach((todo) => printTodo(todo))
        users.forEach((user) => createUserOption(user))
    })
}
function handleSubmit(event) {
    event.preventDefault()
    createTodo({
        userId: Number(form.user.value),
        title: form.todo.value,
        complited: false
    })
}
function handleTodoChange (){
    const todoId = this.parentElement.dataset.id
    const complited = this.checked
    toggleTodoComplete(todoId,complited)
    
}
function complitedMessage(data){
    const message = document.createElement('span')
    message.innerHTML = `${data.id} todo <i>"${data.title}"</i> is changed <b>${data.complited} </b>`
    form.append(message)
}
function handleClose(){
    const todoId = this.parentElement.dataset.id
    removeTodo(todoId)
}
function deleteTodo(todoId){
    todos = todos.filter(todo => todo.id !== todoId)
    const todo = todoList.querySelector(`[data-id="${todoId}"]`)
    todo.querySelector('input').removeEventListener('change',handleTodoChange)
    todo.querySelector('.close').removeEventListener('click',handleClose)
    todo.remove()
}


// Async logic
async function getAllTodos(){
    try{
        const response = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=10')
        const data = await response.json()

        return data
    } catch(error){
        alertError(error)
    }

    
}
async function getAllUsers(){
    try{
        const response = await fetch('https://jsonplaceholder.typicode.com/users')
        const data = await response.json()
    
        return data
    }catch(error){
        alertError(error)
    }

   
}

async function createTodo(todo){
    try{
        const response = await fetch('https://jsonplaceholder.typicode.com/todos', {
        method: 'POST',
        body: JSON.stringify(todo),
        headers: {
            'Content-Type':'application/json'
        }
    })
    const newTodo = await response.json()
    printTodo(newTodo)
    }catch(error){
        alertError(error)
    }
}
async function toggleTodoComplete(todoId,complited){
    try{
        const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${todoId}`,{
        method:'PATCH',
        body: JSON.stringify({complited}),
        headers: {
            'Content-Type':'application/json'
        },

    })
    const data = await response.json()
    complitedMessage(data)
    if(!response.ok){
        throw new Error('Failed to connect with server. Please try later')
    }
    }catch(error){
        alertError(error)
    }
}
async function removeTodo(todoId){
    try{
        const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${todoId}`,{
        method:'DELETE',
        headers: {
            'Content-Type':'application/json'
        }
    }) 
    if(response.ok){
        deleteTodo(todoId)
    }else{
        throw new Error('Failed to connect with server. Please try later')
    }
    }catch(event){
        alertError(event)
    }
}
})()
