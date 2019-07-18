import { colors } from '../constants';

class ColorWheel {
	constructor() {
		this.state = {
			colors: colors,
			current: 0
		};
		this.getColor = this.getColor.bind(this);
		this.getNextColor = this.getNextColor.bind(this);
		this.getColorsList = this.getColorsList.bind(this);
	}

	getColor(name) {
		const colors = Object.keys(this.state.colors);
		this.state = {
			...this.state,
			current: colors.indexOf(name)
		};
		return this.state.colors[name];
	}

	getNextColor() {
		const colors = Object.keys(this.state.colors);
		this.state = {
			...this.state,
			current: (this.state.current + 1) % colors.length
		};
		return this.state.colors[colors[this.state.current]];
	}

	getColorsList() {
		return Object.keys(this.state.colors);
	}
}

export default ColorWheel;
