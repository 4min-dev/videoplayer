import React, { SetStateAction, useEffect, useState } from 'react'
import styles from './VideoOverlay.module.scss'
import VideoPlayer from '../../../../ui/videoPlayer/VideoPlayer'
import VideoPlayerPanel from '../videoPlayerPanel/VideoPlayerPanel'
import ICurrentInteraction from '../../../../../interfaces/ICurrentInteraction'
import IStyleColor from '../../../../../interfaces/IStyleColor'
import IButtonTimestamp from '../../../../../interfaces/IButtonTimestamp'
import IInteraction from '../../../../../interfaces/IInteraction'
import playVideo from '../../../../../assets/playVideo'
import pauseVideo from '../../../../../assets/pauseVideo'

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
  commentTimestamp:IButtonTimestamp,
  interactionsData:IInteraction[],
  isVideoStarted:boolean,
  setVideoStarted:React.Dispatch<SetStateAction<boolean>>,
  videoRef: React.RefObject<HTMLVideoElement>,
  isVideoPaused:boolean,
  setIsVideoPaused:React.Dispatch<SetStateAction<boolean>>
}

const EditorVideoOverlay: React.FC<TEditorVideoOverlay> = ({ videoUrl, handleFullscreenToggle, isFullscreen, currentInteraction, setButtonProps, buttonProps, handleSetTimestampButton, buttonStyle, isDrawing, newComment, handleChangeAddComment, handleAddCommentInteraction, commentTimestamp, interactionsData, isVideoStarted, setVideoStarted, videoRef, isVideoPaused, setIsVideoPaused }) => {
  const [isVideoPauseByDirection, setIsVideoPausedByDirection] = useState<boolean>(false)
  const [currentTimelineInteractions, setCurrentTimelineInteractions] = useState<ICurrentInteraction[] | []>([])

  function handleSetCurrentTimelineInteraction(interaction: ICurrentInteraction) {
    setCurrentTimelineInteractions((prev) => {
        const isAlreadyAdded = prev.some((item) => item.id === interaction.id)

        if (isAlreadyAdded) {
            return prev
        }

        return [...prev, { ...interaction }]
    })
}

function handleRemoveCurrentTimelineInteraction(id: number) {
  setCurrentTimelineInteractions((prev) => {
      return prev.filter((interaction) => interaction.id !== id)
  })
}

useEffect(() => {
  console.log(currentTimelineInteractions)
}, [currentTimelineInteractions])

  return (
    <div className={`flex column align__center ${styles.editorVideoOverlay} ${isFullscreen ? styles.fullScreen : ''}`}>
      <VideoPlayer currentInteraction={currentInteraction} videoUrl={videoUrl} playVideo={() => playVideo(videoRef?.current!, setIsVideoPaused)} pauseVideo={() => pauseVideo(videoRef.current!, setIsVideoPaused)} videoRef={videoRef} isVideoStarted={isVideoStarted} setVideoStarted={setVideoStarted} setButtonProps={setButtonProps} buttonProps={buttonProps} buttonStyle={buttonStyle} isDrawing={isDrawing} newComment={newComment} currentTimelineInteractions={currentTimelineInteractions} setIsVideoPaused={setIsVideoPausedByDirection}/>
      {
        (!currentInteraction && isVideoStarted && !isVideoPauseByDirection) && <VideoPlayerPanel interactionsData={interactionsData} isVideoPaused={isVideoPaused} playVideo={() => playVideo(videoRef.current!, setIsVideoPaused)} pauseVideo={() => pauseVideo(videoRef.current!, setIsVideoPaused)} videoRef={videoRef} handleFullscreenToggle={handleFullscreenToggle} isFullscreen={isFullscreen} handleSetTimestampButton={handleSetTimestampButton} handleChangeAddComment={handleChangeAddComment} handleAddCommentInteraction={handleAddCommentInteraction} commentTimestamp={commentTimestamp} newComment={newComment} handleSetCurrentTimelineInteraction={handleSetCurrentTimelineInteraction} handleRemoveCurrentTimelineInteraction={handleRemoveCurrentTimelineInteraction}/>
      }
    </div>
  )
}

export default EditorVideoOverlay
