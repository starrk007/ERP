<template>
    <div class="min-h-screen bg-base-200">
        <div class="navbar bg-base-100 border-b border-base-300">
            <div class="flex-1">
                <NuxtLink to="/users" class="btn btn-ghos text-xl">
                    ERP
                </NuxtLink>
            </div>
            <div class="flex-none gap-2">
                <NuxtLink to="/users" class="btn btn-ghost btn-sm">
                    Users
                </NuxtLink>
            </div>
            <div class="flex-none gap-2">
                <button class="btn btn-warning btn-sm" @click="logout">
                    Salir
                </button>
            </div>
        </div>
        <main class="p-6">
            <NuxtPage />
        </main>
    </div>
</template>

<script setup lang="ts">
import { useAuth } from '../composables/useAuth';

const auth = useAuth()
const logout = async () => {
    await auth.clear()
    await navigateTo('/login')
}
</script>