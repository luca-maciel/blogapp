const mongoose:any = require('mongoose');
const Schema:any = mongoose.Schema;

const Postagem = new Schema({
    titulo: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    descricao: {
        type: String,
        required: true
    },
    conteudo: {
        type: String,
        required: true
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: "categorias",
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    }
});

mongoose.model("postagens", Postagem);

export default module.exports;