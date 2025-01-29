const express = require("express");
const { valid , update } = require("./valid.js")

const app = express();


app.use(express.json());

app.post('/todos',(req , res ) => {
    const todo = req.body;
    const validTodo = valid.safeParse(todo);
    if(!validTodo.success){
        return res.json({
            msg : "Invalid input type"
        });
    }else{

    }

});

app.get('/todos',() => {

});

app.put('/completed',(req , res ) => {
    const updateid = req.body;
    const validUpdate = update.safeParse(updateid);
    if(!validUpdate.success){
        return res.json({
            msg : "invalid input type"
        });
    }else{

    }

});




app.listen(3000);
