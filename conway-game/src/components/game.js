import React, { Component } from 'react';
import './game.css';
import { ColorWheel } from '../utils';

class Game extends Component {
	constructor(props) {
		super(props);
		this.state = {
			generation: 0,
			color: '',
			colors_available: [],
			stroke_color: '',
			simulating: false,
			dimensions: 0,
			size: 0,
			size_new: 20,
			grid: {},
			simulationSpeed: 0
		};
		this.cw = new ColorWheel();

		this.gridInit = this.gridInit.bind(this);
		this.gridDraw = this.gridDraw.bind(this);
		this.gridClear = this.gridClear.bind(this);
		this.cellClick = this.cellClick.bind(this);
		this.cellIsAlive = this.cellIsAlive.bind(this);
		this.cellGetFillingStyle = this.cellGetFillingStyle.bind(this);
		this.cellsUpdate = this.cellsUpdate.bind(this);
		this.cellColorUpdate = this.cellColorUpdate.bind(this);
		this.boardNext = this.boardNext.bind(this);
		this.neighboursCount = this.neighboursCount.bind(this);
		this.play = this.play.bind(this);
		this.stop = this.stop.bind(this);
		this.playStep = this.playStep.bind(this);
		this.boardRandomized = this.boardRandomized.bind(this);
		this.onChange = this.onChange.bind(this);
		this.onColorChange = this.onColorChange.bind(this);
		this.gridRerender = this.gridRerender.bind(this);
		this.gridUpdate = this.gridUpdate.bind(this);
		this.addFigure = this.addFigure.bind(this);
	}

	componentDidMount() {
		this.setState(
			{
				...this.state,
				colors_available: this.cw.getColorsList()
			},
			() => {
				const color = this.cw.getColor(this.state.colors_available[0]);
				const stroke_color = this.cw.getColor(
					this.state.colors_available[0]
				);
				const dimensions = 600;
				const size = 10;
				const simulationSpeed = 100;

				this.gridRerender(
					color,
					stroke_color,
					dimensions,
					size,
					simulationSpeed
				);
			}
		);
	}

	gridInit() {
		const grid = {};
		for (let i = 0; i < this.state.dimensions; i += this.state.size) {
			for (let j = 0; j < this.state.dimensions; j += this.state.size) {
				grid[`${i}_${j}`] = 'dead';
			}
		}
		this.setState(
			{
				...this.state,
				generation: 0,
				simulating: false,
				grid
			},
			() => {
				this.gridDraw();
			}
		);
	}

	gridDraw() {
		const grid = this.refs.grid;
		const context = grid.getContext('2d');
		context.strokeStyle = this.state.stroke_color;
		for (let i = 0; i <= this.state.dimensions; i += this.state.size) {
			context.beginPath();
			context.moveTo(i + 0.5, 0);
			context.lineTo(i + 0.5, this.state.dimensions);
			context.moveTo(0, i + 0.5);
			context.lineTo(this.state.dimensions, i + 0.5);
			context.stroke();
		}
	}

	gridClear() {
		const grid = this.refs.grid;
		const context = grid.getContext('2d');
		context.clearRect(0, 0, this.state.dimensions, this.state.dimensions);
		this.gridInit();
	}

	cellIsAlive(x, y) {
		return this.state.grid[`${x}_${y}`] === 'alive';
	}

	cellGetFillingStyle(x, y) {
		return this.cellIsAlive(x, y) ? '#fff' : this.state.color;
	}

	cellClick(e) {
		if (this.state.simulating) return null;
		const grid = this.refs.grid;
		const context = grid.getContext('2d');
		const rect = grid.getBoundingClientRect();
		const x =
			Math.floor((e.clientX - rect.left) / this.state.size) *
			this.state.size;
		const y =
			Math.floor((e.clientY - rect.top) / this.state.size) *
			this.state.size;
		context.fillStyle = this.cellGetFillingStyle(x, y);
		context.fillRect(
			x + 1,
			y + 1,
			this.state.size - 1,
			this.state.size - 1
		);

		const gridUpdated = this.state.grid;
		gridUpdated[`${x}_${y}`] =
			this.state.grid[`${x}_${y}`] === 'dead' ? 'alive' : 'dead';

		this.setState({
			...this.state,
			grid: gridUpdated
		});
	}

	cellsUpdate(step = undefined) {
		if (this.state.simulating) {
			setTimeout(() => {
				const newBoard = this.boardNext();
				this.setState(
					{
						...this.state,
						...newBoard,
						generation: this.state.generation + 1
					},
					() => requestAnimationFrame(this.cellsUpdate)
				);
			}, this.state.simulationSpeed);
		} else if (step === 1) {
			const newBoard = this.boardNext();
			this.setState({
				...this.state,
				...newBoard,
				generation: this.state.generation + 1
			});
		}
	}

	cellColorUpdate() {
		const grid = this.refs.grid;
		const context = grid.getContext('2d');
		context.fillStyle = this.state.color;
		for (let i = 0; i < this.state.dimensions; i += this.state.size) {
			for (let j = 0; j < this.state.dimensions; j += this.state.size) {
				if (this.state.grid[`${i}_${j}`] === 'alive') {
					context.fillRect(
						i + 1,
						j + 1,
						this.state.size - 1,
						this.state.size - 1
					);
				}
			}
		}
	}

	neighboursCount(x, y) {
		const neighbours = [
			`${x}_${y - this.state.size}`,
			`${x}_${y + this.state.size}`,
			`${x + this.state.size}_${y}`,
			`${x - this.state.size}_${y}`,
			`${x - this.state.size}_${y - this.state.size}`,
			`${x + this.state.size}_${y - this.state.size}`,
			`${x - this.state.size}_${y + this.state.size}`,
			`${x + this.state.size}_${y + this.state.size}`
		];
		return neighbours.reduce(
			(acc, elem) => (this.state.grid[elem] === 'alive' ? acc + 1 : acc),
			0
		);
	}

	boardNext() {
		const board = { ...this.state };
		const grid = this.refs.grid;
		const context = grid.getContext('2d');
		for (let i = 0; i < this.state.dimensions; i += this.state.size) {
			for (let j = 0; j < this.state.dimensions; j += this.state.size) {
				const livingNB = this.neighboursCount(i, j);
				if (
					this.state.grid[`${i}_${j}`] === 'alive' &&
					(livingNB > 3 || livingNB < 2)
				) {
					board.grid[`${i}_${j}`] = 'dead';
					context.fillStyle = '#fff';
					context.fillRect(
						i + 1,
						j + 1,
						this.state.size - 1,
						this.state.size - 1
					);
				} else if (
					this.state.grid[`${i}_${j}`] === 'dead' &&
					livingNB === 3
				) {
					board.grid[`${i}_${j}`] = 'alive';
					context.fillStyle = this.state.color;
					context.fillRect(
						i + 1,
						j + 1,
						this.state.size - 1,
						this.state.size - 1
					);
				}
			}
		}
		return board;
	}

	boardRandomized() {
		if (!this.state.simulating) {
			const board = { ...this.state };
			const grid = this.refs.grid;
			const context = grid.getContext('2d');
			for (let i = 0; i < this.state.dimensions; i += this.state.size) {
				for (
					let j = 0;
					j < this.state.dimensions;
					j += this.state.size
				) {
					const rnd = Math.random() * 10;
					board.grid[`${i}_${j}`] = rnd < 5 ? 'alive' : 'dead';
					context.fillStyle = rnd < 5 ? this.state.color : '#fff';
					context.fillRect(
						i + 1,
						j + 1,
						this.state.size - 1,
						this.state.size - 1
					);
				}
			}
			this.setState({
				...this.state,
				...board
			});
		}
	}

	onChange(e) {
		e.preventDefault();
		this.setState({
			...this.state,
			[e.target.name]: e.target.value
		});
	}

	onColorChange(e) {
		e.preventDefault();
		this.setState(
			{
				...this.state,
				[e.target.name]: this.cw.getColor(e.target.value)
			},
			() => this.cellColorUpdate()
		);
	}

	play() {
		if (!this.state.simulating) {
			this.setState({
				...this.state,
				simulating: true
			});
			requestAnimationFrame(this.cellsUpdate);
		}
	}

	playStep() {
		if (!this.state.simulating) {
			requestAnimationFrame(() => this.cellsUpdate(1));
		}
	}

	stop() {
		if (this.state.simulating) {
			this.setState({
				...this.state,
				simulating: false
			});
		}
	}

	gridRerender(color, stroke_color, dimensions, size, simulationSpeed) {
		const grid = {};
		for (let i = 0; i < Number(dimensions); i += Number(size)) {
			for (let j = 0; j < Number(dimensions); j += Number(size)) {
				grid[`${i}_${j}`] = 'dead';
			}
		}
		this.setState(
			{
				...this.state,
				color,
				stroke_color,
				dimensions: Number(dimensions),
				size: Number(size),
				simulationSpeed,
				grid
			},
			() => this.gridDraw()
		);
	}

	gridUpdate(e) {
		e.preventDefault();
		this.gridClear();
		this.gridRerender(
			this.state.color,
			this.state.stroke_color,
			this.state.dimensions,
			this.state.size_new,
			this.state.simulationSpeed
		);
	}

	addFigure(name, pos_x = undefined, pos_y = undefined) {
		if (this.state.running) return;
		const grid = this.refs.grid;
		const context = grid.getContext('2d');
		const rect = grid.getBoundingClientRect();
		let x;
		let y;
		if (pos_x === undefined || pos_y === undefined) {
			x =
				Math.floor(
					(Math.random() * this.state.dimensions - rect.left) /
						this.state.size
				) * this.state.size;
			y =
				Math.floor(
					(Math.random() * this.state.dimensions - rect.top) /
						this.state.size
				) * this.state.size;
		} else {
			x = pos_x;
			y = pos_y;
		}

		const newgrid = { ...this.state.grid };
		context.fillStyle = this.state.color;
		let cells = undefined;

		switch (name) {
			case 'glider':
				cells = [
					`${x - this.state.size}_${y - 2 * this.state.size}`,
					`${x}_${y - this.state.size}`,
					`${x}_${y}`,
					`${x - this.state.size}_${y}`,
					`${x - 2 * this.state.size}_${y}`
				];
				break;
			case 't':
				cells = [
					`${x}_${y}`,
					`${x - this.state.size}_${y}`,
					`${x + this.state.size}_${y}`,
					`${x}_${y + this.state.size}`,
					`${x}_${y + 2 * this.state.size}`,
					`${x}_${y + 3 * this.state.size}`
				];
				break;
			case 'arrow':
				cells = [
					`${x}_${y}`,
					`${x + this.state.size}_${y + this.state.size}`,
					`${x + 2 * this.state.size}_${y + 2 * this.state.size}`,
					`${x + this.state.size}_${y + 3 * this.state.size}`,
					`${x}_${y + 4 * this.state.size}`
				];
				break;
			case 'pulsar':
				cells = [
					`${x - 5 * this.state.size}_${y - 8 * this.state.size}`,
					`${x - 4 * this.state.size}_${y - 8 * this.state.size}`,
					`${x - 3 * this.state.size}_${y - 8 * this.state.size}`,
					`${x + this.state.size}_${y - 8 * this.state.size}`,
					`${x + 2 * this.state.size}_${y - 8 * this.state.size}`,
					`${x + 3 * this.state.size}_${y - 8 * this.state.size}`,
					`${x - 2 * this.state.size}_${y - 6 * this.state.size}`,
					`${x - 2 * this.state.size}_${y - 5 * this.state.size}`,
					`${x - 2 * this.state.size}_${y - 4 * this.state.size}`,
					`${x}_${y - 6 * this.state.size}`,
					`${x}_${y - 5 * this.state.size}`,
					`${x}_${y - 4 * this.state.size}`,
					`${x + this.state.size}_${y - 3 * this.state.size}`,
					`${x + 2 * this.state.size}_${y - 3 * this.state.size}`,
					`${x + 3 * this.state.size}_${y - 3 * this.state.size}`,
					`${x - 5 * this.state.size}_${y - 3 * this.state.size}`,
					`${x - 4 * this.state.size}_${y - 3 * this.state.size}`,
					`${x - 3 * this.state.size}_${y - 3 * this.state.size}`,
					`${x + 5 * this.state.size}_${y - 4 * this.state.size}`,
					`${x + 5 * this.state.size}_${y - 5 * this.state.size}`,
					`${x + 5 * this.state.size}_${y - 6 * this.state.size}`,
					`${x - 7 * this.state.size}_${y - 4 * this.state.size}`,
					`${x - 7 * this.state.size}_${y - 5 * this.state.size}`,
					`${x - 7 * this.state.size}_${y - 6 * this.state.size}`,
					`${x - 2 * this.state.size}_${y}`,
					`${x - 3 * this.state.size}_${y - this.state.size}`,
					`${x}_${y}`,
					`${x + this.state.size}_${y - this.state.size}`,
					`${x + 2 * this.state.size}_${y - this.state.size}`,
					`${x + 3 * this.state.size}_${y - this.state.size}`,
					`${x}_${y + this.state.size}`,
					`${x}_${y + 2 * this.state.size}`,
					`${x - 2 * this.state.size}_${y + this.state.size}`,
					`${x - 2 * this.state.size}_${y + 2 * this.state.size}`,
					`${x - 4 * this.state.size}_${y - this.state.size}`,
					`${x - 5 * this.state.size}_${y - this.state.size}`,
					`${x + 5 * this.state.size}_${y}`,
					`${x + 5 * this.state.size}_${y + this.state.size}`,
					`${x + 5 * this.state.size}_${y + 2 * this.state.size}`,
					`${x - 7 * this.state.size}_${y}`,
					`${x - 7 * this.state.size}_${y + this.state.size}`,
					`${x - 7 * this.state.size}_${y + 2 * this.state.size}`,
					`${x + this.state.size}_${y + 4 * this.state.size}`,
					`${x + 2 * this.state.size}_${y + 4 * this.state.size}`,
					`${x + 3 * this.state.size}_${y + 4 * this.state.size}`,
					`${x - 5 * this.state.size}_${y + 4 * this.state.size}`,
					`${x - 4 * this.state.size}_${y + 4 * this.state.size}`,
					`${x - 3 * this.state.size}_${y + 4 * this.state.size}`
				];
				break;
			default:
				cells = [
					`${x}_${y}`,
					`${x}_${y + this.state.size}`,
					`${x}_${y + 2 * this.state.size}`,
					`${x}_${y + 3 * this.state.size}`,
					`${x}_${y + 4 * this.state.size}`,
					`${x}_${y + 5 * this.state.size}`,
					`${x}_${y + 6 * this.state.size}`,
					`${x}_${y + 7 * this.state.size}`,
					`${x + this.state.size}_${y + 7 * this.state.size}`,
					`${x + 2 * this.state.size}_${y + 7 * this.state.size}`,
					`${x + 3 * this.state.size}_${y + 7 * this.state.size}`,
					`${x + 5 * this.state.size}_${y + 3 * this.state.size}`,
					`${x + 5 * this.state.size}_${y + 4 * this.state.size}`,
					`${x + 5 * this.state.size}_${y + 5 * this.state.size}`,
					`${x + 5 * this.state.size}_${y + 6 * this.state.size}`,
					`${x + 5 * this.state.size}_${y + 7 * this.state.size}`,
					`${x + 6 * this.state.size}_${y + 7 * this.state.size}`,
					`${x + 7 * this.state.size}_${y + 7 * this.state.size}`,
					`${x + 8 * this.state.size}_${y + 3 * this.state.size}`,
					`${x + 8 * this.state.size}_${y + 4 * this.state.size}`,
					`${x + 8 * this.state.size}_${y + 5 * this.state.size}`,
					`${x + 8 * this.state.size}_${y + 6 * this.state.size}`,
					`${x + 8 * this.state.size}_${y + 7 * this.state.size}`,
					`${x + 10 * this.state.size}_${y}`,
					`${x + 10 * this.state.size}_${y + this.state.size}`,
					`${x + 10 * this.state.size}_${y + 2 * this.state.size}`,
					`${x + 10 * this.state.size}_${y + 3 * this.state.size}`,
					`${x + 10 * this.state.size}_${y + 4 * this.state.size}`,
					`${x + 10 * this.state.size}_${y + 5 * this.state.size}`,
					`${x + 10 * this.state.size}_${y + 6 * this.state.size}`,
					`${x + 10 * this.state.size}_${y + 7 * this.state.size}`,
					`${x + 11 * this.state.size}_${y + 5 * this.state.size}`,
					`${x + 12 * this.state.size}_${y + 4 * this.state.size}`,
					`${x + 12 * this.state.size}_${y + 6 * this.state.size}`,
					`${x + 13 * this.state.size}_${y + 3 * this.state.size}`,
					`${x + 13 * this.state.size}_${y + 7 * this.state.size}`,
					`${x + 15 * this.state.size}_${y + 3 * this.state.size}`,
					`${x + 15 * this.state.size}_${y + 5 * this.state.size}`,
					`${x + 15 * this.state.size}_${y + 6 * this.state.size}`,
					`${x + 15 * this.state.size}_${y + 7 * this.state.size}`,
					`${x + 16 * this.state.size}_${y + 3 * this.state.size}`,
					`${x + 16 * this.state.size}_${y + 5 * this.state.size}`,
					`${x + 16 * this.state.size}_${y + 7 * this.state.size}`,
					`${x + 17 * this.state.size}_${y + 3 * this.state.size}`,
					`${x + 17 * this.state.size}_${y + 5 * this.state.size}`,
					`${x + 17 * this.state.size}_${y + 7 * this.state.size}`,
					`${x + 18 * this.state.size}_${y + 3 * this.state.size}`,
					`${x + 18 * this.state.size}_${y + 4 * this.state.size}`,
					`${x + 18 * this.state.size}_${y + 5 * this.state.size}`,
					`${x + 18 * this.state.size}_${y + 6 * this.state.size}`,
					`${x + 18 * this.state.size}_${y + 7 * this.state.size}`,
					`${x + 20 * this.state.size}_${y + 3 * this.state.size}`,
					`${x + 20 * this.state.size}_${y + 5 * this.state.size}`,
					`${x + 20 * this.state.size}_${y + 4 * this.state.size}`,
					`${x + 20 * this.state.size}_${y + 7 * this.state.size}`,
					`${x + 21 * this.state.size}_${y + 3 * this.state.size}`,
					`${x + 21 * this.state.size}_${y + 5 * this.state.size}`,
					`${x + 21 * this.state.size}_${y + 7 * this.state.size}`,
					`${x + 22 * this.state.size}_${y + 3 * this.state.size}`,
					`${x + 22 * this.state.size}_${y + 5 * this.state.size}`,
					`${x + 22 * this.state.size}_${y + 7 * this.state.size}`,
					`${x + 23 * this.state.size}_${y + 3 * this.state.size}`,
					`${x + 23 * this.state.size}_${y + 6 * this.state.size}`,
					`${x + 23 * this.state.size}_${y + 5 * this.state.size}`,
					`${x + 23 * this.state.size}_${y + 6 * this.state.size}`,
					`${x + 23 * this.state.size}_${y + 7 * this.state.size}`
				];
		}

		for (let elem in cells) {
			if (cells[elem] in newgrid) {
				newgrid[cells[elem]] = 'alive';
				const [p1, p2] = cells[elem].split('_');
				context.fillRect(
					Number(p1) + 1,
					Number(p2) + 1,
					this.state.size - 1,
					this.state.size - 1
				);
			}
		}
		this.setState({ ...this.state, grid: newgrid });
	}

	render() {
		return (
			<>
				<div className='panel'>
					<div className='presets'>
						<button
							onClick={() => this.addFigure('glider', 40, 40)}
						>
							ADD glider
						</button>
						<button onClick={() => this.addFigure('t', 80, 80)}>
							ADD t
						</button>
						<button
							onClick={() => this.addFigure('arrow', 200, 20)}
						>
							ADD arrow
						</button>
						<button
							onClick={() => this.addFigure('pulsar', 300, 300)}
						>
							ADD pulsar
						</button>
						<button onClick={() => this.addFigure('', 40, 440)}>
							ADD FIGURE
						</button>
					</div>
					<div className='controls'>
						<button onClick={this.gridClear}>CLEAR</button>
						<button onClick={this.play}>PLAY</button>
						<button onClick={this.stop}>STOP</button>
						<button onClick={this.playStep}>STEP</button>
						<button onClick={this.boardRandomized}>
							Randomize board
						</button>
					</div>
				</div>
				<h1 className='title text-center'>
					Generation: {this.state.generation}
				</h1>
				<div className='board'>
					<canvas
						ref='grid'
						onClick={this.cellClick}
						width={this.state.dimensions + 1}
						height={this.state.dimensions + 1}
					/>
				</div>
			</>
		);
	}
}

export default Game;
