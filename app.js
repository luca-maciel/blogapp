"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const app = express();
const routes = require('./routes/routes');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
// CONFIGS.
//SESSÃO
app.use(session({
    secret: "cursodenode",
    resave: true,
    saveUninitialized: true
}));
app.use(flash());
//MIDDLEWARE
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    next();
});
// BODYPARSER
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// HANDLEBARS
app.engine('handlebars', handlebars.engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
//MONGOOSE
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/blogapp").then(() => {
    console.log("Conectado ao mongodb");
}).catch((err) => {
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
app.listen(PORT, () => {
    console.log("Servidor rodando em http://localhost:8081");
});
// ==========================
