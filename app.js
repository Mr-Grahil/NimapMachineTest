const express = require("express")
const app = express();
const sql = require('mysql')
const bodyParser = require("body-parser");

const connection = require("./config/db")

app.set("view engine","ejs")
// middlewares
app.use(express.static(__dirname + "\\public"))
app.use(express.static(__dirname + "\\views"))
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.get("/",(req,res)=>{
    res.redirect("createProduct.html");
})

app.get("/data",(req,res)=>{
    let num = req.query.num;
    let off = (num-1)*3;
   
    if(num==undefined){
        off = 0;
    }
    console.log(off+" tihs is the offset")
    connection.query("select * from product",(err,datas)=>{
        if(err){
            console.error(err)
        }
        n = datas.length;
    })
    connection.query("select * from catagory",(err,catData)=>{
        if(err){
            console.error(err)
        }
        console.log(catData)
        
    })
    connection.query("select * from product limit ? offset ?",[3,off],(err,rows)=>{
        if(err){
            res.send(err);
        }
        res.render("read.ejs",{rows,n})
    })
})


app.get("/edit-data",(req,res)=>{
    connection.query("select * from product where product_id=?",[req.query.id],(err,row)=>{
        if(err){
            console.error(err)
        }
        else{
            result = JSON.parse(JSON.stringify(row[0]));
            console.log(result.product_id)
            res.render("edit.ejs",{result})
        }
    })
})

app.post("/final-update",(req,res)=>{
    console.log(req.body)
    const product_id = req.body.product_id;
    const product_name = req.body.product_name;
    const catagory_id = req.body.catagory_id;
    console.log(req.body)
    let edit = "update product set product_name=?,catagory_id=? where product_id=?"
    connection.query(edit,[product_name,catagory_id,product_id],(err,row)=>{
        if(err){
            console.error(err)
        }
        else{
            res.redirect("/data");
        }
    })
})
app.get("/delete-data",(req,res)=>{

    let deletequery = "delete from product where product_id = ?";
    connection.query(deletequery,[req.query.id],(err,rows)=>{
        if(err){
            console.error(err)
        }
        else{
            res.redirect("/data")
        }
    })

})
app.post("/created",(req,res)=>{
    const product_id = req.body.product_id;
    const product_name = req.body.product_name;
    const catagory_id = req.body.catagory_id;

    try {
        let execute = "insert into product (product_id,product_name,catagory_id) values(?,?,?);"
        connection.query(execute,[product_id,product_name,catagory_id],(err,rows)=>{

            if(err){
                res.send(err)
            }
            res.redirect("/data")
        })

    } catch (error) {
        res.send("this is error")
    }
})

app.post("/catagory",(req,res)=>{
    let id = req.body.id;
    let name = req.body.name;
    connection.query("insert into catagory values(?,?)",[id,name],(err,rows)=>{
        if(err){
            console.error(err);
        }
        else{
            res.redirect("/data");
        }
    })
})

// command for starting the applicatio is npm start

app.listen(5000,console.log("server is running on the port 5000..."))
