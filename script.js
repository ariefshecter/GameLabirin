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

class MazeGenerator {
    constructor(size = 10) {
        this.size = size;
        this.maze = this.createEmptyMaze();
    }

    createEmptyMaze() {
        // Inisialisasi maze dengan tembok
        return Array.from({length: this.size}, () => 
            Array(this.size).fill(1)
        );
    }

    // Algoritma Generate Maze menggunakan Recursive Backtracking
    generateMaze(startX, startY) {
        // Reset maze
        this.maze = this.createEmptyMaze();

        // Mulai dari titik awal
        this.recursiveBacktrack(startX, startY);

        return this.maze;
    }

    recursiveBacktrack(x, y) {
        // Tandai sel saat ini sebagai path
        this.maze[y][x] = 0;

        // Arah acak
        const directions = this.shuffleDirections([
            {dx: 0, dy: 1},   // Bawah
            {dx: 1, dy: 0},   // Kanan
            {dx: 0, dy: -1},  // Atas
            {dx: -1, dy: 0}   // Kiri
        ]);

        for (let {dx, dy} of directions) {
            const newX = x + dx * 2;
            const newY = y + dy * 2;

            // Periksa batas dan apakah sel belum dikunjungi
            if (this.isValidCell(newX, newY)) {
                // Buka jalur antar sel
                this.maze[y + dy][x + dx] = 0;
                this.recursiveBacktrack(newX, newY);
            }
        }
    }

    isValidCell(x, y) {
        return x >= 0 && x < this.size && 
               y >= 0 && y < this.size && 
               this.maze[y][x] === 1;
    }

    shuffleDirections(directions) {
        for (let i = directions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [directions[i], directions[j]] = [directions[j], directions[i]];
        }
        return directions;
    }
}

class ComplexMazeGenerator extends MazeGenerator {
    constructor(size = 10) {
        super(size);
    }

    addMultiLayeredComplexity(maze) {
        this.maze = maze;
        
        // 1. Reset maze ke kondisi awal dengan lebih banyak tembok
        this.densifyMaze();
        
        // 2. Tambahkan koridor yang lebih sistematis
        this.addStructuredCorridors();

        // 3. Tambahkan rintangan strategis yang lebih teratur
        this.addControlledObstacles();

        // 4. Buat jalur yang konsisten
        this.createConsistentPaths();

        // 5. Tambahkan area tertutup dengan hati-hati
        this.addCarefulDeceptiveSections();

        // 6. Pastikan masih ada jalur yang valid
        this.ensureMinimumPathValidity();

        return this.maze;
    }

    densifyMaze() {
        // Reset maze dengan pola grid yang lebih teratur
        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {
                // Buat pola grid dengan jalur dan tembok bergantian
                if (x % 2 === 0 || y % 2 === 0) {
                    this.maze[y][x] = 1; // Tembok
                } else {
                    this.maze[y][x] = 0; // Jalur
                }
            }
        }
    }

    addStructuredCorridors() {
        // Tambahkan koridor dengan pola yang lebih sistematis
        const corridorDensity = 0.7; // Tentukan kepadatan koridor
        
        for (let y = 1; y < this.size - 1; y += 2) {
            for (let x = 1; x < this.size - 1; x += 2) {
                // Tambahkan kemungkinan membuka koridor
                if (Math.random() < corridorDensity) {
                    // Pilih arah koridor
                    const directions = [
                        {dx: 1, dy: 0},   // Kanan
                        {dx: 0, dy: 1},   // Bawah
                    ];
                    
                    const direction = directions[Math.floor(Math.random() * directions.length)];
                    const newX = x + direction.dx;
                    const newY = y + direction.dy;
                    
                    // Pastikan masih di dalam batas
                    if (newX > 0 && newX < this.size - 1 && 
                        newY > 0 && newY < this.size - 1) {
                        
                        // Buka koridor
                        this.maze[y][x] = 0;
                        this.maze[newY][newX] = 0;
                    }
                }
            }
        }
    }

    createConsistentPaths() {
        // Pastikan jalur memiliki konektivitas yang baik
        const pathConnectivity = 0.6;
        
        for (let y = 1; y < this.size - 1; y += 2) {
            for (let x = 1; x < this.size - 1; x += 2) {
                if (this.maze[y][x] === 0) {
                    const neighbors = [
                        {x: x+1, y: y},
                        {x: x-1, y: y},
                        {x: x, y: y+1},
                        {x: x, y: y-1}
                    ];
                    
                    neighbors.forEach(({x: nx, y: ny}) => {
                        if (nx > 0 && nx < this.size - 1 && 
                            ny > 0 && ny < this.size - 1 && 
                            this.maze[ny][nx] === 1 && 
                            Math.random() < pathConnectivity) {
                            
                            // Buka jalur antar sel
                            this.maze[ny][nx] = 0;
                        }
                    });
                }
            }
        }
    }

    addControlledObstacles() {
        const obstacleIntensity = 0.05; // Kurangi intensitas rintangan
        
        for (let y = 1; y < this.size - 1; y += 2) {
            for (let x = 1; x < this.size - 1; x += 2) {
                // Fokus pada persimpangan yang terbuka
                if (this.maze[y][x] === 0) {
                    const neighbors = [
                        {x: x+1, y: y},
                        {x: x-1, y: y},
                        {x: x, y: y+1},
                        {x: x, y: y-1}
                    ];
                    
                    const openNeighbors = neighbors.filter(
                        ({x: nx, y: ny}) => this.maze[ny][nx] === 0
                    );
                    
                    // Tambahkan rintangan di persimpangan dengan probabilitas rendah
                    if (openNeighbors.length > 2 && Math.random() < obstacleIntensity) {
                        // Blok sel saat ini dengan probabilitas rendah
                        this.maze[y][x] = 1;
                    }
                }
            }
        }
    }

    addCarefulDeceptiveSections() {
        const sectionAttempts = Math.floor(this.size / 4);
        
        for (let i = 0; i < sectionAttempts; i++) {
            const sectionSize = Math.floor(Math.random() * 3) + 2;
            const startX = Math.floor(Math.random() * (this.size - sectionSize - 2)) + 1;
            const startY = Math.floor(Math.random() * (this.size - sectionSize - 2)) + 1;
            
            // Buat area dengan pola yang lebih terstruktur
            for (let y = startY; y < startY + sectionSize; y++) {
                for (let x = startX; x < startX + sectionSize; x++) {
                    // Variasi antara jalur terbuka dan tertutup, dengan kontrol lebih ketat
                    if (x % 2 === 0 || y % 2 === 0) {
                        this.maze[y][x] = 1; // Tembok
                    } else {
                        this.maze[y][x] = Math.random() > 0.3 ? 0 : 1; // Jalur atau tembok
                    }
                }
            }
        }
    }

    ensureMinimumPathValidity() {
        // Pastikan masih ada jalur yang valid dengan A* atau flood fill
        const start = this.findValidStart();
        const end = this.findValidEnd();
        
        if (!this.hasValidPath(start, end)) {
            this.createForcedPath(start, end);
        }
    }

    findValidStart() {
        for (let y = 1; y < this.size - 1; y++) {
            for (let x = 1; x < this.size - 1; x++) {
                if (this.maze[y][x] === 0) return {x, y};
            }
        }
        return {x: 1, y: 1}; // Fallback
    }

    findValidEnd() {
        for (let y = this.size - 2; y > 0; y--) {
            for (let x = this.size - 2; x > 0; x--) {
                if (this.maze[y][x] === 0) return {x, y};
            }
        }
        return {x: this.size - 2, y: this.size - 2}; // Fallback
    }

    hasValidPath(start, end) {
        // Implementasi sederhana flood fill
        const visited = new Set();
        const queue = [start];
        
        while (queue.length > 0) {
            const current = queue.shift();
            const key = `${current.x},${current.y}`;
            
            if (current.x === end.x && current.y === end.y) return true;
            
            if (visited.has(key)) continue;
            visited.add(key);
            
            const neighbors = [
                {x: current.x+1, y: current.y},
                {x: current.x-1, y: current.y},
                {x: current.x, y: current.y+1},
                {x: current.x, y: current.y-1}
            ];
            
            neighbors.forEach(neighbor => {
                if (neighbor.x > 0 && neighbor.x < this.size - 1 &&
                    neighbor.y > 0 && neighbor.y < this.size - 1 &&
                    this.maze[neighbor.y][neighbor.x] === 0) {
                    queue.push(neighbor);
                }
            });
        }
        
        return false;
    }

    createForcedPath(start, end) {
        let current = {...start};
        
        while (current.x !== end.x || current.y !== end.y) {
            // Gerakkan menuju titik akhir
            if (current.x < end.x) current.x++;
            else if (current.x > end.x) current.x--;
            
            if (current.y < end.y) current.y++;
            else if (current.y > end.y) current.y--;
            
            // Buka jalur
            this.maze[current.y][current.x] = 0;
        }
    }
}

class MazeGame {
    constructor() {
        this.mazeSize = 20;
        this.maze = null;
        this.player = {x: 0, y: 0};
        this.end = {x: 0, y: 0};
        this.steps = 0;
        this.shortestPath = 0;
        this.shortestPathCells = [];
        
        this.mazeElement = document.getElementById('maze');
        this.stepsElement = document.getElementById('steps');
        this.shortestElement = document.getElementById('shortest');
        this.characterElement = document.getElementById('character');
        this.finishElement = document.getElementById('finish');
        
        this.mazeGenerator = new ComplexMazeGenerator(this.mazeSize);
        
        this.setupEventListeners();
        this.generateRandomMaze();
    }

    generateRandomMaze() {
        // Tentukan arah maze
        const directions = [
            {start: {x: 0, y: 'random'}, end: {x: this.mazeSize - 1, y: 'random'}},  // kiri ke kanan
            {start: {x: 'random', y: 0}, end: {x: 'random', y: this.mazeSize - 1}},  // atas ke bawah
            {start: {x: this.mazeSize - 1, y: 'random'}, end: {x: 0, y: 'random'}},  // kanan ke kiri
            {start: {x: 'random', y: this.mazeSize - 1}, end: {x: 'random', y: 0}}   // bawah ke atas
        ];

        const selectedDirection = directions[Math.floor(Math.random() * directions.length)];

        // Tentukan titik awal
        if (selectedDirection.start.x === 'random') {
            this.player.x = Math.floor(Math.random() * (this.mazeSize - 4)) + 2;
            this.player.y = selectedDirection.start.y === 0 ? 0 : this.mazeSize - 1;
        } else {
            this.player.y = Math.floor(Math.random() * (this.mazeSize - 4)) + 2;
            this.player.x = selectedDirection.start.x;
        }

        // Tentukan titik akhir
        if (selectedDirection.end.x === 'random') {
            this.end.x = Math.floor(Math.random() * (this.mazeSize - 4)) + 2;
            this.end.y = selectedDirection.end.y === 0 ? 0 : this.mazeSize - 1;
        } else {
            this.end.y = Math.floor(Math.random() * (this.mazeSize - 4)) + 2;
            this.end.x = selectedDirection.end.x;
        }

        // Generate maze menggunakan algoritma recursive backtracking
        let baseMaze = this.mazeGenerator.generateMaze(this.player.x, this.player.y);

        // Tambahkan kompleksitas
        this.maze = this.mazeGenerator.addMultiLayeredComplexity(baseMaze);

        // Set titik awal dan akhir
        this.maze[this.player.y][this.player.x] = 2;  // Start point
        this.maze[this.end.y][this.end.x] = 3;        // End point

        // Pastikan jalur tersambung
        this.ensurePathBetweenStartAndEnd();

        // Inisialisasi maze dan hitung jalur terpendek
        this.initializeMaze();
        this.calculateShortestPath();
    }

    ensurePathBetweenStartAndEnd() {
        let currentX = this.player.x;
        let currentY = this.player.y;

        const maxAttempts = 100;
        let attempts = 0;

        while ((currentX !== this.end.x || currentY !== this.end.y) && attempts < maxAttempts) {
            // Gerakkan menuju titik akhir
            if (currentX < this.end.x) currentX++;
            else if (currentX > this.end.x) currentX--;
            
            if (currentY < this.end.y) currentY++;
            else if (currentY > this.end.y) currentY--;

            // Buka jalur
            if (this.maze[currentY][currentX] === 1 && 
                !(currentX === this.player.x && currentY === this.player.y) &&
                !(currentX === this.end.x && currentY === this.end.y)) {
                this.maze[currentY][currentX] = 0;
            }

            attempts++;
        }
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
                        cell.innerHTML = `<img src="${this.characterElement.src}" width="30" height="30" alt="Karakter">`;
                        break;
                    case 3: // End
                        cell.innerHTML = `<img src="${this.finishElement.src}" width="30" height="30" alt="Titik Finish">`;
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
            if (cell.querySelector('img[alt="Pemain"]')) {
                cell.innerHTML = ' ';
            }
        }
        
        const playerCell = this.mazeElement.children[this.player.y].children[this.player.x];
        if (this.maze[this.player.y][this.player.x] !== 3) {
            const playerImg = document.createElement('img');
            playerImg.src = this.characterElement.src;
            playerImg.width = 30;
            playerImg.height = 30;
            playerImg.alt = "Pemain";
            playerCell.innerHTML = '';
            playerCell.appendChild(playerImg);
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
        const start = {x: this.player.x, y: this.player.y};
        const end = {x: this.end.x, y: this.end.y};
        
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
                
                // Rekonstruksi jalur
                this.shortestPathCells = [];
                let curr = end;
                while (curr) {
                    this.shortestPathCells.push(curr);
                    curr = cameFrom[`${curr.x},${curr.y}`];
                }
                this.shortestPathCells.reverse();
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
        // Reset sel
        const cells = this.mazeElement.getElementsByClassName('cell');
        for (let cell of cells) {
            cell.classList.remove('shortest-path');
            if (cell.textContent === '🟨') {
                cell.textContent = ' ';
            }
        }

        // Tampilkan jalur terpendek
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
            this.resetGame();
        });

        document.getElementById('nextMapBtn').addEventListener('click', () => {
            this.resetGame(true);
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

        const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const key = button.getAttribute('data-key');
            const event = new KeyboardEvent('keydown', { key });
            document.dispatchEvent(event);
        });
    });
    }

    resetGame(generateNewMap = false) {
        this.steps = 0;
        this.stepsElement.textContent = '0';
        this.hideShortestPath();
        
        if (generateNewMap) {
            this.generateRandomMaze();
        } else {
            // Reset ke posisi awal
            this.player.x = this.maze.findIndex(row => row.includes(2)) || 0;
            this.player.y = this.maze[this.player.x].indexOf(2) || 0;
            this.initializeMaze();
        }
    }
}

window.onload = () => {
    new MazeGame();
};
