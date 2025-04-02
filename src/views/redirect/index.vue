<script setup lang="ts">
import { onBeforeMount } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const route = useRoute();
const router = useRouter();

onBeforeMount(() => {
  const { params } = route;
  const { path } = params;
  
  router.replace({ path: '/' + path });
});
</script> 
