import React, { useState } from 'react'
import styles from './TooltipButton.module.scss'
import ICurrentInterface from '../../../../interfaces/ICurrentInteraction'

type TTooltipButton = {
    position: 'top' | 'right' | 'bottom' | 'left',
    tooltip:string,
    children:React.ReactNode,
    buttonClassname?:string,
    wrapperClassname?:string,
    tooltipClassname?:string,
    handleMouseClick?:(props?:any) => void
}

const TooltipButton: React.FC<TTooltipButton> = ({ position, tooltip, children, buttonClassname, wrapperClassname, tooltipClassname, handleMouseClick }) => {

    const [isTooltipVisible, setTooltipVisible] = useState<boolean>(false)

    function handleMouseEnter() {
        setTooltipVisible(true)
    }

    function handleMouseLeave() {
        setTooltipVisible(false)
    }

    return (
        <div className={`flex ${styles.tooltipButtonContainer} ${styles[position]} ${wrapperClassname}`}>
            <div className={`flex align__center justify__center ${styles.tooltipButton} ${buttonClassname}`} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={handleMouseClick}>
                {children}
            </div>

            <div className={`flex align__center justify__center ${styles.tooltip} ${isTooltipVisible ? styles.visible : ''} ${tooltipClassname}`}>
                {tooltip}
            </div>
        </div>
    )
}

export default TooltipButton
