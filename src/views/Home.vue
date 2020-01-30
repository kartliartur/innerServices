<template>
  <div class="home">
    <Auth/>
  </div>
</template>

<script>
// @ is an alias to /src
import Auth from '@/components/auth/auth.vue'

export default {
  name: 'home',
  components: {
    Auth
  }
}
</script>

<style lang="less">
	@import url('../assets/less-templates/base.less');
	.home {
		.flex(column, center, center);
		width: 100%;
		height: 100vh;
	}
</style>
