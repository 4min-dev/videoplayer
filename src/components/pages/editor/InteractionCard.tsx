import React, { useState } from 'react'
import styles from './Editor.module.scss'
import IInteraction from '../../../interfaces/IInteraction'
import TooltipButton from '../../ui/buttons/tooltipButton/TooltipButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import rgbaToString from '../../../assets/rgbaToString'
import { IconDefinition, faEllipsisVertical, faTrash } from '@fortawesome/free-solid-svg-icons'

type TInteractionCard = {
    interaction: IInteraction,
    handleDeleteInteraction:(id:number) => void
}

type TControlData = {
    id: number,
    icon: IconDefinition,
    title: string,
    handler: (props?: any) => void,
    hint: string
}

const InteractionCard: React.FC<TInteractionCard> = ({ interaction, handleDeleteInteraction }) => {

    const [isControlMenu, setControlMenu] = useState<boolean>(false)
    const [controlsData, setControlsData] = useState<TControlData[]>([
        {
            id: 1,
            icon: faTrash,
            title: "Delete",
            handler: () => handleDeleteInteraction(interaction.id),
            hint: 'Delete Interaction'
        }
    ])

    return (
        <div className={`flex column align__center ${styles.interactionCardContainer}`}>
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

                <TooltipButton position='left' tooltip='Delete' buttonClassname={styles.interactionButton} wrapperClassname={styles.interactionButtonContainer} handleMouseClick={() => setControlMenu((prev) => !prev)}>
                    <FontAwesomeIcon icon={faEllipsisVertical} style={{ width: '21px', height: '21px' }} />
                </TooltipButton>
            </div>

            {
                isControlMenu && (
                    <div className={styles.controlMenuContainer}>
                        {
                            controlsData.map((control) => (
                                <TooltipButton key={control.id} buttonClassname={`${styles.controlButton} ${control.title === 'Delete' ? styles.deleteButton : ''}`} handleMouseClick={control.handler} position='top' tooltip={control.hint} wrapperClassname={styles.controlButtonWrapper}>
                                    <FontAwesomeIcon icon={control.icon} />
                                    <span className={styles.controlButtonTitle}>
                                        {control.title}
                                    </span>
                                </TooltipButton>
                            ))
                        }
                    </div>
                )
            }
        </div>
    )
}

export default InteractionCard
