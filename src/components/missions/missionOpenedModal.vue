<template>
	<div class="modal-wrap" :class="{ active: isOpen }">
		<div class="hover"></div>
		<div class="modal-frame">
			<h2 class="title">Поручение</h2>
			<span class="desc">Описание: {{ isActiveIndex.Description }}</span>
			<span>Исполнитель: {{ isActiveIndex.Performer }}</span>
			<span>Срок: {{ isActiveIndex.Deadline || 'Отсутствует' }}</span>
			<div class="btn-wrap">
				<button @click="hideModal()">Закрыть</button>
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
				employee: new String('')
			}
		},
		props: ['isOpen'],
		methods: {
			hideModal() {
				this.$emit('toggleModal', false);
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
			}
		},
		computed: {
			isActiveIndex() {
				if (this.$store.state.activeMissionIndex != null) {
					return this.$store.state.missions[this.$store.state.activeMissionIndex];
				}
				if (this.$store.state.activeMissionCheckIndex != null) {
					return this.$store.state.missionsCheck[this.$store.state.activeMissionCheckIndex];
				}
				if (this.$store.state.activeMissionPerformIndex != null) {
					return this.$store.state.missionsPerform[this.$store.state.activeMissionPerformIndex];
				}

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
			.flex(column, flex-start, flex-start);
			position: absolute;
			width: 100%;
			top: 0%;
			left: 0%;
			height: 100vh;
			padding: 10px;
			border-radius: 2px;
			background: @green-color;
			color: #fff;

			& h2.title {
				width: 100%;
				padding: 10px 0;
				text-align: left;		
				font-size: 1.2em;	
				border-bottom: 1px solid #eee;
				margin-bottom: 10px;
			}
			
			& span {
				color: #fff;
				margin: 10px 0;
			}

			& .desc {
				white-space: pre-wrap;
				text-align: left;
				padding-left: 10px;
				border-left: 1px solid #fff;
			}

			& .btn-wrap {
				.flex(row, center, center);
				flex-wrap: wrap;
				width: 100%;
				padding: 10px 0;
				& div {
					.flex(row, space-between, center);
					width: 100%;
					margin: 10px auto;
					& span {
						text-align: left;
					}
					& input {
						width: 60%;
						margin: 0;
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
		}
	}
	.active {
		z-index: 10000000;
		opacity: 1;
	}
</style>