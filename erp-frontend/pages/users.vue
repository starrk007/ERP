<template>
    <div class="min-h-screen bg-base-200 p-6">
        <div class="mx-auto max-w-5xl space-y-4">
            <div class="flex items-center justify-between">
                <h1 class="text-2xl font-bold">Users</h1>
                <div class="flex gap-2">
                    <button class="btn btn-outline btn-sm" @click="logout">
                        Logout
                    </button>
                    <button class="btn btn-outline btn-sm" @click="reload">
                        Recargar
                    </button>
                </div>
            </div>
            <div class="card bg-base-100 shadow-xl">
                <div class="card-body">
                    <div class="overflow-x-auto">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Email</th>
                                    <th>Activo</th>
                                    <th>ID</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="u in items" :key="u.id" class="hover">
                                    <td>{{ u.name }}</td>
                                    <td class="font-mono text-xs">{{ u.email }}</td>
                                    <td>
                                        <span class="badge" :class="u.active ? 'badge-success' : 'badge-error'">
                                            {{ u.active ? '❤️': '🤢' }}
                                        </span>
                                    </td>
                                    <td class="font-mono text-xs opacity-70">
                                        {{ u.id }}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="flex items-center justify-between pt-4">
                        <div class="text-sm opacity-70">
                            Items: {{ items.length }} · nextCursor: {{ nextCursor || "null" }}
                        </div>

                        <div class="join">
                            <button class="btn btn-sm join-item" @click="reload" :disabled="loading">Reset</button>
                            <button class="btn btn-sm btn-primary join-item" @click="loadMore" :disabled="loading || !nextCursor">
                            <span v-if="loading" class="loading loading-spinner"></span>
                                Cargar más
                            </button>
                        </div>
                    </div>

                    <p v-if="error" class="text-sm text-error pt-2">{{ error }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { definePageMeta } from '#imports'

type User = {
    id: string
    name: string
    email: string
    active: boolean
    roleIds?: string[]
}

const config = useRuntimeConfig()

const items = ref<User[]>([])
const nextCursor = ref<string | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

definePageMeta({
    middleware: ['auth']
})

/** Helpers seguros (solo cliente) */
function getAccessToken(): string {
    if (!process.client) return ""
    return localStorage.getItem("accessToken") || ""
}

function getRefreshToken(): string {
    if (!process.client) return ""
    return localStorage.getItem("refreshToken") || ""
}

function setTokens(accessToken: string, refreshToken: string) {
    if (!process.client) return
    localStorage.setItem("accessToken", accessToken)
    localStorage.setItem("refreshToken", refreshToken)
}

function clearTokens() {
    if (!process.client) return
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
}

async function apiFetch<T>(path: string, opts: any = {}): Promise<T> {
    const url = path.startsWith("http") ? path : `${config.public.apiBase}/${path}`

    try {
        return await $fetch<T>(url, {
            ...opts,
            headers: {
                ...(opts.headers || {}),
                ...(getAccessToken() ? { Authorization: `Bearer ${getAccessToken()}` } : {})
            }
        })
    } catch (e: any) {
        const status = e?.status || e?.response?.status

        // Refresh-once
        if (status === 401 && getRefreshToken()) {
            try {
                const r: any = await $fetch(`${config.public.apiBase}/auth/refresh`, {
                    method: "POST",
                    body: { refreshToken: getRefreshToken() }
                })

                setTokens(r.accessToken, r.refreshToken)

                return await $fetch<T>(url, {
                    ...opts,
                    headers: {
                        ...(opts.headers || {}),
                        Authorization: `Bearer ${r.accessToken}`
                    }
                })
            } catch {
                // refresh falló => logout duro
                await hardLogout()
            }
        }

        throw e
    }
}

async function reload() {
    error.value = null
    loading.value = true
    try {
        const res: any = await apiFetch(`/users?limit=20`)
        items.value = res.items || []
        nextCursor.value = res.nextCursor || null
    } catch (e: any) {
        error.value = e?.data?.message || "Error cargando users"
    } finally {
        loading.value = false
    }
}

async function loadMore() {
    if (!nextCursor.value) return
    error.value = null
    loading.value = true
    try {
        const res: any = await apiFetch(`/users?limit=20&cursor=${encodeURIComponent(nextCursor.value)}`)
        items.value = [...items.value, ...(res.items || [])]
        nextCursor.value = res.nextCursor || null
    } catch (e: any) {
        error.value = e?.data?.message || "Error cargando más"
    } finally {
        loading.value = false
    }
}

async function hardLogout() {
    // intenta avisar al backend, pero no bloquea
    const rt = getRefreshToken()
    if (rt) {
        await $fetch(`${config.public.apiBase}/auth/logout`, {
            method: "POST",
            body: { refreshToken: rt }
        }).catch(() => {})
    }

    clearTokens()
    await navigateTo("/login")
}

async function logout() {
    await hardLogout()
}

onMounted(async () => {
    // cliente only: validar sesión
    if (!getAccessToken()) return navigateTo("/login")
    await reload()
})
</script>