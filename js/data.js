// Lista Oficial League Two 24/25 (Extraída das Imagens do Calendário)
const initialTeams = [
    { name: "Accrington Stanley", abbr: "ACC" },
    { name: "AFC Wimbledon", abbr: "WIM" },
    { name: "Barrow AFC", abbr: "BAW" }, // Sigla nova BAW para evitar puxar escudo do Barnet
    { name: "Bradford City", abbr: "BRA" },
    { name: "Bromley", abbr: "BRO" },
    { name: "Carlisle United", abbr: "CAR" },
    { name: "Cheltenham Town", abbr: "CHE" },
    { name: "Chesterfield", abbr: "CHF" },
    { name: "Colchester", abbr: "COL" },
    { name: "Crewe Alexandra", abbr: "CRE" },
    { name: "Doncaster Rovers", abbr: "DON" },
    { name: "Fleetwood Town", abbr: "FLE" },
    { name: "Gillingham", abbr: "GIL" },
    { name: "Grimsby Town", abbr: "GRI" },
    { name: "Harrogate Town", abbr: "HAR" },
    { name: "MK Dons", abbr: "MKD" },
    { name: "Morecambe", abbr: "MOR" },
    { name: "Newport County", abbr: "NWP" },
    { name: "Notts County", abbr: "NOT" },
    { name: "Port Vale", abbr: "PTV" },
    { name: "Salford City", abbr: "SAL" },
    { name: "Swindon Town", abbr: "SWI" },
    { name: "Tranmere Rovers", abbr: "TRA" },
    { name: "Walsall", abbr: "WAL" }
];

export function loadData() {
    let savedData = localStorage.getItem('eafc26_career_data_v4'); 
    if (savedData) {
        let parsedData = JSON.parse(savedData);
        
        if (!parsedData.currentSeason) parsedData.currentSeason = 1;
        if (!parsedData.history) parsedData.history = [];
        if (!parsedData.playoffResults) {
            parsedData.playoffResults = {
                sf1: { t1_ida: '', t2_ida: '', t1_volta: '', t2_volta: '', t1_pk: '', t2_pk: '' },
                sf2: { t1_ida: '', t2_ida: '', t1_volta: '', t2_volta: '', t1_pk: '', t2_pk: '' },
                final: { t1: '', t2: '', t1_pk: '', t2_pk: '' }
            };
        }
        if (!parsedData.cupResults) {
            parsedData.cupResults = { facup: {}, carabao: {}, efltrophy: {} };
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
            sf1: { t1_ida: '', t2_ida: '', t1_volta: '', t2_volta: '', t1_pk: '', t2_pk: '' },
            sf2: { t1_ida: '', t2_ida: '', t1_volta: '', t2_volta: '', t1_pk: '', t2_pk: '' },
            final: { t1: '', t2: '', t1_pk: '', t2_pk: '' }
        },
        cupResults: { facup: {}, carabao: {}, efltrophy: {} }
    };
    
    saveData(data);
    return data;
}

export function saveData(data) {
    localStorage.setItem('eafc26_career_data_v4', JSON.stringify(data));
}