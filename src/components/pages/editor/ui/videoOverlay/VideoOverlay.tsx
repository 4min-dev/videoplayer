import React, { useRef, useState } from 'react'
import styles from './VideoOverlay.module.scss'
import VideoPlayer from '../../../../ui/videoPlayer/VideoPlayer'
import VideoPlayerPanel from '../videoPlayerPanel/VideoPlayerPanel'
import ICurrentInteraction from '../../../../../interfaces/ICurrentInteraction'
import IStyleColor from '../../../../../interfaces/IStyleColor'
import IButtonTimestamp from '../../../../../interfaces/IButtonTimestamp'
import IInteraction from '../../../../../interfaces/IInteraction'

type TEditorVideoOverlay = {
  videoUrl: string,
  handleFullscreenToggle: () => void,
  isFullscreen: boolean,
  currentInteraction: ICurrentInteraction,
  setButtonProps:React.Dispatch<React.SetStateAction<{ left: string | null, top: string | null, width: string | null, height: string | null, bottom:string | null }>>,
  buttonProps:{left: string | null, top: string | null, width: string | null, height: string | null, bottom:string | null},
  handleSetTimestampButton:(timeStamp: { start: string, end: string }) => void,
  buttonStyle:IStyleColor[],
  isDrawing:boolean,
  newComment:string,
  handleChangeAddComment:(event:React.ChangeEvent<HTMLInputElement>) => void,
  handleAddCommentInteraction:(interaction:IInteraction) => void,
  commentTimestamp:IButtonTimestamp
}

const EditorVideoOverlay: React.FC<TEditorVideoOverlay> = ({ videoUrl, handleFullscreenToggle, isFullscreen, currentInteraction, setButtonProps, buttonProps, handleSetTimestampButton, buttonStyle, isDrawing, newComment, handleChangeAddComment, handleAddCommentInteraction, commentTimestamp }) => {

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
      <VideoPlayer currentInteraction={currentInteraction} videoUrl={videoUrl} playVideo={playVideo} pauseVideo={pauseVideo} videoRef={videoRef} isVideoStarted={isVideoStarted} setVideoStarted={setVideoStarted} setButtonProps={setButtonProps} buttonProps={buttonProps} buttonStyle={buttonStyle} isDrawing={isDrawing} newComment={newComment}/>
      {
        !currentInteraction && <VideoPlayerPanel isVideoPaused={isVideoPaused} playVideo={playVideo} pauseVideo={pauseVideo} videoRef={videoRef} handleFullscreenToggle={handleFullscreenToggle} isFullscreen={isFullscreen} handleSetTimestampButton={handleSetTimestampButton} handleChangeAddComment={handleChangeAddComment} handleAddCommentInteraction={handleAddCommentInteraction} commentTimestamp={commentTimestamp} newComment={newComment}/>
      }
    </div>
  )
}

export default EditorVideoOverlay
