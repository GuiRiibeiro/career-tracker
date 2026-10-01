// Lista inicial de times baseada no seu rascunho
const initialTeams = [
    "Accrington", "Barnet", "Bristol Rovers", "Cheltenham", "Chesterfield",
    "Colchester", "Crawley", "Crewe", "Exeter City", "Fleetwood",
    "Gillingham", "Grimsby Town", "Newport County", "Northampton", "Oldham Athletic",
    "Port Vale", "Rochdale AFC", "Rotherham", "Salford City", "Shrewsburry",
    "Swindon Town", "Tranmere Rovers", "Walsall", "York City"
];

// Carrega os dados do localStorage ou cria a estrutura do zero
export function loadData() {
    const savedData = localStorage.getItem('eafc26_career_data');
    if (savedData) {
        return JSON.parse(savedData);
    }

    // Estrutura inicial se for o primeiro acesso
    const data = {
        teams: initialTeams.map(name => ({
            name: name,
            played: 0,
            win: 0,
            draw: 0,
            loss: 0,
            goalsFor: 0,
            goalsAgainst: 0,
            points: 0,
            form: [] // Array para guardar os últimos resultados, ex: ['W', 'D', 'L']
        })),
        matches: []
    };
    
    saveData(data);
    return data;
}

// Salva os dados no localStorage
export function saveData(data) {
    localStorage.setItem('eafc26_career_data', JSON.stringify(data));
}