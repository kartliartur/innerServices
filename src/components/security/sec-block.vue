<template>
	<transition name="slide-fade">
		<div class="block-wrap">
			<div class="block" 
				@click="openModal()">
				<div class="date-wrap">
					<span>{{ dayFromDate }}</span>
					<span>{{ formatDate }}</span>
				</div>
				<div class="comp-info">
					<span>{{ companyName }}</span>
					<span>ИНН: {{ inn }}</span>					
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
	export default {
		name: 'logistBlock',
		props: ['isOpen', 'date', 'companyName', 'inn', 'text', 'taskIndex'],
		data: () => {
			return {
				dict: [
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
				]
			}
		},
		methods: {
			openModal() {
				this.$emit('toggleModal', true);
				this.$store.commit('CHANGE_ACTIVE_TASK_INDEX', this.taskIndex);
			}
		},
		computed: {
			formatDate() {
				return this.dict[this.date.substr(5,2)-1];
			},
			dayFromDate() {
				return this.date.substr(8,2);
			}
		}
	}
</script>

<style lang="less">
	@import url('../../assets/less-templates/base.less');
	.block-wrap {
		.default-block();
		justify-content: center;

		& .date-wrap {
			.flex(column, center, center);
			width: 30%;
			height: 100%;

			& span {
				margin: 0;
			}
		}

		& .comp-info {
			.flex(column, center, center);
			width: 60%;

			& span {
				text-align: center;
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