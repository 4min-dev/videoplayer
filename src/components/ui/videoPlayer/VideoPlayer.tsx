import React, { useState, useRef, useEffect, MutableRefObject, Ref } from 'react'
import styles from './VideoPlayer.module.scss'
import getImage from '../../../assets/getImage'

type TVideoPlayer = {
    videoUrl: string,
    playVideo: (videoRef: HTMLVideoElement) => void,
    pauseVideo: (videoRef: HTMLVideoElement) => void,
    videoRef: React.RefObject<HTMLVideoElement>
}

const VideoPlayer: React.FC<TVideoPlayer> = ({ videoUrl, playVideo, pauseVideo, videoRef }) => {
    const [isVideoStarted, setVideoStarted] = useState<boolean>(false)

    const handlePlayClick = () => {
        if (!isVideoStarted) {
            setVideoStarted(true)
            if (videoRef.current) {
                videoRef.current.currentTime = 0
                videoRef.current.muted = false
                playVideo(videoRef.current)
            }
        } else {
            if (videoRef.current) {
                videoRef.current.paused ? playVideo(videoRef.current) : pauseVideo(videoRef.current)
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
                onEnded={() => playVideo(videoRef.current!)}
                onTimeUpdate={handleTimeUpdate}
                onClick={handlePlayClick}
            />
        </div>
    )
}

export default VideoPlayer