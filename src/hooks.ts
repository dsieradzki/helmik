import React, { useEffect, useRef, useState } from "react";

export function useOnFirstMount(fn: () => Promise<any>) {
    const alreadyInitialized = useRef(false)
    useEffect(() => {
        if (!alreadyInitialized.current) {
            alreadyInitialized.current = true
            fn()
                .then(() => {
                })
                .catch(e => {
                    console.error(e)
                    throw e
                })
        }
    }, [])
}

export function useAsyncEffect(fn: () => Promise<any>, deps?: React.DependencyList): void {
    useEffect(() => {
        fn()
            .then(() => {
            })
            .catch(e => {
                console.error(e)
                throw e
            })
    }, deps)
}

export function useDebounce<T>(value: T, delayMillis?: number): T {
    const [result, setResult] = useState<T>(value);
    useEffect(() => {
        const timer = setTimeout(() => {
            setResult(value);
        }, delayMillis || 300);
        return () => {
            clearTimeout(timer);
        }
    }, [value, delayMillis]);
    return result;
}