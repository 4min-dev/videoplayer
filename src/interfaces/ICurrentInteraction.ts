import { IconDefinition } from "@fortawesome/free-solid-svg-icons"

export default interface ICurrentInteraction {
    id: string | number,
    value: string,
    isPause: boolean,
    startTime: string,
    endTime: string,
    title:string,
    icon:IconDefinition,
    imgHref?:string
}