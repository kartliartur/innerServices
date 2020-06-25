<template>
	<div class="filter-wrap">
		<h2>Фильтр</h2>
		<form>
			<input type="text" name="context_search" autocomplete="off"
					@focus="isFocus = true"
					@blur="isFocus = false"
					v-model="searchValue">
			<div class="hidden-list" :class="{ active: isFocus }">
				<span
					v-for="(item, idx) in $store.state.statusTypes" :key="idx"
					@click="searchValue=item">
					{{ item }}
				</span>
			</div>
			<input type="date" class="date_first" v-model="dateFirst">
			<input type="date" class="date_last" v-model="dateLast">
			<div class="btn-wrap">
				<button @click="search($event)">Найти</button>
			</div>
		</form>
	</div>
</template>

<script>
import Funcs from '../../assets/js-funcs/default-funcs.js'

export default {
	name: 'filterWrap',
	data: function() {
		return {
			isFocus: false,
			searchValue: new String(''),
			dateFirst: new String(''),
			dateLast: new String('')
		}
	},
	methods: {
		search(e) {
			e.preventDefault();
			for (let i = 0; i < this.$store.state.ttns.length; i++) {
				//const a = 0;
				if (this.searchValue != '') {
					const ttndate = this.$store.state.ttns[i].TTN_Date;
					const date = Funcs.dateToDef(ttndate);
					const checkerDate = new Date(date[0], date[1], date[2]);
					if (checkerDate <= new Date(this.dateLast) && checkerDate >= new Date(this.dateFirst)) {
						let k = 0;
						for (let prop in this.$store.state.ttns[i]) {
							if (prop.substr(0,2) != 'is') {
								if (String(this.$store.state.ttns[i][prop]).toUpperCase().indexOf(this.searchValue.toUpperCase()) !== -1)
									k++;
							}
						}
						if (k > 0) {
							this.$store.state.ttns[i].isVissible = true;
						}
						else
							this.$store.state.ttns[i].isVissible = false;
					} else {
						this.$store.state.ttns[i].isVissible = false;
					}
				} else {
					this.$store.state.ttns[i].isVissible = true;
				}
				this.$store.state.ttns[i].isChecked = false;
			}
		}
	},
	beforeMount() {
		let val = Funcs.dateToInputs(new Date())[2] + '-'
				+ Funcs.dateToInputs(new Date())[1] + '-'
				+ Funcs.dateToInputs(new Date())[5];
		let val1 = Funcs.dateToInputs(new Date())[2] + '-'
				+ (Funcs.dateToInputs(new Date())[3]) + '-'
				+ Funcs.dateToInputs(new Date())[0];

		this.dateFirst = val;
		this.dateLast = val1;
	}
}

</script>

<style lang="less">
	@import url('../../assets/less-templates/base.less');
	.filter-wrap {
		.flex(row, space-between, center);
		flex-wrap: wrap;
		width: 100%;
		height: auto;
		padding: 10px 0;
		border-bottom: 1px solid #ccc;

		& h2 {
			width: 100%;
			text-align: center;
			font-size: 1.5em;
			padding: 10px 0;
		}

		& form {
			.flex(row, space-between, center);
			position: relative;
			flex-wrap: wrap;
			padding: 5px 10px;
			width: 100%;
			height: auto;

			& input {
				.input();
				margin: 5px 0;
				width: 45%;
			}

			& input[type="text"] {
				width: 100%;
			}

			.hidden-list {
				.flex(column, flex-start, center);
				position: absolute;
				top: 30%;
				left: 10px;
				width: calc(100% - 20px);
				height: 0;
				border: 1px solid @green-color;
				z-index: -2;
				transition: all .3s linear;

				& span {
					.flex(row, center, center);
					width: 100%;
					background: #fafafa;
					color: #000;
					height: 0;
					color: transparent;
					text-align: center;
					border-bottom: 1px solid @green-color;
					transition: height .3s linear;
				}
			}

			& .active {
				height: 80px;
				z-index: 99;
				& span {
					height: 27px;
					color: #000;
				}
			}

			& .btn-wrap {
				display: flex;
				justify-content: center;
				width: 100%;
				margin: 5px 0;
				& button {
					.button(5px, @green-color, #fff);
				}
			}	}

		}
</style>
