import { SetStateAction } from "react"

export default function pauseVideo(videoRef: HTMLVideoElement, setIsVideoPaused:React.Dispatch<SetStateAction<boolean>>) {
    videoRef.pause()
    setIsVideoPaused(true)
  }