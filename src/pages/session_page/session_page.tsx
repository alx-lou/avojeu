import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { FadeInTransition } from "../../components/transition/transitions";
import { gameToolRegistry } from "../../component_registry";
import { getActiveSession, closeActiveSession } from "../../utils/session_storage";
import HomeIcon from "../../assets/icons/home.svg"
import styles from "./session_page.module.css";
import type { AppError } from "../../types/error";


export function SessionPage() {
    const navigate = useNavigate();
    const gameSession = getActiveSession()
    const [selectedTool, setSelectedTool] = useState<string | null>(
        gameSession?.game.tools[0] ?? null
    );

    useEffect(() => {
        if (!gameSession) {
            return;
        }
        void Promise.all(
            gameSession.game.tools.map((toolName) => gameToolRegistry[toolName]?.preload?.() ?? Promise.resolve())
        );
    }, [gameSession]);

    const handleFinishSession = () => {
        navigate("/avojeu/")
        closeActiveSession()
    };

    if (!gameSession) {
        const error: AppError = {
                title: "No session found",
                message: "The session you are looking does not exist."
            }
        return (
            <Navigate to="/avojeu/error" replace state={error}/>
        )
    }

    const selectedToolEntry = selectedTool ? gameToolRegistry[selectedTool] : undefined;
    const ToolComponent = selectedToolEntry?.toolComponent;
    const activeToolContent = selectedTool
        ? ToolComponent ? (
            <ToolComponent gameSession={gameSession} />
        ) : (
            <p>Tool "{selectedTool}" is not available yet.</p>
        )
        : <p>Select a tool to get started.</p>;

    return (
        <FadeInTransition>
            <div className={styles.page}>
                <header className={styles.header}>
                    <h1>{gameSession.game.name}</h1>
                    <button type="button" onClick={() => navigate("/avojeu/")}>
                        <img src={HomeIcon} alt="home" />
                    </button>
                    <button type="button" onClick={handleFinishSession}>
                        {"Finish"}
                    </button>
                </header>

                <section className={styles.toolList}>
                    {gameSession.game.tools.map((toolName) => (
                        <button
                            key={toolName}
                            type="button"
                            onClick={() => setSelectedTool(toolName)}
                        >
                            {gameToolRegistry[toolName]?.toolLabel ?? toolName}
                        </button>
                    ))}
                </section>

                <section className={styles.toolWindow}>
                    {activeToolContent}
                </section>
            </div>
        </FadeInTransition>
    );
}