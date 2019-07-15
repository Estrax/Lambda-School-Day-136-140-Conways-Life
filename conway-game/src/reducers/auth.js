import { actionTypes } from '../constants';

const {
	LOGIN_USER_START,
	LOGIN_USER_SUCCESS,
	LOGIN_USER_FAILURE,
	REGISTER_USER_START,
	REGISTER_USER_SUCCESS,
	REGISTER_USER_FAILURE,
	GET_CURRENT_USER_START,
	GET_CURRENT_USER_SUCCESS,
	GET_CURRENT_USER_FAILURE,
	LOGOUT_USER_START,
	LOGOUT_USER_SUCCESS,
	LOGOUT_USER_FAILURE
} = actionTypes;

const initialState = {
	token: localStorage.getItem('Authorization'),
	isFetching: false,
	currentUser: null,
	error: null
};

export default (state = initialState, action) => {
	switch (action.type) {
		case LOGIN_USER_START:
			return {
				...state,
				isFetching: true
			};

		case LOGIN_USER_SUCCESS:
			localStorage.setItem('Authorization', action.payload.token);
			return {
				...state,
				isFetching: false,
				token: localStorage.getItem('Authorization') || null
			};

		case LOGIN_USER_FAILURE:
			return {
				...state,
				isFetching: false,
				error: action.payload
			};

		case REGISTER_USER_START:
			return {
				...state,
				isFetching: true
			};

		case REGISTER_USER_SUCCESS:
			return {
				...state,
				isFetching: false
			};

		case REGISTER_USER_FAILURE:
			return {
				...state,
				isFetching: false,
				error: action.payload
			};

		case GET_CURRENT_USER_START:
			return {
				...state,
				isFetching: true
			};

		case GET_CURRENT_USER_SUCCESS:
			return {
				...state,
				isFetching: false,
				currentUser: action.payload
			};

		case GET_CURRENT_USER_FAILURE:
			return {
				...state,
				isFetching: false,
				error: action.payload
			};

		case LOGOUT_USER_START:
			return {
				...state
			};

		case LOGOUT_USER_SUCCESS:
			localStorage.removeItem('Authorization');
			return {
				...state,
				token: localStorage.getItem('Authorization') || null
			};

		case LOGOUT_USER_FAILURE:
			return {
				...state,
				error: action.payload
			};

		default:
			return state;
	}
};
