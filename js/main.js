import { loadData, saveData } from './data.js';
import { renderTable, initMatchesUI } from './ui.js';
import { schedule } from './schedule.js';
import { renderStats } from './stats.js';
import { initPlayoffs } from './playoffs.js';
import { renderHistory } from './history.js'; // NOVO IMPORT

let appData;

function init() {
    appData = loadData();
    renderTable(appData, schedule);
    initMatchesUI(appData, schedule);
    initPlayoffs(appData, schedule);
    renderHistory(appData); // NOVO
    setupExportImport();
    setupTabs();
}

function setupTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.view-section').forEach(s => s.classList.remove('active'));
            
            const targetId = e.target.getAttribute('data-target');
            e.target.classList.add('active');
            document.getElementById(targetId).classList.add('active');

            if (targetId === 'view-stats') renderStats(appData, schedule);
        });
    });

    document.getElementById('my-team-select').addEventListener('change', (e) => {
        appData.myTeam = e.target.value;
        saveData(appData);
        renderStats(appData, schedule);
    });
}

function setupExportImport() {
    document.getElementById('btn-export').addEventListener('click', () => {
        const dataStr = localStorage.getItem('eafc26_career_data');
        if (!dataStr) return alert("Nenhum dado para exportar.");
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = "eafc26_career_backup.json";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    const fileInput = document.getElementById('input-import');
    document.getElementById('btn-import').addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target.result);
                if (importedData.teams && importedData.results) {
                    localStorage.setItem('eafc26_career_data', JSON.stringify(importedData));
                    alert("Dados importados com sucesso!");
                    location.reload(); 
                } else {
                    alert("Arquivo JSON inválido.");
                }
            } catch (error) {
                alert("Erro ao ler o arquivo JSON.");
            }
        };
        reader.readAsText(file);
        event.target.value = ''; 
    });
}

document.addEventListener('DOMContentLoaded', init);