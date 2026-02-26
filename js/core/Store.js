export class Store {
    constructor() {
        this.events = {};
        this.state = {
            events: [],
            filterDisc: 'Todas',
            searchTerm: '',
            dateRange: { min: 0, max: 100 },
            theme: localStorage.getItem('theme') || 'dark'
        };
    }

    /**
     * @param {string} event 
     * @param {Function} callback 
     */
    subscribe(event, callback) {
        if (!this.events[event]) this.events[event] = [];
        this.events[event].push(callback);
    }

    /**
     * @param {string} event 
     * @param {any} data 
     */
    publish(event, data = {}) {
        if (this.events[event]) {
            this.events[event].forEach(cb => cb(this.state, data));
        }
    }

    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.publish('stateChange', this.state);
    }

    // Ações específicas
    setTheme(theme) {
        this.setState({ theme });
        localStorage.setItem('theme', theme);
        this.publish('themeChange', theme);
    }
}

export const appStore = new Store();
