import React, { useEffect, useState } from 'react'
import Aside from './ui/aside/Aside'
import styles from './Editor.module.scss'
import EditorVideoOverlay from './ui/videoOverlay/VideoOverlay'
import PrimaryButton from '../../ui/buttons/primaryButton/PrimaryButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHandPointUp, faImage, faQuestionCircle, faSun } from '@fortawesome/free-regular-svg-icons'
import { faBolt, faChevronDown, faEllipsisVertical, faFont, faMinus, faPlay, faPlus, faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import TooltipButton from '../../ui/buttons/tooltipButton/TooltipButton'
import ICurrentInteraction from '../../../interfaces/ICurrentInteraction'

type TControlButton = {
    id: number,
    icon: any,
    title: string,
    hint: string,
    handler: (interaction: ICurrentInteraction) => void
}

type TInteraction = {
    id: number,
    icon: any,
    duration: string,
    type: string,
    title: string,
    types?: { title: string, id: number, background: string, color: string }[],
    tooltip: string
}

const Editor: React.FC = () => {
    const [buttonTimestamp, setButtonTimestamp] = useState<{ startTime: string | null, endTime: string | null }>({ startTime: null, endTime: null })
    const [videoUrl, setVideoUrl] = useState<string | null>(null)
    const [asideTitle, setAsideTitle] = useState<string>('Interactions')
    const [controlsData, setControlsData] = useState<TControlButton[]>([
        {
            id: 1,
            icon: faHandPointUp,
            title: 'Button',
            hint: 'Add Button',
            handler: () => handleAddNewButton({
                id: Date.now(),
                isPause: false,
                startTime: buttonTimestamp.startTime!,
                endTime: buttonTimestamp.endTime!,
                value: 'button'
            })
        },
        {
            id: 2,
            icon: faSun,
            title: 'Hotspot',
            hint: 'Add Hotspot',
            handler: () => console.log('test')
        },
        {
            id: 3,
            icon: faQuestionCircle,
            title: 'Question',
            hint: 'Add Question',
            handler: () => console.log('test')
        },
        {
            id: 4,
            icon: faImage,
            title: 'Image',
            hint: 'Add Image',
            handler: () => console.log('test')
        },
        {
            id: 5,
            icon: faFont,
            title: 'Text',
            hint: 'Add Text',
            handler: () => console.log('test')
        },
        {
            id: 6,
            icon: faPlusCircle,
            title: 'More',
            hint: 'Drawings, Media Clips, Navigations',
            handler: () => console.log('test')
        }
    ])
    const [isFullscreen, setIsFullscreen] = useState<boolean>(false)
    const [currentInteraction, setCurrentInteraction] = useState<ICurrentInteraction | null>(null)
    const [interactionData, setInteractions] = useState<TInteraction[]>([
        {
            id: 1,
            duration: '0:00',
            icon: faQuestionCircle,
            title: 'ksdfsf',
            type: 'Question',
            types: [
                {
                    id: 1,
                    background: 'rgba(67, 198, 172, 0.5)',
                    color: 'black',
                    title: 'Rating (1-5)'
                }
            ],
            tooltip: 'Question that shows at 00:00'
        }
    ])
    const [buttonProps, setButtonProps] = useState<{ left: string | null, top: string | null, width: string | null, height: string | null, bottom: string | null }>({
        left: '200',
        top: '200',
        width: '200',
        height: '200',
        bottom: '200'
    })
    const [buttonTitle, setButtonTitle] = useState<string>('')

    const handleFullscreenToggle = () => {
        if (isFullscreen) {
            if (document.exitFullscreen) {
                document.exitFullscreen()
            } else if ((document as any).webkitExitFullscreen) {
                (document as any).webkitExitFullscreen()
            } else if ((document as any).mozCancelFullScreen) {
                (document as any).mozCancelFullScreen()
            } else if ((document as any).msExitFullscreen) {
                (document as any).msExitFullscreen()
            }
        } else {
            const fullscreenTarget = document.documentElement

            if (fullscreenTarget.requestFullscreen) {
                fullscreenTarget.requestFullscreen()
            } else if ((fullscreenTarget as any).webkitRequestFullscreen) {
                (fullscreenTarget as any).webkitRequestFullscreen()
            } else if ((fullscreenTarget as any).mozRequestFullScreen) {
                (fullscreenTarget as any).mozRequestFullScreen()
            } else if ((fullscreenTarget as any).msRequestFullscreen) {
                (fullscreenTarget as any).msRequestFullscreen()
            }
        }

        setIsFullscreen((prev) => !prev)
    }

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

    function handleAddInteraction(interaction: TInteraction) {
        setInteractions((prev) => ([...prev, interaction]))
    }

    function handleAddButton(interaction: ICurrentInteraction) {
        setCurrentInteraction({
            id: interaction.id,
            startTime: interaction.startTime,
            endTime: interaction.endTime,
            value: interaction.value,
            isPause: interaction.isPause
        })
    }

    function handleAddNewButton(interaction: ICurrentInteraction) {
        handleAddButton({
            id: interaction.id,
            startTime: interaction.startTime,
            endTime: interaction.endTime,
            isPause: interaction.isPause,
            value: interaction.value
        })
    }

    function handleButtonTitleChange(event: React.ChangeEvent<HTMLInputElement>) {
        setButtonTitle(event.target.value)
    }

    const handleValueChange = (field: keyof typeof buttonProps, delta: number) => {
        setButtonProps((prev) => {
            const currentValue = prev[field]
            if (currentValue === null) return prev

            const numericValue = parseFloat(currentValue.replace('px', '')) || 0

            const newValue = Math.max(0, numericValue + delta)

            return {
                ...prev,
                [field]: `${newValue}px`,
            }
        })
    }

    function handleSetTimestampButton(timeStamp: { start: string, end: string }) {
        setButtonTimestamp({
            startTime: timeStamp.start,
            endTime: timeStamp.end
        })
    }

    return (
        <div className={`flex justify__space__between`}>
            {
                !isFullscreen && <Aside>
                    <div className={`flex column ${styles.asidePanelHeadingContainer}`}>
                        <div className={`flex align__center justify__center ${styles.asidePanelTitleContainer}`}>
                            {
                                <>
                                    {!currentInteraction ? (
                                        <>
                                            <FontAwesomeIcon size='2x' icon={faBolt} />
                                            <span className={styles.asidePanelTitle}>{asideTitle}</span>
                                        </>
                                    ) :
                                        <div className={`flex column ${styles.asidePanelTitleContainer}`}>
                                            <span className={styles.asidePanelTitle}>{`Add ${currentInteraction.value}`}</span>
                                            <div className={`flex align__center ${styles.asidePanelPauseCheckboxContainer}`}>
                                                <input type='checkbox' id='pauseCheckbox'/>
                                                <label htmlFor='pauseCheckbox'>
                                                    Pause for {currentInteraction.value}
                                                </label>
                                            </div>
                                        </div>}
                                </>
                            }
                        </div>

                        <>
                            {
                                currentInteraction ? (
                                    <div className={`flex align__center column ${styles.currentInteractionWrapper}`}>
                                        <div className={`flex align__center ${styles.currentInteractionHeading}`}>
                                            <div className={`flex align__center column ${styles.currentInteractionHeadingCard}`}>
                                                <span className={styles.currentInteractionHeadingCardTitle}>
                                                    Show Time
                                                </span>

                                                <span className={styles.currentInteractionHeadingCardValue}>
                                                    {buttonTimestamp.startTime}
                                                </span>
                                                <span className={styles.currentInteractionHeadingCardDescription}>
                                                    Set to start
                                                </span>
                                            </div>

                                            <div className={`flex align__center column ${styles.currentInteractionHeadingCard}`}>
                                                <span className={styles.currentInteractionHeadingCardTitle}>
                                                    Hide Time
                                                </span>

                                                <span className={styles.currentInteractionHeadingCardValue}>
                                                    {buttonTimestamp.endTime}
                                                </span>
                                                <span className={styles.currentInteractionHeadingCardDescription}>
                                                    Set to end
                                                </span>
                                            </div>
                                        </div>

                                        <div className={`flex column align__center ${styles.currentInteractionInputContainer}`}>
                                            <span className={styles.currentInteractionInputName}>
                                                Button Label
                                            </span>

                                            <input type='text' className={`${styles.currentInteractionInput} ${styles.main}`} placeholder='Enter Button Text' onChange={handleButtonTitleChange} />
                                        </div>

                                        <div className={`flex column align__center ${styles.currentInteractionSelectAction}`}>
                                            <span className={styles.currentInteractionInputName}>
                                                Click Action
                                            </span>

                                            <div className={`flex align__center justify__space__between ${styles.actionRelative} ${styles.currentInteractionSelectActionSelecter}`}>
                                                <span className={styles.currentInteractionSelecterTitle}>
                                                    Open Link
                                                </span>

                                                <button type='button' className={styles.currentInteractionSelecterButton}>
                                                    <FontAwesomeIcon style={{ width: '16', height: '16' }} icon={faChevronDown} />
                                                </button>
                                            </div>
                                        </div>

                                        <div className={`flex column align__center ${styles.currentInteractionInputContainer}`}>
                                            <span className={styles.currentInteractionInputName}>
                                                URL to Open
                                            </span>

                                            <input type='text' className={`${styles.currentInteractionInput} ${styles.actionChild}`} placeholder='Enter Link' />
                                        </div>

                                        <div className={`flex align__center ${styles.uiSettingsContainer}`}>
                                            <TooltipButton position='top' tooltip='Update Colors, Transitions, Animations and more'>
                                                <div className={`flex align__center justify__center ${styles.uiSettingsButton}`}>
                                                    Styling
                                                </div>
                                            </TooltipButton>

                                            <TooltipButton position='top' tooltip='Conditional Logic, Variables, and more'>
                                                <div className={`flex align__center justify__center ${styles.uiSettingsButton}`}>
                                                    Settings
                                                </div>
                                            </TooltipButton>
                                        </div>

                                        <div className={`flex column ${styles.buttonsContainer}`}>
                                            <button type='button' className={styles.saveButton}>
                                                {`Save ${currentInteraction.value}`}
                                            </button>
                                            <button type='button' className={styles.saveAndAddAnotherButton}>
                                                Save & Add Another
                                            </button>
                                            <button type='button' className={styles.discardChangesButton} onClick={() => setCurrentInteraction(null)}>
                                                Discard Changes
                                            </button>
                                        </div>
                                    </div>
                                )
                                    :
                                    interactionData.length <= 0 ? (
                                        <span className={`text__center ${styles.asidePanelDescription}`}>
                                            Welcome to Mindstamp! Press play and use the interaction bar beneath the video to get started.
                                            <br />
                                            <br />
                                            Need help? Check out the tutorials below!
                                        </span>
                                    ) : <div className={`flex column ${styles.interactionCardsContainer}`}>
                                        {
                                            interactionData.map((interaction) => (
                                                <div key={interaction.id} className={`flex justify__space__between ${styles.interactionCard}`}>
                                                    <div className={`flex justify__space__between ${styles.aboutInteractionCard}`}>
                                                        <TooltipButton position={'top'} tooltip={interaction.tooltip}>
                                                            <div className={`flex align__center column ${styles.interactionCardMainUi}`}>
                                                                <span className={styles.duration}>{interaction.duration}</span>
                                                                <FontAwesomeIcon style={{ width: '22.5px', height: '22.5px' }} icon={interaction.icon} />
                                                                <span className={styles.interactionType}>{interaction.type}</span>
                                                            </div>
                                                        </TooltipButton>

                                                        <div className={`flex column ${styles.interactionCardMainAbout}`}>
                                                            <span className={styles.interactionTitle}>{interaction.title}</span>
                                                            {
                                                                interaction.types && (
                                                                    <div className={`flex align__center ${styles.interactionTypesContainer}`}>
                                                                        {
                                                                            interaction.types.map((interactionType) => (
                                                                                <div key={interactionType.id} className={`flex align__center justify__center ${styles.interactionType}`} style={{ background: interactionType.background, color: interactionType.color }}>
                                                                                    {
                                                                                        interactionType.title
                                                                                    }
                                                                                </div>
                                                                            ))
                                                                        }
                                                                    </div>
                                                                )
                                                            }
                                                        </div>
                                                    </div>

                                                    <TooltipButton position='left' tooltip='Edit, Copy, Delete, and More' buttonClassname={styles.interactionButton} wrapperClassname={styles.interactionButtonContainer}>
                                                        <FontAwesomeIcon icon={faEllipsisVertical} style={{ width: '21px', height: '21px' }} />
                                                    </TooltipButton>
                                                </div>
                                            ))
                                        }
                                    </div>
                            }
                        </>
                    </div>

                    {
                        !interactionData && <PrimaryButton
                            className={`flex align__center ${styles.tutorialButton}`}
                            clickHandler={() => { }}
                            buttonText="View Tutorials"
                        >
                            <FontAwesomeIcon icon={faPlay} color="#424242" style={{
                                stroke: 'white',
                                strokeWidth: 60
                            }} />
                        </PrimaryButton>
                    }
                </Aside>
            }
            <div className={`flex column ${styles.editorVideoWrapper} ${isFullscreen ? styles.fullScreen : ''}`}>
                <EditorVideoOverlay videoUrl={videoUrl !== null ? videoUrl : ''} handleFullscreenToggle={handleFullscreenToggle} isFullscreen={isFullscreen} currentInteraction={currentInteraction!} setButtonProps={setButtonProps} buttonTitle={buttonTitle} buttonProps={buttonProps} handleSetTimestampButton={handleSetTimestampButton} />
                {
                    !isFullscreen && <div className={`flex ${styles.videoControlsPanel}`}>
                        {
                            currentInteraction ? (
                                <div className={`flex align__center justify__space__between ${styles.currentInteractionControlsPanel}`}>
                                    <div className={`flex column align__center ${styles.currentInteractionControlsPanelCard}`}>
                                        <span className={styles.currentInteractionControlsPanelCardTitle}>
                                            Left
                                        </span>
                                        <div className={`flex align__center ${styles.currentInteractionControlsPanelCardUi}`}>
                                            <button
                                                type="button"
                                                className={styles.amountButton}
                                                onClick={() => handleValueChange('left', -1)}
                                            >
                                                <FontAwesomeIcon icon={faMinus} />
                                            </button>
                                            <input
                                                value={String(buttonProps.left)}
                                                type="text"
                                                className={styles.currentAmount}
                                                readOnly
                                            />
                                            <button
                                                type="button"
                                                className={styles.amountButton}
                                                onClick={() => handleValueChange('left', 1)}
                                            >
                                                <FontAwesomeIcon icon={faPlus} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className={`flex column align__center ${styles.currentInteractionControlsPanelCard}`}>
                                        <span className={styles.currentInteractionControlsPanelCardTitle}>
                                            Top
                                        </span>
                                        <div className={`flex align__center ${styles.currentInteractionControlsPanelCardUi}`}>
                                            <button
                                                type="button"
                                                className={styles.amountButton}
                                                onClick={() => handleValueChange('top', -1)}
                                            >
                                                <FontAwesomeIcon icon={faMinus} />
                                            </button>
                                            <input
                                                value={String(buttonProps.top)}
                                                type="text"
                                                className={styles.currentAmount}
                                                readOnly
                                            />
                                            <button
                                                type="button"
                                                className={styles.amountButton}
                                                onClick={() => handleValueChange('top', 1)}
                                            >
                                                <FontAwesomeIcon icon={faPlus} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className={`flex column align__center ${styles.currentInteractionControlsPanelCard}`}>
                                        <span className={styles.currentInteractionControlsPanelCardTitle}>
                                            Bottom
                                        </span>
                                        <div className={`flex align__center ${styles.currentInteractionControlsPanelCardUi}`}>
                                            <button
                                                type="button"
                                                className={styles.amountButton}
                                                onClick={() => handleValueChange('bottom', -1)}
                                            >
                                                <FontAwesomeIcon icon={faMinus} />
                                            </button>
                                            <input
                                                value={String(buttonProps.bottom)}
                                                type="text"
                                                className={styles.currentAmount}
                                                readOnly
                                            />
                                            <button
                                                type="button"
                                                className={styles.amountButton}
                                                onClick={() => handleValueChange('bottom', 1)}
                                            >
                                                <FontAwesomeIcon icon={faPlus} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className={`flex column align__center ${styles.currentInteractionControlsPanelCard}`}>
                                        <span className={styles.currentInteractionControlsPanelCardTitle}>
                                            Width
                                        </span>
                                        <div className={`flex align__center ${styles.currentInteractionControlsPanelCardUi}`}>
                                            <button
                                                type="button"
                                                className={styles.amountButton}
                                                onClick={() => handleValueChange('width', -1)}
                                            >
                                                <FontAwesomeIcon icon={faMinus} />
                                            </button>
                                            <input
                                                value={String(buttonProps.width)}
                                                type="text"
                                                className={styles.currentAmount}
                                                readOnly
                                            />
                                            <button
                                                type="button"
                                                className={styles.amountButton}
                                                onClick={() => handleValueChange('width', 1)}
                                            >
                                                <FontAwesomeIcon icon={faPlus} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className={`flex column align__center ${styles.currentInteractionControlsPanelCard}`}>
                                        <span className={styles.currentInteractionControlsPanelCardTitle}>
                                            Height
                                        </span>
                                        <div className={`flex align__center ${styles.currentInteractionControlsPanelCardUi}`}>
                                            <button
                                                type="button"
                                                className={styles.amountButton}
                                                onClick={() => handleValueChange('height', -1)}
                                            >
                                                <FontAwesomeIcon icon={faMinus} />
                                            </button>
                                            <input
                                                value={String(buttonProps.height)}
                                                type="text"
                                                className={styles.currentAmount}
                                                readOnly
                                            />
                                            <button
                                                type="button"
                                                className={styles.amountButton}
                                                onClick={() => handleValueChange('height', 1)}
                                            >
                                                <FontAwesomeIcon icon={faPlus} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )
                                : controlsData.length > 0 &&
                                controlsData.map((controlButton) => (
                                    <TooltipButton key={controlButton.id} position='bottom' tooltip={controlButton.hint} buttonClassname={styles.controlButton} wrapperClassname={styles.controlButtonWrapper} handleMouseClick={controlButton.handler}>
                                        <FontAwesomeIcon icon={controlButton.icon} />
                                        <span className={styles.controlButtonText}>{controlButton.title}</span>
                                    </TooltipButton>
                                ))
                        }
                    </div>
                }
            </div>
        </div>
    )
}

export default Editor