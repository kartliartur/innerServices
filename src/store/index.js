import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		fullName: localStorage.getItem('user'),
		role: new String(''),
		requestsLinks: [
			{
				name: 'missions',
				links: [
					{
						name: 'addMission',
						link: 'https://erp.unlogic.ru/ecm/hs/tasks/create/control'
					},
					{
						name: 'updateControl',
						link: 'https://erp.unlogic.ru/ecm/hs/tasks/update/control'
					},
					{
						name: 'get',
						link: 'https://erp.unlogic.ru/ecm/hs/tasks/get/'
					},		
					{
						name: 'performers',
						link: 'https://erp.unlogic.ru/ecm/hs/tasks/get/performers'
					}			
				]
			},
			{
				name: 'logist',
				links: [
					{
						name: 'getTTNS',
						link: 'https://erp.unlogic.ru/erp_local/hs/WaybillClient/get/Waybills'
					},
					{
						name: 'setStatus',
						link: 'https://erp.unlogic.ru/erp_local/hs/WaybillClient/SetStatusTTN'
					}	
				]
			},
			{
				name: 'security',
				links: [
					{
						name: 'getTasks',
						link: 'https://erp.unlogic.ru/erp_local/hs/tasks/get/legalservice'
					},
					{
						name: 'approve',
						link: 'https://erp.unlogic.ru/erp_local/hs/tasks/approve/legalservice'
					}	
				]
			},
			{
				name: 'sellers',
				links: [
					{
						name: 'getSellers',
						link: 'https://erp.unlogic.ru/erp_local/hs/tasks/get/coordinator'
					},
					{
						name: 'approve',
						link: 'https://erp.unlogic.ru/erp_local/hs/tasks/approve/coordinator'
					}	
				]
			},
			{
				name: 'tracking',
				links: [
					{
						name: 'setStatus',
						link: 'https://erp.unlogic.ru/erp_local/hs/WaybillClient/update/waybill'
					},
					{
						name: 'getTTNS',
						link: 'https://erp.unlogic.ru/erp_local/hs/WaybillClient/get/waybills'
					}	
				]
			},
			{
				name: 'dashboard',
				links: [
					{
						name: 'get',
						link: 'https://erp.unlogic.ru/erp_local/hs/products/get/'
					},
					{
						name: 'fullList',
						link: 'https://erp.unlogic.ru/erp_local/hs/products/get/full-list'
					}	
				]
			},	
			{
				name: 'auth',
				links: [
					{
						name: 'login',
						link: 'https://erp.unlogic.ru/api/v1/auth/login'
					},
					{
						name: 'logout',
						link: 'https://erp.unlogic.ru/api/v1/auth/logout'
					}
				]
			}		
		],
		activeTtnIndex: null,
		activeSaleIndex: null,
		activeTaskIndex: null,
		activeMissionIndex: null,
		rolesLinks: [
			{
				name: 'Руководитель отдела',
				links: [
					{
						link: '/sellers',
						name: 'Согласование задач'
					},
					{
						link: '/missions',
						name: 'Контроль исполнительской дисциплины'
					}
				]
			},
			{
				name: 'Администратор',
				links: [
					{
						link: '/missions',
						name: 'Контроль исполнительской дисциплины'
					},
					{
						link: '/dashboard',
						name: 'Дэшбоард'
					}
				]
			},
			{
				name: 'Юрист (служба безопасности)',
				links: [
					{
						link: '/security',
						name: 'Согласование задач безопасности'
					}
				]
			},
			{
				name: 'Логисты',
				links: [
					{
						link: '/logist',
						name: 'Изменение статуса ТТН'
					},
					{
						link: '/tracking',
						name: 'Оформление остлеживания ТТН'
					}
				]
			}
		],
		ttns: [],
		sales: [],
		missions: [],
		missionPerformers: [],
		tasks: [],
		statusTypes: ['Товар отгружен', 'Отменено', 'Товар получен']
	},
	getters: {
		getTtns: state => state.ttns,
		getRoleLinks: state => state.rolesLinks,
		getLinkByName: state => (name,surname) => {
			for (let i in state.requestsLinks) {
				if (state.requestsLinks[i].name === name) {
					for (let j in state.requestsLinks[i].links) {
						let item = state.requestsLinks[i].links[j];
						if (item.name === surname)
							return item.link;
					}
				}
			}
		}
	},
	mutations: {
		CHANGE_ACTIVE_TTN_INDEX: (state, active) => state.activeTtnIndex = active,
		CHANGE_ACTIVE_TASK_INDEX: (state, active) => state.activeTaskIndex = active,
		CHANGE_ACTIVE_SALE_INDEX: (state, active) => state.activeSaleIndex = active,
		CHANGE_ACTIVE_MISSION_INDEX: (state, active) => state.activeMissionIndex = active,
		ADD_MISSION: (state, data) => state.missions.push(data),
		DELETE_TASK: (state, index) => state.sales.splice(index, 1),
		DELETE_SEC_TASK: (state, index) => state.tasks.splice(index, 1),
		DELETE_MIS_TASK: (state) => state.missions.forEach((v, i, a) => {
			if (v.isChecked === true) {
				a.splice(i, 1);
			}
		}),
		CHANGE_MIS_DATE: (state, item) => state.missions[item.index].Deadline = item.date
	},
	actions: {
		changeActiveTtnIndex: (context, active) => context.commit('CHANGE_ACTIVE_TTN_INDEX', +active),
		changeActiveSaleIndex: (context, active) => context.commit('CHANGE_ACTIVE_SALE_INDEX', +active),
		changeActiveMissionIndex: (context, active) => context.commit('CHANGE_ACTIVE_MISSION_INDEX', +active),
		deleteTask: (context, index) => context.commit('DELETE_TASK', +index),
		deleteSecTask: (context, index) => context.commit('DELETE_SEC_TASK', +index),
		deleteMisTask: (context) => context.commit('DELETE_MIS_TASK'),
		changeMisDate: (context, item) => context.commit('CHANGE_MIS_DATE', item),
	},
	modules: {
	}
})
