import React from 'react'
import styles from './PrimaryButton.module.scss'

type TPrimaryButton = {
    clickHandler: () => void,
    className?:string,
    buttonText:string,
    children: React.ReactNode
}

const PrimaryButton: React.FC<TPrimaryButton> = ({ clickHandler, className, buttonText, children }) => {
    return (
        <button type='button' className={`${styles.primaryButton} ${className}`} onClick={clickHandler}>
            {children}
            <span className={styles.buttonText}>{buttonText}</span>
        </button>
    )
}

export default PrimaryButton
