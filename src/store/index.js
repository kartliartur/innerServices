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
						link: '/ecm/hs/tasks-Demo/create/control'
					},
					{
						name: 'updateControl',
						link: '/ecm/hs/tasks-Demo/update/control'
					},
					{
						name: 'get',
						link: '/ecm/hs/tasks-Demo/get/'
					},
					{
						name: 'performers',
						link: '/ecm/hs/tasks-Demo/get/performers'
					},
					{
						name: 'updateCheck',
						link: '/ecm/hs/tasks-Demo/update/check'
					}
				]
			},
			{
			name: 'logist',
				links: [
					{
						name: 'getTTNS',
						link: '/erp_base/hs/WaybillClient-Demo/get/Waybills'
					},
					{
						name: 'setStatus',
						link: '/erp_base/hs/WaybillClient-Demo/SetStatusTTN'
					}
				]
			},
			{
			name: 'security',
				links: [
					{
						name: 'getTasks',
						link: '/erp_base/hs/tasks-Demo/get/legalservice'
					},
					{
						name: 'approve',
						link: '/erp_base/hs/tasks-Demo/approve/legalservice'
					}	
				]
			},
			{
			name: 'sellers',
				links: [
					{
						name: 'getSellers',
						link: '/erp_base/hs/tasks-Demo/get/coordinator'
					},
					{
						name: 'approve',
						link: '/erp_base/hs/tasks-Demo/approve/coordinator'
					}
				]
			},
			{
			name: 'tracking',
				links: [
					{
						name: 'setStatus',
						link: '/erp_base/hs/WaybillClient-Demo/update/waybill'
					},
					{
						name: 'getTTNS',
						link: '/erp_base/hs/WaybillClient-Demo/get/waybills'
					}
				]
			},
			{
			name: 'dashboard',
				links: [
					{
						name: 'get',
						link: '/erp_base/hs/products-Demo/get/'
					},
					{
						name: 'fullList',
						link: '/erp_base/hs/products-Demo/get/full-list'
					}
				]
			},
			{
			name: 'auth',
				links: [
					{
						name: 'login',
						link: '/api/v1/auth/login'
					},
					{
						name: 'logout',
						link: '/api/v1/auth/logout'
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
		statusTypes: ['Товар отгружен', 'Отменено', 'Товар получен'],
		base_url: 'https://erp.unlogic.ru',
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
							return state.base_url + item.link;
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
