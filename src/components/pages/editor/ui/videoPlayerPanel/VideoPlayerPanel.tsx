import React, { useState } from 'react'
import styles from './VideoPlayerPanel.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExpand, faPause, faPlay, faVolumeHigh } from '@fortawesome/free-solid-svg-icons'

type TVideoPlayetPanel = {
    isVideoPaused: boolean,
    playVideo: (videoRef: HTMLVideoElement) => void,
    pauseVideo: (videoRef: HTMLVideoElement) => void,
    videoRef: React.RefObject<HTMLVideoElement>
}

const VideoPlayerPanel: React.FC<TVideoPlayetPanel> = ({ isVideoPaused, playVideo, pauseVideo, videoRef }) => {

    const [isMuteHovered, setIsMuteHovered] = useState<boolean>(false)
    const [playBack, setPlayback] = useState({ current: '0:00', total: '0:00' })

    function handlePlaybackButton() {
        isVideoPaused ? playVideo(videoRef.current!) : pauseVideo(videoRef.current!)
    }

    return (
        <div className={`flex column ${styles.videoPlayerPanel}`}>
            <div className={styles.videoPlayerTimelineWrapper}>
                <div className={styles.videoPlayerTimeline}></div>
            </div>
            <div className={`flex align__center justify__space__between ${styles.videoPlayerTimelineControls}`}>
                <div className={`flex align__center ${styles.videoPlayterTimelineControlButtons}`}>
                    <button type='button' className={styles.playButton} onClick={handlePlaybackButton}>
                        <FontAwesomeIcon size="2x" icon={isVideoPaused ? faPlay : faPause} color='white' />
                    </button>

                    <button type='button' className={styles.muteButton}>
                        <FontAwesomeIcon size="2x" icon={faVolumeHigh} color='white' />
                    </button>

                    {
                        isMuteHovered
                            ? <div className={styles.soundLineContainer}>
                                <div className={styles.soundLineControlCorner}>
                                </div>
                            </div>
                            : <div className={styles.playbackValueContainer}>
                                <span className={styles.currentPlaybackValue}>{playBack.current}</span>
                                &nbsp;/&nbsp;
                                <span className={styles.totalPlaybackValue}>{playBack.total}</span>
                            </div>
                    }
                </div>

                <input className={`flex align__center justify__center ${styles.addCommentInput}`} placeholder='Add Comment' />

                <button type='button' className={styles.fullscreenButton}>
                    <FontAwesomeIcon size="2x" icon={faExpand} color='white' />
                </button>
            </div>
        </div>
    )
}

export default VideoPlayerPanel
