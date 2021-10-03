import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export const Cards = () => {
    const [characters, setCharacters] = useState([])
    const [bounds, setBounds] = useState([])

    const [form, setForm] = useState({
        first_part: "",
        second_part: ""
    })
    const changeForm = (event) => {
        setForm({...form, [event.target.name]: event.target.value})

    }

    const getCards = async () => {
        try {
            await axios.get('/api/character/get_all', {
                headers:{
                    'Content-Type': 'application/json'
                }
            } )
            .then(response => setCharacters(response.data))
        } catch (error) {
            console.log(error)
        }
    }

    const getBounds = async () => {
        try {
            await axios.get('/api/relationship/get_all', {
                headers:{
                    'Content-Type': 'application/json'
                }
            } )
            .then(response => setBounds(response.data))
        } catch (error) {
            console.log(error)
        }
    }

    async function createBound(){
        try {
            await axios.post('/api/relationship/add', {...form}, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(getBounds())
        } catch (error) {
            
        }
    }

    

    async function deleteCard(id){
        try {
            await axios.delete(`/api/character/delete/${id}`, {id}, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(getCards())
        } catch (error) {
            
        }
    }

    useEffect(()=>{
        getCards()
        getBounds()
    }, [setCharacters])

    return(
        <div className = "cards">
            <div className="cards__content">
                {
                    characters.map((character) => (
                        <div key={character._id} className= "card">
                            <h1 className="card__title">{character.name}</h1>
                            <div className="card__info">
                                <p className="card__text">/{character.status}/</p>
                                <p className="card__text">Место нахождения: {character.area}</p>
                                <h3 className="card__subtitle">Отношения:</h3>
                                {
                                    character.relationship.map((bound) => (
                                        <li key={bound._id} className="card__text">{bound.current_char} для {bound.partner_name}</li>
                                    ))
                                }
                            </div>
                            <div className="card__bottom">
                                <Link to={"/refactor/"+ character._id}><button className="card__button card__button_redact">Редактировать</button></Link>
                                <button onClick={() => deleteCard(character._id)} className="card__button card__button_delete">Удалить</button>
                            </div>
                            
                        </div>
                    ))
                }
            </div>

            <div className="cards__submenu">
                <h2>Дополнительно</h2>
                <Link to= "/create"><button className="cards__submenu-button">Создать персонажа</button></Link>
                <div className="cards__form">
                    <h3>Добавить новый тип отношений</h3>
                    <p>Первая часть</p>
                    <input name="first_part" type="text" onChange={changeForm}/>
                    <p>Вторая часть</p>
                    <input name="second_part"  type="text" onChange={changeForm}/>
                    <button onClick={() => createBound()}>Добавить</button>
                </div>

                <div className="cards__bounds">
                    <h2>Виды связей</h2>
                    {
                        bounds.map((bound) => (
                            <p key={bound._id}>{bound.first_part} - {bound.second_part}</p>
                        ))
                    }
                </div>
            </div>

            

        </div>
    )
}