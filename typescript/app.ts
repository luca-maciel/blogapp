const express:any = require('express');
const handlebars:any = require('express-handlebars');
const bodyParser:any = require('body-parser');
const app:any = express();
const routes:any = require('./routes/routes');
const path:any = require('path');
const mongoose:any = require('mongoose');
const session:any = require('express-session');
const flash:any = require('connect-flash');

// CONFIGS.
//SESSÃO
app.use(session({
    secret: "cursodenode",
    resave: true,
    saveUninitialized: true
}));
app.use(flash());

//MIDDLEWARE
app.use((req:any, res:any, next:any)=>{
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    next();
});

// BODYPARSER
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// HANDLEBARS
app.engine('handlebars', handlebars.engine({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//MONGOOSE
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/blogapp").then(()=>{
    console.log("Conectado ao mongodb");
}).catch((err:any)=>{
    console.log(`Erro: ${err}`);
});

// OUTRAS CONFIGS...
// Static Files

app.use(express.static(path.join(__dirname, "public")));


// Exemplo de middleware:
// app.use((req:any, res:any, next:any)=>{
//     console.log("TEste middleware");
//     next();
// });

// ==========================

// ROTAS

app.use('/', routes);

// ==========================


// OUTROS
const PORT = 8081;
app.listen(PORT, ()=>{
    console.log("Servidor rodando em http://localhost:8081");
});
// ==========================