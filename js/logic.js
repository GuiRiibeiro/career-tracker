export function calculateGoalDifference(goalsFor, goalsAgainst) {
    return goalsFor - goalsAgainst;
}

export function recalculateTable(teams, schedule, results) {
    // 1. Zera estatísticas
    const stats = {};
    teams.forEach(t => {
        stats[t.abbr] = {
            ...t, played: 0, win: 0, draw: 0, loss: 0,
            goalsFor: 0, goalsAgainst: 0, points: 0, form: []
        };
    });

    // 2. Aplica resultados de forma cronológica
    schedule.forEach(match => {
        const result = results[match.id];
        if (result) {
            const h = stats[match.home];
            const a = stats[match.away];
            const gh = result.h;
            const ga = result.a;

            h.played++; a.played++;
            h.goalsFor += gh; h.goalsAgainst += ga;
            a.goalsFor += ga; a.goalsAgainst += gh;

            if (gh > ga) {
                h.win++; h.points += 3; h.form.push('W');
                a.loss++; a.form.push('L');
            } else if (gh < ga) {
                a.win++; a.points += 3; a.form.push('W');
                h.loss++; h.form.push('L');
            } else {
                h.draw++; h.points += 1; h.form.push('D');
                a.draw++; a.points += 1; a.form.push('D');
            }
        }
    });

    // Mantém apenas os últimos 5 jogos na forma
    Object.values(stats).forEach(t => {
        if (t.form.length > 5) t.form = t.form.slice(-5);
    });

    // 3. Ordena
    return Object.values(stats).sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        const sgA = calculateGoalDifference(a.goalsFor, a.goalsAgainst);
        const sgB = calculateGoalDifference(b.goalsFor, b.goalsAgainst);
        if (sgB !== sgA) return sgB - sgA;
        if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
        return a.name.localeCompare(b.name);
    });
}