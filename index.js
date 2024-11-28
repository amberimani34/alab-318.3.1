// first bring in express, which we already installed
// you can see it in your package.json
const express = require('express');
// create your application
const app = express();
// Import the body-parser package
// This package contains middleware that can handle
// the parsing of many different types of data,
// making it easier to work with data in routes that
// accept data from the client (POST, PATCH)
const bodyParser = require('body-parser')
// in order to use the jsx view engine, i need to bring it in
const jsxViewEngine = require('jsx-view-engine');
// method-override is used to be able to do more than GET and POST
const methodOverride = require('method-override');
// you have to have a port defined so that the application has somewhere to listen
const PORT = 3001;

// import the data from the fake database files
const fruits = require('./data/fruits');
const vegetables = require('./data/vegetables');

// set up the view engine to be able to use it
app.set('view engine', 'jsx');
app.set('views', './views');
app.engine('jsx', jsxViewEngine());

// =========== MIDDLEWARE ===============
// this is imported middleware, meaning that we are using code that someone else wrote
// we use the body-parser middleware first so that
// we have access to the parsed data within our routes.
// the parsed data will be located in req.body
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json({ extended: true}));

app.use(methodOverride('_method'));

// below is custom middleware, meaning that we wrote the code wanted to be executed
app.use((req, res, next) => {
    console.log('Middleware: I run for all routes');
    next();
})

app.use((req, res, next) => {
    const time = new Date();
    console.log(
        `-----
        ${time.toLocaleDateString()}: Received a ${req.method} request to ${req.url}.
        `
    );
    if (req.body && Object.keys(req.body).length > 0) {
        console.log('Containing the data');
        console.log(`${JSON.stringify(req.body)}`);
    }
    next();
})

// =========== ROUTES ==================

// We are going to create a full CRUD application
// That means we will be able to
// C - Create new data
// R - Read existing data
// U - Update existing data
// D - Delete existing data
// ========= This corresponds to 4 HTTP verbs
// CRUD                         HTTP
// C - Create                   Post
// R - Read                     Get
// U - Update                   Put/Patch
// D - Delete                   Delete

// Server-side rendering, you also need the views for someone to input to put or post
// INDUCES
// I - Index        GET - READ - display all of the elements
// N - New          GET -* CREATE - but this is a view that allows user inputs
// D - Delete       DELETE - DELETE
// U - Update       PUT - UPDATE - this updates the data
// C - Create       POST - CREATE - this adds new data
// E - Edit         GET -* UPDATE - this is a view that allows user inputs
// S - Show         GET - READ - displays one of the elements


// create routes to represent the different requests
// define the route 
// define the method
// start with the get request
// general format of the request
// app.get(route, function)
// the route is what the client or user types in for the request
// the function is how we respond
app.get('/', (req, res) => {
    res.send(
        '<div>this is my home</div>'
    );
})

app.get('/params', (req, res) => {
    console.log(req.params)
    res.send(
        '<h1>Route Parameters Example</h1>'
    )
})

app.get('/params/:p1', (req, res) => {
    console.log(req.params)
    res.send(
        `<h1>Route Parameters Example</h1><p>There is one parameter: ${req.params.p1}</P>`
    )
})

app.get('/params/:p1/explanations', (req, res) => {
    console.log(req.params);
    res.send(
        `<h1>This is where I explain ${req.params.p1} </h1>`
    )
})

app.get('/params/:p1/:p2', (req, res) => {
    console.log(req.params)
    res.send(
        `<h1>Route Parameters Example</h1><p>There are two parameters: ${req.params.p1} and ${req.params.p2}</P>`
    )
})

app.get('/index', (req, res) => {
    res.send(
        '<h1>This is an index</h1>'
    );
})

app.get('/demo', (req, res) => {
    res.render('Demo');
})


// ******* ABOVE HERE are NON-API routes

// BELOW is what you would typically see in an API with a clear split
//      ****** between backend and frontend
// INDEX

// this is called an index route, where you can see all of the data
// THIS is one version of READ
// READ many
// this is only practical when you have small amounts of data
// but you can also use an index route and limit the number of responses
app.get('/api/fruits', (req, res) => {
    res.json(fruits);
})

app.get('/api/vegetables', (req, res) => {
    res.json(vegetables);
})

// N - NEW - allows a user to input a new fruit
app.get('/fruits/new', (req, res) => {
    // the fruits/New in the render needs to be pointing to something in my views folder
    res.render('fruits/New');
})

// This should be before the route with the parameter
// otherwise, it will get caught up in that route
app.get('/api/fruits/descriptions', (req, res) => {
    res.send('<h2>descriptions of the fruits</h2>');
})

app.get('/api/vegetables/descriptions', (req, res) => {
    res.send('<h2>descriptions of the vegetables</h2>');
})



// DELETE
app.delete('/api/fruits/:id', (req, res) => {
    if (req.params.id >= 0 && req.params.id < fruits.length) {
        fruits.splice(req.params.id, 1);
        res.json(fruits[req.params.id])
    } else {
        res.send('<p>That is not a valid id</p>')
    }
})

app.delete('/api/vegetables/:id', (req, res) => {
    if (req.params.id >= 0 && req.params.id < vegetables.length) {
        vegetables.splice(req.params.id, 1);
        res.json(vegetables[req.params.id])
    } else {
        res.send('<p>That is not a valid id</p>')
    }
})

// UPDATE
// put replaces a resource
app.put('/api/fruits/:id', (req, res) => {
    if (req.params.id >= 0 && req.params.id < fruits.length) {
        // put takes the request body and replaces the entire database entry with it
        // find the id and replace the entire thing with the req.body
        if (req.body.readyToEat === 'on') {
            req.body.readyToEat = true;
        } else {
            req.body.readyToEat = false;
        }
        fruits[req.params.id] = req.body;
        res.json(fruits[req.params.id]);
    } else {
        res.send('<p>That is not a valid id</p>')
    }

})

app.put('/api/vegetables/:id', (req, res) => {
    if (req.params.id >= 0 && req.params.id < vegetables.length) {
        // put takes the request body and replaces the entire database entry with it
        // find the id and replace the entire thing with the req.body
        vegetables[req.params.id] = req.body;
        res.json(vegetables[req.params.id]);
    } else {
        res.send('<p>That is not a valid id</p>')
    }

})

// patch updates part of it
app.patch('/api/fruits/:id', (req, res) => {
    if (req.params.id >= 0 && req.params.id < fruits.length) {
        // patch only replaces the properties that we give it
        // find the id and replace only the new properties
            const newFruit = {...fruits[req.params.id], ...req.body}
            fruits[req.params.id] = newFruit;
        res.json(newFruit);
    } else {
        res.send('<p>that is not valid</p>');
    }
})

app.patch('/api/vegetables/:id', (req, res) => {
    if (req.params.id >= 0 && req.params.id < vegetables.length) {
        // patch only replaces the properties that we give it
        // find the id and replace only the new properties
            const newVegetable = {...vegetables[req.params.id], ...req.body}
            fruits[req.params.id] = newVegetable;
        res.json(newVegetable);
    } else {
        res.send('<p>that is not valid</p>');
    }
})

// CREATE
app.post('/api/fruits', (req, res) => {
    console.log(req.body);
    // you should check this when you first start, but then get rid of this console.log
    // console.log(req.body);
    if (req.body.readyToEat === 'on') {
        req.body.readyToEat = true;
    } else {
        req.body.readyToEat = false;
    }
    fruits.push(req.body)
    // res.send('this was the post route');
    res.json(fruits);
})

app.post('/api/vegetables', (req, res) => {
    // you should check this when you first start, but then get rid of this console.log
    // console.log(req.body);
    vegetables.push(req.body)
    // res.send('this was the post route');
    res.json(vegetables);
})

// E - Edit
app.get('/fruits/:id/edit', (req, res) => {
    if (req.params.id >= 0 && req.params.id < fruits.length) {
        res.render('fruits/Edit', { fruit: fruits[req.params.id], id: req.params.id});
    } else {
        res.send('<p>That is not a valid id</p>')
    }
})

// SHOW
// another version of READ is called a show route
// in this one, we can see more information on an individual piece of data
app.get('/api/fruits/:id', (req, res) => {
    // in this case, my unique identifier is going to be the array index
    if (req.params.id >= 0 && req.params.id < fruits.length) {
    res.json(fruits[req.params.id])
} else {
    res.send('<p>That is not a valid id</p>')
}
})

app.get('/api/vegetables/:id', (req, res) => {
    // in this case, my unique identifier is going to be the array index
    if (req.params.id >= 0 && req.params.id < vegetables.length) {
    res.json(vegetables[req.params.id])
} else {
    res.send('<p>That is not a valid id</p>')
}
})


// Custom 404 (not found) middleware
// since we placed this last, it will only process 
// if no other routes have already sent a response
// We also don't need a next in this VERY SPECIAL instance
// because it is the last stop along with the request-response cycle
app.use((req, res) => {
    console.log('i am only in this middleware if no other routes have sent a response.')
    res.status(404);
    res.json({ error: 'Resource not found'});
})


// have your application start and listen for requests
// this is server, so will be listening for requests and responding
app.listen(PORT, () => {
    console.log('listening');
})
