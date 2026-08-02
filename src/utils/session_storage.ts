import type { GameSession } from "../types/session";

const STORAGE_KEY = "sessions";

export function getSessions(): GameSession[] {
    const strSessions = localStorage.getItem(STORAGE_KEY);

    if (!strSessions)  {
        return [];
    }

    try {
        const sessions = JSON.parse(strSessions);
        if (!Array.isArray(sessions)) {
            return [];
        }
        return sessions as GameSession[];
    } catch (e) {
        console.error("Error parsing sessions from localStorage", e);
        return [];
    }
}

export function saveSessions(sessions: GameSession[]): void {
    try {
        const strSessions = JSON.stringify(sessions);
        localStorage.setItem(STORAGE_KEY, strSessions);
    } catch (e) {
        console.error("Error saving sessions to localStorage", e);
    }
}

export function addSession(session: GameSession): void {
    const sessions = getSessions();
    sessions.push(session);
    saveSessions(sessions);
}

export function updateSession(session: GameSession): boolean {
    const sessions = getSessions();
    const index = sessions.findIndex((s) => s.id === session.id);

    if (index === -1) {
        return false;
    }

    sessions[index] = session;
    saveSessions(sessions);
    return true;
}

// Utils for manageiung only 1 sessions instead of multiple. 
// First version of the app will only keep track of a single session to enable 
// to resume a game that was started.
// Utils above are kept for later use when history or multiple pending sessions 
// are gonna be allowed 

const ACTIVE_SESSION_KEY = "resume"

function getActiveSession(): GameSession | null {
    const strSession = localStorage.getItem(ACTIVE_SESSION_KEY);
    if (!strSession)  {
        return null;
    }
    try {
        const activeSession = JSON.parse(strSession);
        return activeSession as GameSession;
    } catch (e) {
        console.error("Error parsing ative session from localStorage", e);
        return null;
    }
}

function saveActiveSession(session: GameSession): void {
    try {
        const strSession = JSON.stringify(session);
        localStorage.setItem(ACTIVE_SESSION_KEY, strSession);
    } catch (e) {
        console.error("Error saving active session to localStorage", e);
    }
}

function closeActiveSession() {
    localStorage.removeItem(ACTIVE_SESSION_KEY)
}

export { getActiveSession, saveActiveSession, closeActiveSession}