<template>
	<div class="modal-wrap" :class="{ active: isOpen }">
		<myNotification
				:text="not_text"
				:textColor="not_color"
				v-show="is_not_show"/>
		<div class="hover"></div>
		<div class="modal-frame">
			<div class="row">
				<span>№{{ isActiveIndex.Number }}</span>
				<span>от {{ isActiveIndex.TTN_Date }}</span>
			</div>
			<div class="row">
				<span>Статус:</span>
				<select @change="statusChange()" id="status_select">
					<option
						v-for="(item, idx) in $store.state.statusTypes" :key="idx"
						:value="item"
						:selected="activeStatus(idx)"
						>
						{{ item }}
					</option>
				</select>
			</div>
			<div class="row">
				<span>Дата доставки(отправки):</span>
				<input type="date" :value="this.dateNow" @change="dateChange()" id="status_date">
			</div>
			<div class="row">
				<span>Транспортная компания:</span>
				<span>{{ isActiveIndex.Payment_Company }}</span>
			</div>
			<div class="row">
				<span>Плательщик:</span>
				<span>{{ isActiveIndex.Releaser }}</span>
			</div>
			<div class="row">
				<span>Водитель:</span>
				<span>{{ isActiveIndex.FIO_Driver }}</span>
			</div>
			<div class="row">
				<span>Номер водителя:</span>
				<span>{{ isActiveIndex.Driver_Number }}</span>
			</div>
			<div class="btn-wrap">
				<button @click="saveChanges()">Применить</button>
				<button @click="hideModal()">Закрыть</button>
			</div>
		</div>
	</div>
</template>

<script>
import myNotification from '@/components/other/notification.vue'
import Funcs from '../../assets/js-funcs/default-funcs.js'
	export default {
		name: 'modalFrame',
		props: ['isOpen'],
		components: {
			myNotification
		},
		data: () => {
			return {
					newValue: null,
					not_text: 'Ошибка',
					not_color: 'red',
					is_not_show: false,
					currentDate: '',
					dateNow: '',
			}
		},
		methods: {
			hideModal() {
				this.$emit('toggleModal', false);
			},
			showNotification(text, color) {
				this.not_text = text;
				this.not_color = color;
				this.is_not_show = true;
				setTimeout(() => {
					this.is_not_show = false;
					this.hideModal();
				}, 5500);
			},
			saveChanges() {
				let data = new Array();
				data[0] = {
					TTN_Status: this.newValue,
					TTN_GUID: this.isActiveIndex.TTN_GUID,
					Status_Date: this.currentDate
				}
				Funcs.doRequest(
					'put',
					this.$store.getters.getLinkByName('logist','setStatus'),
					data,
					null,
					res => {
						let color = 'green';
						if (res.data.error) {
							color = 'red';
							this.showNotification(res.data.report, color);
						} else {
							this.$store.state.ttns[this.$store.state.activeTtnIndex].TTN_Status = this.newValue;
							this.$store.state.ttns[this.$store.state.activeTtnIndex].Date_Delivery = this.currentDate;
							this.showNotification('Успешно', color);
						}
					},
					() => { this.showNotification('Сервер временно недоступен', 'red'); }
				);
			},
			activeStatus(idx) {
				let result = new Number();
				for (let i = 0; i < this.$store.state.statusTypes.length; i++) {
					if (this.$store.state.statusTypes[i] == this.isActiveIndex.TTN_Status)
						result = i;
				}
				if (result == idx)
					return true;
				else
					return false;
			},
			statusChange() {
				this.newValue = document.getElementById('status_select').value;
			},
			dateChange() {
				this.currentDate = document.getElementById('status_date').value;
			}
		},
		computed: {
			isActiveIndex() {
				window.console.log(this.$store.state.activeTtnIndex);
				if (this.$store.state.activeTtnIndex != null) 
					return this.$store.state.ttns[this.$store.state.activeTtnIndex];
				else 
					return {
						ttnNumber: 'Нет',
						ttnDate: 'Нет',
						ttnDelDate: new Date(),
						ttnCompany: 'Нет',
						ttnPaymenter: 'Нет',
						ttnDriver: 'Нет',
						ttnDriverNum: 'Нет'
					}
			}
		},
		beforeMount() {
			this.dateNow = Funcs.dateToInputs(new Date())[2] + '-'
					+ Funcs.dateToInputs(new Date())[1] + '-'
					+ Funcs.dateToInputs(new Date())[0];
		}
	}
</script>

<style lang="less">
	@import url('../../assets/less-templates/base.less');
	.modal-wrap {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100vh;
		opacity: 0;
		z-index: -2;
		transition: all .3s linear;

		& .hover {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background: #000;
			opacity: .7;
		}

		& .modal-frame {
			.flex(column, center, center);
			position: absolute;
			width: 100%;
			top: 0;
			left: 0;
			padding: 0 5px;
			border-radius: 2px;
			height: 100vh;
			background: @green-color;
			color: #fff;

			& .row {
				.flex(row, space-between, center);
				padding: 15px 5px;
				width: 100%;
				border-bottom: 1px solid #fff;
				& span, select {
					font-size: 1.1em;
				}
				& span:last-child {
					text-align: right;
				}
				& select, input {
					.input();
				}
			}

			& .row:first-child {
				& span {
					font-size: 1.3em;
					font-weight: bold;
				}
			}

			& .btn-wrap {
				.flex(row, center, center);
				width: 100%;
				& button {
					.button(5px, @green-color, #fff);
					margin: 10px;
				}

				& button:last-child {
					.button(5px, #fff, @green-color);
				}
			}
		}
	}
	.active {
		z-index: 10000000;
		opacity: 1;
	}
</style>
