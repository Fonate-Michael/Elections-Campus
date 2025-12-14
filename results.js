function initializeCandidates() {
    const defaultCandidates = [
        {
            id: 1,
            name: "Jean Anderson",
            party: "Parti Démocratique",
            image: "https://i.pravatar.cc/150?img=12",
            votes: 0
        },
        {
            id: 2,
            name: "Sarah Mitchell",
            party: "Parti Républicain",
            image: "https://i.pravatar.cc/150?img=45",
            votes: 0
        },
        {
            id: 3,
            name: "Michel Chen",
            party: "Parti Indépendant",
            image: "https://i.pravatar.cc/150?img=33",
            votes: 0
        },
        {
            id: 4,
            name: "Émilie Rodriguez",
            party: "Parti Vert",
            image: "https://i.pravatar.cc/150?img=47",
            votes: 0
        },
        {
            id: 5,
            name: "David Thompson",
            party: "Parti Libéral",
            image: "https://i.pravatar.cc/150?img=15",
            votes: 0
        },
        {
            id: 6,
            name: "Jennifer Williams",
            party: "Parti Progressiste",
            image: "https://i.pravatar.cc/150?img=20",
            votes: 0
        },
        {
            id: 7,
            name: "Robert Martinez",
            party: "Parti Conservateur",
            image: "https://i.pravatar.cc/150?img=8",
            votes: 0
        },
        {
            id: 8,
            name: "Lisa Johnson",
            party: "Parti de l'Unité",
            image: "https://i.pravatar.cc/150?img=9",
            votes: 0
        }
    ];
    
    if (!localStorage.getItem('candidates')) {
        localStorage.setItem('candidates', JSON.stringify(defaultCandidates));
    }
}

function displayResults() {
    initializeCandidates();
    
    const candidates = JSON.parse(localStorage.getItem('candidates') || '[]');
    const totalVotes = candidates.reduce((sum, c) => sum + c.votes, 0);
    
    const container = document.getElementById('resultsContainer');
    
    if (candidates.length === 0) {
        container.innerHTML = '<div class="alert alert-warning">Aucun candidat trouvé. Veuillez actualiser la page.</div>';
        return;
    }
    
    const sortedCandidates = [...candidates].sort((a, b) => b.votes - a.votes);
    
    let html = `
        <div class="mb-4 p-4 bg-primary text-white rounded text-center">
            <h3 class="mb-2">Total des Votes Exprimés: <strong>${totalVotes}</strong></h3>
            <p class="mb-0">Total des Candidats: ${candidates.length}</p>
        </div>
    `;
    
    html += sortedCandidates.map((candidate, index) => {
        const percentage = totalVotes > 0 ? ((candidate.votes / totalVotes) * 100).toFixed(1) : 0;
        const rankBadge = index === 0 ? '#1' : index === 1 ? '#2' : index === 2 ? '#3' : `#${index + 1}`;
        
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
    
    container.innerHTML = html;
}

displayResults();
setInterval(displayResults, 5000);
