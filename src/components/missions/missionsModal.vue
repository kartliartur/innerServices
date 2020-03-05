<template>
	<div class="modal-wrap" :class="{ active: isOpen }">
		<div class="hover"></div>
		<div class="modal-frame">
			<h2>Поручение</h2>
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
			<input
					type="text"
					placeholder="Кому"
					@input="searchPerformer"
					v-model="this.employee"
					@focus="isFocus = true"
					@blur="isFocus = false"
			>
			<div class="hidden-list" :class="{ activeList: isFocus }" :style="this.styleList">
				<span v-for="(item, idx) in this.items" :key="idx" @click="selectEmployee(item)">
					{{ item.Performer_name }}
				</span>
			</div>
			<!--<input type="text" placeholder="От кого">-->
			<div class="btn-wrap">
				<button @click="addMission($event)">OK</button>
				<button @click="hideModal()">Отмена</button>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'missionsModal',
		data: () => {
			return {
				missionText: new String(''),
				isSend: false,
				limitDate: new String(''),
				employee: new String(''),
				performer: '',
				isFocus: false,
				items: [],
				styleList: ''
			}
		},
		props: ['isOpen', 'performers', 'roles'],
		methods: {
			hideModal() {
				this.$emit('toggleModal', false);
			},
			selectEmployee (item) {
				this.employee = item.Performer_name;
			},
			addMission(e) {
				e.preventDefault();
				let data = {
					title: this.missionText,
					employee: this.employee,
					limitDate: this.limitDate,
					createDate: new Date().getFullYear() + '-' + (new Date().getMonth()+1) + '-' + new Date().getDate(),
					isChecked: false
				}
				this.$store.commit('ADD_MISSION', data);
			},
			changePerformer(performer) {
				this.performer = performer;
				window.console.log(this.performer);
			},
			searchPerformer () {
				//window.console.log(this.performers);
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
					& input[type="checkbox"] {
						.kartli-check();
						width: 20px;
						height: 20px;
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
				top: 100%;
				left: 0;
				width: 100%;
				height: 0;
				border: 1px solid @green-color;
				background: #fafafa;
				z-index: -2;
				overflow: scroll;
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
		}
	}
	.active {
		z-index: 10000000;
		opacity: 1;
	}
</style>