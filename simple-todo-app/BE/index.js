const express = require("express");
const { valid , update } = require("./valid.js")

const app = express();


app.post('/todos',(req , res ) => {
    const todo = req.body;
    const validTodo = valid.safeParse(todo);
    if(!validTodo.success){
        return res.json({
            msg : "Invalid input type"
        });
    }

});

app.get('/todos',() => {

});

app.put('/completed',() => {

});




app.listen(3000);
