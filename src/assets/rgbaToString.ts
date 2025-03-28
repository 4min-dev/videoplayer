export default function rgbaToString(rgba: { r: number, g: number, b: number, a: number } | undefined): string {
    if (!rgba) return '#fff'
    return `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`
}