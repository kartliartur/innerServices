<template>
	<div class="modal-wrap" :class="{ active: isOpen }">
		<div class="hover"></div>
		<div class="modal-frame">
			<h2>Поручение</h2>
			<span>Компания: {{ isActiveIndex.Partner }}</span>
			<span>ИНН: {{ isActiveIndex.INN }}</span>
			<span>Дата: {{ new Date(isActiveIndex.Deadline).toLocaleString().substring(0, 10) }}</span>
			<span class="desc">{{ isActiveIndex.Description }}</span>
			<textarea placeholder="Оставьте комментарий" v-model="comment"></textarea>
			<div class="btn-wrap">
				<button @click="finishTask()">Применить</button>
				<button @click="hideModal()">Закрыть</button>
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
		name: 'secModal',
		props: ['isOpen'],
		components: {
			myNotification
		},
		data: () => {
			return {
				comment: new String(),
				not_text: new String(),
				not_color: new String(),
				is_not_show: false
			}
		},
		computed: {
			isActiveIndex() {
				if (this.$store.state.activeTaskIndex != null && this.$store.state.tasks.length > 0) 
					return this.$store.state.tasks[this.$store.state.activeTaskIndex];
				else 
					return {
						Partner: 'Нет',
						INN: 'Нет',
						Author: 'Нет',
						Description: 'Нет',
						Deadline: new Date()
					}
			}
		},
		methods: {
			hideModal() {
				this.$emit('toggleModal', false);
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
			},
			finishTask() {
				let data = {
					id: this.$store.state.tasks[this.$store.state.activeTaskIndex].id,
					Comment: this.comment
				}
				Funcs.doRequest(
					'post',
					this.$store.getters.getLinkByName('security','approve'),
					data,
					null,
					res => {
						let color = 'red';
						if (!res.data.error) {
							color = 'green';
							//this.$store.state.tasks.splice(this.$store.state.activeTaskIndex, 1);
							this.$store.dispatch('deleteSecTask', this.$store.state.activeTaskIndex);
						}
						let message;
						if (res.data.data.length > 0 && res.data.report.length <= 0)
							message = res.data.data;
						else
							message = res.data.report;						
						this.showNotification(message, color, () => { this.hideModal(); });
					},
					() => { this.showNotification('Сервер временно недоступен', 'red') }
				)
			}
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
			.flex(column, flex-start, center);
			position: absolute;
			width: 100%;
			height: 100%;
			padding: 5px 10px;
			border-radius: 2px;
			background: @green-color;
			color: #fff;

			& h2 {
				text-align: left;
				border-bottom: 1px solid #fff;
				width: 100%;
				padding: 5px 0;
			}

			& span {
				padding: 10px 0;
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

			& textarea {
				.input();
				width: 100%;
				height: 100px;
				margin: 10px 0;
				padding: 10px;
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