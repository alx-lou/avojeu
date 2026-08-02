type PlayerID = string
type Score = number
type TeamName = string 

export type ScoreSequence = Score[];                    // List of points scored per round
export type Scores = Record<PlayerID, ScoreSequence>;   // Player ID : [score 1, ..., score N]
export type RoundScores =Record<PlayerID, Score>         // {PlayerID 1: score 1, ..., PlayerID N: score N}

export type Team = PlayerID[]                           // list of player IDs
export type Teams = Record<TeamName, Team>;             // Team Name : [PlayerID 1, ..., PlayerID N]

export type GameState = {
    scores: Scores
    teams: Teams
}