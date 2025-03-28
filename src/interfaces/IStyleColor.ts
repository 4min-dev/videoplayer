export default interface IStyleColor {
    id: number,
    name: string,
    value: string | { r: number; g: number; b: number; a: number },
    defaultValue: string
}