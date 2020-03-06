import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		fullName: localStorage.getItem('user'),
		role: new String(''),
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
						name: 'Согласование задач'
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
		statusTypes: ['Без статуса', 'Товар отгружен', 'Отменено', 'Товар получен']
	},
	getters: {
		getTtns: state => state.ttns,
		getRoleLinks: state => state.rolesLinks
	},
	mutations: {
		CHANGE_ACTIVE_TTN_INDEX: (state, active) => state.activeTtnIndex = active,
		CHANGE_ACTIVE_TASK_INDEX: (state, active) => state.activeTaskIndex = active,
		CHANGE_ACTIVE_SALE_INDEX: (state, active) => state.activeSaleIndex = active,
		CHANGE_ACTIVE_MISSION_INDEX: (state, active) => state.activeMissionIndex = active,
		ADD_MISSION: (state, data) => state.missions.push(data),
		DELETE_TASK: (state, index) => state.sales.splice(index, 1),
		DELETE_SEC_TASK: (state, index) => state.tasks.splice(index, 1),
		DELETE_MIS_TASK: (state, index) => state.missions.splice(index, 1),
		CHANGE_MIS_DATE: (state, item) => state.missions[item.index].Deadline = item.date,
	},
	actions: {
		changeActiveTtnIndex: (context, active) => context.commit('CHANGE_ACTIVE_TTN_INDEX', +active),
		changeActiveSaleIndex: (context, active) => context.commit('CHANGE_ACTIVE_SALE_INDEX', +active),
		changeActiveMissionIndex: (context, active) => context.commit('CHANGE_ACTIVE_MISSION_INDEX', +active),
		deleteTask: (context, index) => context.commit('DELETE_TASK', +index),
		deleteSecTask: (context, index) => context.commit('DELETE_SEC_TASK', +index),
		deleteMisTask: (context, index) => context.commit('DELETE_MIS_TASK', +index),
		changeMisDate: (context, item) => context.commit('CHANGE_MIS_DATE', item),
	},
	modules: {
	}
})
