<template>
  <a
    href="#main-content"
    class="skip-link"
    @click.prevent="skipToMain"
  >
    {{ $t('accessibility.skipToMain') }}
  </a>
</template>

<script setup lang="ts">
import { useSkipLink } from '@/composables/utils/accessibility-utils'

const { skipToMain } = useSkipLink()
</script>

<style scoped>
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  z-index: 100;
  padding: 8px 16px;
  background-color: #3b82f6;
  color: white;
  text-decoration: none;
  font-weight: 600;
  border-radius: 0 0 4px 0;
  transition: top 0.3s;
}

.skip-link:focus {
  top: 0;
  outline: 2px solid #1e40af;
  outline-offset: 2px;
}
</style>
