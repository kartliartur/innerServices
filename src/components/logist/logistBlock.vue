<template>
	<transition name="slide-fade">
		<div class="block-wrap">
			<div class="block" 
				v-bind:class="{ active: $store.state.ttns[ttnIndex].isChecked }" 
				@click="openModal()">
				<span>{{ ttnNumber }}</span>
				<span>{{ ttnStatus }}</span>
				<span>от {{ ttnDate }}</span>
				<span class="company_name">{{ ttnCompany }}</span>
			</div>
			<input type="checkbox" 
					v-model="$store.state.ttns[ttnIndex].isChecked">
		</div>
	</transition>
</template>

<script>
	export default {
		name: 'logistBlock',
		props: ['isOpen', 'ttnNumber', 'ttnStatus', 'ttnDate', 'ttnCompany', 'ttnIndex'],
		methods: {
			openModal() {
				this.$emit('toggleModal', true);
				this.$store.dispatch('changeActiveTtnIndex', this.ttnIndex);
			}
		}
	}
</script>

<style lang="less">
	@import url('../../assets/less-templates/base.less');
	.block-wrap {
		.default-block();
		.block span {
			font-size: .8em;
		}
	}

	.slide-fade-enter-active, .slide-fade-leave-active {
		transition: opacity .5s;
	}
	.slide-fade-enter, .slide-fade-leave-to /* .fade-leave-active до версии 2.1.8 */ {
		opacity: 0;
	}
</style>