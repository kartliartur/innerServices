<template>
	<div class="modal-wrap" :class="{ active: isOpen }">
		<div class="hover"></div>
		<div class="modal-frame">
			<h2 class="title">Поручение</h2>
			<textarea placeholder="Что сделать?"
						v-model="missionText"/>
			<div class="btn-wrap">
				<div class="check-for-send">
					<span>Отправить задание:</span>
					<input type="checkbox" 
							v-model="isSend"/>
				</div>
				<div class="date">
					<span>Срок:</span>
					<input type="date" 
					v-model="limitDate"/>
				</div>
			</div>
			<div class="select-performer">
				<label>Назначить на:</label>
				<div class="performer">
					<label><input type="radio" class="radio" name="performer" @click="changePerformer('performer')"/>Исполнителя</label>
					<label><input type="radio" class="radio" name="performer" @click="changePerformer('role')"/>Роль</label>
				</div>
			</div>
			<div class="search">
				<input
						type="text"
						placeholder="Кому"
						@input="searchPerformer"
						v-model="employee"
						@focus="isFocus = true"
						@blur="isFocus = false"
				>
				<div class="hidden-list" :class="{ activeList: isFocus }" :style="isFocus ? this.styleList: ''">
				<span v-for="(item, idx) in this.items" :key="idx" @click="selectEmployee(item)">
					{{ item.Performer_name }}
				</span>
				</div>
			</div>
			<!--<input type="text" placeholder="От кого">-->
			<div class="btn-wrap">
				<button @click="addMission($event)">OK</button>
				<button @click="hideModal()">Отмена</button>
			</div>
			<myNotification
				:text="not_text"
				:textColor="not_color"
				v-show="is_not_show"/>
		</div>
	</div>
</template>

<script>	

	import myNotification from '@/components/other/notification.vue'
	import Funcs from '../../assets/js-funcs/default-funcs'
	export default {
		name: 'missionsModal',
		components: {
			myNotification
		},
		data: () => {
			return {
				missionText: new String(''),
				isSend: false,
				limitDate: new String(''),
				employee: '',
				performer: '',
				isFocus: false,
				items: [],
				styleList: '',
				Performer_GUID: '',
				not_text: '',
				not_color: '',
				is_not_show: false
			}
		},
		props: ['isOpen', 'performers', 'roles'],
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
				}, 1500);
			},
			selectEmployee (item) {
				this.employee = item.Performer_name;
				this.Performer_GUID = item.Performer_GUID;
			},
			addMission(e) {
				e.preventDefault();
				let data = {
					Description: this.missionText,
					Performer_name: this.employee,
					Performer: this.employee,
					Performer_GUID: this.Performer_GUID,
					Deadline: this.limitDate,
					SendTask: this.isSend,
					Controler_GUID: "",
					createDate: new Date().getFullYear() + '-' + (new Date().getMonth()+1) + '-' + new Date().getDate(),
					isChecked: false
				}
				Funcs.doRequest(
						"post",
						this.$store.getters.getLinkByName('missions', 'addMission'),
						data,
						null,
						(res) => {
							if (!res.error) {
								data.Control_GUID = res.data.data;
								data.isVissible = true;
								this.$store.commit('ADD_MISSION', data);
								this.showNotification('Успешно', 'green');
							}
						}
				);

			},
			changePerformer(performer) {
				this.performer = performer;
				window.console.log(this.performer);
			},
			searchPerformer () {
				if (this.employee && this.employee !== '' && this.employee !== undefined) {
					if (this.performer == 'role') {
						this.items = this.roles.filter(e => {
							return e.Performer_name.includes(this.employee)
						});
					} else {
						this.items = this.performers.filter(e => {
							return e.Performer_name.includes(this.employee)
						});
					}
					if (this.items.length === 0) {
						this.items = "";
						this.styleList = 'height: 0; border: unset;';
					}
					if (this.items.length <= 2) {
						this.styleList = "height: " + 28 * this.items.length + "px;"
					}
					if (this.items.length >= 3) {
						this.styleList = "height: 84px;"
					}
				} else {
					this.items = this.performer === 'role' ? this.roles : this.performers;
					this.styleList = "height: 84px;"
				}
			}
		},
		mounted() {
			this.items = this.performer === 'role' ? this.roles : this.performers;
			if (this.items.length <= 3) {
				this.styleList = "height: " + 28 * this.items.length + "px;";
			} else {
				this.styleList = "height: 84px;";
			}
		},
		beforeMount() {
			let date = new Date();
			date.setDate(date.getDate()+7);
			this.limitDate = Funcs.dateToInputs(date)[2] + '-'
							+ Funcs.dateToInputs(date)[1] + '-'
							+ Funcs.dateToInputs(date)[0];
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
			position: absolute;
			width: 100%;
			top: 0%;
			left: 0%;
			height: 100vh;
			padding: 10px;
			border-radius: 2px;
			background: @green-color;
			color: #fff;

			& input[type="checkbox"], input[type="radio"] {
				.kartli-check();
				width: 20px;
				height: 20px;
			}

			& h2.title {
				width: 100%;
				padding: 10px 0;
				text-align: left;		
				font-size: 1.2em;	
				border-bottom: 1px solid #eee;
				margin-bottom: 10px;
			}

			& .select-performer {
				.flex(column, center, cetner);
				width: 100%;
				& label {
					text-align: center;
					padding: 10px 0;
				}
				& .performer {
					.flex(row, center, center);
					& input {
						margin: auto 10px;
					}
				}
			}
			
			& textarea, input {
				.input();
				width: 100%;
				padding: 10px;
			}

			& textarea {
				width: 100%;
				height: 100px;
				padding: 10px;
			}

			& .btn-wrap {
				.flex(row, center, center);
				flex-wrap: wrap;
				width: 100%;
				padding: 10px 0;
				& div {
					.flex(row, flex-start, center);
					width: 100%;
					margin: 10px auto;
					& span {
						text-align: left;
					}
					& input {
						width: 60%;
						margin: 0 auto;
					}
				}
				& button {
					.button(5px, @green-color, #fff);
					margin: 10px;
				}

				& button:last-child {
					.button(5px, #fff, @green-color);
				}
			}
			& .hidden-list {
				.flex(column, flex-start, center);
				top: 99%;
				left: 0;
				width: 100%;
				height: 0;
				border: 1px solid @green-color;
				background: #fafafa;
				z-index: -2;
				overflow-y: scroll;
				overflow-x: visible;
				transition: height .3s linear;

				& span {
					.flex(row, flex-start, center);
					width: 100%;
					color: #000;
					border-bottom: 1px solid @green-color;
					padding: 5px 10px;
					margin: 0px 0px;
				}
			}
			& .activeList {
				height: 84px;
				z-index: 999;

				& span {
					color: #000;
				}
			}
			& .search {
				width: 100%;
			}
		}
	}
	.active {
		z-index: 10000000;
		opacity: 1;
	}
</style>