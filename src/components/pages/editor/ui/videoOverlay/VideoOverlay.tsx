import React, { useRef, useState } from 'react'
import styles from './VideoOverlay.module.scss'
import VideoPlayer from '../../../../ui/videoPlayer/VideoPlayer'
import VideoPlayerPanel from '../videoPlayerPanel/VideoPlayerPanel'
import ICurrentInteraction from '../../../../../interfaces/ICurrentInteraction'
import IStyleColor from '../../../../../interfaces/IStyleColor'

type TEditorVideoOverlay = {
  videoUrl: string,
  handleFullscreenToggle: () => void,
  isFullscreen: boolean,
  currentInteraction: ICurrentInteraction,
  setButtonProps:React.Dispatch<React.SetStateAction<{ left: string | null, top: string | null, width: string | null, height: string | null, bottom:string | null }>>,
  buttonTitle:string,
  buttonProps:{left: string | null, top: string | null, width: string | null, height: string | null, bottom:string | null},
  handleSetTimestampButton:(timeStamp: { start: string, end: string }) => void,
  buttonStyle:IStyleColor[]
}

const EditorVideoOverlay: React.FC<TEditorVideoOverlay> = ({ videoUrl, handleFullscreenToggle, isFullscreen, currentInteraction, setButtonProps, buttonTitle, buttonProps, handleSetTimestampButton, buttonStyle }) => {

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
      <VideoPlayer currentInteraction={currentInteraction} videoUrl={videoUrl} playVideo={playVideo} pauseVideo={pauseVideo} videoRef={videoRef} isVideoStarted={isVideoStarted} setVideoStarted={setVideoStarted} setButtonProps={setButtonProps} buttonTitle={buttonTitle} buttonProps={buttonProps} buttonStyle={buttonStyle}/>
      {
        !currentInteraction && <VideoPlayerPanel isVideoPaused={isVideoPaused} playVideo={playVideo} pauseVideo={pauseVideo} videoRef={videoRef} handleFullscreenToggle={handleFullscreenToggle} isFullscreen={isFullscreen} handleSetTimestampButton={handleSetTimestampButton}/>
      }
    </div>
  )
}

export default EditorVideoOverlay
