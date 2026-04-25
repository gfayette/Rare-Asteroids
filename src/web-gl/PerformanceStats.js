
export default class PerformanceStats {
    static renderFps = 0

    static maxRenderTick = 0
    static maxGameBeforeTick = 0
    static maxGameAfterTick = 0
    static maxCombined = 0

    static maxRenderGap = 0
    static maxTimeBetweenDraws = 0

    static totalObjects = 0
    static removedPerSec = 0

    static heapLimit = 0
    static heapSize = 0
    static heapUsed = 0

    static slow = false
    static skips = false

    static fpsLoop = [60, 60, 60, 60]
    static frameLoop = [17, 17, 17, 17]

    static lastTickFinished = performance.now()
    static lastFpsTime = performance.now()

    static reset() {
        PerformanceStats.slow = false
        PerformanceStats.skips = false
    
        PerformanceStats.fpsLoop = [60, 60, 60, 60]
        PerformanceStats.frameLoop = [17, 17, 17, 17]
    
        PerformanceStats.lastTickFinished = performance.now()
        PerformanceStats.lastFpsTime = performance.now()
    }
}