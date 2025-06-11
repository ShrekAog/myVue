import { createStore } from 'vuex';
import createPersistedState from 'vuex-persistedstate'
import {parseUserToken} from '@/api/api'
const modulesAState = {
		namespaced: true,
		state:{
			isLogin:false,
			token:'',
			routers:[],
			userType:0
		},
		mutations:{
			outLogin(state){
				state.isLogin = false;
				state.token = '';
				state.routers = [];
				state.userType = 0;
			},
			isLogin(state,payVal){
				state.isLogin = payVal;
			},
			isToken(state,payVal){
				state.token = payVal;
			},
			updateRouters(state,payVal){
				state.routers = payVal;
			},
			updateUserType(state,payVal){
				state.userType = payVal;
			}
		},
		actions:{
			
		}
	}
const store = createStore({
	modules:{
		user:modulesAState
	},
	plugins:[
		createPersistedState({
			key:'vuex',
			storage:window.localStorage
		})
	]
})

export default store;