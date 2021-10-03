import { useState } from "react"
import axios from "axios"
import { useHistory } from "react-router"

export const CreateCard = () => {
    const history = useHistory()

    const [errors, setErrors] = useState([])
    const [form, setForm] = useState({
        name: "",
        status: "",
        area: "",
        relationship: []
    })
    const changeForm = (event) => {
        setForm({...form, [event.target.name]: event.target.value})

    }

    const addRelationship = () => {
        const count_relationship = form.relationship.length + 1
        const newList = form.relationship
        newList.push({
            partner_name: "",
            current_char: "",
            bound_char: "",
            id:count_relationship,
        })

        console.log(newList)

        setForm({...form, relationship : newList})
    }

    function changeRelationship(event, id){
        
        const newList = form.relationship.map((bound)=>{
            if(bound.id === id){
                    bound[event.target.name] = event.target.value
                    console.log(form)
            }
            return bound
            
        })
        setForm({...form, relationship : newList})
    }
    
    const createChar = async () => {
        try {
            await axios.post('/api/character/create' , {...form} , {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).catch((error) => {
                if (error.response.status === 400){
                    console.log(error.response.data)
                    setErrors(error.response.data)
                }
            }

            )
            .then(response => {
                console.log(response.status)
                if (response.status === 200) {
                    history.push('/')
                }
            })
        } catch (error) {
            console.log(error)
        }
    }

    return(
        <div className="form-card">
        <div className = "form-card__content">
            <h1>Создание карточки персонажа</h1>
            {
                errors.map((error) => (
                    <p>{error}</p>
                ))
            }
            <p>Имя?</p>
            <input name= "name" type="text" onChange={changeForm} />

            <p>Статус?</p>
            <input name= "status"  type="text" onChange={changeForm} />

            <p>Место жительства/нахождения/пребывания/заключения?</p>
            <input name= "area"  type="text" onChange={changeForm} />

            <div>
                <h2>Связи с другими персонажами</h2>
                {
                    form.relationship.map((bound)=>(
                        <div className= "form-card__bound">
                            <p>Имя связанного персонажа:</p>
                            <input name= "partner_name" type="text" onChange={(e) => changeRelationship(e, bound.id)}/>

                            <p>Роль текущего персонажа:</p>
                            <input name= "current_char" type="text" onChange={(e) => changeRelationship(e, bound.id)}/>

                            <p>Роль связанного персонажа:</p>
                            <input name= "bound_char" type="text" onChange={(e) => changeRelationship(e, bound.id)}/>
                        </div>
                    ))
                }
                <button onClick = {addRelationship}>Добавить</button>
            </div>

            <button onClick = {() => createChar()}>Создать</button>
        </div>
        </div>
    )
}