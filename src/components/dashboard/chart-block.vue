<template>
	<div class="chart-wrap">
		<canvas :id="name" style="width: 100%; height: 100%;">
			
		</canvas>
	</div>
</template>

<script>
import Chart from 'chart.js'

export default {
	props: ['type', 'colors', 'labels', 'chartName', 'label', 'dataSet', 'name'],
	methods: {
	},
	mounted() {
		let ctx = document.getElementById(this.name);
		new Chart(ctx, {
			type: this.type,
			data: {
				labels: this.labels,
				datasets: [{
					label: this.label,
					data: this.dataSet,
					backgroundColor: this.colors,
					borderColor: this.colors,
					borderWidth: 1
				}]
			}
		});
	}
}

</script>

<style lang="less">
	@import url('../../assets/less-templates/base.less');
	.chart-wrap {
		.flex(column, flex-start, center);
		width: 100%;
		height: 600px;
		padding: 20px;
		background: #fff;
		border-radius: 5px;
		transition: all .3s linear;
		& h2 {
			width: 100%;
			text-align: left;
			padding: 10px;
			border-bottom: 1px solid #eee;
		}

		& canvas {
			z-index: 2;
		}

		& button {
			.button(5px, @green-color, #fff);
			height: auto;
			margin: 10px 0;
		}
	}

	.fullSize {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100vh;
		z-index: 100;
		opacity: 1;
		& canvas {
			position: absolute;
			opacity: 1;
		}

		& button {
			position: absolute;
			bottom: 0;
		}
	}

	@media screen and (max-width: 1000px) {
		.chart-wrap {
			width: 100%;
		}
	}
</style>