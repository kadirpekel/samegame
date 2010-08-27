var canvas = document.getElementById('c'),
	g = canvas.getContext('2d'),
	colors = ['#59031A', '#5BA68A', '#D9C45B', '#D95829', '#D90404'],
	board = [],
	row = 11,
	col = size = 21,
	current, fl = Math.floor,
	neighbour = function (o, dir) {
		var n, i;
		if (o && (i = board.indexOf(o)) >= 0) {
			if (dir == 0) n = board[i % col == 0 ? -1 : i - 1]; // left
			if (dir == 1) n = board[i % col == col - 1 ? -1 : i + 1]; // right
			if (dir == 2) n = board[i - col]; // top
			if (dir == 3) n = board[i + col]; // bottom
		}
		return n;
	},
	traverse = function (o, highlight) {
		if (hasMatcher(o)) {
			o.h = highlight;
			for (var j = 0; j < 4; j++) {
				var dir = neighbour(o, j);
				if (dir && dir.h != highlight && dir.c == o.c) traverse(dir, highlight);
			}
		}
	},
	hasMatcher = function (o) {
		for (var j = 0; j < 4; j++) {
			var dir = neighbour(o, j);
			if (dir && dir.c == o.c) return true;
		}
	},
	reset = function () {
		for (var i = 0; i < row * col; i++) board[i] = {
			c: colors[fl(Math.random() * colors.length)]
		};
		update();
	},
	update = function (e) {
		if (e) {
			var pos = fl(e.clientX / size) + fl(e.clientY / size) * col;
			if (board[pos] != current) {
				traverse(current, false);
				traverse(board[pos], true);
				current = board[pos];
			}
			if (e.type == "click") {
				for (var i in board)
						if(board[i] && board[i].h)
							for(var j = i; j >= 0; board[j] = board[j -= col]);
				for(var i = 0; i < col; i++) {
					var index = (row - 1) * col + i, w = 0;
					while(!board[index + w] && (index % col) + w++ < col);
					if(w > 0)
						for(var j = index % col; j < col - w; j++)
							for(var k = 0; k < row; k++) {
								var l = k * col + j;
								board[l] = board[l+w];
								board[l+w] = null;
							}
				}
				var left = 0, gameover = true;
				for (var i in board)
				if (board[i]) {
					gameover = gameover && !hasMatcher(board[i]);
					left++;
				}
			}
		}
		g.fillStyle = '#000';
		g.fillRect(0, 0, size * col, size * row);
		for (var i in board) {
			var o = board[i];
			if (o) {
				g.fillStyle = o.c;
				g.fillRect((i % col) * size + (o.h ? 0 : 2), fl(i / col) * size + (o.h ? 0 : 2), size - (o.h ? 0 : 1), size - (o.h ? 0 : 1));
			}
		};
		if (gameover) {
			alert('left: ' + left);
			reset();
		}
	};
document.body.style.margin = 0;
canvas.onclick = canvas.onmousemove = update;
canvas.width = size * col;
canvas.height = size * row;
reset();