<template>
	<div class="modal-wrap" :class="{ active: isOpen }">
		<div class="hover"></div>
		<div class="modal-frame">
			<h2>Оставить комментарий</h2>
			<span>Партнер: {{ isActiveIndex.Partner || "Нет" }}</span>
			<span>ИНН: {{ isActiveIndex.INN || "Нет" }}</span>
			<span>Автор задачи: {{ isActiveIndex.Author }}</span>
			<span class="desc">{{ isActiveIndex.Description }}</span>
			<span>Дата: {{ new Date(isActiveIndex.Deadline).toLocaleString().substring(0, 10) }}</span>
			<textarea placeholder="Введите комментарий сюда" v-model="comment"></textarea>
			<label v-if="isActiveIndex.TaskType == 'Согласовать'" >
				<span>Согласовать с директором</span>
				<input type="checkbox" v-model="confirmWD">
			</label>
			<div class="btn-wrap">
				<button @click="checkAproove(true)">{{ isActiveIndex.TaskType == 'Согласовать' ? 'Согласовать' : 'Ознакомлено' }}</button>
				<button v-if="isActiveIndex.TaskType == 'Согласовать'" @click="checkAproove(false)">Не согласовать</button>
				<button @click="hideModal()">Отмена</button>
			</div>
		</div>
		<myNotification
			:text="not_text"
			:textColor="not_color"
			v-show="is_not_show"/>    
	</div>
</template>

<script>
import myNotification from '@/components/other/notification.vue'
import Funcs from '../../assets/js-funcs/default-funcs.js'
	export default {
		name: 'saleModal',
		data: () => {
			return {
				not_text: '',
				not_color: '',
				is_not_show: false,
				comment: new String(''),
				confirmWD: false,
				isSend: false,
				limitDate: new String(''),
				employee: new String('')
			}
		},
		props: ['isOpen'],
		components: {
			myNotification
		},
		methods: {
			hideModal() {
				this.$emit('toggleModal', false);
			},
			checkAproove(aproove) {
				if (this.comment == '') {
					this.showNotification('Заполните поле комментария', 'red');
				} else {
					let data = {
						id: this.$store.state.sales[this.$store.state.activeSaleIndex].id,
						Comment : this.comment,
						ConfirmWithDirector : this.confirmWD,
						Approved : aproove,
					}
					if (this.isActiveIndex.TaskType == 2 || this.isActiveIndex.TaskType == 3)
						delete data.confirmWithDirector;
					Funcs.doRequest(
						'post',
						this.$store.getters.getLinkByName('sellers','approve'),
						data,
						null,
						res => {
							let color = "green";
							if (res.data.error) {
								color = 'red';
							} else {
								this.comment = new String('');
								this.confirmWD = false;
								//this.$store.state.sales.splice(this.$store.state.activeSaleIndex, 1);
								this.$store.dispatch('deleteTask', this.$store.state.activeSaleIndex);
								this.$emit('sortSales', this.$store.state.sales);
							}
							let message;
							if (res.data.data.length > 0 && res.data.report.length <= 0)
								message = res.data.data;
							else
								message = res.data.report;
							this.showNotification(message, color, () => { this.hideModal() });
						},
						() => { this.showNotification('Сервер временно недоступен', 'red'); }
					);
				}
			},
			showNotification(text, color, callback) {
				this.not_text = text;
				this.not_color = color;
				this.is_not_show = true;
				setTimeout(() => {
					this.is_not_show = false;
					if (callback) {
						callback();
					}
				}, 1500);
			}    			
		},
		computed: {
			isActiveIndex() {
				if (this.$store.state.activeSaleIndex != null && this.$store.state.sales.length > 0) 
					return this.$store.state.sales[this.$store.state.activeSaleIndex];
				else 
					return {
						Partner: 'Нет',
						INN: 'Нет',
						Author: 'Нет',
						Description: 'Нет',
						Deadline: new Date()
					}
			}
		}
	}
</script>

<style lang="less">
	@import url('../../assets/less-templates/base.less');
	.modal-wrap {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100vh;
		overflow-y: scroll;
		opacity: 0;
		z-index: -2;
		transition: all .3s linear;

		& .hover {
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background: #000;
			opacity: .7;
		}

		& .modal-frame {
			.flex(column, flex-start, center);
			position: absolute;
			width: 100%;
			min-height: 100vh;
			top: 0;
			left: 0;
			padding: 0 5px;
			border-radius: 2px;
			background: @green-color;
			color: #fff;

			& h2 {
				width: 100%;
				padding: 10px 0;
				text-align: left;		
				font-size: 1.2em;	
				border-bottom: 1px solid #eee;
				margin-bottom: 10px;
			}
			
			& textarea, input {
				.input();
			}

			& textarea {
				width: 100%;
				height: 150px;
				padding: 10px;
			}

			& span {
				padding: 5px 0;
				margin: 5px 0;
				font-size: 1.1em;
				width: 100%;
				text-align: left;
			}

			& .desc {
				white-space: pre-wrap;
				text-align: left;
				font-size: .9em;
				border: none;
				border-left: 2px solid #ffffff4d;
				padding-left: 10px;
			}

			& label {
				.flex(row, center, center);
				width: 100%;
				padding: 5px 0;
				& span {
					width: auto;
					padding: 0 5px;
				}
				& input {
					.kartli-check();
					height: auto;
				}
			}

			& .btn-wrap {
				.flex(row, center, center);
				width: 100%;
				flex-wrap: wrap;
				padding: 10px 0;
				& button {
					.button(5px, @green-color, #fff);
					margin: 10px;
				}

				& button:nth-child(2) {
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