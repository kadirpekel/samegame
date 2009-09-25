/*
 ------------------------------------------------------------------------------
 Copyright [2009] [Kadir PEKEL]

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 	http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 ------------------------------------------------------------------------------
*/
public class SameGame extends java.applet.Applet {
	static final int ROW_CNT = 15, COL_CNT = 15, CELL_SIZE = 30;
	static final int[] CELL_TABLE = {0xFFDB5800, 0xFF4FA6B2, 0xFFF0C600, 0xFF8EA106};
	int[][] table = new int[ROW_CNT][COL_CNT];
	java.util.Random random = new java.util.Random();
	java.awt.Image offscreen;
	public void init() {
		setSize(COL_CNT * CELL_SIZE, ROW_CNT * CELL_SIZE);
		offscreen = createImage(getWidth(), getHeight());
		for (int r = ROW_CNT - 1; r >= 0; r--) for (int c = 0; c < table[r].length; c++)
			table[r][c] = CELL_TABLE[random.nextInt(CELL_TABLE.length)];
	}
	public void update(java.awt.Graphics g) { paint(g); }
	public void paint(java.awt.Graphics g) {
		java.awt.Graphics2D offscreenG = (java.awt.Graphics2D)offscreen.getGraphics();
		offscreenG.addRenderingHints(new java.awt.RenderingHints(java.awt.RenderingHints.KEY_ANTIALIASING, java.awt.RenderingHints.VALUE_ANTIALIAS_ON));
		offscreenG.fillRect(0, 0, getWidth(), getHeight());
		for (int r = 0; r < table.length; r++) for (int c = 0; c < table[r].length; c++) {
			offscreenG.setColor(new java.awt.Color(table[r][c]));
			offscreenG.fillOval((c * CELL_SIZE), (((ROW_CNT - 1) * CELL_SIZE) - (r * CELL_SIZE)), CELL_SIZE, CELL_SIZE);
		}
		boolean gameOver = true;
		int score = 0;
		for (int r = ROW_CNT - 1; r >= 0; r--) for (int c = 0; c < table[r].length; c++) {
			gameOver = gameOver && !hasNeighbour(r, c);
			score += table[r][c] == 0 ? 0 : 1;
		}
		offscreenG.setColor(new java.awt.Color(0xFFFFFFFF));
		offscreenG.setFont(new java.awt.Font("Verdana", java.awt.Font.PLAIN, 12));
		if(gameOver) offscreenG.drawString(score == 0 ? "You Win!" : "You Lose! Your Score:" + score, 20, 20);
		g.drawImage(offscreen, 0, 0, this);
		offscreenG.dispose();
	}
	public boolean mouseDown(java.awt.Event evt, int x, int y) {
		int column = x / CELL_SIZE;
		int row = (ROW_CNT - 1) - (y / CELL_SIZE);
		System.out.println("row:" + row + " col:" + column + " cell:" + Integer.toHexString(table[row][column]));
		if (hasNeighbour(row, column)) {
			traverseCells(row, column, table[row][column]);
			mergeRows(0, 0);
			mergeColumns(0, 0);
		}
		repaint();
		return true;
	}
	void traverseCells(int row, int column, int cell) {
		if (cell == table[row][column]) {
			table[row][column] = 0;
			if (row - 1 >= 0 && cell == table[row - 1][column]) traverseCells(row - 1, column, cell);
			if (row + 1 < ROW_CNT && cell == table[row + 1][column]) traverseCells(row + 1, column, cell);
			if (column - 1 >= 0 && cell == table[row][column - 1]) traverseCells(row, column - 1, cell);
			if (column + 1 < COL_CNT && cell == table[row][column + 1]) traverseCells(row, column + 1, cell);
		}
	}
	void mergeRows(int row, int column) {
		if (column < COL_CNT) {
			if (row < ROW_CNT) {
				if (table[row][column] == 0) {
					int r = row;
					while (r < ROW_CNT) {
						if (table[r][column] != 0) {
							table[row][column] = table[r][column];
							table[r][column] = 0;
							break;
						}
						r++;
					}
				}
				mergeRows(++row, column);
			} else {
				mergeRows(0, ++column);
			}
		}
	}
	boolean hasNeighbour(int row, int column) {
		int cell = table[row][column];
		if (cell == 0) return false;
		if (row - 1 >= 0 && cell == table[row - 1][column]) return true;
		if (row + 1 < ROW_CNT && cell == table[row + 1][column]) return true;
		if (column - 1 >= 0 && cell == table[row][column - 1]) return true;
		if (column + 1 < COL_CNT && cell == table[row][column + 1]) return true;
		return false;
	}
	void mergeColumns(int row, int column) {
		if(column < COL_CNT) {
			boolean columnEmpty = true;
			for(int r = 0; r < ROW_CNT; r++) columnEmpty = columnEmpty && table[r][column] == 0; 
			if(columnEmpty) {
				for(int r = 0; r < ROW_CNT; r++) {
					if((column + 1) < COL_CNT) {
						table[r][column] = table[r][column + 1]; 
						table[r][column + 1] = 0;
					}
				}
			}
			mergeColumns(0, ++column);
		}
	}
}
