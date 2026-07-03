"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require("../models/Categoria");
const Categoria = mongoose.model("categorias");
require("../models/Postagem");
const Postagem = mongoose.model("postagens");
require("../models/Usuario");
const Usuario = mongoose.model("usuarios");
router.get('/', (req, res) => {
    res.render("admin/index");
});
router.get('/categorias', async (req, res) => {
    const categorias = await Categoria.find({}).lean();
    res.render("admin/categorias", { categorias: categorias });
});
router.get('/categorias/add', (req, res) => {
    res.render("admin/addcategoria");
});
router.get('/categorias/edit/:id', (req, res) => {
    const categoria = Categoria.findOne({ _id: req.params.id }).lean().then((categoria) => {
        res.render("admin/editcategoria", { categoria: categoria });
    })
        .catch((err) => {
        req.flash("error_msg", "Esta categoria não existe");
        res.redirect("/admin/categorias");
    });
});
router.post('/categorias/edit', (req, res) => {
    Categoria.findOne({ _id: req.body.id }).then((categoria) => {
        categoria.nome = req.body.nome;
        categoria.slug = req.body.slug;
        categoria.save().then(() => {
            req.flash("success_msg", "Categoria editada com sucesso");
            res.redirect("/admin/categorias");
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao salvar a edição da categoria");
            res.redirect("/admin/categorias");
        });
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao editar a categoria");
        res.redirect("/admin/categorias");
    });
});
router.post('/categorias/deletar', (req, res) => {
    Categoria.deleteOne({ _id: req.body.id }).then(() => {
        req.flash("success_msg", "Categoria deletada com sucesso");
        res.redirect("/admin/categorias");
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao deletar a categoria");
        res.redirect("/admin/categorias");
    });
});
router.post('/categorias/add', (req, res) => {
    var erros = [];
    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        erros.push({ texto: "Nome inválido" });
    }
    ;
    if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
        erros.push({ texto: "Slug inválido" });
    }
    ;
    if (req.body.nome.length < 2) {
        erros.push({ texto: "Nome da categoria muito pequeno" });
    }
    ;
    if (erros.length > 0) {
        res.render("admin/addcategoria", { erros: erros });
    }
    else {
        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        };
        new Categoria(novaCategoria).save().then(() => {
            req.flash("success_msg", "Categoria criada com sucesso.");
            res.redirect("/admin/categorias");
        }).catch((err) => {
            req.flash("error_msg", "Erro ao salvar categoria");
            res.redirect("/admin/categorias");
        });
    }
});
router.get('/postagens', (req, res) => {
    Postagem.find().populate("categoria").sort({ date: "desc" }).lean().then((postagens) => {
        res.render("admin/postagens", { postagens: postagens });
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao listar as postagens");
        res.redirect("/admin/postagens");
    });
});
router.get('/postagens/add', (req, res) => {
    Categoria.find().lean().then((categorias) => {
        res.render("admin/addpostagem", { categorias: categorias });
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao carregar o formulário");
        res.redirect("/");
    });
});
router.get('/postagens/edit/:id', (req, res) => {
    Postagem.findOne({ _id: req.params.id }).lean().then((postagem) => {
        Categoria.find().lean().then((categorias) => {
            res.render("admin/editpostagem", { categorias: categorias, postagem: postagem });
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao listar as categorias");
            res.redirect("/admin/postagens");
        });
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao carregar o formulário de edição");
        res.redirect("/admin/postagens");
    });
});
router.post('/postagens/add', (req, res) => {
    var erros = [];
    if (req.body.categoria == "0") {
        erros.push({ texto: "Categoria inválida, registre uma categoria" });
    }
    if (erros.length > 0) {
        res.render("admin/addpostagem", { erros: erros });
    }
    else {
        const novaPostagem = {
            titulo: req.body.titulo,
            slug: req.body.slug,
            descricao: req.body.descricao,
            conteudo: req.body.conteudo,
            categoria: req.body.categoria
        };
        new Postagem(novaPostagem).save().then(() => {
            req.flash("success_msg", "Postagem criada com sucesso.");
            res.redirect("/admin/postagens");
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao salvar a postagem");
            res.redirect("/admin/postagens");
        });
    }
});
router.post('/postagens/edit', (req, res) => {
    Postagem.findOne({ _id: req.body.id }).then((postagem) => {
        postagem.titulo = req.body.titulo;
        postagem.slug = req.body.slug;
        postagem.descricao = req.body.descricao;
        postagem.conteudo = req.body.conteudo;
        postagem.categoria = req.body.categoria;
        postagem.save().then(() => {
            req.flash("success_msg", "Postagem editada com sucesso");
            res.redirect("/admin/postagens");
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao salvar a edição da postagem");
            res.redirect("/admin/postagens");
        });
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao editar a postagem");
        res.redirect("/admin/postagens");
    });
});
router.post('/postagens/deletar', (req, res) => {
    Postagem.deleteOne({ _id: req.body.id }).then(() => {
        req.flash("success_msg", "Postagem deletada com sucesso");
        res.redirect("/admin/postagens");
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao deletar a postagem");
        res.redirect("/admin/postagens");
    });
});
router.get('/registro', (req, res) => {
    res.render("usuarios/registro");
});
router.post('/registro', (req, res) => {
    var erros = [];
    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        erros.push({ texto: "Nome inválido" });
    }
    ;
    if (!req.body.email || typeof req.body.email == undefined || req.body.email == null) {
        erros.push({ texto: "Email inválido" });
    }
    ;
    if (!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null) {
        erros.push({ texto: "Senha inválida" });
    }
    ;
    if (req.body.senha.length < 4) {
        erros.push({ texto: "Senha muito curta" });
    }
    ;
    if (req.body.senha != req.body.senha2) {
        erros.push({ texto: "Senhas não coincidem" });
    }
    ;
    if (erros.length > 0) {
        res.render("usuarios/registro", { erros: erros });
    }
    else {
        Usuario.findOne({ email: req.body.email }).then((usuario) => {
            if (usuario) {
                req.flash("error_msg", "Já existe um usuário com esse e-mail.");
                res.redirect("/admin/registro");
            }
            else {
                const novoUsuario = new Usuario({
                    nome: req.body.nome,
                    email: req.body.email,
                    senha: req.body.senha
                });
                bcrypt.genSalt(10, (erro, salt) => {
                    bcrypt.hash(novoUsuario.senha, salt, (erro, hash) => {
                        if (erro) {
                            req.flash("error_msg", "Houve um erro ao tentar salvar usuário");
                            res.redirect("/");
                        }
                        ;
                        novoUsuario.senha = hash;
                        novoUsuario.save().then(() => {
                            req.flash("success_msg", "Usuário registrado com sucesso");
                            res.redirect("/");
                        }).catch((err) => {
                            req.flash("error_msg", "Houve um erro ao tentar criar o usuário. Tente novamente.");
                        });
                    });
                });
            }
            ;
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro interno");
            res.redirect("/");
        });
    }
    ;
});
router.get("/login", (req, res) => {
    res.render("usuarios/login");
});
module.exports = router;
