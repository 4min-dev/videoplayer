import IButtonProps from "./IButtonProps";
import IStyleColor from "./IStyleColor";

export default interface IInteraction {
    id: number,
    icon: any,
    duration: string,
    endTime:string,
    type: string,
    title: string,
    types?: { title: string, id: number, background: string, color: string }[],
    tooltip: string,
    buttonProps?: IButtonProps,
    styles?: IStyleColor[],
    isPause:boolean,
    pauseDuration?:string,
    imgHref?:string,
    clickHandler?:() => void
}