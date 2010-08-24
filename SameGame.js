var d = document,
	canvas = d.body.children[0],
	g = canvas.getContext('2d'),
	colors = ['#59031A', '#5BA68A', '#D9C45B', '#D95829', '#D90404'],
	board = [],
	row = 11,
	current,
	col = size = 21,
	fl = Math.floor,
	evaldir = function(o) {
		return function() {board[o.i() % col == 0 ? -1 : o.i() - 1] };
	},
	reset = function () {
		for (var i = 0; i < row * col; i++) {
			board[i] = {
				i: function () {
					return board.indexOf(this)
				},
				c: colors[fl(Math.random() * colors.length)],
				0: evaldir(this),
				
				1: function () { // right node
					return board[this.i() % col == col - 1 ? -1 : this.i() + 1]
				},
				
				2: function () { // top node
					return board[this.i() - col]
				},
				
				3: function () { // bottom node
					return board[this.i() + col]
				},
				m: function () {
					for (var j = 0; j < 4; j++) {
						var dir = this[j]();
						if (dir && dir.c == this.c) return true;
					}
				},
				t: function (select) {
					this.h = select;
					for (var j = 0; j < 4; j++) {
						var dir = this[j]();
						if (dir && dir.h != select && dir.c == this.c) dir.t(select);
					}
				}
			};
		}
		update();
	},
	update = function (e) {
		if (e) {
			var node = board[fl(e.clientX / size) + fl(e.clientY / size) * col];
			if (node && node != current) {
				if (current) current.t(false);
				if (node.m()) node.t(true);
				current = node;
			}
			if (e.type == "click" && !e.r) {
				for (var i in board)
					if (board[i] && board[i].h) board[i] = null;

				var emptyCols = [];
				for (var i = row * col - 1; i >= 0; i--) {
					var j = i;
					while (j >= 0 && !board[j]) j -= col;
					if (i != j) {
						board[i] = board[j];
						board[j] = null;
						if (i - j == row * col) emptyCols.push(i % col);
					}
				}
				for (var i in emptyCols) {
					var m = emptyCols[i];
					while (m < col) {
						for (var j = 0; j < col; j++) {
							var index = (j * col) + m;
							if ((index + 1) % col != 0) {
								board[index] = board[index + 1];
								board[index + 1] = null;
							}
						}
						m++;
					}
				}
				var left = 0, gameover = true;
				for (var i in board)
					if (board[i]) {
						gameover = gameover && !board[i].m();
						left ++;
					}
				e.r = 1;
				update(e);
			}
		}
		g.fillStyle = '#000';
		g.fillRect(0, 0, canvas.width, canvas.height);
		for (var i in board) {
			var o = board[i];
			if (o) {
				g.fillStyle = o.c;
				g.fillRect((o.i() % col) * size + (o.h ? 0 : 2),
					fl(o.i() / col) * size + (o.h ? 0 : 2),
					size - (o.h ? 0 : 1),
					size - (o.h ? 0 : 1));
			}
		};
		if (gameover) {
			alert('left: ' + left);
			reset();
		}
	};
d.body.style.margin = 0;
with(canvas) {
	onclick = onmousemove = update;
	width = size * col;
	height = size * row;
}
reset();