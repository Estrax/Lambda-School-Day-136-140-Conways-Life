# Conway's Game of Life

What is a cellular automaton and how to code your first one with an example in JS (with a strong emphasis on readable and intuitive code).

## What is a cellular automaton and how does it work?

A cellular automaton consist of a sequence of cells, also called grid. Each cell has a state (`0/1` aka dead/alive) and can also contain some other properties (e.g. size, value, color, etc.). THe automaton's state changes over the time, with the new state of each cell being set based on the set of rules.

One of the most popular cellular automata is the [Game of Life](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life), that was created by John Horton Conway in 1970. It is a zero-player game, so it does not require any input further than initial state from user.

## A set of rules

The rules of `Life` are as follows:
1. No cells can come to life unless there are already at least two living cells in the entire grid.
2. A living cell can survive into the next generation by default.
3. If a living cell has less than two live neighbours, it dies due to **_underpopulation_**.
4. If a living cell has more than three live neighbours, it dies due to **_overpopulation_**.
5. A dead cell can spring to life only if it has exactly three live neighbours, due to **_reproduction_**.

Thus, to play, we need to put something called `seed`, so the set of initially living cells. Because of the nature of cellular automata, the results can be really complex, especially starting from the very simple seeds.

## Let's plan!

To be able to make this game real, we need to make a series of the decisions while designing and writing code, ranging from high-level decisions to the smaller (yet important) decisions that we make pretty much continuously. It includes things like what kind of variables do we plan to store, how do we call our methods, what is the responsibility of each method, etc. These decisions are often overlooked when working on software within a really tight deadline and they are one of the reasons why we see many people fail.

There are few main rules we need to follow:
1. SOLID principles
2. KISS rule
3. DRY principle

We need to come up with a plan of how to split down this problem into smaller ones, that we know how to solve. Let's list all the elements we need to cover:
- a grid
- a cell

Looks like it's a very easy problem to tackle. But are they all the things that we need to think about while writing the code for this game? What about things like the state of our cells that needs to be updated on click, or at least the state of the entire grid? How are we going to change the color of our cell? What if we want to randomize the grid before running the simulation?

Here's the final set of elements we need to take care of:
1. The initializer of an entire app that sets the default state.
2. The grid initializer.
3. A function drawing our grid.
4. A function clearing our grid.
5. A function changing the state of cell on click.
6. A function calculating the next state of an entire grid (new `generation`).
7. Functions to start and stop simulation, a function to simulate only one generation.
8. A function updating all cells
9. A function updating color of cells
10. A function checking the filling style of a cell
11. A function checking if cell is alive
12. A function counting the number of alive neighbours
13. A function randomizing our board.
14. A function rendering the grid.
15. A function updating the grid.

### 1. The initializer of an entire app

First of all, we need to make the way to have our game initialized. For example, if we use `class`es, we can use a `constructor` or make another method to do that.

We set up all of our properties there and assign them their default values.
The list of properties we should consider contains:
- the current generation
- the color we plan to use when our cell is `alive`
- the boolean representing an info whether the simulation runs or not
- the dimensions of our grid and the size of each grid cell
- the grid state, being a set of cells (key-value pairs storing the location on a map and `alive`/`dead` status)
- simulation speed

So, for example, when writing our implementation with React, we can do it that way:

```js
class Game extends Component {
	constructor(props) {
		super(props);
		this.state = {
			generation: 0,
			color: '#000',
			stroke_color: '#000',
			simulating: false,
			dimensions: 800,
			size: 20,
			grid: {},
			simulationSpeed: 0
		};
	}
```

### 2. The grid initializer

The second element of our game is the grid initializer, so just the function that should generate an empty grid. There are few approaches to that problem, the easiest one just requires us to iterate over all the cells, initialize their properties and state (to the default value of `dead`, `0` or `false`), add them to the set of cells and update the state of our app.

```js
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
```

At the end, after the cells initialization, we can start drawing our grid by calling the `gridDraw` method.

### 3. A function drawing our grid

To draw the grid, we need to reference the relevant element in the DOM, this time we use `canvas`. We get the `2d` context and set the stroke color and after that, we start drawing lines.

```js
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
```

### 4. A function clearing our grid.

Another useful method that we should have in our game is the one that allows us to clear the grid. Instead of clearing each cell, we basically clear the entire grid and re-initialize it.

```js
gridClear() {
    const grid = this.refs.grid;
    const context = grid.getContext('2d');
    context.clearRect(0, 0, this.state.dimensions, this.state.dimensions);
    this.gridInit();
}
```

### 5. A function changing the state of cell on click.

We also need to be able to execute an action when we click on the canvas and want to change the state of our grid cell. One of the ways to do that is to select an appropriate cell by taking the (x, y) relative coordinates of our canvas and calculate which cell we are over. For example we can cast it to the _beginning_ of the cell (top-left position). Then we switch the cell color by filling it up with the given color.

And at the end we just update the game state.

```js
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
```

### 6. A function calculating the next state of an entire grid (new `generation`).

To calculate the next generation, we need to make the new grid and add the existing elements to it, plus of course check whether the cell has an appropriate number of alive neighbours, so its state is going to change. After that, we color our cell appropriately and return the game board containing the new generation.

```js
boardNext() {
    const board = { ...this.state, grid: {} };
    const grid = this.refs.grid;
    const context = grid.getContext('2d');
    for (let i = 0; i < this.state.dimensions; i += this.state.size) {
        for (let j = 0; j < this.state.dimensions; j += this.state.size) {
            const livingNB = this.neighboursCount(i, j);
            board.grid[`${i}_${j}`] = this.state.grid[`${i}_${j}`];
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
```


### 7. Functions to start and stop simulation, a function to simulate only one generation.

Functions controlling our game/simulation are very easy to write, as they manipulate only one parameter. We just need to check whether the simulation is already active and then call the cells update function or to turn the `simulating` variable off.

```js
play() {
    if (!this.state.simulating) {
        this.setState({
            ...this.state,
            simulating: true
        });
        requestAnimationFrame(this.cellsUpdate);
    }
}
```

```js
playStep() {
    if (!this.state.simulating) {
        requestAnimationFrame(() => this.cellsUpdate(1));
    }
}
```

```js
stop() {
    if (this.state.simulating) {
        this.setState({
            ...this.state,
            simulating: false
        });
    }
}
```

### 8. A function updating all cells

To be able to update our cells (e.g. while running a simulation) we need to check how many steps do we want to simulate. With only one step to simulate, we can just make a new (next) board with our algorithm and put it in the game state. When simulating more generations, we can use functions like `setTimeout` that allow us to specify the refresh rate/delay. The single simulation is exactly the same as with the one generation, but at the end we call the `requestAnimationFrame` to run the animation.

```js
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
```


### 9. A function updating color of cells

Wanna change your cells color? Easy! We just need to pick up the new color from our game state and then visit all the cells that are alive and update their property.

```js
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
```

### 10. A function checking the filling style of a cell

Just to check what color we should fill our cell with, we need to check its state - if the cell is already alive, we fill it with white, otherwise we want to fill it with the given color.

```js
cellGetFillingStyle(x, y) {
    return this.cellIsAlive(x, y) ? '#fff' : this.state.color;
}
```

And now we need to figure out how to check if cell is alive.

### 11. A function checking if cell is alive

This function is so far one of the shortest. It just returns the boolean value based on the curren state of the cell in our grid.

```js
cellIsAlive(x, y) {
    return this.state.grid[`${x}_${y}`] === 'alive';
}
```

### 12. A function counting the number of alive neighbours

One of the most important functions for an entire game is the one that allows us to calculate the number of alive neighbours of the given cell. Without that, we wouldn't be able to take any steps forward, as the state of the current cell depends on the number of neighbours.

We select all the neighbours:
- the top one
- the bottom one
- the left one
- the right one
- the top-left one
- the top-right one
- the bottom-left one
- the bottom-right one

Then we need check if they are `alive` and if so, increment the counter. The array method called `reduce` is a perfect choice to do so.

```js
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
```

### 13. A function randomizing our board.

Randomization of our board can be done only if our simulation is not running. We make a copy of our current game state and then fill in our cells with random values casted to the `alive` or `dead` value. After that, we just fill them with the appropriate color.

```js
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
```

### 14. A function rendering the grid.

To be able to render our grid, we need to take few parameters, including the color of strokes, the grid dimensions and the size of cell. After generating the blank grid, we need to attach it to the game state and execute the function drawing elements on a canvas.

```js
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
```

### 15. A function updating the grid.

Updating our grid (e.g. after changing the cell size) is easy - we just clear an entire grid and re-render it with the new properties.

```js
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
```


## Where to go from here?

Even though we already finished our application, there are always options to do it better! Make sure you check out [Hashlife](https://en.wikipedia.org/wiki/Hashlife) algorithm as it is a very efficient option (time-wise) that uses more memory, but will enable you to simulate even the Googolplexth generation in only few seconds.