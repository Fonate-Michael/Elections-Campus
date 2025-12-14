document.getElementById('verifyForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const votingId = document.getElementById('votingIdInput').value.trim();
    const errorMessage = document.getElementById('errorMessage');

    const voters = JSON.parse(localStorage.getItem('voters') || '[]');

    const voter = voters.find(v => v.votingId === votingId);

    if (!voter) {
        errorMessage.textContent = 'Identifiant de vote invalide. Veuillez vérifier et réessayer.';
        errorMessage.classList.remove('d-none');
        return;
    }

    if (voter.hasVoted) {
        errorMessage.textContent = 'Vous avez déjà voté. Le vote multiple n\'est pas autorisé.';
        errorMessage.classList.remove('d-none');
        return;
    }

    sessionStorage.setItem('currentVoterId', votingId);

    window.location.href = 'election-type.html';
});
