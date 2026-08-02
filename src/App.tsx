import { HomePage } from "./pages/home_page/home_page"
import { PlayersPage } from "./pages/players_page/players_page"
import { GamePage } from "./pages/game_page/game_page"
import { Routes, Route } from "react-router-dom"
import { AnimatePresence } from "framer-motion"
import { SessionPage } from "./pages/session_page/session_page"
import ErrorPage from "./pages/error_page/error_page"

function App() {
    return (
        <AnimatePresence mode="wait">
            <Routes>
                <Route path="/avojeu/" element={<HomePage />} />
                <Route path="/avojeu/players" element={<PlayersPage />} />
                <Route path="/avojeu/game/:id" element={<GamePage />} />
                <Route path="/avojeu/session/:id" element={<SessionPage />} />
                <Route path="/avojeu/error" element={<ErrorPage />} />
            </Routes>
        </AnimatePresence>
    )
}

export default App
