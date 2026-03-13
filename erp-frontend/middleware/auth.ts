export default defineNuxtRouteMiddleware((to) => {
    if (!process.client) return
    const auth = useAuth()
    if (auth.accessToken.value === null) auth.loadFromStorage()

    const isLogin = to.path === '/login'
    const hasToken = !!auth.accessToken.value

    if (!hasToken && !isLogin) return navigateTo('/login')
    if (hasToken && isLogin) return navigateTo('/users')

    

})