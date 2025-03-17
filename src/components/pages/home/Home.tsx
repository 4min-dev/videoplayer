import React, { useState } from 'react'
import styles from './Home.module.scss'

const Home: React.FC = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [isDragging, setIsDragging] = useState(false)
    const [videoTitle, setVideoTitle] = useState('')

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]

        if (file) {
            if (file.type.startsWith('video/')) {
                setSelectedFile(file)
                console.log(`Видео успешно загружено: ${file.name}`)
            } else {
                console.log('Пожалуйста, выберите видеофайл.')
            }
        }
    }

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = () => {
        setIsDragging(false)
    }

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault()
        setIsDragging(false)

        const file = event.dataTransfer.files?.[0]

        if (file) {
            if (file.type.startsWith('video/')) {
                setSelectedFile(file)
                console.log(`Видео успешно загружено: ${file.name}`)
            } else {
                console.log('Пожалуйста, перетащите видеофайл.')
            }
        }
    }

    function handleVideoTitle(event: React.ChangeEvent<HTMLInputElement>) {
        setVideoTitle(event.target.value)
    }

    return (
        <div className={`flex justify__center ${styles.homePageContainer}`}>
            <div className={`flex column align__center ${styles.uploadVideoPanel}`}>
                <span className={styles.uploadeVideoPanelTitle}>
                    {
                        !selectedFile ? 'New Video' : 'Add Title'
                    }
                </span>
                {
                    !selectedFile ? (
                        <div
                            className={`flex align__center justify__center ${styles.uploadVideoDropOverlay} ${isDragging ? styles.dragging : ''
                                }`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        >
                            <div className={`flex align__center justify__center ${styles.inside}`}>
                                <input
                                    type="file"
                                    accept="video/*"
                                    className={styles.uploadVideoInput}
                                    id="uploadVideoInput"
                                    onChange={handleFileChange}
                                    style={{ display: 'none' }}
                                />
                                <span className={styles.uploadVideoTitle}>
                                    Drop files here or&nbsp;
                                    <label htmlFor="uploadVideoInput" className={styles.uploadVideoLink}>
                                        browse files
                                    </label>
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div className={`flex align__center column ${styles.aboutVideoContent}`}>
                            <div className={`flex column align__center ${styles.namedInput}`}>
                                <span className={styles.inputName}>Video Title</span>
                                <input type='text' className={styles.input} onChange={handleVideoTitle} />
                            </div>
                            <button disabled={!videoTitle} type='button' className={styles.continueButton}>Continue</button>
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default Home