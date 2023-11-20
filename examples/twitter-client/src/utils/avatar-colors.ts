const variants = ['blue', 'purple', 'green', 'gold', 'orange']
export const hashColors = (text: string) => {
    const index = djb2Hash(text, variants.length)
    return variants[index]
}

function djb2Hash(str: string, arrayLength: number) {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
        hash = (hash * 33) ^ str.charCodeAt(i);
    }
    return Math.abs(hash) % arrayLength;
}