import "./About.css"
import { useEffect } from 'react'


export default function About(props) {

    useEffect(() => {

        return () => {
        }
    }, [])

    return (
        <div className="about-container">
            About
            <div className="about-panel">
                <div className="about-title">
                    How To Play
                </div>
                <div className="about-text">
                    Move the mouse or tap the bottom of the screen to steer the ship. When your primary weapon is unlocked, click or tap to fire.
                    <br />
                    <br />
                    Asteroid impacts deplete your shield. If your shield runs out, your points are reset.
                </div>
                <div className="about-title">
                    Background
                </div>
                <div className="about-text">
                    When I started this project in 2023, my goal was to build something neat while learning game design and the rendering pipeline.
                    Three years later, here it is - written almost entirely from scratch with javascript and webgl.
                </div>
                <br />
                <img className="about-img" src="textures/ui/deps.png" />
                <div className="about-text">
                    If it's running slowly on your device, that's probably why. ^
                </div>
            </div>
            <div className="about-github">
                <a
                    href="https://github.com/gfayette/Rare-Asteroids"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <img
                        src="/textures/ui/github.png"
                        alt="Repository"
                    />
                </a>
            </div>
            <div className="about-text">
                George Fayette
                <div />
                2026
            </div>
            <br />
        </div>
    )
}