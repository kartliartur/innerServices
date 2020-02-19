<template>
	<div class="actions-wrap">
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
	props: ['checkedArr'],
	components: {
		myNotification
	},
	data: () => {
		return {
			not_text: '',
			not_color: '',
			is_not_show: false,
			becomeNewDate: false,
			new_date: Funcs.getTodayDateToInput()[2] + '-' + Funcs.getTodayDateToInput()[1] + '-' + Funcs.getTodayDateToInput()[0]
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
			this.updateMissions(data);
		},
		showNotification(text, color) {
			this.not_text = text;
			this.not_color = color;
			this.is_not_show = true;
			setTimeout(() => {
				this.is_not_show = false;
				this.hideModal();
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
			this.updateMissions(data);
		},
		updateMissions(data) {
			Funcs.doRequest(
				'post',
				'https://erp.unlogic.ru/api/v1/top_managers_instructions/update_instruction',
				data,
				null,
				res => {
					window.console.log(res);
				},
				() => { this.showNotification('Сервер временно недоступен', 'red') }
			);			
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