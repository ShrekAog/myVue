import { createStore } from 'vuex';
import createPersistedState from 'vuex-persistedstate'
const modulesAState = {
		namespaced: true,
		state:{
			isLogin:false,
			token:'',
			routers:[],
			userType:0,
			id:0
		},
		mutations:{
			outLogin(state){
				state.isLogin = false;
				state.token = '';
				state.routers = [];
				state.userType = 0;
				state.id = 0;
			},
			login(state,payVal){
				state.isLogin = payVal.isLogin;
				state.token = payVal.token;
				state.routers = payVal.routers;
				state.userType = payVal.userType;
				state.id = payVal.id;
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
			},
			updateUserId(state,payVal){
				state.id = payVal;
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