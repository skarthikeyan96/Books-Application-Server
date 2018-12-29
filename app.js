const express = require("express");//including express
const app = express();
const graphQL = require("express-graphql")
//importing the GraphQLSchema
const schema = require("./schema/schema")
//connecting to the database
const mongoose = require("mongoose")
const cors = require('cors');

app.use(cors())


mongoose.connect("mongodb://root:root996@ds259912.mlab.com:59912/llcapp",{ useNewUrlParser: true })
mongoose.connection.once("open",()=>{
  console.log("Connected to the database")
})

app.use("/graphql",graphQL({
schema, // schema : schema
graphiql:true
}))


























//listening to the port server
app.listen(4000,()=>console.log("listening to port 4000"))
