const initialTeams = [
    { name: "Accrington", abbr: "ACC" }, { name: "Barnet", abbr: "BAR" },
    { name: "Bristol Rovers", abbr: "BRR" }, { name: "Cheltenham", abbr: "CHE" },
    { name: "Chesterfield", abbr: "CHF" }, { name: "Colchester", abbr: "COL" },
    { name: "Crawley", abbr: "CRA" }, { name: "Crewe", abbr: "CRE" },
    { name: "Exeter City", abbr: "EXE" }, { name: "Fleetwood", abbr: "FLE" },
    { name: "Gillingham", abbr: "GIL" }, { name: "Grimsby", abbr: "GRI" },
    { name: "Newport", abbr: "NWP" }, { name: "Northampton", abbr: "NOR" },
    { name: "Oldham", abbr: "OLD" }, { name: "Port Vale", abbr: "PTV" },
    { name: "Rochdale", abbr: "ROC" }, { name: "Rotherham", abbr: "ROT" },
    { name: "Salford City", abbr: "SAL" }, { name: "Shrewsbury", abbr: "SHR" },
    { name: "Swindon", abbr: "SWI" }, { name: "Tranmere Rovers", abbr: "TRA" },
    { name: "Walsall", abbr: "WAL" }, { name: "York City", abbr: "YOR" }
];

export function loadData() {
    let savedData = localStorage.getItem('eafc26_career_data');
    if (savedData) {
        let parsedData = JSON.parse(savedData);
        
        // Migração para Suporte a Temporadas e Ida/Volta
        if (!parsedData.currentSeason) parsedData.currentSeason = 1;
        if (!parsedData.history) parsedData.history = [];
        if (!parsedData.playoffResults || typeof parsedData.playoffResults.sf1.t1_ida === 'undefined') {
            parsedData.playoffResults = {
                sf1: { t1_ida: '', t2_ida: '', t1_volta: '', t2_volta: '' },
                sf2: { t1_ida: '', t2_ida: '', t1_volta: '', t2_volta: '' },
                final: { t1: '', t2: '' }
            };
        }
        
        parsedData.teams = parsedData.teams.map(t => {
            const updatedTeam = initialTeams.find(it => it.abbr === t.abbr);
            return { ...t, name: updatedTeam ? updatedTeam.name : t.name };
        });
        
        return parsedData;
    }

    const data = {
        teams: initialTeams.map(t => ({ name: t.name, abbr: t.abbr })),
        results: {},
        seasonEnded: false,
        playoffTeams: [],
        currentSeason: 1,
        history: [],
        playoffResults: {
            sf1: { t1_ida: '', t2_ida: '', t1_volta: '', t2_volta: '' },
            sf2: { t1_ida: '', t2_ida: '', t1_volta: '', t2_volta: '' },
            final: { t1: '', t2: '' }
        }
    };
    
    saveData(data);
    return data;
}

export function saveData(data) {
    localStorage.setItem('eafc26_career_data', JSON.stringify(data));
}