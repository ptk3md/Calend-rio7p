import { rawSchedule, CONFIG } from './data/schedule.js';
import { appStore } from './core/Store.js';
import { parseDate, getTotalDays } from './utils/dateUtils.js';
import { CalendarListComponent } from './components/CalendarList.js';
import { FilterComponent } from './components/Filters.js';

class App {
    constructor() {
        this.init();
    }

    init() {
        console.log(`[App] Initializing ${CONFIG.title}...`);

        // 1. Process Data (Hydrate dates)
        const processedEvents = rawSchedule.map(item => {
            const dateObj = parseDate(item.d);
            return { 
                ...item, 
                dateObj, 
                sortTime: dateObj.getTime() 
            };
        }).sort((a, b) => a.sortTime - b.sortTime);

        // 2. Initialize Store with Data
        appStore.setState({ 
            events: processedEvents,
            dateRange: { min: 0, max: getTotalDays() }
        });

        // 3. Initialize Components
        this.filters = new FilterComponent();
        this.calendarList = new CalendarListComponent();

        // 4. Hydrate Dynamic Tags in Filters
        const uniqueDiscs = [...new Set(processedEvents.map(e => e.disc))];
        this.filters.renderDisciplineTags(uniqueDiscs);

        // 5. Setup Theme Toggle (Simple logic directly here or separate file)
        this.setupTheme();

        // 6. Initial Render Trigger
        appStore.publish('stateChange', appStore.state);
    }

    setupTheme() {
        const btn = document.getElementById('themeBtn');
        const applyTheme = (theme) => {
            document.body.setAttribute('data-theme', theme);
            // Toggle icons visibility
            btn.querySelector('.icon-moon').style.display = theme === 'dark' ? 'none' : 'block';
            btn.querySelector('.icon-sun').style.display = theme === 'dark' ? 'block' : 'none';
        };

        // Initialize from local storage or default
        const currentTheme = localStorage.getItem('theme') || 'dark';
        applyTheme(currentTheme);

        btn.addEventListener('click', () => {
            const newTheme = document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            appStore.setTheme(newTheme); // Update store
            applyTheme(newTheme);
        });
    }
}

// Start App
window.addEventListener('DOMContentLoaded', () => {
    new App();
});
