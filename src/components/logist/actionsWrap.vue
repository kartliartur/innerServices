<template>
	<transition name="slide-fade">
		<div class="actions-wrap" v-show="getSome">
			<select v-model="currentStatus">
				<option value="Товар отгружен">Товар отгружен</option>
				<option value="Отменено">Отменено</option>
				<option value="Товар получен">Товар получен</option>
			</select>
			<input type="date" v-model="currentDate">
			<div class="btn-wrap">
				<button @click="saveChanges()">Изменить</button>
			</div>
			<myNotification
					:text="not_text"
					:textColor="not_color"
					v-show="is_not_show"/>
		</div>
	</transition>
</template>

<script>
import myNotification from '@/components/other/notification.vue'
import Funcs from '../../assets/js-funcs/default-funcs.js'

	export default {
		name: 'actionsWrap',
		components: {
			myNotification
		},
		data: () => {
			return {
				not_text: 'Error',
				not_color: 'red',
				is_not_show: false,
				currentStatus: 'Товар отгружен',
				currentDate: '2020-02-04'
			}
		},
		methods: {
			showNotification(text, color) {
				this.not_text = text;
				this.not_color = color;
				this.is_not_show = true;
				setTimeout(() => {
					this.is_not_show = false;
				}, 1500);
			},
			saveChanges() {
				let arr = new Array();
				for (let i = 0; i < this.$store.state.ttns.length; i++) {
					let item = this.$store.state.ttns[i];
					if (item.isChecked == true) {
						arr.push(new Object());
						arr[arr.length-1].TTN_Status = this.currentStatus;
						arr[arr.length-1].TTN_GUID = item.TTN_GUID;
						arr[arr.length-1].Status_Date = item.Date_Delivery;
					}
				}
				Funcs.doRequest(
					'put',
					'https://erp.unlogic.ru/erp_local/hs/WaybillClient/SetStatusTTN',
					arr,
					null,
					res => {
						let color = 'green';
						if (res.data.error) {
							color = 'red';
						} else {
							for (let i = 0; i < this.$store.state.ttns.length; i++) {
								let item = this.$store.state.ttns[i];	
								if (item.isChecked) {
									item.TTN_Status = this.currentStatus;
									item.Date_Delivery = this.currentDate;
								}			
							}			
						}
						this.showNotification(res.data.data, color);
					},
					() => { this.showNotification('Сервер временно недоступен', 'red') }
				);
			}
		},
		computed: {
			getSome() {
				let arr = this.$store.getters.getTtns;
				let flag = false;
				for (let i = 0; i < arr.length; i++) {
					if (arr[i].isChecked == true)
						flag = true;
				}
				return flag;
			}
		}
	}
</script>

<style lang="less">
	@import url('../../assets/less-templates/base.less');
	.actions-wrap {
		.flex(row, space-between, center);
		flex-wrap: wrap;
		width: 100%;
		height: 100px;
		margin: 10px 0;
		padding: 10px;

		& input, select {
			.input();
			width: 45%;
		}

		& .btn-wrap {
			.flex(row, center, center);
			width: 100%;
			margin: 10px 0 0 0;
		}

		& button {
			.button(5px, @green-color, #fff);
			margin: 0 5px;
		}

		& button:last-child {
			.button(5px, #fff, @green-color);
		}
	}

	.slide-fade-enter-active {
		transition: all .3s linear;
	}
	.slide-fade-leave-active {
		transition: all .2s linear;
	}
	.slide-fade-enter {
		transform: translateY(20px);
		opacity: 0;
	}
	.slide-fade-leave-to {
		transform: translateY(-20px);
		opacity: 0;
	}
</style>
