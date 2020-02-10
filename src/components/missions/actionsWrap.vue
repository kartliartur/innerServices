<template>
	<div class="actions-wrap">
		<button @click="closeMissions()">Снять с контроля</button>
		<button>Перенести срок</button>
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
			is_not_show: false
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
		& button {
			.button(5px, @green-color, #fff);
			margin: 5px;
		}
		& button:nth-child(2) {
			.button(5px, #fff, @green-color);
		}
	}	
</style>