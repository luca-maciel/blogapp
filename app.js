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
require("./models/Postagem");
const Postagem = mongoose.model("postagens");
require("./models/Categoria");
const Categoria = mongoose.model("categorias");
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
app.use('/admin', routes);
app.get('/', (req, res) => {
    Postagem.find().lean().populate("categoria").sort({ data: "desc" }).then((postagens) => {
        res.render("index", { postagens: postagens });
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro interno");
        res.redirect("/404");
    });
});
app.get('/postagem/:slug', (req, res) => {
    Postagem.findOne({ slug: req.params.slug }).lean().then((postagem) => {
        if (postagem) {
            Categoria.findOne({ _id: postagem.categoria }).lean().then((categoria) => {
                res.render("postagem/index", { postagem: postagem, categoria: categoria });
            }).catch((err) => {
                req.flash("error_msg", "Houve um erro ao listar as categorias");
                res.redirect("/");
            });
        }
        else {
            req.flash("error_msg", "Esta postagem não existe");
            res.redirect("/");
        }
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro interno");
        res.redirect("/");
    });
});
app.get('/categorias', (req, res) => {
    Categoria.find().lean().then((categorias) => {
        res.render("categorias/index", { categorias: categorias });
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao listar as categorias");
        res.redirect("/");
    });
});
app.get('/categorias/:slug', (req, res) => {
    Categoria.findOne({ slug: req.params.slug }).lean().then((categoria) => {
        if (categoria) {
            Postagem.find({ categoria: categoria._id }).lean().then((postagens) => {
                res.render("categorias/postagens", { postagens: postagens, categoria: categoria });
            }).catch((err) => {
                req.flash("error_msg", "Houve um erro ao listar os posts");
                res.redirect("/");
            });
        }
        else {
            req.flash("error_msg", "Esta categoria não existe");
            res.redirect("/");
        }
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao carregar a página desta categoria");
        res.redirect("/");
    });
});
app.get('/404', (req, res) => {
    res.send("Erro 404!");
});
// ==========================
// OUTROS
const PORT = 8081;
app.listen(PORT, () => {
    console.log("Servidor rodando em http://localhost:8081");
});
// ==========================
