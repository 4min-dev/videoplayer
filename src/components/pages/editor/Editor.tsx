import React, { useEffect, useState } from 'react'
import Aside from './ui/aside/Aside'
import styles from './Editor.module.scss'
import EditorVideoOverlay from './ui/videoOverlay/VideoOverlay'
import PrimaryButton from '../../ui/buttons/primaryButton/PrimaryButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHandPointUp, faImage, faQuestionCircle, faSun } from '@fortawesome/free-regular-svg-icons'
import { faBolt, faFont, faPlay, faPlusCircle } from '@fortawesome/free-solid-svg-icons'

type TControlButton = {
    id: number,
    icon: any,
    title: string,
    hint:string
}

const Editor: React.FC = () => {
    const [videoUrl, setVideoUrl] = useState<string | null>(null)
    const [asideTitle, setAsideTitle] = useState<string>('Interactions')
    const [controlsData, setControlsData] = useState<TControlButton[]>([
        {
            id: 1,
            icon: faHandPointUp,
            title: 'Button',
            hint:'Add Button'
        },
        {
            id: 2,
            icon: faSun,
            title: 'Hotspot',
            hint:'Add Hotspot'
        },
        {
            id: 3,
            icon: faQuestionCircle,
            title: 'Question',
            hint:'Add Question'
        },
        {
            id: 4,
            icon: faImage,
            title: 'Image',
            hint:'Add Image'
        },
        {
            id: 5,
            icon: faFont,
            title: 'Text',
            hint:'Add Text'
        },
        {
            id: 6,
            icon: faPlusCircle,
            title: 'More',
            hint:'Drawings, Media Clips, Navigations'
        }
    ])

    useEffect(() => {
        const savedVideo = localStorage.getItem('videoFile')
        if (savedVideo) {
            const videoBlob = base64ToBlob(savedVideo)
            const videoObjectUrl = URL.createObjectURL(videoBlob)
            setVideoUrl(videoObjectUrl)
        }
    }, [])

    const base64ToBlob = (base64: string): Blob => {
        const byteString = atob(base64.split(',')[1])
        const mimeString = base64.split(',')[0].split(':')[1].split(';')[0]
        const arrayBuffer = new ArrayBuffer(byteString.length)
        const uint8Array = new Uint8Array(arrayBuffer)

        for (let i = 0; i < byteString.length; i++) {
            uint8Array[i] = byteString.charCodeAt(i)
        }

        return new Blob([arrayBuffer], { type: mimeString })
    }

    return (
        <div className={`flex justify__space__between`}>
            <Aside>
                <div className={`flex column ${styles.asidePanelHeadingContainer}`}>
                    <div className={`flex align__center justify__center ${styles.asidePanelTitleContainer}`}>
                        <FontAwesomeIcon size='2x' icon={faBolt} />
                        <span className={styles.asidePanelTitle}>{asideTitle}</span>
                    </div>

                    <span className={`text__center ${styles.asidePanelDescription}`}>
                        Welcome to Mindstamp! Press play and use the interaction bar beneath the video to get started.
                        <br />
                        <br />
                        Need help? Check out the tutorials below!
                    </span>
                </div>

                <PrimaryButton
                    className={`flex align__center ${styles.tutorialButton}`}
                    clickHandler={() => { }}
                    buttonText="View Tutorials"
                >
                    <FontAwesomeIcon icon={faPlay} color="#424242" style={{
                        stroke: 'white',
                        strokeWidth: 60
                    }} />
                </PrimaryButton>
            </Aside>

            <div className={`flex column ${styles.editorVideoWrapper}`}>
                <EditorVideoOverlay videoUrl={videoUrl !== null ? videoUrl : ''} />
                <div className={`flex ${styles.videoControlsPanel}`}>
                    {controlsData.length > 0 &&
                        controlsData.map((controlButton) => (
                            <div key={controlButton.id} className={`flex column ${styles.controlButtonWrapper}`}>
                                <div key={controlButton.id} className={`flex align__center justify__center ${styles.controlButton}`}>
                                    <FontAwesomeIcon icon={controlButton.icon} />
                                    <span className={styles.controlButtonText}>{controlButton.title}</span>
                                </div>

                                <div className={`flex align__center justify__center ${styles.controlButtonHint}`}>
                                    {controlButton.hint}
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    )
}

export default Editor