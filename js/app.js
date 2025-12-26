const STORAGE_KEYS = {
    CURRENT_GAME: 'puttdrill_current_game',
    HISTORY: 'puttdrill_history'
};

const VIEWS = {
    MENU: 'menu-area',
    GAME: 'game-area',
    RESULTS: 'results-area'
};

class PuttDrill {
    constructor() {
        this.ui = {
            areas: {
                [VIEWS.MENU]: document.getElementById(VIEWS.MENU),
                [VIEWS.GAME]: document.getElementById(VIEWS.GAME),
                [VIEWS.RESULTS]: document.getElementById(VIEWS.RESULTS),
                header: document.getElementById('header'),
                footer: document.getElementById('footer')
            },
            meters: document.getElementById('meters'),
            rounds: document.getElementById('rounds'),
            points: document.getElementById('points'),
            finalSeries: document.getElementById('final-series'),
            finalPoints: document.getElementById('final-points'),
            leaderboardContext: document.getElementById('leaderboard-context'),
            highScoreList: document.getElementById('high-score-list'),
            fullHistoryList: document.getElementById('full-history-list')
        };

        const initialState = this.loadState() || this.getInitialState();
        this.state = this.createObservableState(initialState);
        
        this.init();
    }

    getInitialState() {
        return {
            round: 1,
            points: 0,
            distance: 10,
            series: [],
            isGameOver: false,
            maxRounds: 20,
            completionTimestamp: null
        };
    }

    createObservableState(initialState) {
        return new Proxy(initialState, {
            set: (target, prop, value) => {
                target[prop] = value;
                this.onStateChange(prop);
                return true;
            }
        });
    }

    onStateChange(prop) {
        // Auto-persist and auto-render on most changes
        if (prop !== 'completionTimestamp') {
            this.saveState();
            this.render();
        }
    }

    init() {
        this.bindEvents();
        this.updateStatsUI();

        if (this.state.isGameOver) {
            this.switchView(VIEWS.RESULTS);
        } else if (this.state.round > 1 || this.state.points > 0) {
            this.switchView(VIEWS.GAME);
        } else {
            this.switchView(VIEWS.MENU);
        }
    }

    bindEvents() {
        // Scoring buttons
        document.querySelectorAll('.hitbtn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (this.state.isGameOver) return;
                this.handleInput(parseInt(e.target.dataset.hits, 10));
            });
        });

        // Navigation
        document.getElementById('menu-start-btn').addEventListener('click', () => this.resetGame());
        document.getElementById('new-game-btn').addEventListener('click', () => this.resetGame());

        // History Management
        document.getElementById('reset-history-btn').addEventListener('click', () => {
            if (confirm('Clear all history? This cannot be undone.')) {
                localStorage.removeItem(STORAGE_KEYS.HISTORY);
                this.updateStatsUI();
            }
        });
        
        document.getElementById('highScoreModal').addEventListener('show.bs.modal', () => this.updateStatsUI());
    }

    handleInput(hits) {
        this.state.points += (this.state.distance * hits);
        this.state.series.push(hits);
        this.state.distance = 5 + hits;

        if (this.state.series.length >= this.state.maxRounds) {
            this.endGame();
        } else {
            this.state.round++;
        }
    }

    render() {
        this.ui.meters.textContent = this.state.distance;
        this.ui.rounds.textContent = this.state.round;
        this.ui.points.textContent = this.state.points;

        if (this.state.isGameOver) {
            this.ui.finalPoints.textContent = this.state.points;
            const r1 = this.state.series.slice(0, 10).join(' ');
            const r2 = this.state.series.slice(10, 20).join(' ');
            this.ui.finalSeries.innerHTML = `<div>${r1}</div><div>${r2}</div>`;
            this.renderLeaderboardContext();
        }
    }

    switchView(viewName) {
        // Toggle main areas
        Object.keys(VIEWS).forEach(key => {
            const id = VIEWS[key];
            this.ui.areas[id].classList.toggle('d-none', id !== viewName);
        });

        // Toggle game metadata visibility
        const isGame = viewName === VIEWS.GAME;
        this.ui.areas.header.classList.toggle('d-none', !isGame);
        this.ui.areas.footer.classList.toggle('d-none', !isGame);

        if (isGame) this.render();
    }

    endGame() {
        this.state.completionTimestamp = new Date().toISOString();
        this.saveHistory();
        this.state.isGameOver = true;
        this.switchView(VIEWS.RESULTS);
    }

    resetGame() {
        // Resetting proxy requires re-assignment of properties to trigger setter
        const fresh = this.getInitialState();
        Object.keys(fresh).forEach(key => this.state[key] = fresh[key]);
        this.switchView(VIEWS.GAME);
    }

    // --- Data Management ---

    saveState() {
        localStorage.setItem(STORAGE_KEYS.CURRENT_GAME, JSON.stringify(this.state));
    }

    loadState() {
        const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_GAME);
        return stored ? JSON.parse(stored) : null;
    }

    saveHistory() {
        const history = this.getHistory();
        history.push({
            date: this.state.completionTimestamp,
            score: this.state.points,
            series: [...this.state.series] // Copy array
        });
        localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
        this.updateStatsUI();
    }

    getHistory() {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.HISTORY) || '[]');
    }

    // --- UI Rendering Helpers ---

    formatDate(dateStr) {
        if (!dateStr) return 'N/A';
        return new Intl.DateTimeFormat(undefined, { 
            month: 'short', day: 'numeric', year: 'numeric' 
        }).format(new Date(dateStr));
    }

    renderGameItem(game, rank, isCurrent = false) {
        const activeClass = isCurrent ? 'list-group-item-primary fw-bold' : '';
        const marker = isCurrent ? ' (You)' : '';
        const seriesStr = (game.series || []).join(' ');

        return `
            <li class="list-group-item ${activeClass}">
                <div class="d-flex justify-content-between align-items-center mb-1">
                    <span>${rank} <strong>${game.score}</strong> pts${marker}</span>
                    <small class="text-secondary">${this.formatDate(game.date)}</small>
                </div>
                <div class="font-monospace text-secondary" style="font-size: 0.7rem;">${seriesStr}</div>
            </li>
        `;
    }

    renderLeaderboardContext() {
        const history = this.getHistory().sort((a, b) => b.score - a.score);
        const myIndex = history.findIndex(g => g.date === this.state.completionTimestamp);
        if (myIndex === -1) return;

        const items = [];
        const start = Math.max(1, myIndex - 3);
        const end = Math.min(history.length - 1, myIndex + 3);

        // Rank #1
        items.push(this.renderGameItem(history[0], '#1', myIndex === 0));
        
        if (start > 1) items.push('<li class="list-group-item d-flex justify-content-start text-muted py-3 ps-3">...</li>');

        // Context
        for (let i = start; i <= end; i++) {
            if (i > 0) items.push(this.renderGameItem(history[i], `#${i + 1}`, i === myIndex));
        }

        if (end < history.length - 1) items.push('<li class="list-group-item d-flex justify-content-start text-muted py-3 ps-3">...</li>');

        this.ui.leaderboardContext.innerHTML = items.join('');
    }

    updateStatsUI() {
        const history = this.getHistory();
        if (!history.length) return;

        // Top 100
        const top = [...history].sort((a, b) => b.score - a.score).slice(0, 100);
        this.ui.highScoreList.innerHTML = top.map((g, i) => this.renderGameItem(g, `${i + 1}.`)).join('');

        // Full History
        const all = [...history].sort((a, b) => new Date(b.date) - new Date(a.date));
        this.ui.fullHistoryList.innerHTML = all.map(g => this.renderGameItem(g, '')).join('');
    }
}

document.addEventListener('DOMContentLoaded', () => new PuttDrill());
