<template>
	<div class="filter-wrap">
		<button @click="openModal()">Создать</button>
		<select v-model="filterValue" @change="filterMissions()">
			<option value="Все">Все</option>
			<option value="Истекает срок">Истекает срок</option>
			<option value="Просрочено">Просрочено</option>
		</select>
	</div>
</template>

<script>
	
export default {
	name: 'missionsFilter',
	props: ['isOpen'],
	data: () => {
		return {
			filterValue: 'Все'
		}
	},
	methods: {
		openModal() {
			this.$emit('toggleModal', true);
		},
		filterMissions() {
			for (let i in this.$store.state.missions) {
				let item = this.$store.state.missions[i];
				if (this.filterValue === 'Все') {
					item.isVissible = true;
				} else if (this.filterValue === 'Истекает срок') {
					let today = new Date();
					if ((new Date(item.Deadline) - today)/(3600000*24) < 7 && (new Date(item.Deadline) - today)/(3600000*24) >= 0) {
						item.isVissible = true;
					} else {
						item.isVissible = false;
					}
				} else {
					let today = new Date();
					if ((new Date(item.Deadline) - today)/(3600000*24) < 0) {
						item.isVissible = true;
					} else {
						item.isVissible = false;
					}
				}
			}
		}
	}
}

</script>

<style lang="less">
	@import url('../../assets/less-templates/base.less');
	.filter-wrap {
		.flex(row, center, center);
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

		& button {
			.button(5px, @green-color, #fff);
			margin: 0 10px;
		}

		& select {
			.input();
		}
	}
</style>