import { recalculateTable } from './logic.js';

export function renderStats(appData, schedule) {
    const container = document.getElementById('stats-container');
    const select = document.getElementById('my-team-select');
    
    // Preenche o dropdown de times se estiver vazio
    if (select.options.length <= 1) {
        const sortedNames = [...appData.teams].sort((a,b) => a.name.localeCompare(b.name));
        sortedNames.forEach(t => {
            const opt = document.createElement('option');
            opt.value = t.abbr;
            opt.textContent = t.name;
            select.appendChild(opt);
        });
        if (appData.myTeam) select.value = appData.myTeam;
    }

    const myTeamAbbr = select.value;
    const teamsStats = recalculateTable(appData.teams, schedule, appData.results);
    
    // Verifica se há jogos registrados
    if (Object.keys(appData.results).length === 0) {
        container.innerHTML = '<p style="text-align:center; grid-column: 1 / -1;">Nenhum jogo registrado para calcular estatísticas.</p>';
        return;
    }

    // 1. Melhor Ataque
    const bestAttack = [...teamsStats].sort((a, b) => b.goalsFor - a.goalsFor)[0];
    // 2. Melhor Defesa (menor número de gols sofridos)
    const bestDefense = [...teamsStats].sort((a, b) => a.goalsAgainst - b.goalsAgainst)[0];
    
    // 3. Maior Goleada
    let biggestWinDiff = -1;
    let biggestWinMatch = null;
    
    schedule.forEach(m => {
        const r = appData.results[m.id];
        if (r) {
            const diff = Math.abs(r.h - r.a);
            if (diff > biggestWinDiff) {
                biggestWinDiff = diff;
                biggestWinMatch = { ...m, ...r };
            }
        }
    });

    // 4. Monta o HTML dos cartões
    let html = `
        <div class="stat-card">
            <h3>Melhor Ataque</h3>
            <div class="stat-value">${bestAttack.name}</div>
            <p>${bestAttack.goalsFor} Gols Pró</p>
        </div>
        <div class="stat-card">
            <h3>Melhor Defesa</h3>
            <div class="stat-value">${bestDefense.name}</div>
            <p>${bestDefense.goalsAgainst} Gols Sofridos</p>
        </div>
        <div class="stat-card">
            <h3>Maior Goleada</h3>
            <div class="stat-value">${biggestWinMatch.h} x ${biggestWinMatch.a}</div>
            <p>${biggestWinMatch.home} x ${biggestWinMatch.away}</p>
        </div>
    `;

    // 5. Adiciona os dados do Seu Time (se selecionado)
    if (myTeamAbbr) {
        const myTeam = teamsStats.find(t => t.abbr === myTeamAbbr);
        const winRate = myTeam.played > 0 ? Math.round((myTeam.points / (myTeam.played * 3)) * 100) : 0;
        const formHtml = myTeam.form.map(r => `<span class="form-ball form-${r.toLowerCase()}"></span>`).join('');
        
        html += `
            <div class="stat-card my-team-card">
                <h3>Aproveitamento (${myTeam.name})</h3>
                <div class="stat-value">${winRate}%</div>
                <p>Posição: <strong>${teamsStats.indexOf(myTeam) + 1}º</strong> | Pontos: <strong>${myTeam.points}</strong></p>
                <div class="form-balls" style="margin-top: 10px;">${formHtml}</div>
            </div>
        `;
    }

    container.innerHTML = html;
}