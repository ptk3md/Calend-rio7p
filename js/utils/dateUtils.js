import { CONFIG } from '../data/schedule.js';

const startDate = new Date(CONFIG.semesterStart);
const endDate = new Date(CONFIG.semesterEnd);

export const getTotalDays = () => {
    return Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
};

export const parseDate = (dayStr) => {
    const [day, month] = dayStr.split('/').map(Number);
    // Assumindo ano da config
    return new Date(CONFIG.year, month - 1, day);
};

export const getDateFromOffset = (offset) => {
    const d = new Date(startDate);
    d.setDate(d.getDate() + offset);
    return d;
};

export const formatDateShort = (date) => {
    return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' }).format(date);
};

export const formatBoxDate = (date) => {
    return { 
        day: date.getDate().toString().padStart(2,'0'), 
        month: new Intl.DateTimeFormat('pt-BR',{month:'short'}).format(date).replace('.','') 
    };
};
