<template>
  <div>{{ all }}</div>
</template>
<script>
export default {
  computed: {
    all() {
      return this.$store.state.events.all;
    }
  }
};
</script>
