<template>
    <div>
        <h1>Blog Post: {{ slug }}</h1>
        <p>This is the blog post content for the slug: {{ slug }}</p>
    </div>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
const slug = route.params.slug
</script>
