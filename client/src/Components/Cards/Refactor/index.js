import { useCallback, useEffect, useState } from "react"
import axios from "axios"
import { useParams , useHistory} from "react-router"

export const RefactorCard = () => {
    const {id} = useParams()
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
    
    const updateChar = async () => {
        try {
            await axios.put(`/api/character/update/${id}` , {...form, id} , {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).catch((error) => {
                if (error.response.status === 400){
                    console.log(error.response.data)
                    setErrors(error.response.data)
                }
            })
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

    const getCard = useCallback(async () => {
        try {
            await axios.get('/api/character/get_one',{
                headers: {
                    'Content-Type': 'application/json'
                },
                params:{
                    id: id
                }
            })
            .then(response => setForm(response.data))
            .then(console.log(id))
            
        } catch (error) {
            console.log(error)
        }
    }, [id])

    useEffect(()=>{
        getCard()
    }, [getCard])

    return(
        <div className="form-card">
        <div className = "form-card__content">
            <h1>Редактировать карту персонажа</h1>
            {
                errors.map((error) => (
                    <p>{error}</p>
                ))
            }
            <p>Имя?</p>
            <input name= "name" value={form.name} type="text" onChange={changeForm} />

            <p>Статус?</p>
            <input name= "status" value={form.status} type="text" onChange={changeForm} />

            <p>Место жительства/нахождения/пребывания/заключения?</p>
            <input name= "area" value={form.area} type="text" onChange={changeForm} />

            <div>
                <h2>Связи с другими персонажами</h2>
                {
                    form.relationship.map((bound)=>(
                        <div key={form.relationship.indexOf(bound)}  className="form-card__bound">
                            <p>Имя связанного персонажа:</p>
                            <input name= "partner_name" type="text" value={bound.partner_name} onChange={(e) => changeRelationship(e, bound.id)}/>

                            <p>Роль текущего персонажа:</p>
                            <input name= "current_char" type="text" value={bound.current_char} onChange={(e) => changeRelationship(e, bound.id)}/>

                            <p>Роль связанного персонажа:</p>
                            <input name= "bound_char" type="text" value={bound.bound_char} onChange={(e) => changeRelationship(e, bound.id)}/>
                        </div>
                    ))
                }
                <button onClick = {addRelationship}>Добавить</button>
            </div>

            <button onClick={updateChar}>Обновить</button>
        </div>
        </div>
    )
}