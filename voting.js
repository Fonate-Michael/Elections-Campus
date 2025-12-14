const currentVoterId = sessionStorage.getItem('currentVoterId');
if (!currentVoterId) {
    alert('Veuillez d\'abord vérifier votre identifiant de vote!');
    window.location.href = 'verify.html';
}

const candidates = [
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

function initializeCandidates() {
    const stored = localStorage.getItem('candidates');
    if (!stored) {
        localStorage.setItem('candidates', JSON.stringify(candidates));
        console.log('Candidats initialisés:', candidates.length);
    } else {
        const parsed = JSON.parse(stored);
        if (parsed.length === 0) {
            localStorage.setItem('candidates', JSON.stringify(candidates));
            console.log('Candidats réinitialisés:', candidates.length);
        }
    }
}

function initializeTestVoter() {
    const voters = JSON.parse(localStorage.getItem('voters') || '[]');
    if (voters.length === 0) {
        const testVoter = {
            votingId: 'TEST-12345678',
            fullName: 'Utilisateur Test',
            phoneNumber: '1234567890',
            idCardNumber: 'ID123456',
            department: 'Informatique',
            region: 'Nord',
            registrationDate: new Date().toLocaleString('fr-FR'),
            hasVoted: false
        };
        voters.push(testVoter);
        localStorage.setItem('voters', JSON.stringify(voters));
        console.log('Électeur test créé avec l\'ID: TEST-12345678');
    }
}

initializeCandidates();
initializeTestVoter();

function displayCandidates() {
    const container = document.getElementById('candidatesContainer');
    if (!container) {
        console.error('Conteneur de candidats introuvable!');
        return;
    }

    const candidatesToShow = JSON.parse(localStorage.getItem('candidates')) || candidates;

    console.log('Affichage des candidats:', candidatesToShow);

    if (!candidatesToShow || candidatesToShow.length === 0) {
        container.innerHTML = '<div class="col-12 text-center"><p class="text-danger">Aucun candidat disponible</p></div>';
        return;
    }

    container.innerHTML = candidatesToShow.map(candidate => `
        <div class="col-md-6 col-lg-3">
            <div class="card candidate-card h-100 shadow-sm">
                <div class="card-body text-center p-4">
                    <img src="${candidate.image}" alt="${candidate.name}" class="candidate-img mb-3">
                    <h5 class="card-title">${candidate.name}</h5>
                    <p class="text-muted mb-3">${candidate.party}</p>
                    <div class="mb-2">
                        <small class="text-primary fw-bold">${candidate.votes} votes</small>
                    </div>
                    <button class="btn btn-primary w-100" onclick="openVoteModal(${candidate.id}, '${candidate.name}', '${candidate.party}')">
                        Voter
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

let selectedCandidateId = null;

function openVoteModal(id, name, party) {
    selectedCandidateId = id;
    document.getElementById('selectedCandidateName').textContent = name;
    document.getElementById('selectedCandidateParty').textContent = party;
    const modal = new bootstrap.Modal(document.getElementById('voteModal'));
    modal.show();
}

function confirmVote() {
    const candidates = JSON.parse(localStorage.getItem('candidates'));
    const candidate = candidates.find(c => c.id === selectedCandidateId);
    candidate.votes++;
    localStorage.setItem('candidates', JSON.stringify(candidates));

    const voters = JSON.parse(localStorage.getItem('voters'));
    const voter = voters.find(v => v.votingId === currentVoterId);
    voter.hasVoted = true;
    voter.votedFor = candidate.name;
    voter.votedAt = new Date().toLocaleString('fr-FR');

    const transactionId = 'TXN-' + Date.now().toString().slice(-10);
    voter.transactionId = transactionId;

    localStorage.setItem('voters', JSON.stringify(voters));

    const voteModal = bootstrap.Modal.getInstance(document.getElementById('voteModal'));
    voteModal.hide();

    showVoteReceipt(voter, candidate);
}

function showVoteReceipt(voter, candidate) {
    document.getElementById('receiptVoterId').textContent = voter.votingId;
    document.getElementById('receiptVoterName').textContent = voter.fullName;
    document.getElementById('receiptVoterDept').textContent = voter.department;
    document.getElementById('receiptVoterRegion').textContent = voter.region;
    document.getElementById('receiptCandidateName').textContent = candidate.name;
    document.getElementById('receiptCandidateParty').textContent = candidate.party;
    document.getElementById('receiptDateTime').textContent = voter.votedAt;
    document.getElementById('receiptTransactionId').textContent = voter.transactionId;

    const receiptModal = new bootstrap.Modal(document.getElementById('voteReceiptModal'));
    receiptModal.show();
}

function printVoteReceipt() {
    const voters = JSON.parse(localStorage.getItem('voters'));
    const voter = voters.find(v => v.votingId === currentVoterId);
    const candidates = JSON.parse(localStorage.getItem('candidates'));
    const candidate = candidates.find(c => c.name === voter.votedFor);

    const printWindow = window.open('', '_blank');

    printWindow.document.write(`<!DOCTYPE html>
<html>
<head>
    <title>Reçu de Vote - Élections Campus</title>
    <meta charset="UTF-8">
    <style>
        @page {
            size: A4 portrait;
            margin: 15mm;
        }
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: Arial, sans-serif;
            font-size: 14px;
            line-height: 1.4;
            color: #000;
            background: #fff;
            padding: 0;
            margin: 0;
        }
        .receipt {
            width: 100%;
            max-width: 180mm;
            margin: 0 auto;
            padding: 20px;
            border: 3px solid #000;
        }
        .header {
            text-align: center;
            border-bottom: 3px solid #000;
            padding-bottom: 15px;
            margin-bottom: 20px;
        }
        .status {
            background: #198754;
            color: #fff;
            padding: 8px 20px;
            display: inline-block;
            font-weight: bold;
            font-size: 14px;
            margin-bottom: 10px;
        }
        .header h1 {
            font-size: 22px;
            color: #198754;
            margin: 10px 0 5px 0;
        }
        .section-title {
            font-size: 16px;
            font-weight: bold;
            text-align: center;
            margin: 15px 0 10px 0;
            text-decoration: underline;
        }
        .line {
            border-top: 2px solid #000;
            margin: 15px 0;
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        tr {
            border-bottom: 1px solid #ddd;
        }
        td {
            padding: 8px 5px;
            vertical-align: top;
        }
        td:first-child {
            font-weight: bold;
            width: 35%;
        }
        td:last-child {
            text-align: right;
            width: 65%;
        }
        .voted-for {
            color: #0d6efd;
            font-size: 16px;
            font-weight: bold;
        }
        .footer {
            text-align: center;
            border-top: 2px solid #000;
            padding-top: 15px;
            margin-top: 20px;
            font-size: 12px;
            color: #666;
        }
        .footer strong {
            display: block;
            margin-bottom: 5px;
            color: #000;
        }
        .buttons {
            text-align: center;
            margin: 20px 0;
            padding: 20px;
        }
        button {
            padding: 10px 25px;
            margin: 0 5px;
            font-size: 14px;
            font-weight: bold;
            border: none;
            cursor: pointer;
            border-radius: 4px;
        }
        .print-btn {
            background: #0d6efd;
            color: #fff;
        }
        .close-btn {
            background: #6c757d;
            color: #fff;
        }
        @media print {
            .buttons {
                display: none;
            }
            body {
                padding: 0;
            }
            .receipt {
                border: 3px solid #000;
                padding: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="receipt">
        <div class="header">
            <div class="status">VOTE CONFIRMÉ</div>
            <h1>Merci d'Avoir Voté!</h1>
            <p>Élection Présidentielle 2024</p>
        </div>
        
        <div class="section-title">REÇU DE VOTE</div>
        
        <table>
            <tr>
                <td>ID Électeur:</td>
                <td>${voter.votingId}</td>
            </tr>
            <tr>
                <td>Nom Complet:</td>
                <td>${voter.fullName}</td>
            </tr>
            <tr>
                <td>Département:</td>
                <td>${voter.department}</td>
            </tr>
            <tr>
                <td>Région:</td>
                <td>${voter.region}</td>
            </tr>
        </table>
        
        <div class="line"></div>
        
        <table>
            <tr>
                <td>A Voté Pour:</td>
                <td class="voted-for">${candidate.name}</td>
            </tr>
            <tr>
                <td>Parti:</td>
                <td>${candidate.party}</td>
            </tr>
        </table>
        
        <div class="line"></div>
        
        <table>
            <tr>
                <td>Date et Heure:</td>
                <td>${voter.votedAt}</td>
            </tr>
            <tr>
                <td>ID de Transaction:</td>
                <td>${voter.transactionId}</td>
            </tr>
        </table>
        
        <div class="footer">
            <strong>Ceci est votre reçu de vote officiel.</strong>
            Conservez-le pour vos dossiers.
        </div>
    </div>
    
    <div class="buttons">
        <button class="print-btn" onclick="window.print()">Imprimer le Reçu</button>
        <button class="close-btn" onclick="window.close()">Fermer</button>
    </div>
</body>
</html>`);

    printWindow.document.close();

    setTimeout(() => {
        printWindow.print();
    }, 300);
}

function goToResults() {
    sessionStorage.removeItem('currentVoterId');
    window.location.href = 'results.html';
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', displayCandidates);
} else {
    displayCandidates();
}
