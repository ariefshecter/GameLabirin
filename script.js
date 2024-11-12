class PriorityQueue {
    constructor() {
        this.values = [];
    }

    enqueue(val, priority) {
        this.values.push({val, priority});
        this.sort();
    }

    dequeue() {
        return this.values.shift();
    }

    sort() {
        this.values.sort((a, b) => a.priority - b.priority);
    }
}

class MazeGame {
    constructor() {
        this.maze = [
            [2, 0, 1, 1, 1, 1, 1, 1, 1, 1],
            [0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
            [1, 1, 1, 0, 1, 1, 0, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
            [1, 0, 1, 1, 1, 0, 1, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 0, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 1, 1, 1, 1, 1, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 3, 1]
        ];
        
        this.player = {x: 0, y: 0};
        this.steps = 0;
        this.shortestPath = 0;
        this.shortestPathCells = [];
        this.mazeElement = document.getElementById('maze');
        this.stepsElement = document.getElementById('steps');
        this.shortestElement = document.getElementById('shortest');
        
        this.initializeMaze();
        this.calculateShortestPath();
        this.setupEventListeners();
    }

    initializeMaze() {
        this.mazeElement.innerHTML = '';
        for (let i = 0; i < this.maze.length; i++) {
            const row = document.createElement('div');
            row.className = 'row';
            
            for (let j = 0; j < this.maze[i].length; j++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.x = j;
                cell.dataset.y = i;
                
                switch(this.maze[i][j]) {
                    case 0: // Path
                        cell.textContent = ' ';
                        break;
                    case 1: // Wall
                        cell.textContent = '⬛';
                        break;
                    case 2: // Start
                        cell.textContent = '🟩';
                        this.player = {x: j, y: i};
                        break;
                    case 3: // End
                        cell.textContent = '🟥';
                        break;
                }
                
                row.appendChild(cell);
            }
            this.mazeElement.appendChild(row);
        }
        this.updatePlayerPosition();
    }

    updatePlayerPosition() {
        const cells = this.mazeElement.getElementsByClassName('cell');
        for (let cell of cells) {
            if (cell.textContent === '🟦') {
                cell.textContent = ' ';
            }
        }
        
        const playerCell = this.mazeElement.children[this.player.y].children[this.player.x];
        if (this.maze[this.player.y][this.player.x] !== 3) {
            playerCell.textContent = '🟦';
        }
    }

    movePlayer(dx, dy) {
        const newX = this.player.x + dx;
        const newY = this.player.y + dy;
        
        if (
            newX >= 0 && newX < this.maze[0].length &&
            newY >= 0 && newY < this.maze.length &&
            this.maze[newY][newX] !== 1
        ) {
            this.player.x = newX;
            this.player.y = newY;
            this.steps++;
            this.stepsElement.textContent = this.steps;
            this.updatePlayerPosition();
            
            if (this.maze[newY][newX] === 3) {
                setTimeout(() => {
                    alert(`Selamat! Anda menyelesaikan labirin dalam ${this.steps} langkah.\nJalur terpendek: ${this.shortestPath} langkah.`);
                }, 100);
            }
        }
    }

    calculateShortestPath() {
        const start = {x: 0, y: 0};
        const end = {x: 8, y: 9};
        
        const h = (pos) => {
            return Math.abs(pos.x - end.x) + Math.abs(pos.y - end.y);
        };
        
        const pq = new PriorityQueue();
        const visited = new Set();
        const gScore = {};
        const fScore = {};
        const cameFrom = {};
        
        gScore[`${start.x},${start.y}`] = 0;
        fScore[`${start.x},${start.y}`] = h(start);
        
        pq.enqueue(start, fScore[`${start.x},${start.y}`]);
        
        while (pq.values.length > 0) {
            const current = pq.dequeue().val;
            const currentKey = `${current.x},${current.y}`;
            
            if (current.x === end.x && current.y === end.y) {
                this.shortestPath = gScore[currentKey];
                this.shortestElement.textContent = this.shortestPath;
                
                // Reconstruct path
                this.shortestPathCells = [];
                let curr = end;
                while (curr) {
                    this.shortestPathCells.push(curr);
                    curr = cameFrom[`${curr.x},${curr.y}`];
                }
                return;
            }
            
            visited.add(currentKey);
            
            const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
            
            for (let [dx, dy] of directions) {
                const newX = current.x + dx;
                const newY = current.y + dy;
                
                if (
                    newX >= 0 && newX < this.maze[0].length &&
                    newY >= 0 && newY < this.maze.length &&
                    this.maze[newY][newX] !== 1
                ) {
                    const neighbor = {x: newX, y: newY};
                    const neighborKey = `${newX},${newY}`;
                    
                    if (visited.has(neighborKey)) continue;
                    
                    const tentativeGScore = gScore[currentKey] + 1;
                    
                    if (!gScore[neighborKey] || tentativeGScore < gScore[neighborKey]) {
                        cameFrom[neighborKey] = current;
                        gScore[neighborKey] = tentativeGScore;
                        fScore[neighborKey] = tentativeGScore + h(neighbor);
                        pq.enqueue(neighbor, fScore[neighborKey]);
                    }
                }
            }
        }
    }

    showShortestPath() {
        // Reset all cells
        const cells = this.mazeElement.getElementsByClassName('cell');
        for (let cell of cells) {
            cell.classList.remove('shortest-path');
            if (cell.textContent === '🟨') {
                cell.textContent = ' ';
            }
        }

        // Show shortest path
        for (let pos of this.shortestPathCells) {
            const cell = this.mazeElement.children[pos.y].children[pos.x];
            if (this.maze[pos.y][pos.x] === 0) {
                cell.textContent = '🟨';
            }
        }
    }

    hideShortestPath() {
        const cells = this.mazeElement.getElementsByClassName('cell');
        for (let cell of cells) {
            cell.classList.remove('shortest-path');
            if (cell.textContent === '🟨') {
                cell.textContent = ' ';
            }
        }
        this.updatePlayerPosition();
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowUp':
                    this.movePlayer(0, -1);
                    break;
                case 'ArrowRight':
                    this.movePlayer(1, 0);
                    break;
                case 'ArrowDown':
                    this.movePlayer(0, 1);
                    break;
                case 'ArrowLeft':
                    this.movePlayer(-1, 0);
                    break;
            }
        });

        document.getElementById('resetBtn').addEventListener('click', () => {
            this.player = {x: 0, y: 0};
            this.steps = 0;
            this.stepsElement.textContent = '0';
            this.hideShortestPath();
            this.initializeMaze();
        });

        const showPathBtn = document.getElementById('showPathBtn');
        let pathVisible = false;
        showPathBtn.addEventListener('click', () => {
            if (pathVisible) {
                this.hideShortestPath();
                showPathBtn.textContent = 'Tampilkan Jalur Terpendek';
            } else {
                this.showShortestPath();
                showPathBtn.textContent = 'Sembunyikan Jalur Terpendek';
            }
            pathVisible = !pathVisible;
        });
    }
}

window.onload = () => {
    new MazeGame();
};