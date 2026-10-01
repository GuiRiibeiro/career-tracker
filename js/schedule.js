export const schedule = [];

// Arrays baseados nos seus confrontos da Rodada 01
const t1 = ["ACC", "BAR", "BRR", "CHE", "CHF", "CRA", "CRE", "EXE", "FLE", "GIL", "GRI", "NOR"];
const t2 = ["YOR", "ROT", "COL", "SAL", "SWI", "PTV", "WAL", "TRA", "NWP", "SHR", "ROC", "OLD"];

// Gerador Provisório de 46 Rodadas (Turno e Returno)
for (let round = 1; round <= 23; round++) {
    for (let i = 0; i < 12; i++) {
        let home = t1[i];
        let away = t2[i];
        
        // Alterna mandos de campo para equilibrar
        if (i % 2 === round % 2) {
            [home, away] = [away, home];
        }
        
        // Turno
        schedule.push({ round, home, away, id: `${home}_${away}` });
        // Returno (inverte mandante/visitante e soma 23 na rodada)
        schedule.push({ round: round + 23, home: away, away: home, id: `${away}_${home}` });
    }
    
    // Rotação do algoritmo de todos contra todos (mantém t1[0] fixo)
    const lastT1 = t1.pop();
    const firstT2 = t2.shift();
    t1.splice(1, 0, firstT2);
    t2.push(lastT1);
}

// Ordena o calendário por rodadas
schedule.sort((a, b) => a.round - b.round);