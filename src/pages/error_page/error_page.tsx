import { useLocation, useNavigate } from "react-router-dom"
import { FadeInTransition } from "../../components/transition/transitions"
import styles from "./error_page.module.css"

import HomeIcon from "../../assets/icons/home.svg"
import { ROUTES } from "../../routes/routes";

export default function ErrorPage() {

    const { state } = useLocation(); 
    const navigate = useNavigate();

    return (
        <FadeInTransition>
            <div className={styles.errorPage}>
                <h1>{state.title}</h1>
                <p>{state.message}</p>
                <button className={styles.homeButton} onClick={() => navigate(ROUTES.HOME)}>
                    <img src={HomeIcon} alt="Return to home page" />
                </button>
            </div>
        </FadeInTransition>
    )
}