<template>
	<div class="auth-window">
		<img src="../../assets/logo.png" alt="kartli" width="200px">
		<span>Для того, чтобы воспользоваться сервисом введите свое имя и пароль</span>
		<form>
			<input type="text" name="name" placeholder="Введите свое имя" v-model="name">
			<input type="password" name="password" placeholder="Введите пароль" v-model="password">
			<span class="alert"></span>
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

Vue.use(axios)

export default {
	name: 'auth',
	components: {
		myNotification
	},
	data: function () {
		return {
			name: new String(''),
			password: new String(''),
			not_text: 'Hello world',
			not_color: '#000',
			is_not_show: false
		}
	},
	methods: {
		login(event) {
			event.preventDefault();
			let data = {
				username: this.name,
				password: this.password
			}
			if (this.name.length > 0 && this.password.length > 0) {
				axios
				.post('https://erp.unlogic.ru/api/v1/auth/login', data)
				.then(res => {
					if (!res.data.error) {
						localStorage.setItem('user', res.data.data.name);
						localStorage.setItem('token', res.data.data.token);
						localStorage.setItem('role', res.data.data.PerformerRoles);
						if (localStorage.getItem('token') != null) {
							this.$emit('loggedIn')
							if(this.$route.params.nextUrl != null){
								this.$router.push(this.$route.params.nextUrl)
							} else {
								this.$router.push('/logist');
							}
						}
					} else {
						this.showNotification(res.data.data, 'red');
					}
				})
				.catch(res => {
					window.console.log(res);
				});
			}
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
