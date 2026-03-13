export function useAuth() {
    const  accessToken = useState<string | null>('accessToken', () => null)
    const  refreshToken = useState<string | null>('refreshToken', () => null)

    const  loadFromStorage = () => {
        accessToken.value = localStorage.getItem('accessToken')
        refreshToken.value = localStorage.getItem('refreshToken')
    }

    const setTokens = (a: string, r: string) => {
        accessToken.value = a
        refreshToken.value = r
        localStorage.setItem('accessToken', a)
        localStorage.setItem('refreshToken', r)
    }

    const clear = () => {
        accessToken.value = null
        refreshToken.value = null
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
    }

    return { accessToken, refreshToken, loadFromStorage, setTokens, clear }
}
