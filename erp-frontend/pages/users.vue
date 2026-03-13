<template>
    <div class="mx-auto max-w-5xl space-y-4">
        <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold">Users</h1>

        <div class="flex gap-2">
            <button class="btn btn-primary btn-sm" @click="reload" :disabled="loading">
            <span v-if="loading" class="loading loading-spinner"></span>
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
                    <td class="font-mono text-xs">
                    {{ u.email }}
                    </td>
                    <td>
                    <span class="badge" :class="u.active ? 'badge-success' : 'badge-error'">
                        {{ u.active ? '❤️' : '🤢' }}
                    </span>
                    </td>
                    <td class="font-mono text-xs opacity-70">
                    {{ u.id }}
                    </td>
                </tr>

                <tr v-if="!loading && items.length === 0">
                    <td colspan="4" class="text-center opacity-60 py-6">
                    Sin datos
                    </td>
                </tr>
                </tbody>
            </table>
            </div>

            <div class="flex items-center justify-between pt-4">
            <div class="text-sm opacity-70">
                Items: {{ items.length }} · nextCursor: {{ nextCursor || 'null' }}
            </div>

            <div class="join">
                <button class="btn btn-sm join-item" @click="reload" :disabled="loading">
                Reset
                </button>

                <button
                class="btn btn-sm btn-primary join-item"
                @click="loadMore"
                :disabled="loading || !nextCursor"
                >
                <span v-if="loading" class="loading loading-spinner"></span>
                Cargar más
                </button>
            </div>
            </div>

            <p v-if="error" class="text-sm text-error pt-2">
            {{ error }}
            </p>
        </div>
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    middleware: ['auth']
})

type User = {
    id: string
    name: string
    email: string
    active: boolean
    roleIds?: string[]
}

const { $api } = useNuxtApp()

const items = ref<User[]>([])
const nextCursor = ref<string | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

async function reload() {
    error.value = null
    loading.value = true

    try {
        const res: any = await $api('/users?limit=20')
        items.value = res.items || []
        nextCursor.value = res.nextCursor || null
    } catch (e: any) {
        error.value = e?.data?.message || 'Error cargando users'
    } finally {
        loading.value = false
    }
}

async function loadMore() {
    if (!nextCursor.value) return

    error.value = null
    loading.value = true

    try {
        const res: any = await $api(`/users?limit=20&cursor=${encodeURIComponent(nextCursor.value)}`)
        items.value = [...items.value, ...(res.items || [])]
        nextCursor.value = res.nextCursor || null
    } catch (e: any) {
        error.value = e?.data?.message || 'Error cargando más'
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    reload()
})
</script>