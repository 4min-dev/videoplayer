import React, { useEffect, useState, useRef } from 'react'
import styles from './VideoPlayerPanel.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExpand, faPause, faPlay, faVolumeHigh, faVolumeMute } from '@fortawesome/free-solid-svg-icons'

type TVideoPlayerPanel = {
    isVideoPaused: boolean,
    playVideo: (videoRef: HTMLVideoElement) => void,
    pauseVideo: (videoRef: HTMLVideoElement) => void,
    videoRef: React.RefObject<HTMLVideoElement>,
    handleFullscreenToggle: () => void,
    isFullscreen: boolean
}

const VideoPlayerPanel: React.FC<TVideoPlayerPanel> = ({ isVideoPaused, playVideo, pauseVideo, videoRef, handleFullscreenToggle, isFullscreen }) => {
    const [isMuteHovered, setIsMuteHovered] = useState<boolean>(false)
    const [isMuted, setIsMuted] = useState<boolean>(false)
    const [playBack, setPlayback] = useState({
        current: "00:00",
        total: "00:00",
    })
    const [progress, setProgress] = useState<number>(0)
    const [tooltipPosition, setTooltipPosition] = useState<{ x: number, y: number }>({ x: 0, y: 0 })
    const [tooltipTime, setTooltipTime] = useState<string>("00:00")
    const [isTooltipVisible, setIsTooltipVisible] = useState<boolean>(false)
    const isDraggingRef = useRef<boolean>(false)

    const formatTime = (timeInSeconds: number): string => {
        if (isNaN(timeInSeconds)) return "00:00"
        const minutes = Math.floor(timeInSeconds / 60)
        const seconds = Math.floor(timeInSeconds % 60)
        return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
    }

    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            setPlayback({
                current: formatTime(videoRef.current.currentTime),
                total: formatTime(videoRef.current.duration),
            })
        }
    }

    const handleTimeUpdate = () => {
        if (videoRef.current && !isDraggingRef.current) {
            const currentTime = videoRef.current.currentTime
            const duration = videoRef.current.duration

            setPlayback((prev) => ({
                ...prev,
                current: formatTime(currentTime),
            }))

            const progressPercentage = (currentTime / duration) * 100
            setProgress(isNaN(progressPercentage) ? 0 : progressPercentage)
        }
    }

    const handlePlaybackButton = () => {
        if (!videoRef.current) {
            console.error("Video reference is null")
            return
        }
        isVideoPaused ? playVideo(videoRef.current) : pauseVideo(videoRef.current)
    }

    const handleMuteToggle = () => {
        if (videoRef.current) {
            videoRef.current.muted = !videoRef.current.muted
            setIsMuted(videoRef.current.muted)
        }
    }

    const handleTimelineClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (!videoRef.current) return

        const timelineWrapper = event.currentTarget
        const rect = timelineWrapper.getBoundingClientRect()
        let clickPosition = event.clientX - rect.left

        clickPosition = Math.max(0, Math.min(rect.width, clickPosition))

        const percentage = (clickPosition / rect.width) * 100

        const duration = videoRef.current.duration
        const newTime = (percentage / 100) * duration

        videoRef.current.currentTime = newTime
    }

    const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
        if (!videoRef.current) return

        isDraggingRef.current = true

        if (!isVideoPaused) {
            pauseVideo(videoRef.current)
        }

        const timelineWrapper = event.currentTarget
        const updateProgress = (event: MouseEvent) => {
            const rect = timelineWrapper.getBoundingClientRect()
            let clickPosition = event.clientX - rect.left

            clickPosition = Math.max(0, Math.min(rect.width, clickPosition))

            const percentage = (clickPosition / rect.width) * 100

            const duration = videoRef.current?.duration || 0
            const newTime = (percentage / 100) * duration

            if (videoRef.current) {
                videoRef.current.currentTime = newTime
                setProgress(percentage)

                setPlayback((prev) => ({
                    ...prev,
                    current: formatTime(newTime),
                }))
            }
        }

        const handleMouseUp = () => {
            isDraggingRef.current = false
            window.removeEventListener('mousemove', updateProgress)
            window.removeEventListener('mouseup', handleMouseUp)

            if (!isVideoPaused && videoRef.current) {
                playVideo(videoRef.current)
            }
        }

        window.addEventListener('mousemove', updateProgress)
        window.addEventListener('mouseup', handleMouseUp)
    }

    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
        if (!videoRef.current) return

        const timelineWrapper = event.currentTarget
        const rect = timelineWrapper.getBoundingClientRect()
        let clickPosition = event.clientX - rect.left

        clickPosition = Math.max(0, Math.min(rect.width, clickPosition))

        const percentage = (clickPosition / rect.width) * 100

        const duration = videoRef.current.duration
        const newTime = (percentage / 100) * duration

        setTooltipPosition({
            x: rect.left + clickPosition,
            y: event.clientY - 30,
        })
        setTooltipTime(formatTime(newTime))
    }

    const handleMouseEnter = () => {
        setIsTooltipVisible(true)
    }

    const handleMouseLeave = () => {
        setIsTooltipVisible(false)
    }

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.addEventListener("loadedmetadata", handleLoadedMetadata)
            videoRef.current.addEventListener("timeupdate", handleTimeUpdate)

            return () => {
                videoRef.current?.removeEventListener("loadedmetadata", handleLoadedMetadata)
                videoRef.current?.removeEventListener("timeupdate", handleTimeUpdate)
            }
        }
    }, [])

    return (
        <div className={`flex column ${styles.videoPlayerPanel}`}>
            <div
                className={styles.videoPlayerTimelineWrapper}
                onClick={handleTimelineClick}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <div
                    className={styles.videoPlayerTimeline}
                    style={{ width: `${progress}%` }}
                ></div>

                {isTooltipVisible && (
                    <div
                        className={`${styles.tooltip} ${isFullscreen ? styles.fullScreen : ''}`}
                        style={{

                            left: `${tooltipPosition.x}px`,

                        }}
                    >
                        {tooltipTime}
                    </div>
                )}
            </div>

            <div className={`flex align__center justify__space__between ${styles.videoPlayerTimelineControls}`}>
                <div className={`flex align__center ${styles.videoPlayterTimelineControlButtons}`}>
                    <button type='button' className={styles.playButton} onClick={handlePlaybackButton}>
                        <FontAwesomeIcon size="2x" icon={isVideoPaused ? faPlay : faPause} color='white' />
                    </button>

                    <button
                        type='button'
                        className={styles.muteButton}
                        onMouseEnter={() => setIsMuteHovered(true)}
                        onMouseLeave={() => setIsMuteHovered(false)}
                        onClick={handleMuteToggle}
                    >
                        <FontAwesomeIcon size="2x" icon={isMuted ? faVolumeMute : faVolumeHigh} color='white' />
                    </button>

                    {isMuteHovered ? (
                        <div className={styles.soundLineContainer}>
                            <div className={styles.soundLineControlCorner}></div>
                        </div>
                    ) : (
                        <div className={styles.playbackValueContainer}>
                            <span className={styles.currentPlaybackValue}>{playBack.current}</span>
                            &nbsp;/&nbsp;
                            <span className={styles.totalPlaybackValue}>{playBack.total}</span>
                        </div>
                    )}
                </div>

                <input
                    className={`flex align__center justify__center ${styles.addCommentInput}`}
                    placeholder='Add Comment'
                />

                <button type='button' className={styles.fullscreenButton} onClick={handleFullscreenToggle}>
                    <FontAwesomeIcon size="2x" icon={faExpand} color='white' />
                </button>
            </div>
        </div>
    )
}

export default VideoPlayerPanel