import React, { useRef, useState } from 'react'
import styles from './VideoOverlay.module.scss'
import VideoPlayer from '../../../../ui/videoPlayer/VideoPlayer'
import VideoPlayerPanel from '../videoPlayerPanel/VideoPlayerPanel'

type TEditorVideoOverlay = {
    videoUrl:string
}

const EditorVideoOverlay:React.FC<TEditorVideoOverlay> = ({videoUrl}) => {

  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [isVideoPaused, setIsVideoPaused] = useState<boolean>(true)

  function playVideo(videoRef:HTMLVideoElement) {
    videoRef.play()
    setIsVideoPaused(false)
  }

  function pauseVideo(videoRef:HTMLVideoElement) {
    videoRef.pause()
    setIsVideoPaused(true)
  }

  return (
    <div className={`flex column align__center ${styles.editorVideoOverlay}`}>
      <VideoPlayer videoUrl={videoUrl} playVideo={playVideo} pauseVideo={pauseVideo} videoRef={videoRef}/>
      <VideoPlayerPanel isVideoPaused={isVideoPaused} playVideo={playVideo} pauseVideo={pauseVideo} videoRef={videoRef}/>
    </div>
  )
}

export default EditorVideoOverlay
