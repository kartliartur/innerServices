import axios from 'axios'
import Vue from 'vue'

Vue.use(axios)

export default {
	dateToInputs: (date) => {
		let day = date.getDate();
		let month = date.getMonth()+1;
		let year = date.getFullYear();
		let month_after = date.getMonth()+2;
		let month_before = date.getMonth();
		let before3day = date.setDate(date.getDate() - 3);
		before3day = date.getDate();
		if (day <= 3) month = month_before;
		if (month < 10) month = '0' + month;
		if (month_after < 10) month_after = '0' + month_after;
		if (month_before < 10) month_before = '0' + month_before;
		if (day < 10) day = '0' + day;
		if (before3day < 10) before3day = '0' + before3day;
		return [day, month, year, month_after, month_before, before3day];
	},
	dateToDef: (date) => {
		let year = date.substring(6,10);
		let month = date.substring(3, 5);
		let day = date.substring(0,2);
		return [year, month, day];
	},
	getCookie() {
		let cooks = document.cookie;
		const index = cooks.indexOf('passport_session_id=');
		if (index === -1) {
			cooks = null;
		} else {
			cooks = cooks.substring(index);
			cooks = cooks.replace('passport_session_id=', '');
		}
		return cooks;
	},
	getTodayDateToInput() {
		let today = new Date();
		return this.dateToInputs(today);
	},
	doRequest(type, url, data, params, success, error, preload = true) {
		let preloadScreen = document.getElementById('preload');
		if (preload)
			preloadScreen.setAttribute('style', 'display: flex;');

		axios({
			method: type,
			url: url,
			data: data,
			params: params,
			headers:
			{
				'Session': this.getCookie()
			}
		})
		.then(res => {
			success(res)
			setTimeout(function () {
				preloadScreen.removeAttribute('style');
			})
		})
		.catch(res => {
			if (res == 'Error: Request failed with status code 401') {
				localStorage.removeItem('token');
				localStorage.removeItem('user');
				localStorage.removeItem('role');
				window.location.reload();          
			} else
				error()
				setTimeout(function () {
					preloadScreen.removeAttribute('style');
				})		
		})
	},
	uniqueItem: (arr) => {
		let obj = {};
		return arr.filter(item => {
			var value = JSON.stringify(item);
			return !(value in obj) && (obj[value] = item);
		});
	},
}
