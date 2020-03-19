<template>
	<transition name="slide-fade">
		<div class="block-wrap">
			<div
					class="block"
					@click="openModal()"
					v-bind:class="{ active:
					type === 'control' ? $store.state.missions[missionIndex].isChecked :
						$store.state.missionsCheck[missionIndex].isChecked }"
			>
				<div class="head">
					<span class="title">{{ type === 'control' ? 'title' : "Поручение " + (missionIndex+1)  }}</span>
					<span>{{ limitDate ? new Date(limitDate).toLocaleString().substring(0, 10) : 'Нет срока' }}</span>
				</div>
				<div class="bot">
					<span>{{ employee ? employee : 'Исполнителя нет' }}</span>
					<span>{{ createDate }}</span>
				</div>
			</div>
			<input v-if="type === 'control'" type="checkbox" v-model="$store.state.missions[missionIndex].isChecked">
			<input v-if="type === 'check'" type="checkbox" v-model="$store.state.missionsCheck[missionIndex].isChecked">
			<!--<div v-if="type === 'check'">
				<div
						class="block"
						@click="openModal()"
						v-bind:class="{ active: $store.state.missionsCheck[missionIndex].isChecked }"
				>
					<div class="head">
						<span class="title">{{ "Поручение " + missionIndex }}</span>
						<span>{{ limitDate ? new Date(limitDate).toLocaleString().substring(0, 10) : 'Нет срока' }}</span>
					</div>
					<div class="bot">
						<span>{{ employee ? employee : 'Исполнителя нет' }}</span>
						<span>{{ createDate }}</span>
					</div>
				</div>
				<input
						type="checkbox"
						v-model="$store.state.missionsCheck[missionIndex].isChecked"
				>
			</div>-->
		</div>
	</transition>
</template>

<script>
	export default {
		name: 'mission',
		props: ['title', 'employee', 'limitDate', 'createDate', 'missionIndex', 'type'],
		methods: {
			openModal() {
				this.$emit('toggleModal', true);
				if (this.type === 'control') {
					this.$store.dispatch('changeActiveMissionIndex', this.missionIndex);
				}
				if (this.type === 'check') {
					this.$store.dispatch('changeActiveMissionCheckIndex', this.missionIndex);
				}
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