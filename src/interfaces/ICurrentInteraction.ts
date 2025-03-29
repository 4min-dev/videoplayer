import { IconDefinition } from "@fortawesome/free-solid-svg-icons"
import IStyleColor from "./IStyleColor"

export default interface ICurrentInteraction {
    id: string | number,
    value: string,
    isPause: boolean,
    pauseDuration?:string,
    startTime: string,
    endTime: string,
    title:string,
    icon:IconDefinition,
    imgHref?:string,
    styles:IStyleColor[],
    buttonProps:{
        left: string | null, 
        top: string | null, 
        width: string | null, 
        height: string | null, 
        bottom:string | null
    }
}