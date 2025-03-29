export default function convertToSeconds(time: string): number {
    const [minutes, seconds] = time.split(':').map(Number)
    return minutes * 60 + seconds
}