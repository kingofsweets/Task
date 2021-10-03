const {model, Schema} = require('mongoose')

const character = new Schema({
    name:{type: String, required: true, unique: true},
    status: {type: String, required: true},
    area: {type: String, required: true},
    relationship: [
        {
            partner_name: {type: String, required: true},
            current_char: {type: String, required: true},
            bound_char: {type: String, required: true}
        }
    ]

})

module.exports = model('Character', character);