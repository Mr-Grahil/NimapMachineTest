const sql = require('mysql')
const con = new sql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'nimap'

})


con.connect((err)=>{
    if (err){
        console.log(err)
    }
    console.log("Connection is successful")
})

module.exports= con;
