<template>
	<transition name="slide-fade">
		<div class="block-wrap">
			<div class="block" @click="openModal()" :style="getStyles">
				<div class="date">
					<span class="number">{{ day }}</span>
					<span class="text">{{ getMonth }}</span>
				</div>
				<div class="column">
					<span class="company">{{ company }}</span>
					<span class="inn">ИНН: {{ inn }}</span>
				</div>				
			</div>
		</div>
	</transition>
</template>

<script>
	export default {
		name: 'mission',
		props: ['day', 'month', 'company', 'inn', 'saleIndex', 'isOpen', 'taskType'],
		computed: {
			getMonth() {
				let months = [
					'Января',
					'Февраля',
					'Марта',
					'Апреля',
					'Мая',
					'Июня',
					'Июля',
					'Августа',
					'Сентября',
					'Октября',
					'Ноября',
					'Декабря'
				];
				return months[this.month];
			},
			getStyles () {
				let style = this.taskType === 'Согласовать' ? 'background: linear-gradient(120deg, #66ab557a, #fff 45%);'
						: 'background: linear-gradient(120deg, #eaaa597a, #fff 45%);'
				return style;
			}
		},
		methods: {
			openModal() {
				this.$emit('toggleModal', true);
				this.$store.dispatch('changeActiveSaleIndex', this.saleIndex);
			}
		}
	}
</script>

<style lang="less">
	@import url('../../assets/less-templates/base.less');
	.block-wrap {
		.default-block();
	
		& div {
			.flex(column, center, center);
			width: 40%;
			& span {
				text-align: center;
				font-size: .9em;
			}
		}

		& .block {
			width: 100%;
		}

		& .column {
			width: 60%;
		}
	}

	.slide-fade-enter-active, .slide-fade-leave-active {
		transition: opacity .5s;
	}
	.slide-fade-enter, .slide-fade-leave-to /* .fade-leave-active до версии 2.1.8 */ {
		opacity: 0;
	}
</style>