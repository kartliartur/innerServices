<template>
	<div class="auth-window">
		<img src="../../assets/logo.png" alt="kartli" width="200px">
		<span>Для того, чтобы воспользоваться сервисом нажмите на кнопку</span>
		<form>
<!-- 			<input type="text" name="name" placeholder="Введите свое имя" v-model="name">
			<input type="password" name="password" placeholder="Введите пароль" v-model="password"> -->
<!-- 			<span class="alert"></span> -->
			<input type="submit" value="Войти" @click="login($event)">
		</form>
		<myNotification :text="not_text"
										:textColor="not_color"
										v-show="is_not_show"/>
	</div>
</template>

<script>
import axios from 'axios'
import Vue from 'vue'
import myNotification from '@/components/other/notification.vue'
//import Funcs from '@/assets/js-funcs/default-funcs.js'

Vue.use(axios)

export default {
	name: 'auth',
	components: {
		myNotification
	},
	data: function () {
		return {
			// name: new String(''),
			// password: new String(''),
			not_text: 'Hello world',
			not_color: '#000',
			is_not_show: false
		}
	},
	methods: {
		login(event) {
			event.preventDefault();
			const data = {
				session: 'i6d0b7y0twjsmq814b74dbocodp0qm7e'
			}
			axios
			.post(this.$store.getters.getLinkByName('auth','login'), data)
			.then(res => {
				window.console.log(res.data);
				if (!res.data.error) {
					if (res.data.data.Access_Groups == undefined || res.data.data.Access_Groups == null || res.data.data.Access_Groups.length == 0) {
						this.showNotification("У вас нет прав доступа", 'red');
					} else {
						localStorage.setItem('user', res.data.data.first_name + res.data.data.last_name);
						//localStorage.setItem('token', cooks);
						//localStorage.setItem('dept', res.data.data.Dept)
						let roles = [];
						for (let i in res.data.data.Access_Groups) {
							let item = res.data.data.Access_Groups[i];
							for (let j in this.$store.state.rolesLinks) {
								let role = this.$store.state.rolesLinks[j];
								window.console.log(item);
								if (item == role.name) {
									roles.push(item);
									break;
								}
							}
						}
						window.console.log(roles);
						if (roles.length === 0) {
							this.showNotification('Ваша роль отсутствует в системе', 'red');
						} else
							localStorage.setItem('role', roles);
						if (localStorage.getItem('token') != null) {
							this.$emit('loggedIn')
							if(this.$route.params.nextUrl != null){
								this.$router.push(this.$route.params.nextUrl)
							} else {
								this.$router.push('/tracking');
							}
						}
					}
				} else {
					this.showNotification(res.data.report, 'red');
				}
			})
			.catch(res => {
				if (res == 'Error: Request failed with status code 401') {
					this.showNotification('Пользователя не существует', 'red');
				} 
				if (res == 'Error: Request failed with status code 403') {
					this.showNotification('Недостаточно прав', 'red');
				} else {
					this.showNotification('Сервер временно недоступен', 'red');
				}
			});
		},
		showNotification(text, color) {
			this.not_text = text;
			this.not_color = color;
			this.is_not_show = true;
			setTimeout(() => {
				this.is_not_show = false;
			}, 1500);
		}
	}
}

</script>

<style lang="less">
	@import url('../../assets/less-templates/base.less');
	.auth-window {
		.flex(column, center, center);
		width: 100%;
		height: 100%;

		& form {
			.flex(column, flex-start, center);
			width: 250px;
			background: #fff;
			border-radius: 5px;
			box-shadow: 2px 2px 14px 2px rgba(0,0,0,.5);
			padding: 20px;
		}

		& span {
			width: 80%;
			padding-top: 20px;
			padding-bottom: 20px;
			text-align: center;
		}

		& input {
			.input();
			width: 80%;
			margin: 5px 0;
		}

		& input[type="submit"] {
			.button(5px, @green-color, #fff);
			width: auto;
		}
	}
</style>
