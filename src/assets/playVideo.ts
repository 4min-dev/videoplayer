import { SetStateAction } from "react"

export default function playVideo(videoRef: HTMLVideoElement, setIsVideoPaused:React.Dispatch<SetStateAction<boolean>>) {
    videoRef.play()
    setIsVideoPaused(false)
  }