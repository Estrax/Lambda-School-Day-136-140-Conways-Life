import { actionTypes } from '../constants';

const {} = actionTypes;

const initialState = {
	isFetching: false,
	error: null
};

export default (state = initialState, action) => {
	switch (action.type) {
		default:
			return state;
	}
};
