const express:any = require('express');
const router:any = express.Router();
const mongoose:any = require('mongoose');
require("../models/Categoria");
const Categoria:any = mongoose.model("categorias");
require("../models/Postagem");
const Postagem:any = mongoose.model("postagens");

router.get('/admin', (req:any, res:any)=>{
    res.render("admin/index");
});

router.get('/categorias', async (req:any, res:any)=>{
    const categorias:any = await Categoria.find({}).lean();
    res.render("admin/categorias", {categorias:categorias}); 
});

router.get('/categorias/add', (req:any, res:any)=>{
    res.render("admin/addcategoria");
});

router.get('/categorias/edit/:id', (req:any, res:any)=>{
    const categoria:any = Categoria.findOne({_id:req.params.id}).lean().then((categoria:any)=>{
        res.render("admin/editcategoria", {categoria:categoria});
    })
    .catch((err:any)=>{
        req.flash("error_msg", "Esta categoria não existe");
        res.redirect("/categorias");
    });
});

router.post('/categorias/edit', (req:any, res:any)=>{
    Categoria.findOne({_id:req.body.id}).then((categoria:any)=>{
        categoria.nome = req.body.nome;
        categoria.slug = req.body.slug;

        categoria.save().then(()=>{
            req.flash("success_msg", "Categoria editada com sucesso");
            res.redirect("/categorias");
        }).catch((err:any)=>{
            req.flash("error_msg", "Houve um erro ao salvar a edição da categoria");
            res.redirect("/categorias");
        });
    }).catch((err:any)=>{
        req.flash("error_msg", "Houve um erro ao editar a categoria");
        res.redirect("/categorias");
    });
});

router.post('/categorias/deletar', (req:any, res:any)=>{
    Categoria.deleteOne({_id:req.body.id}).then(()=>{
        req.flash("success_msg", "Categoria deletada com sucesso");
        res.redirect("/categorias");
    }).catch((err:any)=>{
        req.flash("error_msg", "Houve um erro ao deletar a categoria");
        res.redirect("/categorias");
    });
});

router.post('/categorias/add', (req:any, res:any)=>{

    var erros:any[] = [];

    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "Nome inválido"});
    };

    if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        erros.push({texto: "Slug inválido"});
    };

    if (req.body.nome.length < 2){
        erros.push({texto: "Nome da categoria muito pequeno"});
    };

    if (erros.length > 0){
        res.render("admin/addcategoria", {erros:erros});
    }else{
        const novaCategoria:any = {
            nome: req.body.nome,
            slug: req.body.slug
        }
    
        new Categoria(novaCategoria).save().then(()=>{
            req.flash("success_msg", "Categoria criada com sucesso.");
            res.redirect("/categorias");
        }).catch((err:any)=>{
            req.flash("error_msg", "Erro ao salvar categoria");
            res.redirect("/admin");
        });
    }
});

router.get('/postagens', (req:any, res:any)=>{
    Postagem.find().populate("categoria").sort({date: "desc"}).lean().then((postagens:any)=>{
        res.render("admin/postagens", {postagens:postagens});
    }).catch((err:any)=>{
        req.flash("error_msg", "Houve um erro ao listar as postagens");
        res.redirect("/admin");
    });
});

router.get('/postagens/add', (req:any, res:any)=>{
    Categoria.find().lean().then((categorias:any)=>{
        res.render("admin/addpostagem", {categorias:categorias});
    }).catch((err:any)=>{
        req.flash("error_msg", "Houve um erro ao carregar o formulário");
        res.redirect("/admin");
    });    
});

router.get('/postagens/edit/:id', (req:any, res:any)=>{
    Postagem.findOne({_id:req.params.id}).lean().then((postagem:any)=>{
        Categoria.find().lean().then((categorias:any)=>{
            res.render("admin/editpostagem", {categorias:categorias, postagem:postagem});
        }).catch((err:any)=>{
            req.flash("error_msg", "Houve um erro ao listar as categorias");
            res.redirect("/postagens");
        });
    }).catch((err:any)=>{
        req.flash("error_msg", "Houve um erro ao carregar o formulário de edição");
        res.redirect("/postagens");
    });
});

router.post('/postagens/add', (req:any, res:any)=>{
    var erros:any[] = [];

    if (req.body.categoria == "0"){
        erros.push({texto: "Categoria inválida, registre uma categoria"});
    }

    if (erros.length > 0){
        res.render("admin/addpostagem", {erros:erros});
    }else{
        const novaPostagem:any = {
            titulo: req.body.titulo,
            slug: req.body.slug,
            descricao: req.body.descricao,
            conteudo: req.body.conteudo,
            categoria: req.body.categoria
        }
    
        new Postagem(novaPostagem).save().then(()=>{
            req.flash("success_msg", "Postagem criada com sucesso.");
            res.redirect("/postagens");
        }).catch((err:any)=>{
            req.flash("error_msg", "Houve um erro ao salvar a postagem");
            res.redirect("/postagens");
        });
    }
});

router.post('/postagens/edit', (req:any, res:any)=>{
    Postagem.findOne({_id:req.body.id}).then((postagem:any)=>{
        postagem.titulo = req.body.titulo;
        postagem.slug = req.body.slug;
        postagem.descricao = req.body.descricao;
        postagem.conteudo = req.body.conteudo;
        postagem.categoria = req.body.categoria;

        postagem.save().then(()=>{
            req.flash("success_msg", "Postagem editada com sucesso");
            res.redirect("/postagens");
        }).catch((err:any)=>{
            req.flash("error_msg", "Houve um erro ao salvar a edição da postagem");
            res.redirect("/postagens");
        });
    }).catch((err:any)=>{
        req.flash("error_msg", "Houve um erro ao editar a postagem");
        res.redirect("/postagens");
    });
});

router.post('/postagens/deletar', (req:any, res:any)=>{
    Postagem.deleteOne({_id:req.body.id}).then(()=>{
        req.flash("success_msg", "Postagem deletada com sucesso");
        res.redirect("/postagens");
    }).catch((err:any)=>{
        req.flash("error_msg", "Houve um erro ao deletar a postagem");
        res.redirect("/postagens");
    });
});

module.exports = router;