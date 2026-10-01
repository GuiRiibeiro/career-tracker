import { recalculateTable } from './logic.js';
import { saveData } from './data.js';
import { renderHistory } from './history.js';

export function initPlayoffs(appData, schedule) {
    const btnEndSeason = document.getElementById('btn-end-season');
    
    if (appData.seasonEnded) {
        btnEndSeason.textContent = "Reabrir Pontos Corridos";
        btnEndSeason.style.backgroundColor = "#ef4444";
        btnEndSeason.style.color = "#fff";
    }

    btnEndSeason.addEventListener('click', () => {
        if (!appData.seasonEnded) {
            if(confirm("Encerrar fase de pontos corridos? O G4-G7 irá para os Playoffs!")) {
                const sortedTeams = recalculateTable(appData.teams, schedule, appData.results);
                appData.playoffTeams = [sortedTeams[3], sortedTeams[4], sortedTeams[5], sortedTeams[6]];
                appData.seasonEnded = true;
                appData.playoffResults = {
                    sf1: { t1_ida: '', t2_ida: '', t1_volta: '', t2_volta: '' },
                    sf2: { t1_ida: '', t2_ida: '', t1_volta: '', t2_volta: '' },
                    final: { t1: '', t2: '' }
                };
                saveData(appData);
                location.reload();
            }
        } else {
            if(confirm("Deseja reabrir a fase de pontos corridos? Os playoffs serão apagados.")) {
                appData.seasonEnded = false;
                appData.playoffTeams = [];
                saveData(appData);
                location.reload();
            }
        }
    });

    renderBracket(appData, schedule);
}

function renderBracket(appData, schedule) {
    const container = document.getElementById('playoffs-container');
    if (!appData.seasonEnded) {
        container.innerHTML = `<div class="card"><h2 style="text-align: center; color: #888;">Fase de pontos corridos em andamento...</h2></div>`;
        return;
    }

    const p = appData.playoffTeams;
    const r = appData.playoffResults;

    // Calcula Totais Agregados
    const getAgg = (sf) => {
        if (sf.t1_ida === '' && sf.t2_ida === '' && sf.t1_volta === '' && sf.t2_volta === '') return { t1: '-', t2: '-' };
        const t1 = (sf.t1_ida !== '' ? sf.t1_ida : 0) + (sf.t1_volta !== '' ? sf.t1_volta : 0);
        const t2 = (sf.t2_ida !== '' ? sf.t2_ida : 0) + (sf.t2_volta !== '' ? sf.t2_volta : 0);
        return { t1, t2 };
    };

    const aggSf1 = getAgg(r.sf1);
    const aggSf2 = getAgg(r.sf2);

    // Determina vencedores para a final (Se ambos os jogos foram preenchidos)
    let winSf1 = null;
    if (r.sf1.t1_ida !== '' && r.sf1.t1_volta !== '') {
        if (aggSf1.t1 > aggSf1.t2) winSf1 = p[0];
        else if (aggSf1.t2 > aggSf1.t1) winSf1 = p[3];
    }

    let winSf2 = null;
    if (r.sf2.t1_ida !== '' && r.sf2.t1_volta !== '') {
        if (aggSf2.t1 > aggSf2.t2) winSf2 = p[1];
        else if (aggSf2.t2 > aggSf2.t1) winSf2 = p[2];
    }

    // Determina o Campeão da Final
    let champion = null;
    if (winSf1 && winSf2 && r.final.t1 !== '' && r.final.t2 !== '') {
        if (r.final.t1 > r.final.t2) champion = winSf1;
        else if (r.final.t2 > r.final.t1) champion = winSf2;
    }

    const renderLegSlot = (team, matchId, type, rData, aggVal) => {
        if (!team) return `<div class="team-slot pending-team">Aguardando...</div>`;
        return `
            <div class="team-slot">
                <div class="team-name-cell"><img src="img/leaguetwo/${team.abbr}.png" class="team-badge-match" onerror="this.style.display='none'"> ${team.name}</div>
                <div class="po-scores">
                    <span>Ida</span><input type="number" min="0" class="po-input" data-match="${matchId}" data-type="${type}_ida" value="${rData[`${type}_ida`]}">
                    <span>Volta</span><input type="number" min="0" class="po-input" data-match="${matchId}" data-type="${type}_volta" value="${rData[`${type}_volta`]}">
                    <div class="po-agg">${aggVal}</div>
                </div>
            </div>`;
    };

    const renderFinalSlot = (team, type, rData) => {
        if (!team) return `<div class="team-slot pending-team">Aguardando...</div>`;
        return `
            <div class="team-slot">
                <div class="team-name-cell"><img src="img/leaguetwo/${team.abbr}.png" class="team-badge-match" onerror="this.style.display='none'"> ${team.name}</div>
                <input type="number" min="0" class="po-input" data-match="final" data-type="${type}" value="${rData[type]}">
            </div>`;
    };

    let html = `
        <div class="card">
            <h2 style="text-align: center; margin-bottom: 2rem;">Mata-Mata de Acesso (Playoffs)</h2>
            <p style="text-align: center; font-size: 0.85rem; color: #666; margin-top: -1.5rem; margin-bottom: 1.5rem;">*Em caso de desempate por pênaltis, adicione +1 gol manualmente no placar do vencedor.</p>
            <div class="bracket">
                <div class="bracket-col semis">
                    <div class="matchup">
                        <h4>Semifinal 1</h4>
                        ${renderLegSlot(p[0], 'sf1', 't1', r.sf1, aggSf1.t1)}
                        ${renderLegSlot(p[3], 'sf1', 't2', r.sf1, aggSf1.t2)}
                    </div>
                    <div class="matchup">
                        <h4>Semifinal 2</h4>
                        ${renderLegSlot(p[1], 'sf2', 't1', r.sf2, aggSf2.t1)}
                        ${renderLegSlot(p[2], 'sf2', 't2', r.sf2, aggSf2.t2)}
                    </div>
                </div>
                <div class="bracket-col final">
                    <div class="matchup" style="border-color: #eab308; border-width: 2px;">
                        <h4 style="color: #eab308;">Final (Wembley)</h4>
                        ${renderFinalSlot(winSf1, 't1', r.final)}
                        ${renderFinalSlot(winSf2, 't2', r.final)}
                    </div>
                </div>
            </div>
        </div>
    `;

    // Banner do Campeão e Salvar Temporada
    if (champion) {
        html += `
            <div class="champion-banner">
                <img src="img/leaguetwo/${champion.abbr}.png" style="width: 80px; height: 80px; object-fit: contain; margin-bottom: 1rem;" onerror="this.style.display='none'">
                <h2>🏆 ${champion.name.toUpperCase()} 🏆</h2>
                <p>Vencedor dos Playoffs e Promovido!</p>
                <button id="btn-next-season" style="background: #fff; color: #ca8a04; padding: 1rem 2rem; border: none; border-radius: 6px; font-weight: 800; cursor: pointer; font-size: 1.1rem; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
                    Encerrar Temporada ${appData.currentSeason} e Iniciar Nova
                </button>
            </div>
        `;
    }

    container.innerHTML = html;

    // Listeners de input dos playoffs
    document.querySelectorAll('.po-input').forEach(input => {
        input.addEventListener('input', (e) => {
            const matchId = e.target.dataset.match;
            const type = e.target.dataset.type;
            const val = e.target.value;
            appData.playoffResults[matchId][type] = val !== '' ? parseInt(val) : '';
            saveData(appData);
            renderBracket(appData, schedule); // Re-renderiza na hora para calcular agregados
        });
    });

    // Listener para avançar de temporada
    const btnNext = document.getElementById('btn-next-season');
    if (btnNext) {
        btnNext.addEventListener('click', () => {
            if (confirm(`Atenção: Isso salvará a Temporada ${appData.currentSeason} no histórico e ZERARÁ a tabela para uma nova temporada. Deseja prosseguir?`)) {
                
                const sortedTeams = recalculateTable(appData.teams, schedule, appData.results);
                
                // Salva o snapshot da temporada no histórico
                appData.history.push({
                    seasonNumber: appData.currentSeason,
                    promoted: [sortedTeams[0], sortedTeams[1], sortedTeams[2]], // Top 3
                    playoffWinner: champion,
                    relegated: [sortedTeams[22], sortedTeams[23]] // Últimos 2
                });

                // Zera os dados para a próxima
                appData.currentSeason++;
                appData.seasonEnded = false;
                appData.results = {};
                appData.playoffTeams = [];
                appData.playoffResults = {
                    sf1: { t1_ida: '', t2_ida: '', t1_volta: '', t2_volta: '' },
                    sf2: { t1_ida: '', t2_ida: '', t1_volta: '', t2_volta: '' },
                    final: { t1: '', t2: '' }
                };
                
                saveData(appData);
                location.reload();
            }
        });
    }
}