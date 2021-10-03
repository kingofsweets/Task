import { Link } from "react-router-dom"

export const Header = () => {
    return(
        <div className="header">
            <Link to="/"><h1 className="header__title">Gossip about the witcher</h1></Link> 
            {/* <div className="header__menu">
                <p className="header__anchor"></p>
                <p className="header__anchor"></p>
            </div> */}
        </div>
    )
}