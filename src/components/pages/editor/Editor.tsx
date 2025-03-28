import React, { useEffect, useState } from 'react'
import { ChromePicker } from 'react-color'
import Aside from './ui/aside/Aside'
import styles from './Editor.module.scss'
import EditorVideoOverlay from './ui/videoOverlay/VideoOverlay'
import PrimaryButton from '../../ui/buttons/primaryButton/PrimaryButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHandPointUp, faImage, faQuestionCircle, faSun } from '@fortawesome/free-regular-svg-icons'
import { faBolt, faChevronDown, faEllipsisVertical, faFont, faMinus, faPlay, faPlus, faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import TooltipButton from '../../ui/buttons/tooltipButton/TooltipButton'
import ICurrentInteraction from '../../../interfaces/ICurrentInteraction'
import IStyleColor from '../../../interfaces/IStyleColor'
import TPauseData from '../../../interfaces/TPauseData'
import rgbaToString from '../../../assets/rgbaToString'

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
    tooltip: string,
    buttonProps?: TButtonProps,
    styles?: IStyleColor[]
}

type TButtonTimestamp = {
    startTime: string | null,
    endTime: string | null,
    total: string | null
}

type TActionData = {
    id: number,
    title: string,
    actionHandler: (props?: any) => void
}

type TSelectedAction = {
    id: number | null,
    title: string
}

type TButtonProps = {
    left: string | null,
    top: string | null,
    width: string | null,
    height: string | null,
    bottom: string | null
}

const Editor: React.FC = () => {
    const [buttonTimestamp, setButtonTimestamp] = useState<TButtonTimestamp>({ startTime: null, endTime: null, total: null })
    const [hotspotTimestamp, setHotspotTimestamp] = useState<TButtonTimestamp>({ startTime: null, endTime: null, total: null })
    const [textTimestamp, setTextTimestamp] = useState<TButtonTimestamp>({ startTime: null, endTime: null, total: null })
    const [imageTimestamp, setImageTimestamp] = useState<TButtonTimestamp>({ startTime: null, endTime: null, total: null })
    const [videoUrl, setVideoUrl] = useState<string | null>(null)
    const [asideTitle, setAsideTitle] = useState<string>('Interactions')
    const [controlsData, setControlsData] = useState<TControlButton[]>([
        {
            id: 1,
            icon: faHandPointUp,
            title: 'Button',
            hint: 'Add Button',
            handler: () => {
                handleAddNewButton({
                    id: Date.now(),
                    isPause: false,
                    startTime: buttonTimestamp.startTime!,
                    endTime: buttonTimestamp.endTime!,
                    value: 'button',
                    title: '',
                    icon: faHandPointUp
                })
            }
        },
        {
            id: 2,
            icon: faSun,
            title: 'Hotspot',
            hint: 'Add Hotspot',
            handler: () => handleAddNewHotspot({
                id: Date.now(),
                isPause: false,
                startTime: hotspotTimestamp.startTime!,
                endTime: hotspotTimestamp.endTime!,
                value: 'hotspot',
                title: '',
                icon: faSun
            })
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
            handler: () => handleAddNewImage({
                id: Date.now(),
                isPause: false,
                startTime: hotspotTimestamp.startTime!,
                endTime: hotspotTimestamp.endTime!,
                value: 'image',
                title: '',
                icon: faImage
            })
        },
        {
            id: 5,
            icon: faFont,
            title: 'Text',
            hint: 'Add Text',
            handler: () => handleAddNewText({
                id: Date.now(),
                isPause: false,
                startTime: hotspotTimestamp.startTime!,
                endTime: hotspotTimestamp.endTime!,
                value: 'text',
                title: '',
                icon: faFont
            })
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
    const [interactionData, setInteractions] = useState<TInteraction[]>([])
    const [buttonProps, setButtonProps] = useState<TButtonProps>({
        left: '200',
        top: '200',
        width: '84',
        height: '48',
        bottom: '200'
    })
    const [linkToOpen, setLinkToOpen] = useState<string>('')
    const [isActionSelector, setIsActionSelector] = useState<boolean>(false)
    const [selectedAction, setSelectedAction] = useState<TSelectedAction>({ id: 3, title: 'None' })
    const [actionsData, setActionsData] = useState<TActionData[]>([
        {
            id: 1,
            title: 'Continue',
            actionHandler: (action: TSelectedAction) => selectActionHandler(action)
        },

        {
            id: 2,
            title: 'Open Link',
            actionHandler: (action: TSelectedAction) => selectActionHandler(action)
        },

        {
            id: 3,
            title: 'None',
            actionHandler: (action: TSelectedAction) => selectActionHandler(action)
        }
    ])
    const [styleColorData, setStyleColorData] = useState<IStyleColor[]>([])
    const [isStylingActive, setStylingActive] = useState<boolean>(false)
    const [activePickerId, setActivePickerId] = useState<number | null>(null)
    const [selectedPause, setSelectedPause] = useState<TPauseData>({ id: 1, name: 'Until Viewer Click', value: 'click' })
    const [selectedImage, setSelectedImage] = useState<string | null>(null)
    const [pauseData, setPauseData] = useState<TPauseData[]>([
        {
            id: 1,
            value: 'click',
            name: 'Until Viewer Click',
            actionHandler: (action: TPauseData) => pauseActionHandler(action)
        },

        {
            id: 2,
            value: '2',
            name: '2 seconds',
            actionHandler: (action: TPauseData) => pauseActionHandler(action)
        },

        {
            id: 3,
            value: '5',
            name: '5 seconds',
            actionHandler: (action: TPauseData) => pauseActionHandler(action)
        },

        {
            id: 4,
            value: '10',
            name: '10 seconds',
            actionHandler: (action: TPauseData) => pauseActionHandler(action)
        },

        {
            id: 5,
            value: '15',
            name: '15 seconds',
            actionHandler: (action: TPauseData) => pauseActionHandler(action)
        },

        {
            id: 6,
            value: '20',
            name: '20 seconds',
            actionHandler: (action: TPauseData) => pauseActionHandler(action)
        },

        {
            id: 7,
            value: '25',
            name: '25 seconds',
            actionHandler: (action: TPauseData) => pauseActionHandler(action)
        },

        {
            id: 8,
            value: '30',
            name: '30 seconds',
            actionHandler: (action: TPauseData) => pauseActionHandler(action)
        },

        {
            id: 9,
            value: '45',
            name: '45 seconds',
            actionHandler: (action: TPauseData) => pauseActionHandler(action)
        },

        {
            id: 10,
            value: '60',
            name: '60 seconds',
            actionHandler: (action: TPauseData) => pauseActionHandler(action)
        },
    ])
    const [isPauseSelector, setPauseSelector] = useState<boolean>(false)

    useEffect(() => {
        if (currentInteraction?.value === 'button') {
            setStyleColorData([
                {
                    id: 1,
                    name: 'Text',
                    value: '#fff',
                    defaultValue: '#fff',
                },
                {
                    id: 2,
                    name: 'Background',
                    value: 'rgb(92, 75, 192)',
                    defaultValue: 'rgb(92, 75, 192)',
                },
                {
                    id: 3,
                    name: 'Border',
                    value: '#fff',
                    defaultValue: '#fff',
                },
            ])
        } else if (currentInteraction?.value === 'hotspot') {
            setStyleColorData([
                {
                    id: 1,
                    name: 'Background',
                    value: 'rgb(27, 155, 243)',
                    defaultValue: 'rgb(92, 75, 192)',
                }
            ])
        } else if (currentInteraction?.value === 'text') {
            setStyleColorData([
                {
                    id: 1,
                    name: 'Text',
                    value: '#fff',
                    defaultValue: '#fff',
                },
                {
                    id: 2,
                    name: 'Background',
                    value: 'rgba(0, 0, 0, 0.75)',
                    defaultValue: 'rgba(0, 0, 0, 0.75)'
                }
            ])
        }
    }, [currentInteraction?.value])

    function pauseActionHandler(action: TPauseData) {
        setSelectedPause({ id: action.id, name: action.name, value: action.value })
        setPauseSelector(false)
    }

    function selectActionHandler(action: TSelectedAction) {
        setSelectedAction({ id: action.id, title: action.title })
        setIsActionSelector(false)
    }

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
            isPause: interaction.isPause,
            title: interaction.title,
            icon: faHandPointUp
        })
    }

    function handleAddHotspot(interaction: ICurrentInteraction) {
        setCurrentInteraction({
            id: interaction.id,
            startTime: interaction.startTime,
            endTime: interaction.endTime,
            value: interaction.value,
            isPause: interaction.isPause,
            title: interaction.title,
            icon: faSun
        })
    }

    function handleAddText(interaction: ICurrentInteraction) {
        setCurrentInteraction({
            id: interaction.id,
            startTime: interaction.startTime,
            endTime: interaction.endTime,
            value: interaction.value,
            isPause: interaction.isPause,
            title: interaction.title,
            icon: faFont
        })
    }

    function handleAddImage(interaction: ICurrentInteraction) {
        setCurrentInteraction({
            id: interaction.id,
            startTime: interaction.startTime,
            endTime: interaction.endTime,
            value: interaction.value,
            isPause: interaction.isPause,
            title: interaction.title,
            icon: faImage
        })
    }

    function handleAddNewButton(interaction: ICurrentInteraction) {
        handleAddButton({
            id: interaction.id,
            startTime: interaction.startTime,
            endTime: interaction.endTime,
            isPause: interaction.isPause,
            value: interaction.value,
            title: interaction.title,
            icon: faHandPointUp
        })
    }

    function handleAddNewHotspot(interaction: ICurrentInteraction) {
        handleAddHotspot({
            id: interaction.id,
            startTime: interaction.startTime,
            endTime: interaction.endTime,
            isPause: interaction.isPause,
            value: interaction.value,
            title: interaction.title,
            icon: faSun
        })
    }

    function handleAddNewText(interaction: ICurrentInteraction) {
        handleAddText({
            id: interaction.id,
            startTime: interaction.startTime,
            endTime: interaction.endTime,
            isPause: interaction.isPause,
            value: interaction.value,
            title: interaction.title,
            icon: faFont
        })
    }

    function handleAddNewImage(interaction: ICurrentInteraction) {
        handleAddImage({
            id: interaction.id,
            startTime: interaction.startTime,
            endTime: interaction.endTime,
            isPause: interaction.isPause,
            value: interaction.value,
            title: interaction.title,
            icon: faImage
        })
    }

    function handleInteractionChangeValue(event: React.ChangeEvent<HTMLInputElement>) {
        setCurrentInteraction((prev) => {
            if (!prev) return null

            return {
                ...prev,
                title: event.target.value,
            }
        })
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
            endTime: timeStamp.end,
            total: timeStamp.end
        })
        setHotspotTimestamp({
            startTime: timeStamp.start,
            endTime: timeStamp.end,
            total: timeStamp.end
        })
        setTextTimestamp({
            startTime: timeStamp.start,
            endTime: timeStamp.end,
            total: timeStamp.end
        })
        setImageTimestamp({
            startTime: timeStamp.start,
            endTime: timeStamp.end,
            total: timeStamp.end
        })
    }

    function handleTimestampForward(timeline: 'start' | 'end') {
        if (!currentInteraction?.value) return

        if (currentInteraction?.value === 'button') {
            setButtonTimestamp((prev: TButtonTimestamp) => {
                if (!prev.startTime || !prev.endTime) {
                    console.error('Start or End time is not defined')
                    return prev
                }

                if (timeline === 'start') {
                    const newStartTime = convertToSeconds(prev.startTime) + 1
                    if (newStartTime > convertToSeconds(prev.endTime)) {
                        console.warn('Start time cannot be greater than end time')
                        return prev
                    }
                    return {
                        ...prev,
                        startTime: convertToTimeString(newStartTime),
                    }
                } else {
                    const newEndTime = convertToSeconds(prev.endTime) + 1
                    const totalTime = convertToSeconds(prev.total!)

                    if (buttonTimestamp.total && newEndTime > totalTime) {
                        console.warn('End time cannot exceed total video duration')
                        return prev
                    }

                    return {
                        ...prev,
                        endTime: convertToTimeString(newEndTime),
                    }
                }
            })
        } else if (currentInteraction.value === 'hotspot') {
            setHotspotTimestamp((prev: TButtonTimestamp) => {
                if (!prev.startTime || !prev.endTime) {
                    console.error('Start or End time is not defined')
                    return prev
                }

                if (timeline === 'start') {
                    const newStartTime = convertToSeconds(prev.startTime) + 1
                    if (newStartTime > convertToSeconds(prev.endTime)) {
                        console.warn('Start time cannot be greater than end time')
                        return prev
                    }
                    return {
                        ...prev,
                        startTime: convertToTimeString(newStartTime),
                    }
                } else {
                    const newEndTime = convertToSeconds(prev.endTime) + 1
                    const totalTime = convertToSeconds(prev.total!)

                    if (hotspotTimestamp.total && newEndTime > totalTime) {
                        console.warn('End time cannot exceed total video duration')
                        return prev
                    }

                    return {
                        ...prev,
                        endTime: convertToTimeString(newEndTime),
                    }
                }
            })
        } else if (currentInteraction.value === 'text') {
            setTextTimestamp((prev: TButtonTimestamp) => {
                if (!prev.startTime || !prev.endTime) {
                    console.error('Start or End time is not defined')
                    return prev
                }

                if (timeline === 'start') {
                    const newStartTime = convertToSeconds(prev.startTime) + 1
                    if (newStartTime > convertToSeconds(prev.endTime)) {
                        console.warn('Start time cannot be greater than end time')
                        return prev
                    }
                    return {
                        ...prev,
                        startTime: convertToTimeString(newStartTime),
                    }
                } else {
                    const newEndTime = convertToSeconds(prev.endTime) + 1
                    const totalTime = convertToSeconds(prev.total!)

                    if (textTimestamp.total && newEndTime > totalTime) {
                        console.warn('End time cannot exceed total video duration')
                        return prev
                    }

                    return {
                        ...prev,
                        endTime: convertToTimeString(newEndTime),
                    }
                }
            })
        } else if (currentInteraction.value === 'image') {
            setImageTimestamp((prev: TButtonTimestamp) => {
                if (!prev.startTime || !prev.endTime) {
                    console.error('Start or End time is not defined')
                    return prev
                }

                if (timeline === 'start') {
                    const newStartTime = convertToSeconds(prev.startTime) + 1
                    if (newStartTime > convertToSeconds(prev.endTime)) {
                        console.warn('Start time cannot be greater than end time')
                        return prev
                    }
                    return {
                        ...prev,
                        startTime: convertToTimeString(newStartTime),
                    }
                } else {
                    const newEndTime = convertToSeconds(prev.endTime) + 1
                    const totalTime = convertToSeconds(prev.total!)

                    if (imageTimestamp.total && newEndTime > totalTime) {
                        console.warn('End time cannot exceed total video duration')
                        return prev
                    }

                    return {
                        ...prev,
                        endTime: convertToTimeString(newEndTime),
                    }
                }
            })
        }
    }


    function handleTimestampBack(timeline: 'start' | 'end') {
        if (!currentInteraction?.value) return

        if (currentInteraction?.value === 'button') {
            setButtonTimestamp((prev) => {
                if (!prev.startTime || !prev.endTime) {
                    console.error('Start or End time is not defined')
                    return prev
                }

                if (timeline === 'start') {
                    const newStartTime = convertToSeconds(prev.startTime) - 1
                    if (newStartTime < 0) {
                        console.warn('Start time cannot be less than 0 seconds')
                        return prev
                    }
                    return {
                        ...prev,
                        startTime: convertToTimeString(newStartTime),
                    }
                } else {
                    const newEndTime = convertToSeconds(prev.endTime) - 1
                    if (newEndTime < convertToSeconds(prev.startTime)) {
                        console.warn('End time cannot be less than start time')
                        return prev
                    }
                    return {
                        ...prev,
                        endTime: convertToTimeString(newEndTime),
                    }
                }
            })
        } else if (currentInteraction.value === 'hotspot') {
            setHotspotTimestamp((prev) => {
                if (!prev.startTime || !prev.endTime) {
                    console.error('Start or End time is not defined')
                    return prev
                }

                if (timeline === 'start') {
                    const newStartTime = convertToSeconds(prev.startTime) - 1
                    if (newStartTime < 0) {
                        console.warn('Start time cannot be less than 0 seconds')
                        return prev
                    }
                    return {
                        ...prev,
                        startTime: convertToTimeString(newStartTime),
                    }
                } else {
                    const newEndTime = convertToSeconds(prev.endTime) - 1
                    if (newEndTime < convertToSeconds(prev.startTime)) {
                        console.warn('End time cannot be less than start time')
                        return prev
                    }
                    return {
                        ...prev,
                        endTime: convertToTimeString(newEndTime),
                    }
                }
            })
        } else if (currentInteraction.value === 'text') {
            setTextTimestamp((prev) => {
                if (!prev.startTime || !prev.endTime) {
                    console.error('Start or End time is not defined')
                    return prev
                }

                if (timeline === 'start') {
                    const newStartTime = convertToSeconds(prev.startTime) - 1
                    if (newStartTime < 0) {
                        console.warn('Start time cannot be less than 0 seconds')
                        return prev
                    }
                    return {
                        ...prev,
                        startTime: convertToTimeString(newStartTime),
                    }
                } else {
                    const newEndTime = convertToSeconds(prev.endTime) - 1
                    if (newEndTime < convertToSeconds(prev.startTime)) {
                        console.warn('End time cannot be less than start time')
                        return prev
                    }
                    return {
                        ...prev,
                        endTime: convertToTimeString(newEndTime),
                    }
                }
            })
        } else if (currentInteraction.value === 'image') {
            setImageTimestamp((prev) => {
                if (!prev.startTime || !prev.endTime) {
                    console.error('Start or End time is not defined')
                    return prev
                }

                if (timeline === 'start') {
                    const newStartTime = convertToSeconds(prev.startTime) - 1
                    if (newStartTime < 0) {
                        console.warn('Start time cannot be less than 0 seconds')
                        return prev
                    }
                    return {
                        ...prev,
                        startTime: convertToTimeString(newStartTime),
                    }
                } else {
                    const newEndTime = convertToSeconds(prev.endTime) - 1
                    if (newEndTime < convertToSeconds(prev.startTime)) {
                        console.warn('End time cannot be less than start time')
                        return prev
                    }
                    return {
                        ...prev,
                        endTime: convertToTimeString(newEndTime),
                    }
                }
            })
        }
    }

    function convertToSeconds(time: string): number {
        const [minutes, seconds] = time.split(':').map(Number)
        return minutes * 60 + seconds
    }

    function convertToTimeString(seconds: number): string {
        const minutes = Math.floor(seconds / 60)
        const remainingSeconds = seconds % 60
        return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`
    }

    function handleSelectorClick() {
        setIsActionSelector((prev) => !prev)
    }

    function handleValidateLink(): boolean {
        const urlPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/.*)*$/

        if (urlPattern.test(linkToOpen)) {
            return true
        } else {
            console.error('Invalid link')
            return false
        }
    }

    const handleColorChange = (id: number, newColor: string | { r: number; g: number; b: number; a: number }) => {
        setStyleColorData((prevData) =>
            prevData.map((item) =>
                item.id === id ? { ...item, value: newColor } : item
            )
        )
    }

    const closePicker = () => {
        setActivePickerId(null)
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                activePickerId !== null &&
                !event.composedPath().some((el) => (el as HTMLElement)?.classList?.contains(styles.colorPickerContainer))
            ) {
                closePicker()
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [activePickerId])

    function handlePauseSelectorClick() {
        setPauseSelector((prev) => !prev)
    }

    function handleCurrentInteractionPauseSelect() {
        setCurrentInteraction((prev) => {
            if (!prev) return null

            return {
                ...prev,
                isPause: !prev?.isPause
            }
        })
    }

    function handleSaveButtonValidate(isAddAnother: boolean) {
        if (selectedAction.title === 'Open Link') {
            if (handleValidateLink()) {
                if (currentInteraction?.value === 'button') {
                    handleAddInteraction({
                        title: currentInteraction.title,
                        duration: String(buttonTimestamp.startTime),
                        icon: currentInteraction.icon,
                        id: Number(new Date()),
                        tooltip: `Button that shows at ${buttonTimestamp.startTime} and hides at ${buttonTimestamp.endTime}`,
                        type: 'Button',
                        types: [{ background: 'rgba(40, 40, 118, 0.1)', color: 'black', id: Number(new Date()), title: `Open link: ${linkToOpen}` }]
                    })
                } else if (currentInteraction?.value === 'hotspot') {
                    handleAddInteraction({
                        title: currentInteraction.title,
                        duration: String(hotspotTimestamp.startTime),
                        icon: currentInteraction.icon,
                        id: Number(new Date()),
                        tooltip: `Hotspot that shows at ${hotspotTimestamp.startTime} and hides at ${hotspotTimestamp.endTime}`,
                        type: 'Hotspot',
                        types: [{ background: 'rgba(40, 40, 118, 0.1)', color: 'black', id: Number(new Date()), title: `Open link: ${linkToOpen}` }]
                    })
                } else if (currentInteraction?.value === 'text') {
                    handleAddInteraction({
                        title: currentInteraction.title,
                        duration: String(textTimestamp.startTime),
                        icon: currentInteraction.icon,
                        id: Number(new Date()),
                        tooltip: `Hotspot that shows at ${textTimestamp.startTime} and hides at ${textTimestamp.endTime}`,
                        type: 'Text',
                        types: [{ background: 'rgba(40, 40, 118, 0.1)', color: 'black', id: Number(new Date()), title: `Open link: ${linkToOpen}` }]
                    })
                }

                handleDiscardChanges(isAddAnother)
            } else if (currentInteraction?.value === 'image') {
                handleAddInteraction({
                    title: currentInteraction.title,
                    duration: String(textTimestamp.startTime),
                    icon: currentInteraction.icon,
                    id: Number(new Date()),
                    tooltip: `Image that shows at ${textTimestamp.startTime} and hides at ${textTimestamp.endTime}`,
                    type: 'Image',
                    types: [{ background: 'rgba(40, 40, 118, 0.1)', color: 'black', id: Number(new Date()), title: `Open link: ${linkToOpen}` }]
                })

                handleDiscardChanges(isAddAnother)
            } else {
                alert('Please, fill link field')
            }
        } else {
            if (currentInteraction?.value === 'hotspot') {
                handleAddInteraction({
                    title: currentInteraction.title,
                    duration: String(hotspotTimestamp.startTime),
                    icon: currentInteraction.icon,
                    id: Number(new Date()),
                    tooltip: `Hotspot that shows at ${hotspotTimestamp.startTime} and hides at ${hotspotTimestamp.endTime}`,
                    type: 'Hotspot',
                    buttonProps: buttonProps,
                    styles: styleColorData
                })
                handleDiscardChanges(isAddAnother)
            } else if (currentInteraction?.value === 'text' && currentInteraction.title !== '') {
                handleAddInteraction({
                    title: currentInteraction.title,
                    duration: String(textTimestamp.startTime),
                    icon: currentInteraction.icon,
                    id: Number(new Date()),
                    tooltip: `Button that shows at ${textTimestamp.startTime} and hides at ${textTimestamp.endTime}`,
                    type: 'Text',
                    buttonProps: buttonProps,
                    styles: styleColorData
                })
                handleDiscardChanges(isAddAnother)
            } else if (currentInteraction?.title !== '' && currentInteraction?.value === 'button') {
                handleAddInteraction({
                    title: currentInteraction.title,
                    duration: String(buttonTimestamp.startTime),
                    icon: currentInteraction.icon,
                    id: Number(new Date()),
                    tooltip: `Button that shows at ${buttonTimestamp.startTime} and hides at ${buttonTimestamp.endTime}`,
                    type: 'Button',
                    buttonProps: buttonProps,
                    styles: styleColorData
                })
                handleDiscardChanges(isAddAnother)
            } else if (currentInteraction?.value === 'image' && selectedImage) {
                handleAddInteraction({
                    title: currentInteraction.title,
                    duration: String(imageTimestamp.startTime),
                    icon: currentInteraction.icon,
                    id: Number(new Date()),
                    tooltip: `Image that shows at ${imageTimestamp.startTime} and hides at ${imageTimestamp.endTime}`,
                    type: 'Image',
                    buttonProps: buttonProps,
                    styles: styleColorData
                })

                handleDiscardChanges(isAddAnother)
            } else {
                alert('Please, fill required fields')
            }

        }
    }

    function handleDiscardChanges(isAddAnother: boolean) {
        !isAddAnother ? setCurrentInteraction(null) : ''

        const colorData = currentInteraction?.value === 'button' ? [
            {
                id: 1,
                name: 'Text',
                value: '#fff',
                defaultValue: '#fff'
            },

            {
                id: 2,
                name: 'Background',
                value: 'rgb(92, 75, 192)',
                defaultValue: 'rgb(92, 75, 192)'
            },

            {
                id: 3,
                name: 'Border',
                value: '#fff',
                defaultValue: '#fff'
            }
        ] : [
            {
                id: 1,
                name: 'Background',
                value: 'rgb(27, 155, 243)',
                defaultValue: 'rgb(92, 75, 192)',
            }
        ]

        setButtonProps({
            left: '200',
            top: '200',
            width: '84',
            height: '48',
            bottom: '200'
        })
        setSelectedAction({ id: 3, title: 'None' })
        setLinkToOpen('')
        setStyleColorData(colorData)
        setCurrentInteraction((prev) => {
            if (!prev) return null

            return {
                ...prev,
                title: '',
                imgHref:''
            }
        })
        setSelectedImage(null)
    }

    function imageChangeHandler(event: React.ChangeEvent<HTMLInputElement>) {
        const files = event.target.files
        if (files && files.length > 0) {
            const file = files[0]

            const imageUrl = URL.createObjectURL(file)

            setSelectedImage(imageUrl)
            setCurrentInteraction((prev) => {
                if (!prev) return null

                return {
                    ...prev,
                    imgHref: imageUrl
                }
            })

            console.log('Файл успешно загружен:', file)
        } else {
            console.log('Файл не выбран')
        }
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
                                        <div className={`flex column align__center ${styles.asidePanelTitleContainer}`}>
                                            <span className={styles.asidePanelTitle}>{`Add ${currentInteraction.value}`}</span>
                                            <div className={`flex align__center ${styles.asidePanelPauseCheckboxContainer}`}>
                                                <input type='checkbox' id='pauseCheckbox' onClick={handleCurrentInteractionPauseSelect} />
                                                <label htmlFor='pauseCheckbox'>
                                                    Pause for {currentInteraction.value}
                                                </label>
                                            </div>

                                            {
                                                currentInteraction.isPause && (
                                                    <div className={`flex column ${styles.selectorContainer}`}>
                                                        <div className={`flex column align__center ${styles.currentInteractionSelectAction}`}>
                                                            <span className={styles.currentInteractionInputName}>
                                                                Pause Length
                                                            </span>

                                                            <div className={`flex align__center justify__space__between ${styles.actionRelative} ${styles.currentInteractionSelectActionSelecter}`} onClick={handlePauseSelectorClick}>
                                                                <span className={styles.currentInteractionSelecterTitle}>
                                                                    {selectedPause.name}
                                                                </span>

                                                                <button type='button' className={styles.currentInteractionSelecterButton}>
                                                                    <FontAwesomeIcon style={{ width: '16', height: '16' }} icon={faChevronDown} />
                                                                </button>
                                                            </div>
                                                        </div>


                                                        <div className={`flex column ${styles.selectorWrapper} ${isPauseSelector ? styles.active : ''}`}>
                                                            {
                                                                pauseData.length > 0 ? pauseData.map((action: TPauseData) => (
                                                                    <div className={styles.selector} key={action.id} onClick={() => action.actionHandler!(action)}>
                                                                        {
                                                                            action.name
                                                                        }
                                                                    </div>
                                                                ))
                                                                    : <h3>Не найдено</h3>
                                                            }
                                                        </div>
                                                    </div>
                                                )
                                            }


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

                                                <div className={`flex ${styles.timestampValueContainer}`}>
                                                    <TooltipButton position='bottom' tooltip='Back 1 seconds' buttonClassname={`${styles.timestampControlButton} ${styles.minusButton}`} tooltipClassname={styles.leftControlButtonTooltip} handleMouseClick={() => handleTimestampBack('start')}>
                                                        <FontAwesomeIcon icon={faMinus} style={{ width: '10px', height: '10px' }} />
                                                    </TooltipButton>

                                                    <span className={styles.currentInteractionHeadingCardValue}>
                                                        {
                                                            currentInteraction.value === 'button' ? buttonTimestamp.startTime : hotspotTimestamp.startTime
                                                        }
                                                    </span>

                                                    <TooltipButton position='bottom' tooltip='Forward 1 seconds' buttonClassname={`${styles.timestampControlButton} ${styles.plusButton}`} tooltipClassname={styles.rightControlButtonTooltip} handleMouseClick={() => handleTimestampForward('start')}>
                                                        <FontAwesomeIcon icon={faPlus} style={{ width: '10px', height: '10px' }} />
                                                    </TooltipButton>
                                                </div>

                                                <span className={styles.currentInteractionHeadingCardDescription}>
                                                    Set to start
                                                </span>
                                            </div>

                                            <div className={`flex align__center column ${styles.currentInteractionHeadingCard}`}>
                                                <span className={styles.currentInteractionHeadingCardTitle}>
                                                    Hide Time
                                                </span>

                                                <div className={`flex ${styles.timestampValueContainer}`}>
                                                    <TooltipButton position='bottom' tooltip='Back 1 seconds' buttonClassname={`${styles.timestampControlButton} ${styles.minusButton}`} tooltipClassname={styles.leftControlButtonTooltip} handleMouseClick={() => handleTimestampBack('end')}>
                                                        <FontAwesomeIcon icon={faMinus} style={{ width: '10px', height: '10px' }} />
                                                    </TooltipButton>

                                                    <span className={styles.currentInteractionHeadingCardValue}>
                                                        {
                                                            currentInteraction.value === 'button' ? buttonTimestamp.endTime : hotspotTimestamp.endTime
                                                        }
                                                    </span>

                                                    <TooltipButton position='bottom' tooltip='Forward 1 seconds' buttonClassname={`${styles.timestampControlButton} ${styles.plusButton}`} tooltipClassname={styles.rightControlButtonTooltip} handleMouseClick={() => handleTimestampForward('end')}>
                                                        <FontAwesomeIcon icon={faPlus} style={{ width: '10px', height: '10px' }} />
                                                    </TooltipButton>
                                                </div>

                                                <span className={styles.currentInteractionHeadingCardDescription}>
                                                    Set to end
                                                </span>
                                            </div>
                                        </div>

                                        {
                                            currentInteraction.value === 'image' && (
                                                <div className={styles.setImageInputContainer}>
                                                    <input type='file' id='imageFile' accept='image/jpeg, image/png, image/gif, image/webp' onChange={imageChangeHandler} />
                                                    <label htmlFor='imageFile'>
                                                        Choose Image
                                                    </label>
                                                </div>
                                            )
                                        }

                                        <div className={`flex column align__center ${styles.currentInteractionInputContainer}`}>
                                            {
                                                currentInteraction.value === 'button' && (
                                                    <>
                                                        <span className={styles.currentInteractionInputName}>
                                                            Button Label
                                                        </span>
                                                        <input value={currentInteraction.title} type='text' className={`${styles.currentInteractionInput} ${styles.main}`} placeholder='Enter Button Text' onChange={handleInteractionChangeValue} />
                                                    </>)
                                            }

                                            {
                                                currentInteraction.value === 'hotspot' && <input value={currentInteraction.title} type='text' className={`${styles.currentInteractionInput} ${styles.main}`} placeholder='Hotspot Label (Optional)' onChange={handleInteractionChangeValue} style={{ marginTop: '24px' }} />
                                            }

                                            {
                                                currentInteraction.value === 'text' && (
                                                    <>
                                                        <span className={styles.currentInteractionInputName}>
                                                            Text Label
                                                        </span>
                                                        <input value={currentInteraction.title} type='text' className={`${styles.currentInteractionInput} ${styles.main}`} placeholder='Enter Text' onChange={handleInteractionChangeValue} />
                                                    </>
                                                )
                                            }

                                            {
                                                currentInteraction.value === 'image' && (
                                                    <>
                                                        <span className={styles.currentInteractionInputName}>
                                                            Label
                                                        </span>
                                                        <input value={currentInteraction.title} type='text' className={`${styles.currentInteractionInput} ${styles.main}`} placeholder='Image Label (Optional)' onChange={handleInteractionChangeValue} />
                                                    </>
                                                )
                                            }
                                        </div>

                                        <div className={`flex column ${styles.selectorContainer}`}>
                                            <div className={`flex column align__center ${styles.currentInteractionSelectAction}`}>
                                                <span className={styles.currentInteractionInputName}>
                                                    Click Action
                                                </span>

                                                <div className={`flex align__center justify__space__between ${styles.actionRelative} ${styles.currentInteractionSelectActionSelecter}`} onClick={handleSelectorClick}>
                                                    <span className={styles.currentInteractionSelecterTitle}>
                                                        {selectedAction.title}
                                                    </span>

                                                    <button type='button' className={styles.currentInteractionSelecterButton}>
                                                        <FontAwesomeIcon style={{ width: '16', height: '16' }} icon={faChevronDown} />
                                                    </button>
                                                </div>
                                            </div>


                                            <div className={`flex column ${styles.selectorWrapper} ${isActionSelector ? styles.active : ''}`}>
                                                {
                                                    actionsData.length > 0 ? actionsData.map((action: TActionData) => (
                                                        <div className={styles.selector} key={action.id} onClick={() => action.actionHandler(action)}>
                                                            {
                                                                action.title
                                                            }
                                                        </div>
                                                    ))
                                                        : <h3>Не найдено</h3>
                                                }
                                            </div>
                                        </div>

                                        {
                                            selectedAction.title === 'Open Link' && (
                                                <div className={`flex column align__center ${styles.currentInteractionInputContainer}`}>
                                                    <span className={styles.currentInteractionInputName}>
                                                        URL to Open
                                                    </span>

                                                    <input type='text' className={`${styles.currentInteractionInput} ${styles.actionChild}`} placeholder='Enter Link' onChange={(e) => setLinkToOpen(e.target.value)} />
                                                </div>
                                            )
                                        }

                                        {
                                            currentInteraction.value !== 'image' && (
                                                <div className={`flex align__center ${styles.uiSettingsContainer}`}>
                                                    <TooltipButton position='top' tooltip='Update Colors'>
                                                        <div className={`flex align__center justify__center ${styles.uiSettingsButton} ${isStylingActive ? styles.active : ''}`} onClick={() => setStylingActive((prev) => !prev)}>
                                                            Styling
                                                        </div>
                                                    </TooltipButton>

                                                    {/* <TooltipButton position='top' tooltip='Conditional Logic, Variables, and more'>
                                                <div className={`flex align__center justify__center ${styles.uiSettingsButton}`}>
                                                    Settings
                                                </div>
                                            </TooltipButton> */}
                                                </div>
                                            )
                                        }

                                        {isStylingActive && (
                                            <div className={`flex column ${styles.styleSettingsContainer}`}>
                                                <div className={`flex align__center justify__space__evenly ${styles.styleColorContainer}`}>
                                                    {styleColorData.map((styleColor) => (
                                                        <div
                                                            key={styleColor.id}
                                                            className={`flex column align__center ${styles.styleColorCard}`}
                                                        >
                                                            <div
                                                                className={styles.styleColorPicker}
                                                                style={{
                                                                    backgroundColor:
                                                                        typeof styleColor.value === 'string'
                                                                            ? styleColor.value
                                                                            : `rgba(${styleColor.value.r}, ${styleColor.value.g}, ${styleColor.value.b}, ${styleColor.value.a})`,
                                                                }}
                                                                onClick={() => setActivePickerId(styleColor.id)}
                                                            />

                                                            <span className={styles.styleColorName}>
                                                                {styleColor.name}
                                                            </span>

                                                            {activePickerId === styleColor.id && (
                                                                <div className={styles.colorPickerContainer}>
                                                                    <ChromePicker
                                                                        color={
                                                                            typeof styleColor.value === 'string'
                                                                                ? styleColor.value
                                                                                : styleColor.value
                                                                        }
                                                                        onChangeComplete={(color) => {
                                                                            handleColorChange(styleColor.id, {
                                                                                r: color.rgb.r,
                                                                                g: color.rgb.g,
                                                                                b: color.rgb.b,
                                                                                a: color.rgb.a || 1,
                                                                            });
                                                                        }}
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div className={`flex column ${styles.buttonsContainer}`}>
                                            <button type='button' className={styles.saveButton} onClick={() => handleSaveButtonValidate(false)}>
                                                {`Save ${currentInteraction.value}`}
                                            </button>
                                            <button type='button' className={styles.saveAndAddAnotherButton} onClick={() => handleSaveButtonValidate(true)}>
                                                Save & Add Another
                                            </button>
                                            <button type='button' className={styles.discardChangesButton} onClick={() => handleDiscardChanges(false)}>
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
                                                            <span className={styles.interactionTitle}>

                                                                {
                                                                    interaction.type === 'Button'
                                                                        ? <div className={styles.interactionButtonPreview}
                                                                            style={{
                                                                                color:
                                                                                    typeof interaction.styles?.find((item) => item.name === 'Text')?.value === 'string'
                                                                                        ? (interaction.styles?.find((item) => item.name === 'Text')?.value as string)
                                                                                        : rgbaToString(interaction.styles?.find((item) => item.name === 'Text')?.value as { r: number; g: number; b: number; a: number }) || '#fff',
                                                                                backgroundColor:
                                                                                    typeof interaction.styles?.find((item) => item.name === 'Background')?.value === 'string'
                                                                                        ? (interaction.styles?.find((item) => item.name === 'Background')?.value as string)
                                                                                        : rgbaToString(interaction.styles?.find((item) => item.name === 'Background')?.value as { r: number; g: number; b: number; a: number }) || 'rgb(92, 75, 192)',
                                                                                borderColor:
                                                                                    typeof interaction.styles?.find((item) => item.name === 'Border')?.value === 'string'
                                                                                        ? (interaction.styles?.find((item) => item.name === 'Border')?.value as string)
                                                                                        : rgbaToString(interaction.styles?.find((item) => item.name === 'Border')?.value as { r: number; g: number; b: number; a: number }) || '#fff',
                                                                                width: interaction.buttonProps?.width!,
                                                                                height: interaction.buttonProps?.height!
                                                                            }}>
                                                                            {
                                                                                interaction.title
                                                                            }
                                                                        </div>
                                                                        : interaction.title}

                                                            </span>
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
                <EditorVideoOverlay videoUrl={videoUrl !== null ? videoUrl : ''} handleFullscreenToggle={handleFullscreenToggle} isFullscreen={isFullscreen} currentInteraction={currentInteraction!} setButtonProps={setButtonProps} buttonProps={buttonProps} handleSetTimestampButton={handleSetTimestampButton} buttonStyle={styleColorData} />
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