import { recalculateTable, calculateGoalDifference } from './logic.js';
import { saveData } from './data.js';

let currentRound = 1;

export function renderTable(appData, schedule) {
    const tbody = document.querySelector('#league-table tbody');
    tbody.innerHTML = '';

    const sortedTeams = recalculateTable(appData.teams, schedule, appData.results);

    sortedTeams.forEach((team, index) => {
        const pos = index + 1;
        const tr = document.createElement('tr');
        
        if (pos <= 3) tr.classList.add('pos-promoted');
        else if (pos >= 4 && pos <= 7) tr.classList.add('pos-playoffs');
        else if (pos >= 23) tr.classList.add('pos-relegated');

        const sg = calculateGoalDifference(team.goalsFor, team.goalsAgainst);
        const formHtml = team.form.map(r => `<span class="form-ball form-${r.toLowerCase()}"></span>`).join('');

        tr.innerHTML = `
            <td>${pos}</td>
            <td class="col-clube">${team.name}</td>
            <td>${team.played}</td>
            <td>${team.win}</td>
            <td>${team.draw}</td>
            <td>${team.loss}</td>
            <td>${team.goalsFor}</td>
            <td>${team.goalsAgainst}</td>
            <td>${sg}</td>
            <td><strong>${team.points}</strong></td>
            <td><div class="form-balls">${formHtml}</div></td>
        `;
        tbody.appendChild(tr);
    });
}

export function initMatchesUI(appData, schedule) {
    const title = document.getElementById('round-title');
    const container = document.getElementById('matches-list');
    
    document.getElementById('btn-prev').addEventListener('click', () => changeRound(-1));
    document.getElementById('btn-next').addEventListener('click', () => changeRound(1));

    // Novo evento: Limpar rodada
    document.getElementById('btn-clear-round').addEventListener('click', () => {
        if (confirm(`Tem certeza que deseja limpar todos os placares da Rodada ${currentRound}?`)) {
            const matches = schedule.filter(m => m.round === currentRound);
            matches.forEach(match => {
                delete appData.results[match.id];
            });
            saveData(appData);
            renderTable(appData, schedule);
            renderMatches();
        }
    });

    function changeRound(delta) {
        currentRound += delta;
        if (currentRound < 1) currentRound = 1;
        if (currentRound > 46) currentRound = 46;
        renderMatches();
    }

    function renderMatches() {
        title.textContent = `RODADA ${currentRound.toString().padStart(2, '0')}`;
        container.innerHTML = '';
        
        const matches = schedule.filter(m => m.round === currentRound);
        
        matches.forEach(match => {
            const result = appData.results[match.id] || { h: '', a: '' };
            const div = document.createElement('div');
            div.className = 'match-row';
            div.innerHTML = `
                <span class="team-abbr">${match.home}</span>
                <input type="number" min="0" class="score-input home-score" data-id="${match.id}" data-type="h" value="${result.h}">
                <span class="vs">X</span>
                <input type="number" min="0" class="score-input away-score" data-id="${match.id}" data-type="a" value="${result.a}">
                <span class="team-abbr">${match.away}</span>
            `;
            container.appendChild(div);
        });

        document.querySelectorAll('.score-input').forEach(input => {
            input.addEventListener('input', (e) => {
                const row = e.target.closest('.match-row');
                const id = e.target.dataset.id;
                const hVal = row.querySelector('.home-score').value;
                const aVal = row.querySelector('.away-score').value;

                if (hVal !== '' && aVal !== '') {
                    appData.results[id] = { h: parseInt(hVal), a: parseInt(aVal) };
                } else {
                    delete appData.results[id];
                }
                
                saveData(appData);
                renderTable(appData, schedule);
            });
        });
    }

    renderMatches();
}