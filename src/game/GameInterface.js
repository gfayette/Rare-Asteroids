import GameModel from "./GameModel"

export default class GameInterface {

    game

    constructor() {
        this.game = new GameModel()
    }

    // Game
    setState(state) {
        this.game.setState(state)
    }

    resize(wpx, hpx, wb, hb) {
        this.game.resize(wpx, hpx, wb, hb)
    }

    reset(set) {
        this.game.reset(set)
    }

    startGame() {
        this.game.startGame()
    }

    setMenuOpen(menuOpen) {
        this.game.setMenuOpen(menuOpen)
    }

    setTimeWarp(m) {
        this.game.setTimeWarp(m)
    }

    setTimeWarpTarget(m) {
        this.game.setTimeWarpTarget(m)
    }

    // Settings
    getSettings() {
        return this.game.getSettings()
    }

    setZoom(z) {
        this.game.setZoom(z)
    }

    setBaseTimeWarp(warp) {
        this.game.setBaseTimeWarp(warp)
    }

    setDifficulty(pace) {
        this.game.setDifficulty(pace)
    }

    setPace(pace) {
        this.game.setPace(pace)
    }

    setAutoUpgrade(auto) {
        this.game.setAutoUpgrade(auto)
    }

    setAutoUnlock(auto) {
        this.game.setAutoUnlock(auto)
    }

    // Input
    handleMouse(x, y, action) {
        this.game.handleMouse(x, y, action)
    }

    handleTouch(e, h) {
        this.game.handleTouch(e, h)
    }


    // Render
    getRenderData() {
        return this.game.getRenderData()
    }

    beforeDraw() {
        this.game.beforeDraw()
    }

    afterDraw() {
        this.game.afterDraw()
    }


    getDashboardData() {
        return this.game.stateManager.getDashboardData()
    }

    getElapsedData() {
        return this.game.stateManager.getElapsedData()
    }

    addElapsed() {
        this.game.stateManager.addElapsed()
    }


    // Asteroid
    getAsteroidData() {
        return this.game.stateManager.getAsteroidData()
    }

    getAsteroidImageUrl() {
        return this.game.stateManager.getAsteroidImageUrl()
    }

    unlockAsteroid(index) {
        this.game.stateManager.unlockAsteroid(index)
    }

    selectAsteroid(index) {
        this.game.stateManager.selectAsteroid(index)
    }

    upgradeAsteroidNumber = (index) => {
        this.game.stateManager.upgradeAsteroidNumber(index)
    }

    upgradeAsteroidPoints = (index) => {
        this.game.stateManager.upgradeAsteroidPoints(index)
    }

    setAsteroidNumber = (index, level) => {
        this.game.stateManager.setAsteroidNumber(index, level)
    }

    setAsteroidPoints = (index, level) => {
        this.game.stateManager.setAsteroidPoints(index, level)
    }


    // Ship
    getShipData() {
        return this.game.stateManager.getShipData()
    }

    getShipImageUrl() {
        return this.game.stateManager.getShipImageUrl()
    }

    unlockShip(index) {
        this.game.stateManager.unlockShip(index)
    }

    selectShip(index) {
        this.game.stateManager.selectShip(index)
    }

    moveShip(position) {
        this.game.moveShip(position)
    }

    stopMoveShip() {
        this.game.stopMoveShip()
    }

    upgradeShipAgility = (index) => {
        this.game.stateManager.upgradeShipAgility(index)
    }

    upgradeShipShield = (index) => {
        this.game.stateManager.upgradeShieldHp(index)
    }

    setShipAgility = (index, level) => {
        this.game.stateManager.setShipAgility(index, level)
    }

    setShipShield = (index, level) => {
        this.game.stateManager.setShieldHp(index, level)
    }


    // Projectile
    getProjectileData() {
        return this.game.stateManager.getProjectileData()
    }

    getProjectileImageUrl() {
        return this.game.stateManager.getProjectileImageUrl()
    }

    unlockProjectile(index) {
        this.game.stateManager.unlockProjectile(index)
    }

    activateProjectile(index, active) {
        this.game.stateManager.activateProjectile(index, active)
    }

    upgradeProjectileDamage = (index) => {
        this.game.stateManager.upgradeProjectileDamage(index)
    }

    upgradeProjectileInterval = (index) => {
        this.game.stateManager.upgradeProjectileInterval(index)
    }

    upgradeProjectileVelocity = (index) => {
        this.game.stateManager.upgradeProjectileVelocity(index)
    }

    setProjectileDamage = (index, level) => {
        this.game.stateManager.setProjectileDamage(index, level)
    }

    setProjectileInterval = (index, level) => {
        this.game.stateManager.setProjectileInterval(index, level)
    }

    setProjectileVelocity = (index, level) => {
        this.game.stateManager.setProjectileVelocity(index, level)
    }


    // Charged Weapon
    getChargedData() {
        return this.game.stateManager.getChargedData()
    }

    getChargedImageUrl() {
        return this.game.stateManager.getChargedImageUrl()
    }

    unlockCharged() {
        this.game.stateManager.unlockCharged()
    }

    upgradeChargedDamage = () => {
        this.game.stateManager.upgradeChargedDamage()
    }

    upgradeChargedInterval = () => {
        this.game.stateManager.upgradeChargedInterval()
    }

    setChargedDamage = (level) => {
        this.game.stateManager.setChargedDamage(level)
    }

    setChargedInterval = (level) => {
        this.game.stateManager.setChargedInterval(level)
    }

    // Upgrade
    getShipUpgrade() {
        return this.game.stateManager.getShipUpgrade()
    }

    getAsteroidUpgrade() {
        return this.game.stateManager.getAsteroidUpgrade()
    }

    getProjectileUpgrade(k) {
        return this.game.stateManager.getProjectileUpgrade()
    }

    getChargedUpgrade() {
        return this.game.stateManager.getChargedUpgrade()
    }


    checkEndGame() {
        this.game.stateManager.checkEndGame()
    }


    // Level
    unlockLevel(index) {
        this.game.stateManager.unlockLevel(index)
    }

    selectLevel(index) {
        this.game.stateManager.selectLevel(index)
    }
}