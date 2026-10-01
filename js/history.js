export function renderHistory(appData) {
    const container = document.getElementById('history-container');
    
    // Atualiza o título do header global
    document.getElementById('season-display').textContent = `TEMPORADA ${appData.currentSeason}`;

    if (!appData.history || appData.history.length === 0) {
        container.innerHTML = '<div class="card" style="grid-column: 1 / -1; text-align: center;"><p>Nenhuma temporada concluída ainda.</p></div>';
        return;
    }

    let html = '';
    
    appData.history.forEach(hist => {
        const renderTeamItem = (team) => `
            <li>
                <div class="team-name-cell">
                    <img src="img/leaguetwo/${team.abbr}.png" class="team-badge-table" onerror="this.style.display='none'"> 
                    <strong>${team.name}</strong>
                </div>
            </li>`;

        html += `
            <div class="history-card">
                <h3>Temporada ${hist.seasonNumber}</h3>
                <p style="font-size: 0.8rem; color: #666; text-transform: uppercase; margin-bottom: 0.5rem; font-weight: 700;">Promovidos (Acesso Direto)</p>
                <ul class="history-list">
                    ${hist.promoted.map(t => renderTeamItem(t)).join('')}
                </ul>
                
                <p style="font-size: 0.8rem; color: var(--playoffs); text-transform: uppercase; margin-top: 1rem; margin-bottom: 0.5rem; font-weight: 700;">Campeão dos Playoffs</p>
                <ul class="history-list">
                    ${renderTeamItem(hist.playoffWinner)}
                </ul>

                <p style="font-size: 0.8rem; color: var(--relegated); text-transform: uppercase; margin-top: 1rem; margin-bottom: 0.5rem; font-weight: 700;">Rebaixados</p>
                <ul class="history-list">
                    ${hist.relegated.map(t => renderTeamItem(t)).join('')}
                </ul>
            </div>
        `;
    });

    container.innerHTML = html;
}