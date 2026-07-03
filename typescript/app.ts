const express:any = require('express');
const handlebars:any = require('express-handlebars');
const bodyParser:any = require('body-parser');
const app:any = express();
const routes:any = require('./routes/routes');
const path:any = require('path');
const mongoose:any = require('mongoose');
const session:any = require('express-session');
const flash:any = require('connect-flash');
require("./models/Postagem");
const Postagem:any = mongoose.model("postagens");
require("./models/Categoria");
const Categoria:any = mongoose.model("categorias");

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

app.use('/admin', routes);

app.get('/', (req:any, res:any)=>{
    Postagem.find().lean().populate("categoria").sort({data:"desc"}).then((postagens:any)=>{
        res.render("index", {postagens:postagens});
    }).catch((err:any)=>{
        req.flash("error_msg", "Houve um erro interno");
        res.redirect("/404");
    });
});

app.get('/postagem/:slug', (req:any, res:any)=>{
    Postagem.findOne({slug:req.params.slug}).lean().then((postagem:any)=>{
        if (postagem){
            Categoria.findOne({_id:postagem.categoria}).lean().then((categoria:any)=>{
                res.render("postagem/index", {postagem:postagem, categoria:categoria});
            }).catch((err:any)=>{
                req.flash("error_msg", "Houve um erro ao listar as categorias");
                res.redirect("/");
            });
        }else{
            req.flash("error_msg", "Esta postagem não existe");
            res.redirect("/");
        }
    }).catch((err:any)=>{
        req.flash("error_msg", "Houve um erro interno");
        res.redirect("/");
    });
});

app.get('/categorias', (req:any, res:any)=>{
    Categoria.find().lean().then((categorias:any)=>{
        res.render("categorias/index", {categorias:categorias});
    }).catch((err:any)=>{
        req.flash("error_msg", "Houve um erro ao listar as categorias");
        res.redirect("/");
    });
});

app.get('/categorias/:slug', (req:any, res:any)=>{
    Categoria.findOne({slug:req.params.slug}).lean().then((categoria:any)=>{
        if (categoria){
            Postagem.find({categoria:categoria._id}).lean().then((postagens:any)=>{
                res.render("categorias/postagens", {postagens:postagens, categoria:categoria});
            }).catch((err:any)=>{
                req.flash("error_msg", "Houve um erro ao listar os posts");
                res.redirect("/");
            });
        }else{
            req.flash("error_msg", "Esta categoria não existe");
            res.redirect("/");
        }
    }).catch((err:any)=>{
        req.flash("error_msg", "Houve um erro ao carregar a página desta categoria");
        res.redirect("/");
    });
});

app.get('/404', (req:any, res:any)=>{
    res.send("Erro 404!");
});

// ==========================


// OUTROS
const PORT = 8081;
app.listen(PORT, ()=>{
    console.log("Servidor rodando em http://localhost:8081");
});
// ==========================