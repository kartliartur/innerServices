<template>
	<div class="filter-wrap">
		<button @click="openModal()">Создать</button>
		<select>
			<option value="0">Все</option>
			<option value="1">Истекает срок</option>
			<option value="2">Просрочено</option>
		</select>
	</div>
</template>

<script>
	
export default {
	name: 'missionsFilter',
	props: ['isOpen'],
	methods: {
		openModal() {
			this.$emit('toggleModal', true);
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