import { appStore } from '../core/Store.js';
import { formatBoxDate, getDateFromOffset } from '../utils/dateUtils.js';

export class CalendarListComponent {
    constructor() {
        this.container = document.getElementById('eventsContainer');
        this.counter = document.getElementById('countDisplay');
        this.init();
    }

    init() {
        // Subscribe to Store updates
        appStore.subscribe('stateChange', (state) => {
            this.render(state);
        });
    }

    /**
     * Core render logic
     * @param {Object} state 
     */
    render(state) {
        const { events, filterDisc, searchTerm, dateRange } = state;

        // 1. Filter Data
        const rStart = getDateFromOffset(dateRange.min);
        const rEnd = getDateFromOffset(dateRange.max);

        const filtered = events.filter(ev => {
            // Note: dateObj is created in Main and passed to store
            const inDate = ev.dateObj >= rStart && ev.dateObj <= rEnd;
            const inDisc = filterDisc === 'Todas' || ev.disc === filterDisc;
            const inSearch = ev.title.toLowerCase().includes(searchTerm) || 
                           ev.disc.toLowerCase().includes(searchTerm);
            
            return inDate && inDisc && inSearch;
        });

        // 2. Update Counter
        this.counter.innerText = filtered.length;

        // 3. Clear Container
        this.container.innerHTML = '';

        // 4. Handle Empty State
        if (filtered.length === 0) {
            this.container.innerHTML = `
                <div class="empty-state">
                    <div style="font-size: 2rem; margin-bottom:10px;">🍃</div>
                    Nenhuma atividade encontrada neste período.
                </div>`;
            return;
        }

        // 5. Render Cards
        const fragment = document.createDocumentFragment();
        
        filtered.forEach((ev, idx) => {
            const { day, month } = formatBoxDate(ev.dateObj);
            
            const card = document.createElement('div');
            card.className = `event-card type-${ev.type}`;
            // Stagger animation
            card.style.animationDelay = `${Math.min(idx * 0.05, 0.5)}s`;

            card.innerHTML = `
                <div class="date-box">
                    ${day}<span>${month}</span>
                </div>
                <div class="info-box">
                    <div class="event-name">${ev.title}</div>
                    <div class="event-disc">${ev.disc}</div>
                </div>
                <div class="type-indicator" title="${ev.type}"></div>
            `;
            fragment.appendChild(card);
        });

        this.container.appendChild(fragment);
    }
}
