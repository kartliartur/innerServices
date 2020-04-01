<template>
	<div class="actions-wrap">
		<div v-if="type === 'control'">
			<button @click="closeMissions()">Снять с контроля</button>
			<button @click="becomeNewDate = true">Перенести срок</button>
			<div class="action-modal-wrap" v-show="becomeNewDate">
				<div class="hover"></div>
				<div class="date-form">
					<h2>Укажите дату для переноса:</h2>
					<input type="date" v-model="new_date">
					<button @click="changeNewDate()">Подтвердить</button>
					<button @click="becomeNewDate = false">Закрыть</button>
				</div>
			</div>
		</div>
		<div v-if="type === 'check'">
			<button @click="finishMission = true">Завершить</button>
			<div class="action-modal-wrap" v-show="finishMission">
				<div class="hover"></div>
				<div class="return-form">
					<h2>Завершить поручение</h2>
					<label>Оставьте комментарий:</label>
					<textarea type="text" v-model="closeComment"/>
					<button @click="checkMission('Close')">Подтвердить</button>
					<button @click="finishMission = false">Закрыть</button>
				</div>
			</div>
			<button @click="returnMission = true">Вернуть на доработку</button>
			<div class="action-modal-wrap" v-show="returnMission">
				<div class="hover"></div>
				<div class="return-form">
					<h2>Вернуть поручение исполнителю:</h2>
					<label>Оставьте комментарий:</label>
					<textarea type="text" v-model="returnComment"/>
					<label>Выберете дату:</label>
					<input  required type="date" v-model="new_date">
					<button @click="checkMission('Return')">Подтвердить</button>
					<button @click="returnMission = false">Закрыть</button>
				</div>
			</div>
		</div>
		<div v-if="type === 'perform'">
			<button @click="performMission = true">Исполнить</button>
			<div class="action-modal-wrap" v-show="performMission">
				<div class="hover"></div>
				<div class="return-form">
					<h2>Исполнить поручение</h2>
					<label>Оставьте комментарий:</label>
					<textarea type="text" v-model="performComment"/>
					<button @click="execMission('Perform')">Подтвердить</button>
					<button @click="performMission = false">Закрыть</button>
				</div>
			</div>
			<button @click="redirectMission = true">Вернуть на доработку</button>
			<div class="action-modal-wrap" v-show="redirectMission">
				<div class="hover"></div>
				<div class="return-form">
					<h2>Вернуть поручение исполнителю:</h2>
					<label>Оставьте комментарий:</label>
					<textarea type="text" v-model="performComment"/>
					<button @click="execMission('Redirect')">Подтвердить</button>
					<button @click="redirectMission = false">Закрыть</button>
				</div>
			</div>
			<button @click="setComment = true">Комментарий</button>
			<div class="action-modal-wrap" v-show="setComment">
				<div class="hover"></div>
				<div class="return-form">
					<h2>Оставить комментарий</h2>
					<textarea type="text" v-model="performComment"/>
					<button @click="execMission('Save')">Сохранить</button>
					<button @click="setComment = false">Закрыть</button>
				</div>
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
	name: 'actionsWrap',
	props: ['checkedArr', 'type'],
	components: {
		myNotification
	},
	data: () => {
		return {
			not_text: '',
			not_color: '',
			is_not_show: false,
			becomeNewDate: false,
			returnMission: false,
			finishMission: false,
			performMission: false,
			redirectMission: false,
			setComment: false,
			performComment: '',
			closeComment: '',
			returnComment: '',
			new_date: Funcs.getTodayDateToInput()[2] + '-' + Funcs.getTodayDateToInput()[1] + '-' + Funcs.getTodayDateToInput()[0],

		}
	},
	methods: {
		closeMissions() {
			let data = new Array();
			for (let i in this.checkedArr) {
				let item = this.checkedArr[i];
				data.push({
					Action: 'Close',
					Control_GUID: item.Control_GUID
				});
			} 
			this.updateMissions(data, 'delete');
		},
		showNotification(text, color, callback) {
			this.not_text = text;
			this.not_color = color;
			this.is_not_show = true;
			setTimeout(() => {
				this.is_not_show = false;
				if (callback)
					callback()
			}, 1500);
		},
		changeNewDate() {
			let data = new Array();
			for (let i in this.checkedArr) {
				let item = this.checkedArr[i];
				data.push({
					Action: 'Put_off',
					Control_GUID: item.Control_GUID,
					New_date: this.new_date
				});
			} 
			this.updateMissions(data, 'change');
		},
		updateMissions(data, action = null) {
			Funcs.doRequest(
				'post',
				this.getLink,
				data,
				null,
				res => {
					if (!res.data.error) {
						this.checkedArr.forEach(v => {
							if (action === 'delete') {
								this.$store.dispatch('deleteMisTask');
							}
							if (action === 'change') {
								this.$store.dispatch('changeMisDate', {
									index: v.idx,
									date: this.new_date + 'T00:00:00'
								});
								this.becomeNewDate = false;
							}
						});
						this.showNotification('Успешно', 'green');
					} else {
						this.showNotification(res.data.report, 'red');
					}
				},
				() => { this.showNotification('Сервер временно недоступен', 'red') }
			);
		},
		checkMission (action) {
			let data = [];
			this.checkedArr.forEach(item => {
				if (action === 'Close') {
					data.push({
						Action: action,
						Task_GUID: item.Task_GUID,
						Comment: this.closeComment,
					});
				}
				if (action === 'Return') {
					if (this.returnComment == '') {
						this.showNotification('Необходимо оставить комментарий!', 'orange');
						return false;
					}
					data.push({
						Action: action,
						Task_GUID: item.Task_GUID,
						Comment: this.returnComment,
						New_date: this.new_date,
					});
				}
			});
			window.console.log(data);
			Funcs.doRequest(
					"post",
					this.getFinishLink,
					data,
					null,
					(res) => {
						if (!res.data.error) {
							if (action === 'Return') {
								this.returnMission = false;
							}
							this.checkedArr = [];
							this.showNotification('Успешно', 'green');
							window.location.reload();
						} else {
							this.showNotification(res.data.report, 'red');
						}
					}
			)
		},
		execMission (action) {
			let data = [];
			if (this.performComment == '') {
				this.showNotification('Необходимо оставить комментарий!', 'orange');
				return false;
			}
			this.checkedArr.forEach(item => {
				data.push({
					Action: action,
					Task_GUID: item.Task_GUID,
					Comment: this.performComment
				});
			});
			Funcs.doRequest(
				"post",
				this.getPerformLink,
				data,
				null,
				(res) => {
					if (!res.data.error) {
						this.checkedArr = [];
						this.showNotification('Успешно', 'green');
						window.location.reload();
					} else {
						this.showNotification(res.data.report, 'red');
					}
				}
			);
		}
	},
	computed: {
		getLink() {
			return this.$store.getters.getLinkByName('missions', 'updateControl');
		},
		getFinishLink() {
			return this.$store.getters.getLinkByName('missions', 'updateCheck');
		},
		getPerformLink() {
			return this.$store.getters.getLinkByName('missions', 'updatePerform');
		}
	}
}

</script>

<style lang="less">
	@import url('../../assets/less-templates/base.less');
	.actions-wrap {
		.flex(row, center, center);
		width: 100%;
		height: auto;
		padding: 10px 0;
		border-bottom: 1px solid #ccc;
		
		& .action-modal-wrap {
			.flex(column, flex-start, center);
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			height: 100vh;
			z-index: 10000;

			& .hover {
				position: absolute;
				top: 0;
				left: 0;
				background: #000;
				opacity: .7;
				width: 100%;
				height: 100vh;
				z-index: 1;
			}

			& .date-form {
				.flex(row, center, center);
				flex-wrap: wrap;
				width: 80%;
				height: 200px;
				margin-top: 50px;
				background: #fff;
				z-index: 2;

				& h2 {
					font-size: 1.2em;
					margin-bottom: 20px;
				}

				& input {
					.input();
					width: 80%;
					margin-bottom: 20px;
				}

				& button:last-child {
					.button(5px, #fff, @green-color);
				}
			}

			& .return-form {
				.flex(row, center, center);
				flex-wrap: wrap;
				width: 80%;
				height: 300px;
				margin-top: 50px;
				background: #fff;
				z-index: 2;

				& h2 {
					font-size: 1.2em;
					margin-bottom: 20px;
				}

				& input {
					.input();
					width: 80%;
					margin-bottom: 20px;
				}

				& textarea {
					.input();
					width: 80%;
					height: 70px;
					padding: 10px;
				}

				& button:last-child {
					.button(5px, #fff, @green-color);
				}
			}
		}

		& button {
			.button(5px, @green-color, #fff);
			margin: 5px;
		}
		& button:nth-child(2) {
			.button(5px, #fff, @green-color);
		}
	}	
</style>