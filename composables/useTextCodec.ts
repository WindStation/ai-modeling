export const useTextCodec = () => {
    const encode = (text: string) => {
        const encoder = new TextEncoder()
        return btoa(Array.from(encoder.encode(text), byte => String.fromCharCode(byte)).join(''))
    }

    const decode = (base64: string) => {
        const binary = atob(base64)
        const bytes = new Uint8Array(binary.length)
        for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i)
        }
        return new TextDecoder('utf-8').decode(bytes)
    }

    return { encode, decode }
}