import React, { useRef, useState } from 'react'
import styles from './VideoOverlay.module.scss'
import VideoPlayer from '../../../../ui/videoPlayer/VideoPlayer'
import VideoPlayerPanel from '../videoPlayerPanel/VideoPlayerPanel'

type TEditorVideoOverlay = {
  videoUrl: string,
  handleFullscreenToggle:() => void,
  isFullscreen:boolean
}

const EditorVideoOverlay: React.FC<TEditorVideoOverlay> = ({ videoUrl, handleFullscreenToggle, isFullscreen }) => {

  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [isVideoPaused, setIsVideoPaused] = useState<boolean>(true)
  const [isVideoStarted, setVideoStarted] = useState<boolean>(false)

  function playVideo(videoRef: HTMLVideoElement) {
    videoRef.play()
    setIsVideoPaused(false)
  }

  function pauseVideo(videoRef: HTMLVideoElement) {
    videoRef.pause()
    setIsVideoPaused(true)
  }

  return (
    <div className={`flex column align__center ${styles.editorVideoOverlay} ${isFullscreen ? styles.fullScreen : ''}`}>
      <VideoPlayer videoUrl={videoUrl} playVideo={playVideo} pauseVideo={pauseVideo} videoRef={videoRef} isVideoStarted={isVideoStarted} setVideoStarted={setVideoStarted}/>
      {
        isVideoStarted && <VideoPlayerPanel isVideoPaused={isVideoPaused} playVideo={playVideo} pauseVideo={pauseVideo} videoRef={videoRef} handleFullscreenToggle={handleFullscreenToggle} isFullscreen={isFullscreen}/>
      }
    </div>
  )
}

export default EditorVideoOverlay
