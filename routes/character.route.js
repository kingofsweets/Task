const {Router} = require('express')
const Character = require('../models/Characters')
const Relationship = require('../models/Relationship')

const router = Router()

router.get('/get_all', async ( req, res) => {
    try {

        const characters = await Character.find({})

        res.json(characters)
    } catch (error) {
        console.log(error)
    }
})

router.get('/get_one', async ( req, res) => {
    try {
        const {id} = req.query
        const character = await Character.findOne({_id: id})

        res.json(character)
    } catch (error) {
        console.log(error)
    }
})

router.post('/create', async (req, res) => {
    try {

        const {name, status, area, relationship} = req.body

        console.log(relationship.length)

        if(relationship.length > 0){
            const bounds = await Relationship.find({})
            let messages = []

            const promises = await relationship.map(async (bound) => {
                let type = false
                for (let index = 0; index < bounds.length; index++) {
                    
                    console.log(bounds[index])
                    console.log(bound)

                    if((bounds[index].first_part === bound.current_char && bounds[index].second_part === bound.bound_char) || (bounds[index].first_part === bound.bound_char && bounds[index].second_part === bound.current_char)){
                        type = true
                    }
                    
                }

                if(type === false){
                    messages.push(`Отношений вида ${bound.current_char} - ${bound.bound_char} не существует в системе.`)
                }else{
                    const check = await Character.findOne({name: bound.partner_name})
                if (check === null) {
                    messages.push(`Персонажа с именем ${bound.partner_name} не существует в системе.`)
                }

                const new_bound = {
                    partner_name: name,
                    current_char: bound.bound_char,
                    bound_char: bound.current_char,
                }
    
                await Character.updateOne({name: bound.partner_name},{$push: {relationship: new_bound}})
                }
                
                
            }
            )

            await Promise.all(promises)
            if(messages.length > 0) res.status(400).json(messages)
            else {
                const character = new Character({name: name, status: status, area: area, relationship: relationship})
                character.save()
                res.status(200).json({message: 'Персонаж успешно создан.'})
            }



        }
        else{
            const character = new Character({name: name, status: status, area: area, relationship: relationship})
            character.save()
            res.status(200).json({message: 'Персонаж успешно создан.'})
    
        }

    
    } catch (error) {
        console.log(error)
    }
})

router.delete('/delete/:id', async (req, res) => {
    try {
        const id = req.params.id
        const delete_char = await Character.findOne({_id: id})

        if(delete_char.relationship.length > 0){
            await delete_char.relationship.forEach(async (bound) => {

                await Character.updateOne({name: bound.partner_name},{$pull: {relationship: {partner_name: delete_char.name}}})
            
            });
        }
        await Character.deleteOne({_id: id})

        res.status(200).json({message: "Карта успешно удалена"})
    } catch (error) {
        console.log(error)
    }
})

router.put('/update/:id', async (req, res) => {
    try {
        const id = req.params.id
        const {name, status, area, relationship} = req.body

        const update_char = await Character.findOne({_id: id})

        if(relationship.length > 0){
            const bounds = await Relationship.find({})
            let messages = []

            const promises = await relationship.map(async (bound) => {
                let type = false
                for (let index = 0; index < bounds.length; index++) {
                    
                    console.log(bounds[index])
                    console.log(bound)

                    if((bounds[index].first_part === bound.current_char && bounds[index].second_part === bound.bound_char) || (bounds[index].first_part === bound.bound_char && bounds[index].second_part === bound.current_char)){
                        type = true
                    }
                    
                }

                if(type === false){
                    messages.push(`Отношений вида ${bound.current_char} - ${bound.bound_char} не существует в системе.`)
                }     
                else{
                    const check = await Character.findOne({name: bound.partner_name})
                    if (check === null) {
                        messages.push(`Персонажа с именем ${bound.partner_name} не существует в системе`)
                    }
    
                    const new_bound = {
                        partner_name: name,
                        current_char: bound.bound_char,
                        bound_char: bound.current_char,
                    }
    
                    if(bound.id > 0){
                        await Character.updateOne({name: bound.partner_name},{$push: {relationship: new_bound}})
                    }
                    
                }
                
                
            }
            )

            await Promise.all(promises)
            if(messages.length > 0) res.status(400).json(messages)
            else {
                await update_char.relationship.forEach(async (bound) => {

                    await Character.updateOne({name: bound.partner_name, 'relationship.partner_name': update_char.name},{$set:{'relationship.$.partner_name': name}})
                    
                });
        
                await Character.updateOne({_id: id}, {$set:{
                    name:name,
                    status: status,
                    area:area,
                    relationship:relationship
        
                }})
        
                res.status(200).json({message: "Карта успешно обновлена"})
            }



        }
        else{
            await update_char.relationship.forEach(async (bound) => {

                await Character.updateOne({name: bound.partner_name, 'relationship.partner_name': update_char.name},{$set:{'relationship.$.partner_name': name}})
                
            });
    
            await Character.updateOne({_id: id}, {$set:{
                name:name,
                status: status,
                area:area,
                relationship:relationship
    
            }})
    
            res.status(200).json({message: "Карта успешно обновлена"})
    
        }

        

        
    } catch (error) {
        console.log(error)
    }
})


module.exports = router
