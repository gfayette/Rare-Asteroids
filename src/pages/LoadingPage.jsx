import "./LoadingPage.css"
import WebGLRenderer from '../web-gl/WebGLRenderer.js'
import { useEffect, useState } from 'react'

export default function LoadingPage() {

    const [update, setUpdate] = useState(false)

    useEffect(() => {
        let runLoop = true
        window.addEventListener('resize', handleResize)
        const updateLoop = () => {
            if (runLoop) {
                setUpdate(prev => !prev)
                setTimeout(updateLoop, 100)
            }
        }
        updateLoop()

        return () => {
            window.removeEventListener('resize', handleResize)
            runLoop = false
        }
    }, [])

    const handleResize = () => {
        setUpdate(prev => !prev)
    }

    return (
        <div className="loading-page">
            Loading
            <div className="textures">
                {WebGLRenderer.numLoadedTextures + ' / ' + WebGLRenderer.numTextures}
            </div>
        </div>
    )
}
