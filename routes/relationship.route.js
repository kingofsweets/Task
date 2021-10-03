const {Router} = require('express')
const Relationship = require('../models/Relationship')

const router = Router()

router.get('/get_all', async (req, res) => {
    try {
        const bounds = await Relationship.find({})

        res.status(200).json(bounds)
        
    } catch (error) {
        console.log(error)
    }
})

router.post('/add', async (req, res) => {
    try {
        const {first_part, second_part} = req.body

        const bound = new Relationship({first_part: first_part, second_part: second_part})

        bound.save()

        res.status(200).json({message: 'Новый тип отношений был успешно создан.'})
        
    } catch (error) {
        console.log(error)
    }
})

module.exports = router