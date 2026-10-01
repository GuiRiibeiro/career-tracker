import { loadData } from './data.js';
import { renderTable, initMatchesUI } from './ui.js';
import { schedule } from './schedule.js';

function init() {
    const appData = loadData();
    renderTable(appData, schedule);
    initMatchesUI(appData, schedule);
}

document.addEventListener('DOMContentLoaded', init);