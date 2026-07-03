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
    },
    eAdmin:{
        type: Number,
        default: 0
    }
});

mongoose.model("usuarios", Usuario);

export default module.exports;