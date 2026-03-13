<template>
    <div class="card w-full bg-base-100 shadow-xl">
        <div class="card-body">
        <h1 class="text-2xl font-bold">
            Login
        </h1>

        <form class="mt-4 space-y-3" @submit.prevent="onSubmit">
            <input
            v-model="email"
            class="input input-bordered w-full"
            placeholder="Email"
            >

            <input
            v-model="password"
            type="password"
            class="input input-bordered w-full"
            placeholder="Password"
            >

            <button class="btn btn-primary w-full" :disabled="loading">
            <span v-if="loading" class="loading loading-spinner"></span>
            Entrar
            </button>

            <p v-if="error" class="text-sm text-error">
            {{ error }}
            </p>
        </form>
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'auth',
    middleware: ['auth']
})

const auth = useAuth()
const { $api } = useNuxtApp()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref<string | null>(null)

async function onSubmit() {
    loading.value = true
    error.value = null

    try {
        const res: any = await $api('/auth/login', {
        method: 'POST',
        body: {
            email: email.value,
            password: password.value
        }
        })

        auth.setTokens(res.accessToken, res.refreshToken)
        await navigateTo('/users')
    } catch (e: any) {
        error.value = e?.data?.message || 'Error al conectarse al servidor'
    } finally {
        loading.value = false
    }
}
</script>