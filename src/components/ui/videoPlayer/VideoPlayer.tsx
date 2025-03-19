import React, { useState, useRef, useEffect } from 'react'
import styles from './VideoPlayer.module.scss'
import getImage from '../../../assets/getImage'

type TVideoPlayer = {
    videoUrl: string
}

const VideoPlayer: React.FC<TVideoPlayer> = ({ videoUrl }) => {
    const [isVideoStarted, setVideoStarted] = useState<boolean>(false)
    const videoRef = useRef<HTMLVideoElement | null>(null)

    const handlePlayClick = () => {
        if (!isVideoStarted) {
            setVideoStarted(true)
            if (videoRef.current) {
                videoRef.current.currentTime = 0
                videoRef.current.play()
                videoRef.current.muted = false
            }
        }
    }

    const handleTimeUpdate = () => {
        if (!videoRef.current) {
            return
        }

        if (!isVideoStarted) {
            if (videoRef.current.currentTime >= 10) {
                videoRef.current.currentTime = 0
            }
        }

        videoRef.current.play()
    }

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.muted = true
            videoRef.current.play()
        }
    }, [])

    return (
        <div className={styles.videoPlayer}>
            {!isVideoStarted && (
                <button
                    type="button"
                    className={`flex align__center justify__center ${styles.playButton}`}
                    onClick={handlePlayClick}
                >
                    <img src={getImage('play-filled.png')} alt="Play" />
                </button>
            )}

            <video
                ref={videoRef}
                src={videoUrl}
                autoPlay
                muted
                onTimeUpdate={handleTimeUpdate}
                onClick={handlePlayClick}
            />
        </div>
    )
}

export default VideoPlayer