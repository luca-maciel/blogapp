const mongoose:any = require("mongoose");
const Schema:any = mongoose.Schema;

const Usuario:any = new Schema({
    nome:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    senha:{
        type: String,
        required: true
    }
});

mongoose.model("usuarios", Usuario);

export default module.exports;