import React, { useState, useRef, useEffect } from 'react'
import styles from './VideoPlayer.module.scss'
import getImage from '../../../assets/getImage'
import ICurrentInteraction from '../../../interfaces/ICurrentInteraction'
import useDebounce from '../../../hooks/useDebounce'
import IStyleColor from '../../../interfaces/IStyleColor'
import rgbaToString from '../../../assets/rgbaToString'
import { ChromePicker } from 'react-color'
import isMobileDevice from '../../../assets/isMobileDevice'

type TVideoPlayer = {
    currentInteraction: ICurrentInteraction,
    videoUrl: string,
    playVideo: (videoRef: HTMLVideoElement) => void,
    pauseVideo: (videoRef: HTMLVideoElement) => void,
    videoRef: React.RefObject<HTMLVideoElement>,
    isVideoStarted: boolean,
    setVideoStarted: React.Dispatch<React.SetStateAction<boolean>>,
    setButtonProps: React.Dispatch<React.SetStateAction<{ left: string | null, top: string | null, width: string | null, height: string | null, bottom: string | null }>>,
    buttonProps: { left: string | null, top: string | null, width: string | null, height: string | null, bottom: string | null },
    buttonStyle: IStyleColor[],
    isDrawing: boolean,
    newComment: string,
    currentTimelineInteractions: ICurrentInteraction[],
    setIsVideoPaused: React.Dispatch<React.SetStateAction<boolean>>
}

const VideoPlayer: React.FC<TVideoPlayer> = ({
    currentInteraction,
    videoUrl,
    playVideo,
    pauseVideo,
    videoRef,
    isVideoStarted,
    setVideoStarted,
    setButtonProps,
    buttonProps,
    buttonStyle,
    isDrawing,
    newComment,
    currentTimelineInteractions,
    setIsVideoPaused
}) => {
    const [isLineVisibility, setIsLineVisibility] = useState<boolean>(false)
    const [remainingPauseTime, setRemainingPauseTime] = useState<number>(0)
    const [pauseDuration, setPauseDuration] = useState<number>(0)
    const [activePauseId, setActivePauseId] = useState<string | number | null>(null)
    const [lineWidthPercentage, setLineWidthPercentage] = useState(100)
    const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 })
    const [buttonSize, setButtonSize] = useState({ width: 88, height: 56 })
    const buttonRef = useRef<HTMLButtonElement>(null)
    const wrapperRef = useRef<HTMLDivElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const drawingContext = useRef<CanvasRenderingContext2D | null>(null)
    const isDrawingActive = useRef(false)
    const [drawingColor, setDrawingColor] = useState('rgb(0, 156, 224)')
    const [displayColorPicker, setDisplayColorPicker] = useState<boolean>(false)

    const initializeCanvas = () => {
        if (canvasRef.current) {
            const canvas = canvasRef.current
            const context = canvas.getContext('2d')
            if (context) {
                drawingContext.current = context
                context.lineCap = 'round'
                context.lineJoin = 'round'
                context.lineWidth = 5
                context.strokeStyle = drawingColor
            }
        }
    }

    useEffect(() => {
        initializeCanvas()
    }, [drawingColor])

    useEffect(() => {
        if (wrapperRef.current && canvasRef.current) {
            const wrapperRect = wrapperRef.current.getBoundingClientRect()
            canvasRef.current.width = wrapperRect.width
            canvasRef.current.height = wrapperRect.height
        }
    }, [])

    const getCoordinates = (
        e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
    ): { clientX: number, clientY: number } => {
        if ('touches' in e) {
            const touch = e.touches[0]
            return { clientX: touch.clientX, clientY: touch.clientY }
        } else {
            return { clientX: e.clientX, clientY: e.clientY }
        }
    }

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return

        const canvas = canvasRef.current
        if (!canvas || !drawingContext.current) return

        initializeCanvas()

        const rect = canvas.getBoundingClientRect()
        const { clientX, clientY } = getCoordinates(e)

        const x = clientX - rect.left
        const y = clientY - rect.top

        drawingContext.current.beginPath()
        drawingContext.current.moveTo(x, y)
        isDrawingActive.current = true
    }

    const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        if (!isDrawing || !isDrawingActive.current) return

        const canvas = canvasRef.current
        if (!canvas || !drawingContext.current) return

        const rect = canvas.getBoundingClientRect()
        const { clientX, clientY } = getCoordinates(e)

        const x = clientX - rect.left
        const y = clientY - rect.top

        drawingContext.current.lineTo(x, y)
        drawingContext.current.stroke()
    }

    const stopDrawing = () => {
        if (!isDrawing) return

        if (drawingContext.current) {
            drawingContext.current.closePath()
        }
        isDrawingActive.current = false
    }

    const constrainCoordinates = (x: number, y: number): { x: number, y: number } => {
        if (!wrapperRef.current || !buttonRef.current) return { x, y }

        const wrapperRect = wrapperRef.current.getBoundingClientRect()
        const buttonRect = buttonRef.current.getBoundingClientRect()

        const minX = wrapperRect.left
        const maxX = wrapperRect.right - buttonRect.width
        const minY = wrapperRect.top
        const maxY = wrapperRect.bottom - buttonRect.height

        const constrainedX = Math.min(Math.max(x, minX), maxX)
        const constrainedY = Math.min(Math.max(y, minY), maxY)

        return {
            x: constrainedX - wrapperRect.left,
            y: constrainedY - wrapperRect.top,
        }
    }

    const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault()
        if (isMobileDevice()) {
            document.body.style.overflowY = 'hidden'
        }

        const initialX = 'touches' in e ? e.touches[0].clientX : e.clientX
        const initialY = 'touches' in e ? e.touches[0].clientY : e.clientY

        const buttonRect = buttonRef.current?.getBoundingClientRect()
        if (!buttonRect) return

        const offsetX = initialX - buttonRect.left
        const offsetY = initialY - buttonRect.top

        const moveHandler = (moveEvent: MouseEvent | TouchEvent) => {
            const clientX = 'touches' in moveEvent ? moveEvent.touches[0].clientX : moveEvent.clientX
            const clientY = 'touches' in moveEvent ? moveEvent.touches[0].clientY : moveEvent.clientY

            const newX = clientX - offsetX
            const newY = clientY - offsetY

            const constrained = constrainCoordinates(newX, newY)
            setButtonPosition(constrained)
        }

        const stopHandler = () => {
            window.removeEventListener('mousemove', moveHandler as any)
            window.removeEventListener('touchmove', moveHandler as any)
            window.removeEventListener('mouseup', stopHandler)
            window.removeEventListener('touchend', stopHandler)
            if (isMobileDevice()) {
                document.body.style.overflowY = 'auto'
            }
        }

        window.addEventListener('mousemove', moveHandler as any)
        window.addEventListener('touchmove', moveHandler as any)
        window.addEventListener('mouseup', stopHandler)
        window.addEventListener('touchend', stopHandler)
    }

    const test = useDebounce({
        callback: () => {
            if (buttonProps.left && buttonProps.top && buttonProps.width && buttonProps.height) {
                const newLeft = parseInt(buttonProps.left, 10)
                const newTop = parseInt(buttonProps.top, 10)
                const newWidth = parseInt(buttonProps.width, 10)
                const newHeight = parseInt(buttonProps.height, 10)

                setButtonPosition({ x: newLeft, y: newTop })
                setButtonSize({ width: newWidth, height: newHeight })
            }
        },
        delay: 200
    })

    useEffect(() => {
        test()
    }, [buttonProps])

    const handleResizeStart = (
        e: React.MouseEvent | React.TouchEvent,
        resizeType: 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
    ) => {
        e.preventDefault()

        const initialButtonRect = buttonRef.current?.getBoundingClientRect()
        if (!initialButtonRect || !buttonRef.current || !wrapperRef.current) return

        const initialX = 'touches' in e ? e.touches[0].clientX : e.clientX
        const initialY = 'touches' in e ? e.touches[0].clientY : e.clientY

        const resizeHandler = (resizeEvent: MouseEvent | TouchEvent) => {
            const clientX = 'touches' in resizeEvent ? resizeEvent.touches[0].clientX : resizeEvent.clientX
            const clientY = 'touches' in resizeEvent ? resizeEvent.touches[0].clientY : resizeEvent.clientY

            let newWidth = buttonSize.width
            let newHeight = buttonSize.height
            let newX = buttonPosition.x
            let newY = buttonPosition.y

            switch (resizeType) {
                case 'top':
                    newHeight = buttonSize.height + (initialY - clientY)
                    newY = buttonPosition.y + (clientY - initialY)
                    break
                case 'bottom':
                    newHeight = buttonSize.height + (clientY - initialY)
                    break
                case 'left':
                    newWidth = buttonSize.width + (initialX - clientX)
                    newX = buttonPosition.x + (clientX - initialX)
                    break
                case 'right':
                    newWidth = buttonSize.width + (clientX - initialX)
                    break
                case 'top-left':
                    newWidth = buttonSize.width + (initialX - clientX)
                    newHeight = buttonSize.height + (initialY - clientY)
                    newX = buttonPosition.x + (clientX - initialX)
                    newY = buttonPosition.y + (clientY - initialY)
                    break
                case 'top-right':
                    newWidth = buttonSize.width + (clientX - initialX)
                    newHeight = buttonSize.height + (initialY - clientY)
                    newY = buttonPosition.y + (clientY - initialY)
                    break
                case 'bottom-left':
                    newWidth = buttonSize.width + (initialX - clientX)
                    newHeight = buttonSize.height + (clientY - initialY)
                    newX = buttonPosition.x + (clientX - initialX)
                    break
                case 'bottom-right':
                    newWidth = buttonSize.width + (clientX - initialX)
                    newHeight = buttonSize.height + (clientY - initialY)
                    break
            }

            const minWidth = 44
            const minHeight = 28

            newWidth = Math.max(newWidth, minWidth)
            newHeight = Math.max(newHeight, minHeight)

            setButtonSize({ width: newWidth, height: newHeight })
            setButtonPosition({ x: newX, y: newY })
        }

        const stopHandler = () => {
            window.removeEventListener('mousemove', resizeHandler as any)
            window.removeEventListener('touchmove', resizeHandler as any)
            window.removeEventListener('mouseup', stopHandler)
            window.removeEventListener('touchend', stopHandler)
        }

        window.addEventListener('mousemove', resizeHandler as any)
        window.addEventListener('touchmove', resizeHandler as any)
        window.addEventListener('mouseup', stopHandler)
        window.addEventListener('touchend', stopHandler)
    }

    useEffect(() => {
        setButtonPosition({ x: parseInt(buttonProps.width!), y: parseInt(buttonProps.height!) })
        setButtonSize({ width: parseInt(buttonProps.width!), height: parseInt(buttonProps.height!) })
    }, [])

    useEffect(() => {
        if (wrapperRef.current && buttonRef.current) {
            const wrapperRect = wrapperRef.current.getBoundingClientRect()
            const initialX = wrapperRect.width / 2 - buttonSize.width / 2
            const initialY = wrapperRect.height / 2 - buttonSize.height / 2
            const bottom = wrapperRect.height - (buttonPosition.y + buttonSize.height)

            setButtonPosition({ x: initialX, y: initialY })

            setButtonProps({
                left: `${initialX}px`,
                top: `${initialY}px`,
                width: `${buttonSize.width}px`,
                height: `${buttonSize.height}px`,
                bottom: `${bottom}px`
            })
        }
    }, [])

    useEffect(() => {
        const wrapperRect = wrapperRef.current!.getBoundingClientRect()
        const bottom = wrapperRect.height - (buttonPosition.y + buttonSize.height)

        setButtonProps({
            left: `${buttonPosition.x}px`,
            top: `${buttonPosition.y}px`,
            width: `${buttonSize.width}px`,
            height: `${buttonSize.height}px`,
            bottom: `${bottom}px`
        })
    }, [buttonPosition, buttonSize])

    const handlePlayClick = () => {

        if (currentInteraction || (remainingPauseTime / pauseDuration) * 100 > 0) return

        if (!isVideoStarted) {
            setVideoStarted(true)
            if (videoRef.current) {
                videoRef.current.currentTime = 0
                videoRef.current.muted = false
                playVideo(videoRef.current)
            }
        } else {
            if (videoRef.current) {
                videoRef.current.paused ? playVideo(videoRef.current) : pauseVideo(videoRef.current)
            }
        }
    }

    const handleTimeUpdate = () => {
        if (!videoRef.current) {
            return
        }

        if (!isVideoStarted) {
            if (videoRef.current.currentTime >= 10) {
                videoRef.current.currentTime = 0
            }
        }
    }

    useEffect(() => {
        if (!videoRef.current) {
            return
        }

        videoRef.current.muted = true

        if (!currentInteraction && isDrawing && !isVideoStarted) {
            setVideoStarted(true)
            videoRef.current.muted = false
            playVideo(videoRef.current)
        }


        if (!currentInteraction) {
            if (isVideoStarted) {
                videoRef.current.muted = false
            }

            videoRef.current.play()
        } else {
            videoRef.current.pause()
        }
    }, [currentInteraction, isDrawing])

    const handleColorChange = (color: any) => {
        setDrawingColor(color.hex)
        if (drawingContext.current) {
            drawingContext.current.strokeStyle = color.hex
        }
    }

    const timeToSeconds = (time: string) => {
        const [minutes, seconds] = time.split(":").map(Number)
        return minutes * 60 + seconds
    }

    useEffect(() => {
        if (currentTimelineInteractions.length > 0) {
            const currentTime = videoRef.current?.currentTime || 0

            currentTimelineInteractions.forEach((interaction) => {
                const startTimeInSeconds = timeToSeconds(interaction.startTime)
                const pauseDurationInSeconds = parseInt(interaction.pauseDuration!, 10)

                if (
                    interaction.isPause &&
                    interaction.pauseDuration &&
                    interaction.startTime &&
                    currentTime >= startTimeInSeconds &&
                    currentTime < startTimeInSeconds + pauseDurationInSeconds
                ) {

                    if (activePauseId === interaction.id && currentTimelineInteractions.length > 1) return

                    setActivePauseId(interaction.id)
                    setPauseDuration(pauseDurationInSeconds)
                    setRemainingPauseTime(pauseDurationInSeconds - (currentTime - startTimeInSeconds))
                }
            })
        }
    }, [currentTimelineInteractions])


    useEffect(() => {
        if (pauseDuration > 0 && remainingPauseTime > 0) {
            const intervalId = setInterval(() => {
                setRemainingPauseTime((prev) => {
                    if (prev <= 0) {
                        clearInterval(intervalId)
                        setActivePauseId(null)
                        return 0
                    }
                    return prev - 1
                })
            }, 1000)

            return () => clearInterval(intervalId)
        }
    }, [pauseDuration, remainingPauseTime])

    useEffect(() => {
        if (pauseDuration >= 0) {
            const percentage = pauseDuration === 0 ? 0 : (remainingPauseTime / pauseDuration) * 100
            setLineWidthPercentage(percentage)

            if (percentage > 0) {
                setIsLineVisibility(true)
                pauseVideo(videoRef.current!)
                setIsVideoPaused(true)
            } else {
                setIsLineVisibility(false)
                playVideo(videoRef.current!)
                setIsVideoPaused(false)

                setPauseDuration(0)
                setRemainingPauseTime(0)
            }
        }
    }, [remainingPauseTime, pauseDuration])

    return (
        <div className={`flex align__center justify__center ${styles.videoPlayer}`}>

            {isLineVisibility && (
                <div className={styles.pauseDurationLineWrapper}>
                    <div
                        className={styles.pauseDurationLine}
                        style={{
                            width: "100%",
                            clipPath: `inset(0 ${50 - lineWidthPercentage / 2}% 0 ${50 - lineWidthPercentage / 2}%)`,
                        }}
                    ></div>
                </div>
            )}

            <div className={styles.videoWrapper} ref={wrapperRef}>
                {
                    newComment !== '' && (
                        <span className={styles.newComment}>
                            {newComment}
                        </span>
                    )
                }
                <canvas
                    ref={canvasRef}
                    className={styles.drawingCanvas}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        pointerEvents: isDrawing ? 'auto' : 'none',
                    }}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                />
                {
                    isDrawing && (
                        <div className={`flex align__center justify__center ${styles.drawingColorPicker}`}>
                            <span className={styles.drawingColorPickerTitle}>Color</span>
                            <div
                                style={{
                                    width: '36px',
                                    height: '14px',
                                    background: drawingColor,
                                    marginLeft: '10px',
                                    cursor: 'pointer',
                                    zIndex: '50',
                                    border: '1px solid #ccc',
                                    borderRadius: '2px',
                                }}
                                onClick={() => setDisplayColorPicker(!displayColorPicker)}
                            />
                            {displayColorPicker && (
                                <div style={{
                                    position: 'absolute',
                                    top: '40px',
                                    left: '0',
                                    zIndex: '2',
                                }}>
                                    <div
                                        style={{
                                            position: 'fixed',
                                            top: '0',
                                            right: '0',
                                            bottom: '0',
                                            left: '0',
                                        }}
                                        onClick={() => setDisplayColorPicker(false)}
                                    />
                                    <ChromePicker
                                        color={drawingColor}
                                        onChange={handleColorChange}
                                    />
                                </div>
                            )}
                        </div>
                    )
                }
                {currentInteraction ? (
                    <div className={styles.draggableButtonContainer} style={{
                        position: 'absolute',
                        left: `${buttonPosition.x}px`,
                        top: `${buttonPosition.y}px`,
                        width: `${buttonSize.width}px`,
                        height: `${buttonSize.height}px`
                    }}>
                        {
                            currentInteraction.value === 'button' && (
                                <button
                                    ref={buttonRef}
                                    type="button"
                                    className={styles.draggableButton}
                                    onMouseDown={handleDragStart}
                                    onTouchStart={handleDragStart}
                                    style={{
                                        color:
                                            typeof buttonStyle.find((item) => item.name === 'Text')?.value === 'string'
                                                ? (buttonStyle.find((item) => item.name === 'Text')?.value as string)
                                                : rgbaToString(buttonStyle.find((item) => item.name === 'Text')?.value as { r: number, g: number, b: number, a: number }) || '#fff',
                                        backgroundColor:
                                            typeof buttonStyle.find((item) => item.name === 'Background')?.value === 'string'
                                                ? (buttonStyle.find((item) => item.name === 'Background')?.value as string)
                                                : rgbaToString(buttonStyle.find((item) => item.name === 'Background')?.value as { r: number, g: number, b: number, a: number }) || 'rgb(92, 75, 192)',
                                        borderColor:
                                            typeof buttonStyle.find((item) => item.name === 'Border')?.value === 'string'
                                                ? (buttonStyle.find((item) => item.name === 'Border')?.value as string)
                                                : rgbaToString(buttonStyle.find((item) => item.name === 'Border')?.value as { r: number, g: number, b: number, a: number }) || '#fff'
                                    }}>
                                    {currentInteraction.title}
                                </button>
                            )
                        }

                        {
                            currentInteraction.value === 'hotspot' && (
                                <button
                                    ref={buttonRef}
                                    type="button"
                                    className={styles.draggableHotspot}
                                    onMouseDown={handleDragStart}
                                    onTouchStart={handleDragStart}
                                    style={{
                                        backgroundColor:
                                            typeof buttonStyle.find((item) => item.name === 'Background')?.value === 'string'
                                                ? (buttonStyle.find((item) => item.name === 'Background')?.value as string)
                                                : rgbaToString(buttonStyle.find((item) => item.name === 'Background')?.value as { r: number, g: number, b: number, a: number }) || 'rgb(92, 75, 192)',
                                    }}>
                                    {currentInteraction.title}
                                </button>
                            )
                        }

                        {
                            currentInteraction.value === 'text' && (
                                <button
                                    ref={buttonRef}
                                    type="button"
                                    className={`flex align__center justify__center text__center ${styles.draggableText}`}
                                    onMouseDown={handleDragStart}
                                    onTouchStart={handleDragStart}
                                    style={{
                                        color:
                                            typeof buttonStyle.find((item) => item.name === 'Text')?.value === 'string'
                                                ? (buttonStyle.find((item) => item.name === 'Text')?.value as string)
                                                : rgbaToString(buttonStyle.find((item) => item.name === 'Text')?.value as { r: number, g: number, b: number, a: number }) || '#fff',
                                        backgroundColor:
                                            typeof buttonStyle.find((item) => item.name === 'Background')?.value === 'string'
                                                ? (buttonStyle.find((item) => item.name === 'Background')?.value as string)
                                                : rgbaToString(buttonStyle.find((item) => item.name === 'Background')?.value as { r: number, g: number, b: number, a: number }) || 'rgb(92, 75, 192)',
                                    }}>
                                    {
                                        currentInteraction.title
                                    }
                                </button>
                            )
                        }

                        {
                            currentInteraction.value === 'image' && (
                                <button
                                    ref={buttonRef}
                                    type="button"
                                    className={`flex align__center justify__center text__center ${styles.draggableImage}`}
                                    onMouseDown={handleDragStart}
                                    onTouchStart={handleDragStart}>
                                    {currentInteraction.imgHref && (
                                        <img src={currentInteraction.imgHref} alt={`${currentInteraction.id}_img`} />
                                    )}
                                </button>
                            )
                        }

                        <div
                            className={`${styles.resizePoint} ${styles.resizeHandleTop}`}
                            onMouseDown={(e) => handleResizeStart(e, 'top')}
                            onTouchStart={(e) => handleResizeStart(e, 'top')}
                        ></div>
                        <div
                            className={`${styles.resizePoint} ${styles.resizeHandleBottom}`}
                            onMouseDown={(e) => handleResizeStart(e, 'bottom')}
                            onTouchStart={(e) => handleResizeStart(e, 'bottom')}
                        ></div>
                        <div
                            className={`${styles.resizePoint} ${styles.resizeHandleLeft}`}
                            onMouseDown={(e) => handleResizeStart(e, 'left')}
                            onTouchStart={(e) => handleResizeStart(e, 'left')}
                        ></div>
                        <div
                            className={`${styles.resizePoint} ${styles.resizeHandleRight}`}
                            onMouseDown={(e) => handleResizeStart(e, 'right')}
                            onTouchStart={(e) => handleResizeStart(e, 'right')}
                        ></div>
                        <div
                            className={`${styles.resizePoint} ${styles.resizeHandleTopLeft}`}
                            onMouseDown={(e) => handleResizeStart(e, 'top-left')}
                            onTouchStart={(e) => handleResizeStart(e, 'top-left')}
                        ></div>
                        <div
                            className={`${styles.resizePoint} ${styles.resizeHandleTopRight}`}
                            onMouseDown={(e) => handleResizeStart(e, 'top-right')}
                            onTouchStart={(e) => handleResizeStart(e, 'top-right')}
                        ></div>
                        <div
                            className={`${styles.resizePoint} ${styles.resizeHandleBottomLeft}`}
                            onMouseDown={(e) => handleResizeStart(e, 'bottom-left')}
                            onTouchStart={(e) => handleResizeStart(e, 'bottom-left')}
                        ></div>
                        <div
                            className={`${styles.resizePoint} ${styles.resizeHandleBottomRight}`}
                            onMouseDown={(e) => handleResizeStart(e, 'bottom-right')}
                            onTouchStart={(e) => handleResizeStart(e, 'bottom-right')}
                        ></div>
                    </div>
                ) : (
                    <>
                        {
                            (currentTimelineInteractions.length > 0) &&
                            currentTimelineInteractions.map((currentTimelineInteraction) =>
                                <>
                                    {
                                        currentTimelineInteraction && currentTimelineInteraction.value === 'comment' && (

                                            <span className={styles.newComment}>
                                                {currentTimelineInteraction.title}
                                            </span>
                                        )
                                            
                                    }

                                    {currentTimelineInteraction && currentTimelineInteraction.value === 'button' && (
                                        <button
                                            ref={buttonRef}
                                            type="button"
                                            className={styles.draggableButton}
                                            onClick={() => {
                                                if (currentTimelineInteraction.pauseDuration === '999999999999') {
                                                    setPauseDuration(0)
                                                }

                                                if (currentTimelineInteraction.clickHandler) {
                                                    currentTimelineInteraction.clickHandler()
                                                }
                                            }}
                                            style={{
                                                left: `${currentTimelineInteraction.buttonProps.left}`,
                                                top: `${currentTimelineInteraction.buttonProps.top}`,
                                                width: `${currentTimelineInteraction.buttonProps.width}`,
                                                height: `${currentTimelineInteraction.buttonProps.height}`,
                                                color:
                                                    typeof currentTimelineInteraction.styles.find((item) => item.name === 'Text')?.value === 'string'
                                                        ? (currentTimelineInteraction.styles.find((item) => item.name === 'Text')?.value as string)
                                                        : rgbaToString(currentTimelineInteraction.styles.find((item) => item.name === 'Text')?.value as { r: number, g: number, b: number, a: number }) || '#fff',
                                                backgroundColor:
                                                    typeof currentTimelineInteraction.styles.find((item) => item.name === 'Background')?.value === 'string'
                                                        ? (currentTimelineInteraction.styles.find((item) => item.name === 'Background')?.value as string)
                                                        : rgbaToString(currentTimelineInteraction.styles.find((item) => item.name === 'Background')?.value as { r: number, g: number, b: number, a: number }) || 'rgb(92, 75, 192)',
                                                borderColor:
                                                    typeof currentTimelineInteraction.styles.find((item) => item.name === 'Border')?.value === 'string'
                                                        ? (currentTimelineInteraction.styles.find((item) => item.name === 'Border')?.value as string)
                                                        : rgbaToString(currentTimelineInteraction.styles.find((item) => item.name === 'Border')?.value as { r: number, g: number, b: number, a: number }) || '#fff'
                                            }}>
                                            {currentTimelineInteraction.title}
                                        </button>
                                    )
                                    }


                                    {
                                        currentTimelineInteraction && currentTimelineInteraction.value === 'hotspot' && (
                                            <button
                                                ref={buttonRef}
                                                type="button"
                                                className={styles.draggableHotspot}
                                                onClick={() => {
                                                    if (currentTimelineInteraction.pauseDuration === '999999999999') {
                                                        setPauseDuration(0)
                                                    }

                                                    if (currentTimelineInteraction.clickHandler) {
                                                        currentTimelineInteraction.clickHandler()
                                                    }
                                                }}

                                                style={{
                                                    left: `${currentTimelineInteraction.buttonProps.left}`,
                                                    top: `${currentTimelineInteraction.buttonProps.top}`,
                                                    width: `${currentTimelineInteraction.buttonProps.width}`,
                                                    height: `${currentTimelineInteraction.buttonProps.height}`,
                                                    backgroundColor:
                                                        typeof currentTimelineInteraction.styles.find((item) => item.name === 'Background')?.value === 'string'
                                                            ? (currentTimelineInteraction.styles.find((item) => item.name === 'Background')?.value as string)
                                                            : rgbaToString(currentTimelineInteraction.styles.find((item) => item.name === 'Background')?.value as { r: number, g: number, b: number, a: number }) || 'rgb(92, 75, 192)',
                                                }}>
                                                {currentTimelineInteraction.title}
                                            </button>
                                        )
                                    }

                                    {
                                        currentTimelineInteraction && currentTimelineInteraction.value === 'text' && (
                                            <button
                                                ref={buttonRef}
                                                type="button"
                                                className={`flex align__center justify__center text__center ${styles.draggableText}`}

                                                style={{
                                                    left: `${currentTimelineInteraction.buttonProps.left}`,
                                                    top: `${currentTimelineInteraction.buttonProps.top}`,
                                                    width: `${currentTimelineInteraction.buttonProps.width}`,
                                                    height: `${currentTimelineInteraction.buttonProps.height}`,
                                                    color:
                                                        typeof currentTimelineInteraction.styles.find((item) => item.name === 'Text')?.value === 'string'
                                                            ? (currentTimelineInteraction.styles.find((item) => item.name === 'Text')?.value as string)
                                                            : rgbaToString(currentTimelineInteraction.styles.find((item) => item.name === 'Text')?.value as { r: number, g: number, b: number, a: number }) || '#fff',
                                                    backgroundColor:
                                                        typeof currentTimelineInteraction.styles.find((item) => item.name === 'Background')?.value === 'string'
                                                            ? (currentTimelineInteraction.styles.find((item) => item.name === 'Background')?.value as string)
                                                            : rgbaToString(currentTimelineInteraction.styles.find((item) => item.name === 'Background')?.value as { r: number, g: number, b: number, a: number }) || 'rgb(92, 75, 192)',
                                                }}>
                                                {
                                                    currentTimelineInteraction.title
                                                }
                                            </button>
                                        )
                                    }

                                    {
                                        currentTimelineInteraction && currentTimelineInteraction.value === 'image' && (
                                            <button
                                                ref={buttonRef}
                                                type="button"
                                                className={`flex align__center justify__center text__center ${styles.draggableImage}`}
                                                style={{
                                                    left: `${currentTimelineInteraction.buttonProps.left}`,
                                                    top: `${currentTimelineInteraction.buttonProps.top}`,
                                                    width: `${currentTimelineInteraction.buttonProps.width}`,
                                                    height: `${currentTimelineInteraction.buttonProps.height}`,
                                                }}
                                                onClick={() => {
                                                    if (currentTimelineInteraction.pauseDuration === '999999999999') {
                                                        setPauseDuration(0)
                                                    }

                                                    if (currentTimelineInteraction.clickHandler) {
                                                        currentTimelineInteraction.clickHandler()
                                                    }
                                                }}>
                                                {currentTimelineInteraction.imgHref && (
                                                    <img src={currentTimelineInteraction.imgHref} alt={`${currentTimelineInteraction.id}_img`} />
                                                )}
                                            </button>
                                        )

                                    }
                                </>)
                        }

                        {
                            (!isVideoStarted &&
                                !currentInteraction && !isDrawing) && (
                                <button
                                    type="button"
                                    className={`flex align__center justify__center ${styles.playButton}`}
                                    onClick={handlePlayClick}
                                >
                                    <img src={getImage('play-filled.png')} alt="Play" />
                                </button>
                            )
                        }
                    </>
                )}

                <video
                    ref={videoRef}
                    src={videoUrl}
                    autoPlay
                    muted
                    onEnded={() => playVideo(videoRef.current!)}
                    onTimeUpdate={handleTimeUpdate}
                    onClick={handlePlayClick}
                />
            </div>
        </div >
    )
}

export default VideoPlayer