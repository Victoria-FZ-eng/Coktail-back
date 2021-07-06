const express = require('express');
require('dotenv').config();
const cors = require('cors');
const {default:axios}= require('axios');
const server = express();
server.use(cors());
server.use(express.json());

const PORT = process.env.PORT || 3030;

//use : https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Non_Alcoholic

const mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost:27017/drink', {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connect(`${process.env.MONGO_URL}`, {useNewUrlParser: true, useUnifiedTopology: true});

const drinkSchema = new mongoose.Schema({
    name: String,
    url: String
  });

const Drink = mongoose.model('Drink', drinkSchema);

//localhost:3030/all
server.get('/all', allDrinks);
server.post('/fav', addFav);
server.get('/favOnly', renderFav);
server.delete('/del', deleteD);
server.put('/update', updating);

function updating(req, res){
    const {name, url, id}= req.body;

    Drink.find({_id:id}, (err, data)=>{
        data[0].name= name;
        data[0].url=url;
        data[0].save()
        .then(()=>{
            Drink.find({}, (err,data)=>{
                res.status(200).send(data);
            })
        })
        .catch(err=>console.log(err));
    })
}

function deleteD(req, res){
    const id = req.query.id;
    //console.log(id);
    Drink.deleteOne({_id:id}, (err, data)=>{
        //console.log(data);
        Drink.find({}, (err,data)=>{
            res.status(200).send(data);
        })
    })
    .catch(err=>console.log(err));
}

function renderFav(req,res){
    console.log("favss");
    Drink.find({}, (err,data)=>{
        res.status(200).send(data);
    })
    .catch(err=>console.log(err));
}

function addFav(req,res){
    const{name, url}= req.body;
    //console.log(name, url);

    const newDrink = new Drink({ 
        name: name,
        url: url })
        newDrink.save();

     
           Drink.find({}, (err,data)=>{
            res.status(200).send("Saved To Favorites");
        })
       
       //.catch(err=>console.log(err));

}

function allDrinks(req, res){
  //  console.log("alllll");
    axios
    .get('https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Non_Alcoholic')
    .then(results=>res.status(200).send(results.data.drinks))
    .catch(err=>console.log(err));
}

server.listen(PORT, ()=>{
    console.log(`Listening to PORT ${PORT} O.o`);
})