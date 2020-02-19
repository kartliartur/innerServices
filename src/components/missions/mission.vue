<template>
	<transition name="slide-fade">
		<div class="block-wrap" @click="openModal()">
			<div class="block"
				v-bind:class="{ active: $store.state.missions[missionIndex].isChecked }">
				<div class="head">
					<span class="title">{{ title }}</span>
					<span>{{ limitDate ? new Date(limitDate).toLocaleString().substring(0, 10) : 'Нет срока' }}</span>						
				</div>
				<div class="bot">
					<span>{{ employee ? employee : 'Исполнителя нет' }}</span>
					<span>{{ createDate }}</span>
				</div>
			</div>
			<input type="checkbox" 
					v-model="$store.state.missions[missionIndex].isChecked">
		</div>
	</transition>
</template>

<script>
	export default {
		name: 'mission',
		props: ['title', 'employee', 'limitDate', 'createDate', 'missionIndex'],
		methods: {
			openModal() {
				this.$emit('toggleModal', true);
				this.$store.dispatch('changeActiveMissionIndex', this.missionIndex);
			}
		}
	}
</script>

<style lang="less">
	@import url('../../assets/less-templates/base.less');
	.block-wrap {
		.default-block();

		& .head, .bot {
			.flex(row, space-between, center);
			width: 100%;
			& span:last-child {
				min-width: 71px;
			}

			& .title {
				overflow: hidden;
				text-overflow: ellipsis;
				word-spacing: normal;
				white-space: pre;
				width: 100px;
			}
		}
	}

	.slide-fade-enter-active, .slide-fade-leave-active {
		transition: opacity .5s;
	}
	.slide-fade-enter, .slide-fade-leave-to /* .fade-leave-active до версии 2.1.8 */ {
		opacity: 0;
	}
</style>