import GameStates from './GameStates'
import GameState from './GameState'

export default class StateStorage {
    static gameStates = null

    static saveGameState = () => {
        try {
            this.saveGame()
            const gameStateString = JSON.stringify(this.gameStates)
            localStorage.setItem('state', gameStateString)
        } catch (error) {
            console.error('Error saving game state:', error)
        }
    }

    static loadState = () => {
        try {
            const savedState = localStorage.getItem('state')
            this.gameStates = new GameStates()
            if (savedState) {
                Object.assign(
                    this.gameStates,
                    JSON.parse(savedState)
                )

                if (this.gameStates.version != 1.1) {
                    this.gameStates = new GameStates()
                }
            }
        } catch (error) {
            console.error('Error loading game state:', error)
        }
    }

    static clearStorage = () => {
        this.gameStates = new GameStates()
        this.saveGameState()
    }

    static selectGame = (index) => {
        if (this.gameStates != null) {
            this.gameStates.selected = index
        }
        return this.getGameState()
    }

    static saveGame = () => {
        if (this.gameStates.selected !== -1) {
            this.gameStates.states[this.gameStates.selected].saveTime = new Date().getTime()
        }
    }

    static resetGame = (index) => {
        this.gameStates.states[index] = new GameState()
    }

    static getGameState = () => {
        if (this.gameStates.selected === -1) {
            return this.getTitleState()
        } else {
            return this.gameStates.states[this.gameStates.selected]
        }
    }

    static getTitleState = () => {
        const gameState = new GameState()
        gameState.type = 'title'
        gameState.projectiles[0][0].active = false
        gameState.asteroids[0][0].numLS = -1
        return gameState
    }
}
