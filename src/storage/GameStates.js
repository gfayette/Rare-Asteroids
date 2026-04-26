import GameState from "./GameState"

export default class GameStates {
    version = 1.1
    selected = -1
    states = [new GameState(), new GameState(), new GameState()]
}