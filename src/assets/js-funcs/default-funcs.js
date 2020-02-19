import axios from 'axios'
import Vue from 'vue'

Vue.use(axios)

export default {
	dateToInputs: (date) => {
		let day = date.getDate();
		let month = date.getMonth()+1;
		let year = date.getFullYear();
		let month_after = date.getMonth()+2;
		if (month < 10) month = '0' + month;
		if (month_after < 10) month_after = '0' + month_after;
		if (day < 10) day = '0' + day;
		return [day, month, year, month_after];
	},
	dateToDef: (date) => {
		let year = date.substr(0, 4);
		let month = +date.substr(5, 2);
		let day = +date.substr(8,2);
		return [year, month-1, day];
	},
	getTodayDateToInput() {
		let today = new Date();
		return this.dateToInputs(today);
	},
	doRequest(type, url, data, params, success, error) {
		let preloadScreen = document.getElementById('preload');
		preloadScreen.setAttribute('style', 'display: flex;');
		axios({
			method: type,
			url: url,
			data: data,
			params: params,
			headers:
			{
				'Authorization': 'Token ' + localStorage.getItem('token')
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
	}
}
