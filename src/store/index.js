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
		rolesLinks: [
			{
				name: 'Руководитель отдела',
				links: [
					{
						link: '/sellers',
						name: 'Страница продаж'
					},
					{
						link: '/missions',
						name: 'Страница поручений'
					}
				]
			},
			{
				name: 'Юридическая служба (СБ)',
				links: [
					{
						link: '/security',
						name: 'Страница задач'
					}
				]
			},
			{
				name: 'Логист',
				links: [
					{
						link: '/logist',
						name: 'Страница ттн'
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
	},
	mutations: {
		CHANGE_ACTIVE_TTN_INDEX: (state, active) => state.activeTtnIndex = active,
		CHANGE_ACTIVE_TASK_INDEX: (state, active) => state.activeTaskIndex = active,
		CHANGE_ACTIVE_SALE_INDEX: (state, active) => state.activeSaleIndex = active,
		ADD_MISSION: (state, data) => state.missions.push(data)
	},
	actions: {
		changeActiveTtnIndex: (context, active) => context.commit('CHANGE_ACTIVE_TTN_INDEX', +active),
		changeActiveSaleIndex: (context, active) => context.commit('CHANGE_ACTIVE_SALE_INDEX', +active)
	},
	modules: {
	}
})
