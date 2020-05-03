//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _  = require('lodash');
const Request = require('request');

var editText, editTitle;
var posts = [];
var shownPost = {
    title: "",
    text : ""
}

const homeStartingContent = "Bine ai venit pe pagina principala a blogului meu, TECH JOURNAL. Acest blog este legat in totalitate de noutatile din domeniul IT din Romania si din restul lumii. Sper sa iti placa aceasta idee si, de asemenea, daca vrei sa aflii mai multe, nu uita sa te abonezi la newsletter-ul meu zilnic, astfel vei primi zilnic noutatile importante de pe blog.";
const aboutContent = "Salut! Numele meu este Darius Capolna, sunt elev in clasa XII MI la Colegiul National Pedagogic 'Regina Maria' Deva iar acesta este proiectul meu pentru atestatul de informatica. Am o pasiune pentru tot ceea ce tine de informatica, in mod special algoritmica. In clasa a XI-a am reusit sa obtin locul I la Olimpiada Judeteana de Informatica, in clasa a XII reusind mai apoi sa ma calific la faza Nationala. Am realizat acest proiect incercand sa folosesc tot ceea ce am invatat pana la momentul actual legat de programare WEB.";
const contactContent = "Pentru a ma contacta, accesati unul din urmatoarele link-uri sau imi puteti trimite un mail : dariuscapolna@yahoo.com";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


app.get("/", (req, res) => {

    res.render("home", {HomeText: homeStartingContent, posts: posts});
});

app.get('/posts/:currentPost', (req, res) => {
    
    var found = 0;
    posts.forEach(element => {
        if (_.kebabCase(element.title) === _.kebabCase(req.params.currentPost))
        {
            found = 1;
            shownPost = element;
        }
    })
    if (found)
       {
            res.render('post', {
                shownPost: shownPost,
                posts: posts
            })
        }
});


app.get("/compose", (req, res) => {
    
    res.render("compose", {
        editTitle: "",
        editText: ""
    });
});


 app.post("/edit", (req, res) => {

    for (var i = 0; i < posts.length; i++) {
        if (_.kebabCase(posts[i].title) ===  _.kebabCase(shownPost.title))
           {
            posts.splice(i, 1);
            console.log("Eliminat la pozitia " + i);
           }
    }

     res.render("compose", {
         editTitle: shownPost.title,
         editText: shownPost.text 
     });

 });

app.post("/delete", (req, res) => {

    for (var i = 0; i < posts.length; i++) {
        if (_.kebabCase(posts[i].title) ===  _.kebabCase(shownPost.title))
           {
            posts.splice(i, 1);
            console.log("Eliminat la pozitia " + i);
           }
    }

    res.redirect("/");
});

app.post("/compose", (req, res) => {
    
    var post = {
      title : req.body.titleBox,
      text : req.body.textBox
    }

    posts.push(post);
    
    res.redirect("/");
    
});

app.get("/contact", (req, res) => {

    res.render("contact", {ContactText: contactContent});
});


app.get("/about", (req, res) => {
    res.render("about", {AboutText: aboutContent});
});




// Newsletter


app.get("/newsletter", function(req, res){
    res.render('newsletter');
})

app.post("/newsletter", function(req, res){
    var fName = req.body.inputFirst;
    var lName = req.body.inputLast;
    var Email = req.body.inputEmail;

    console.log(fName, lName, Email);

    //construct required data
    const data = {
        members: [
          {
            email_address: Email,
            status: 'subscribed',
            merge_fields: {
              FNAME: fName,
              LNAME: lName
            }
          }
        ]
      };
    
    const postData = JSON.stringify(data);

    const options = {
        url: 'https://us8.api.mailchimp.com/3.0/lists/3ba3c3b202',
        method: 'POST',
        headers: {
           Authorization: 'auth 0f04f636621091d55a8398cc1afff8a7-us8'
        },
        body: postData
    };

    Request (options, function(error, response, body){
        if (error)
            console.log(error);
        else
            console.log(response.statusCode);
            
        if (error)
            res.redirect('/failure')
        else{
            if (response.statusCode === 200)
                res.redirect("/succes");
            else
               res.redirect('/failure');
        }
    });

});

app.get('/succes', (req, res) => {

    res.render("succes");
})

app.get('/failure', (req, res) => {

    res.render('failure');
})

app.post("/failure", function(req, res){
    res.redirect("/newsletter");
});




//API Key
// 0f04f636621091d55a8398cc1afff8a7-us8

//Lists
//ID : 3ba3c3b202
//Authrozation : darius1

var PORT = process.env.PORT || 3000;

app.listen(PORT, function(){

    console.log("Server started on port " + PORT);
    
});
