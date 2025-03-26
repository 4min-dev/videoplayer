import { useCallback, useRef } from "react"

type TDebounceHook<T extends any[]> = {
    callback: (...args: T) => void ,
    delay: number
}

export default function useDebounce<T extends any[]>({ callback, delay }: TDebounceHook<T>) {
    const timer = useRef<number | null>(null)

    const debouncedCallback = useCallback((...args: T) => {
        if (timer.current !== null) {
            clearTimeout(timer.current)
        }
        timer.current = window.setTimeout(() => {
            callback(...args)
        }, delay)
    }, [callback, delay])

    return debouncedCallback
}