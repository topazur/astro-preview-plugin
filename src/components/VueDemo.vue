<template>
<div>
  <p>VuePropA: {{ props.propA }}</p>
  <p>VueChildren: <slot /></p>
  <p>VueCount: {{ count }}</p>
  <button @click="handleAdd">
    &nbsp;+1&nbsp;
  </button>
</div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const props = defineProps(['propA'])
const count = ref(1)
const handleAdd = () => {
  count.value += 1
}
</script>
