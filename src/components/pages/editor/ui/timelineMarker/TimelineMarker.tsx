import { IconDefinition } from '@fortawesome/free-solid-svg-icons'
import styles from './TimelineMarker.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface MarkerProps {
    leftPosition: number,
    type: string,
    icon:IconDefinition,
    isHovered:boolean
}

export const TimelineMarker: React.FC<MarkerProps> = ({ leftPosition, type, icon, isHovered }) => {
    return (
        <div
            className={`flex align__center justify__center ${styles.timelineMarker} ${isHovered ? styles.hovered : ''}`}
            style={{ left: `${leftPosition}%` }}
            title={type}>
                {isHovered && <FontAwesomeIcon icon={icon} color='white'/>}
            </div>
    )
}