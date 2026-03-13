export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig()
    const auth = useAuth()

    const api = $fetch.create({
        baseURL: config.public.apiBase,
        async onRequest({ options }) {
            if (process.client && auth.accessToken.value === null) auth.loadFromStorage()
            const token = auth.accessToken.value
            if (token) {
                options.headers = { ...(options.headers || {}), Authorization: `Bearer ${token}`}
            }
        },
        async onRequestError ({ request, options, response }) {
            if (response?.status === 401) return

            if (!process.client) return

            if (auth.refreshToken.value === null) auth.loadFromStorage()
            const rt = auth.refreshToken.value
            if (!rt) return
            // refresh once
            const r: any = await $fetch(`${config.public.apiBase}/auth/refresh`, {
                method: 'POST',
                body: { refreshToken: rt}
            })
            auth.setTokens(r.accessToken, r.refreshToken)

            return await $fetch(request, {
                ...(options.headers || {}), Authorization: `Bearer ${r.accessToken}`
            })
        }
    })
    return {provide: {api}}

    //
})