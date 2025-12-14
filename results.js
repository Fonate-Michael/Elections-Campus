let currentElectionType = 'presidential';

const electionTypes = {
    presidential: 'Élection Présidentielle',
    legislative: 'Élection Législative',
    municipal: 'Élections Municipales'
};

function initializeCandidates() {
    if (!localStorage.getItem('candidates')) {
        localStorage.setItem('candidates', JSON.stringify([]));
    }
}

function loadElectionTypeButtons() {
    const allCandidates = JSON.parse(localStorage.getItem('candidates') || '[]');
    const buttonsContainer = document.getElementById('electionTypeButtons');
    
    const buttons = Object.keys(electionTypes).map(type => {
        const candidatesForType = allCandidates.filter(c => c.electionType === type);
        const count = candidatesForType.length;
        const isActive = type === currentElectionType ? 'active' : '';
        const disabled = count === 0 ? 'disabled' : '';
        
        return `
            <button type="button" class="btn btn-outline-primary ${isActive}" 
                    onclick="switchElectionType('${type}')" ${disabled}>
                ${electionTypes[type]} ${count > 0 ? `(${count})` : '(0)'}
            </button>
        `;
    }).join('');
    
    buttonsContainer.innerHTML = buttons;
}

function switchElectionType(type) {
    currentElectionType = type;
    loadElectionTypeButtons();
    displayResults();
}

function displayResults() {
    initializeCandidates();
    
    const allCandidates = JSON.parse(localStorage.getItem('candidates') || '[]');
    const candidates = allCandidates.filter(c => c.electionType === currentElectionType);
    const totalVotes = candidates.reduce((sum, c) => sum + c.votes, 0);
    
    const container = document.getElementById('resultsContainer');
    
    if (candidates.length === 0) {
        container.innerHTML = `
            <div class="card shadow-sm">
                <div class="card-body p-4">
                    <div class="alert alert-warning mb-0">
                        <h5>Aucun candidat pour ${electionTypes[currentElectionType]}</h5>
                        <p class="mb-0">Aucun candidat ne s'est inscrit pour ce type d'élection.</p>
                    </div>
                </div>
            </div>
        `;
        return;
    }
    
    const sortedCandidates = [...candidates].sort((a, b) => b.votes - a.votes);
    
    let html = `
        <div class="card shadow-sm">
            <div class="card-body p-4">
                <h5 class="card-title mb-4">${electionTypes[currentElectionType]} 2024</h5>
                <div class="mb-4 p-4 bg-primary text-white rounded text-center">
                    <h3 class="mb-2">Total des Votes Exprimés: <strong>${totalVotes}</strong></h3>
                    <p class="mb-0">Total des Candidats: ${candidates.length}</p>
                </div>
    `;
    
    html += sortedCandidates.map((candidate, index) => {
        const percentage = totalVotes > 0 ? ((candidate.votes / totalVotes) * 100).toFixed(1) : 0;
        const rankBadge = `#${index + 1}`;
        
        return `
            <div class="result-bar mb-4">
                <div class="result-info mb-2">
                    <div>
                        <span class="badge bg-secondary me-2">${rankBadge}</span>
                        <strong>${candidate.name}</strong>
                        <span class="text-muted"> - ${candidate.party}</span>
                    </div>
                    <div>
                        <strong class="text-primary">${candidate.votes}</strong> votes <span class="text-muted">(${percentage}%)</span>
                    </div>
                </div>
                <div class="progress" style="height: 35px;">
                    <div class="progress-bar bg-primary" role="progressbar" style="width: ${percentage}%" aria-valuenow="${percentage}" aria-valuemin="0" aria-valuemax="100">
                        ${percentage}%
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    html += '</div></div>';
    
    container.innerHTML = html;
}

loadElectionTypeButtons();
displayResults();
setInterval(displayResults, 5000);
