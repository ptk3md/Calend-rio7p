import { appStore } from '../core/Store.js';
import { getDateFromOffset, formatDateShort, getTotalDays } from '../utils/dateUtils.js';

export class FilterComponent {
    constructor() {
        this.elements = {
            searchInput: document.getElementById('searchInput'),
            disciplineContainer: document.getElementById('disciplineFilters'),
            sliderMin: document.getElementById('sliderMin'),
            sliderMax: document.getElementById('sliderMax'),
            rangeFill: document.getElementById('rangeFill'),
            dateLabel: document.getElementById('dateRangeLabel')
        };
        
        this.totalDays = getTotalDays();
        this.init();
    }

    init() {
        this.setupSearch();
        this.setupSlider();
        
        // Subscribe to state changes to update UI if necessary (e.g. from external reset)
        appStore.subscribe('stateChange', (state) => {
            this.updateSliderUI(state.dateRange.min, state.dateRange.max);
        });
    }

    /**
     * Renders discipline buttons dynamically based on available data
     * @param {string[]} disciplines 
     */
    renderDisciplineTags(disciplines) {
        const uniqueDiscs = ['Todas', ...disciplines];
        this.elements.disciplineContainer.innerHTML = '';

        uniqueDiscs.forEach(disc => {
            const btn = document.createElement('button');
            btn.className = `tag ${disc === 'Todas' ? 'active' : ''}`;
            btn.textContent = disc;
            btn.onclick = () => {
                // UI Update
                document.querySelectorAll('.tag').forEach(t => t.classList.remove('active'));
                btn.classList.add('active');
                
                // State Update
                appStore.setState({ filterDisc: disc });
            };
            this.elements.disciplineContainer.appendChild(btn);
        });
    }

    setupSearch() {
        this.elements.searchInput.addEventListener('input', (e) => {
            appStore.setState({ searchTerm: e.target.value.toLowerCase() });
        });
    }

    setupSlider() {
        const { sliderMin, sliderMax } = this.elements;
        
        // Config max values
        sliderMin.max = this.totalDays;
        sliderMax.max = this.totalDays;
        sliderMin.value = 0;
        sliderMax.value = this.totalDays;

        const handleInput = (e) => {
            let min = parseInt(sliderMin.value);
            let max = parseInt(sliderMax.value);

            // Prevent crossover
            if (min > max - 1) {
                if (e.target === sliderMin) sliderMin.value = max - 1;
                else sliderMax.value = min + 1;
            }

            // Update State
            appStore.setState({
                dateRange: {
                    min: parseInt(sliderMin.value),
                    max: parseInt(sliderMax.value)
                }
            });
        };

        sliderMin.oninput = handleInput;
        sliderMax.oninput = handleInput;

        // Initialize Label
        this.updateSliderUI(0, this.totalDays);
    }

    updateSliderUI(min, max) {
        const pMin = (min / this.totalDays) * 100;
        const pMax = (max / this.totalDays) * 100;
        
        this.elements.rangeFill.style.left = pMin + "%";
        this.elements.rangeFill.style.width = (pMax - pMin) + "%";

        const d1 = getDateFromOffset(min);
        const d2 = getDateFromOffset(max);
        this.elements.dateLabel.innerText = `${formatDateShort(d1)} - ${formatDateShort(d2)}`;
    }
}
