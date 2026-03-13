<script setup lang="ts">
const auth = useAuth()

if (process.client && auth.accessToken.value === null) {
    auth.loadFromStorage()
}

if (auth.accessToken.value) {
    await navigateTo('/users')
} else {
    await navigateTo('/login')
}
</script>

<template>
    <div />
</template>