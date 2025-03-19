import React from 'react'
import styles from './VideoOverlay.module.scss'
import VideoPlayer from '../../../../ui/videoPlayer/VideoPlayer'

type TEditorVideoOverlay = {
    videoUrl:string
}

const EditorVideoOverlay:React.FC<TEditorVideoOverlay> = ({videoUrl}) => {
  return (
    <div className={`flex column align__center ${styles.editorVideoOverlay}`}>
      <VideoPlayer videoUrl={videoUrl}/>
    </div>
  )
}

export default EditorVideoOverlay
