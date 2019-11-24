import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

//function component
function Square(props) {
	return (
		<button className={props.winningPath.includes(props.index)?"winnerPath square":"square"} onClick={props.onClick}>
			{props.value}
		</button>
	);
}

class Board extends React.Component {
	renderSquare(i) {
		return <Square key={i} value={this.props.squares[i]} onClick={() => this.props.onClick(i)} winningPath={this.props.winningPath} index={i}/>;
	}

	createBoardOfSquares = () => {
		let boardOfSquares = [];
		let index = 0;
		//outer loop to create parent
		for (let row = 0; row < 3; row++) {
			let rowOfColumns = [];
			//inner loop to create children
			for (let col = 0; col < 3; col++) {
				rowOfColumns.push(this.renderSquare(index));
				index++;
			}
			boardOfSquares.push(
				<div className="board-row" key={index}>
					{rowOfColumns}
				</div>
			);
		}
		return boardOfSquares;
	};

	render() {
		return <div>{this.createBoardOfSquares()}</div>;
	}
}

class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			history: [
				{
					squares: Array(9).fill(null),
					position: 0
				}
			],
			stepNumber: 0,
			xIsNext: true,
			isAscending: true
		};
	}

	handleClick(i) {
		const history = this.state.history.slice(0, this.state.stepNumber + 1);
		const current = history[history.length - 1];
		const squares = current.squares.slice();
		if (calculateWinner(squares) || squares[i]) {
			return;
		}
		squares[i] = this.state.xIsNext ? "X" : "O";
		this.setState({
			history: history.concat([
				{
					squares: squares,
					position: i
				}
			]),
			stepNumber: history.length,
			xIsNext: !this.state.xIsNext
		});
	}

	jumpTo(step) {
		this.setState({
			stepNumber: step,
			xIsNext: step % 2 === 0
		});
	}

	changeOrder() {
		this.setState({
			isAscending: !this.state.isAscending
		});
	}

	render() {
		const history = this.state.history;
		const current = history[this.state.stepNumber];
		const winner = calculateWinner(current.squares);
		const move = history.map((step, move, position) => {
			position = getPosition(step.position);
			const desc = move ? "Go to move # " + move + ` (${position[0]}, ${position[1]})` : "Go to game start";
			return (
				<li key={move}>
					<button onClick={() => this.jumpTo(move)} className={move === this.state.stepNumber ? "btn btn_current" : "btn"}>
						{desc}
					</button>
				</li>
			);
		});

		let status;
		let winningPath;
		if (winner) {
			status = "🎉Winner: " + winner[0];
			winningPath=winner[1];
		}else if(this.state.stepNumber===9){
			status="👩‍⚖️It's a draw!";
		} 
		else {
			status = "💁Next player: " + (this.state.xIsNext ? "X" : "O");
		}

		return (
			<div className="game">
				<div className="game-board">
					<Board squares={current.squares} onClick={i => this.handleClick(i)} winningPath={winner?winningPath:[]}/>
				</div>
				<div className="game-info">
					<button onClick={() => this.changeOrder()} className={this.state.isAscending ? "btn" : "btn btn_des"}>
						Change Order to {this.state.isAscending ? "Descending" : "Ascending"}!
					</button>
					<div className="status">{status}</div>
					<ol>{this.state.isAscending ? move : move.reverse()}</ol>
				</div>
			</div>
		);
	}
}

function calculateWinner(squares) {
	const lines = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6]
	];
	for (let i = 0; i < lines.length; i++) {
		const [a, b, c] = lines[i];
		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			return [squares[a],lines[i]];
		}
	}
	return null;
}

function getPosition(location) {
	const row = location >= 0 && location <= 2 ? 1 : location >= 3 && location <= 5 ? 2 : 3;
	const col = [0, 3, 6].includes(location) ? 1 : [1, 4, 7].includes(location) ? 2 : 3;
	return [col, row];
}
// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
