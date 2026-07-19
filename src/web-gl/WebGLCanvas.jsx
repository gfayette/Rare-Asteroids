import { useEffect, useState } from 'react'
import WebGLRenderer from './WebGLRenderer'


export default function WebGLCanvas(props) {

    let timerId = null
    const [renderer, setRenderer] = useState(new WebGLRenderer(props.gameInterface))

    useEffect(() => {
        if (renderer.setupGL()) {
            checkTextureLoad()
        }

        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    const handleResize = () => {
        props.gameInterface.stopMoveShip()
        clearInterval(timerId)
        timerId = setInterval(() => {
            clearInterval(timerId)
            resize()
        }, 80)
    }

    const resize = () => {
        let wpx = window.innerWidth
        let hpx = window.innerHeight
        let devicePixelRatio = window.devicePixelRatio || 1
        let wb = wpx * devicePixelRatio
        let hb = hpx * devicePixelRatio
        renderer.setupProjection(wpx, hpx, wb, hb)
        props.gameInterface.resize(wpx, hpx, wb, hb)
    }

    const checkTextureLoad = () => {
        if (document.readyState === 'complete' && WebGLRenderer.numTextures === WebGLRenderer.numLoadedTextures && WebGLRenderer.shadersLoaded) {
            resize()
            window.addEventListener('resize', handleResize)
            props.setupFinished()
            renderer.startRender()
        } else {
            setTimeout(checkTextureLoad, 100)
        }
    }

    const handleMouseDown = (e) => {
        let x = e.pageX / window.innerHeight
        let y = e.pageY / window.innerHeight
        props.gameInterface.handleMouse(x, y, 'd')
    }

    const handleMouseUp = (e) => {
        let x = e.pageX / window.innerHeight
        let y = e.pageY / window.innerHeight
        props.gameInterface.handleMouse(x, y, 'u')
    }

    const handleMouseMove = (e) => {
        let x = e.pageX / window.innerHeight
        let y = e.pageY / window.innerHeight
        props.gameInterface.handleMouse(x, y, 'm')
    }

    const handleMouseOut = (e) => {
        props.gameInterface.handleMouse(0, 0, 'm')
    }

    const handleTouch = (e) => {
        props.gameInterface.handleTouch(e, window.innerHeight)
    }

    return (
        <div className="web-gl">
            <canvas id="gl-canvas"
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                onMouseOut={handleMouseOut}
                onTouchMove={handleTouch}
                onTouchStart={handleTouch}
                onTouchEnd={handleTouch}>
            </canvas>
        </div>
    )
}
