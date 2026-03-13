import {useEffect} from "react";

export function useConsole<T>(data: T) {
    useEffect(() => console.log(data), [data]);
}