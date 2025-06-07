import { createStore } from 'vuex';
import createPersistedState from 'vuex-persistedstate'
const store = createStore({
	state:{
		isLogin:true
	},
	mutations:{
		isLogin(state,payVal){
			state.isLogin = payVal;
		}
	},
	plugins:[
		createPersistedState({
			key:'vuex',
			storage:window.localStorage
		})
	]
})

export default store;