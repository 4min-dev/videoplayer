import React, { useState } from 'react'
import styles from './Home.module.scss'

const Home: React.FC = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [isDragging, setIsDragging] = useState(false)

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]

        if (file) {
            if (file.type.startsWith('video/')) {
                setSelectedFile(file)
                alert(`Видео успешно загружено: ${file.name}`)
            } else {
                alert('Пожалуйста, выберите видеофайл.')
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
                alert(`Видео успешно загружено: ${file.name}`)
            } else {
                alert('Пожалуйста, перетащите видеофайл.')
            }
        }
    }

    return (
        <div className={`flex justify__center ${styles.homePageContainer}`}>
            <div className={`flex column align__center ${styles.uploadVideoPanel}`}>
                <span className={styles.uploadeVideoPanelTitle}>New Video</span>
                <div
                    className={`flex align__center justify__center ${styles.uploadVideoDropOverlay} ${isDragging ? styles.dragging : ''
                        }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <input
                        type="file"
                        accept="video/*"
                        className={styles.uploadVideoInput}
                        id="uploadVideoInput"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                    />
                    <span className={styles.uploadVideoTitle}>
                        Drop files here or&nbsp
                        <label htmlFor="uploadVideoInput" className={styles.uploadVideoLink}>
                            browse files
                        </label>
                    </span>
                </div>
            </div>
        </div>
    )
}

export default Home