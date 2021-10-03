const {model, Schema} = require('mongoose')

const bound = new Schema({
    first_part:{type: String, required: true},
    second_part: {type: String, required: true}
})



module.exports = model('Relationship', bound);