const initialTeams = [
    { name: "Accrington", abbr: "ACC" }, { name: "Barnet", abbr: "BAR" },
    { name: "Bristol Rovers", abbr: "BRR" }, { name: "Cheltenham", abbr: "CHE" },
    { name: "Chesterfield", abbr: "CHF" }, { name: "Colchester", abbr: "COL" },
    { name: "Crawley", abbr: "CRA" }, { name: "Crewe", abbr: "CRE" },
    { name: "Exeter City", abbr: "EXE" }, { name: "Fleetwood", abbr: "FLE" },
    { name: "Gillingham", abbr: "GIL" }, { name: "Grimsby Town", abbr: "GRI" },
    { name: "Newport County", abbr: "NWP" }, { name: "Northampton", abbr: "NOR" },
    { name: "Oldham Athletic", abbr: "OLD" }, { name: "Port Vale", abbr: "PTV" },
    { name: "Rochdale AFC", abbr: "ROC" }, { name: "Rotherham", abbr: "ROT" },
    { name: "Salford City", abbr: "SAL" }, { name: "Shrewsbury", abbr: "SHR" },
    { name: "Swindon Town", abbr: "SWI" }, { name: "Tranmere Rovers", abbr: "TRA" },
    { name: "Walsall", abbr: "WAL" }, { name: "York City", abbr: "YOR" }
];

export function loadData() {
    let savedData = localStorage.getItem('eafc26_career_data');
    if (savedData) {
        let parsedData = JSON.parse(savedData);
        // Migração ou inicialização de results
        if (!parsedData.results) parsedData.results = {};
        return parsedData;
    }

    const data = {
        teams: initialTeams.map(t => ({ name: t.name, abbr: t.abbr })),
        results: {} // Guarda placares { "ACC_YOR": { h: 1, a: 0 } }
    };
    
    saveData(data);
    return data;
}

export function saveData(data) {
    localStorage.setItem('eafc26_career_data', JSON.stringify(data));
}