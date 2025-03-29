import React, { useEffect, useState, useRef } from 'react'
import styles from './VideoPlayerPanel.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faComment,
    faExpand,
    faPause,
    faPlay,
    faVolumeHigh,
    faVolumeMute,
} from '@fortawesome/free-solid-svg-icons'
import IButtonTimestamp from '../../../../../interfaces/IButtonTimestamp'
import IInteraction from '../../../../../interfaces/IInteraction'
import { TimelineMarker } from '../timelineMarker/TimelineMarker'
import ICurrentInteraction from '../../../../../interfaces/ICurrentInteraction'

type TVideoPlayerPanel = {
    isVideoPaused: boolean
    playVideo: (videoRef: HTMLVideoElement) => void
    pauseVideo: (videoRef: HTMLVideoElement) => void
    videoRef: React.RefObject<HTMLVideoElement>
    handleFullscreenToggle: () => void
    isFullscreen: boolean,
    handleSetTimestampButton: (timeStamp: { start: string, end: string }) => void,
    handleChangeAddComment: (event: React.ChangeEvent<HTMLInputElement>) => void,
    handleAddCommentInteraction: (interaction: IInteraction) => void,
    commentTimestamp: IButtonTimestamp,
    newComment: string,
    interactionsData: IInteraction[],
    handleSetCurrentTimelineInteraction: (interaction: ICurrentInteraction) => void,
    handleRemoveCurrentTimelineInteraction:(interactionId:number) => void
}

const VideoPlayerPanel: React.FC<TVideoPlayerPanel> = ({
    isVideoPaused,
    playVideo,
    pauseVideo,
    videoRef,
    handleFullscreenToggle,
    isFullscreen,
    handleSetTimestampButton,
    handleChangeAddComment,
    handleAddCommentInteraction,
    commentTimestamp,
    interactionsData,
    newComment,
    handleSetCurrentTimelineInteraction,
    handleRemoveCurrentTimelineInteraction
}) => {
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
    const [volume, setVolume] = useState(1)
    const [isDragging, setIsDragging] = useState(false)

    const formatTime = (timeInSeconds: number): string => {
        if (isNaN(timeInSeconds)) return "00:20"
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
            handleLoadedMetadata()

            videoRef.current.addEventListener("loadedmetadata", handleLoadedMetadata)
            videoRef.current.addEventListener("timeupdate", handleTimeUpdate)
            return () => {
                videoRef.current?.removeEventListener("loadedmetadata", handleLoadedMetadata)
                videoRef.current?.removeEventListener("timeupdate", handleTimeUpdate)
            }
        }
    }, [])

    const handleSoundWrapperClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const wrapper = e.currentTarget
        const rect = wrapper.getBoundingClientRect()
        const clickPosition = e.clientX - rect.left
        const newVolume = Math.min(Math.max(clickPosition / rect.width, 0), 1)
        setVolume(newVolume)
    }

    const handleMouseSoundDown = () => {
        setIsDragging(true)
    }

    const handleMouseSoundMove = (e: MouseEvent) => {
        if (!isDragging) return

        const wrapper = document.querySelector(`.${styles.soundLineContainer}`) as HTMLDivElement
        if (!wrapper) return

        const rect = wrapper.getBoundingClientRect()
        const clickPosition = e.clientX - rect.left
        const newVolume = Math.min(Math.max(clickPosition / rect.width, 0), 1)

        setVolume(newVolume)
    }

    const handleMouseSoundUp = () => {
        setIsDragging(false)
    }

    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseSoundMove)
            document.addEventListener('mouseup', handleMouseSoundUp)
        } else {
            document.removeEventListener('mousemove', handleMouseSoundMove)
            document.removeEventListener('mouseup', handleMouseSoundUp)
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseSoundMove)
            document.removeEventListener('mouseup', handleMouseSoundUp)
        }
    }, [isDragging])

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.volume = volume
        }
    }, [volume])

    useEffect(() => {
        handleSetTimestampButton({
            start: playBack.current,
            end: playBack.total
        })
    }, [playBack])

    useEffect(() => {
        if (!videoRef.current) return;

        const handleTimeUpdate = () => {
            const currentTime = videoRef.current?.currentTime;

            if(!currentTime) return

            interactionsData.forEach((interaction) => {
                const interactionStartTimeInSeconds = timeToSeconds(interaction.duration);
                const interactionEndTimeInSeconds = timeToSeconds(interaction.endTime);

                console.log(currentTime)
                console.log(interactionStartTimeInSeconds)
                console.log(interactionEndTimeInSeconds)

                // Проверяем, находится ли текущее время в диапазоне интерактива
                if (
                    currentTime >= interactionStartTimeInSeconds &&
                    currentTime <= interactionEndTimeInSeconds
                ) {
                    // Добавляем интерактив в массив
                    handleSetCurrentTimelineInteraction({
                        id: interaction.id,
                        endTime: interaction.endTime,
                        icon: interaction.icon,
                        isPause: interaction.isPause,
                        pauseDuration:interaction.pauseDuration,
                        startTime: interaction.duration,
                        title: interaction.title,
                        value: interaction.type.toLowerCase(),
                        imgHref: interaction.imgHref,
                        styles:interaction.styles || [],
                        buttonProps:interaction.buttonProps! || []
                    });
                } else {
                    // Удаляем интерактив из массива, если время вышло за пределы
                    handleRemoveCurrentTimelineInteraction(interaction.id);
                }
            });
        };

        videoRef.current.addEventListener("timeupdate", handleTimeUpdate);

        return () => {
            videoRef.current?.removeEventListener("timeupdate", handleTimeUpdate);
        };
    }, [interactionsData]);
    const timeToSeconds = (time: string): number => {
        const [minutes, seconds] = time.split(':').map(Number);
        return minutes * 60 + seconds;
    };

    const markers = interactionsData.map((interaction) => {
        const markerTimeInSeconds = timeToSeconds(interaction.duration)
        const markerPosition = (markerTimeInSeconds / timeToSeconds(playBack.total)) * 100

        return (
            <TimelineMarker
                key={interaction.id}
                leftPosition={markerPosition}
                type={interaction.type}
                icon={interaction.icon}
                isHovered={isTooltipVisible}
            />
        )
    })

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
                {markers}
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
                    <button type="button" className={styles.playButton} onClick={handlePlaybackButton}>
                        <FontAwesomeIcon size="2x" icon={isVideoPaused ? faPlay : faPause} color="white" />
                    </button>
                    <div
                        className={`flex align__center ${styles.muteButtonContainer} ${isMuteHovered ? styles.hovered : ''}`}
                        onMouseEnter={() => setIsMuteHovered(true)}
                        onMouseLeave={() => setIsMuteHovered(false)}
                    >
                        <button
                            type="button"
                            className={styles.muteButton}
                            onClick={() => setVolume((prev) => (prev === 0 ? 1 : 0))}
                        >
                            <FontAwesomeIcon
                                size="2x"
                                icon={volume === 0 ? faVolumeMute : faVolumeHigh}
                                color="white"
                            />
                        </button>
                        <div
                            className={styles.soundLineContainer}
                            onClick={handleSoundWrapperClick}
                        >
                            <div
                                className={styles.soundLineControlThumb}
                                style={{
                                    '--volume': volume,
                                    width: `calc(var(--volume) * 100% - 8px)`,
                                } as React.CSSProperties}
                            >
                                <div
                                    className={styles.soundLineControlCorner}
                                    onMouseDown={handleMouseSoundDown}
                                ></div>
                            </div>
                        </div>
                    </div>
                    {!isMuteHovered && (
                        <div className={styles.playbackValueContainer}>
                            <span className={styles.currentPlaybackValue}>{playBack.current}</span>
                            &nbsp;/&nbsp;
                            <span className={styles.totalPlaybackValue}>{playBack.total}</span>
                        </div>
                    )}
                </div>
                <input
                    className={`flex align__center justify__center ${styles.addCommentInput}`}
                    placeholder="Add Comment"
                    value={newComment}
                    onChange={handleChangeAddComment}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                            event.preventDefault()
                            handleAddCommentInteraction({
                                id: Date.now(),
                                duration: commentTimestamp.startTime!,
                                title: newComment,
                                icon: faComment,
                                type: 'Comment',
                                tooltip: `Comment that shows at ${commentTimestamp.startTime} and hides at ${commentTimestamp.endTime}`,
                                endTime: '00:17',
                                isPause:false
                            })
                        }
                    }}
                />
                <button type="button" className={styles.fullscreenButton} onClick={handleFullscreenToggle}>
                    <FontAwesomeIcon size="2x" icon={faExpand} color="white" />
                </button>
            </div>
        </div>
    )
}

export default VideoPlayerPanel