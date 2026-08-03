import { HomePage } from "./pages/home_page/home_page"
import { PlayersPage } from "./pages/players_page/players_page"
import { GamePage } from "./pages/game_page/game_page"
import { Routes, Route } from "react-router-dom"
import { AnimatePresence } from "framer-motion"
import { SessionPage } from "./pages/session_page/session_page"
import { ROUTES } from "./routes/routes"
import ErrorPage from "./pages/error_page/error_page"

function App() {
    return (
        <AnimatePresence mode="wait">
            <Routes>
                <Route path={ROUTES.HOME} element={<HomePage />} />
                <Route path={ROUTES.PLAYERS} element={<PlayersPage />} />
                <Route path={ROUTES.GAME} element={<GamePage />} />
                <Route path={ROUTES.SESSION} element={<SessionPage />} />
                <Route path={ROUTES.ERROR} element={<ErrorPage />} />
            </Routes>
        </AnimatePresence>
    )
}

export default App
