<template>
	<div class="header-bar">
		<span class="name">{{ name }}</span>
		<div class="menu" @click="isMenuVissible=!isMenuVissible; isClose=!isClose;" :class="{ close: isClose }"></div>
		<transition name="slide-fade">
			<div class="hidden-list" v-show="isMenuVissible">
				<a v-for="(item, idx) in this.links" :key="idx"
					:href="item.link">
					{{ item.name }}
				</a>
				<a @click="logout()" href="/">Выйти</a>
			</div>
		</transition>
	</div>
</template>

<script>
import Funcs from '../../assets/js-funcs/default-funcs.js'

	export default {
		name: 'myHeader',
		data: function () {
			return {
				name: localStorage.getItem('user'),
				isMenuVissible: false,
				isClose: false,
				links: new Array()
			}
		},
		methods: {
			logout() {
				Funcs.doRequest(
					'get',
					'https://erp.unlogic.ru/api/v1/auth/logout',
					null, 
					null,
					res => {		
						window.console.log(res)	
					},
					res => { window.console.log(res) }
				);
				setTimeout(() => {
					localStorage.removeItem('token');
					localStorage.removeItem('user');
					localStorage.removeItem('role');
					this.$router.push({ path: '/' });	
				});
			}
		},
		beforeMount() {
			let role = localStorage.getItem('role').split(',');
			for (let i = 0; i < this.$store.state.rolesLinks.length; i++) {
				let item = this.$store.state.rolesLinks[i];
				for (let j in role) {
					if (role[j] == item.name) {
						for (let k in item.links) {
							this.links.push(item.links[k]);
						}
					}
				}
			}
			window.console.log(this.links);
		}
	}
</script>

<style lang="less">
	@import url('../../assets/less-templates/base.less');
	.header-bar {
		.flex(row, space-between, center);
		width: 100%;
		padding: 10px;
		background: @green-color;
		color: #fff;

		& .menu {
			position: relative;
			width: 20px;
			height: 10px;
			z-index: 1000;

			&:after, &:before {
				position: absolute;
				content: '';
				top: 0;
				left: 0;
				width: 100%;
				height: 2px;
				background: #fff;
				transition: all .2s linear;
			}

			&:before {
				top: 6px;
			}
		}

		& .close {
			&:after {
				transform: rotate(45deg);
			}
			&:before {
				top: 0px;
				transform: rotate(-45deg);
			}
		}

		& .name {
			z-index: 1000;
		}

		& .hidden-list {
			.flex(column, center, center);
			position: absolute;
			top: 35px;
			right: 0;
			width: 100%;
			height: 200px;
			border-top: 1px solid #fff;
			background: @green-color;
			z-index: 999;

			& a {
				color: #fff;
				text-decoration: none;
				padding: 5px 0;
				margin: 5px 0;
				border-bottom: 1px solid #fff;
			}
		}

		& button {
			.button(5px, #fff, @green-color);
		}
	}

	.slide-fade-enter-active, .slide-fade-leave-active {
		transition: all .5s;
	}
	.slide-fade-enter, .slide-fade-leave-to /* .fade-leave-active до версии 2.1.8 */ {
		opacity: 0;
	}

</style>
