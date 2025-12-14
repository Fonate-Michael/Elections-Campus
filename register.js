document.getElementById('registrationForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const photoInput = document.getElementById('identityPhoto');
    let photoData = null;

    if (photoInput.files && photoInput.files[0]) {
        const file = photoInput.files[0];
        if (file.size > 2 * 1024 * 1024) {
            alert('La photo est trop volumineuse. Taille maximale: 2MB');
            return;
        }
        const reader = new FileReader();
        reader.onload = function (event) {
            photoData = event.target.result;
            saveVoterData(photoData);
        };
        reader.readAsDataURL(file);
    } else {
        saveVoterData(null);
    }
});

function saveVoterData(photoData) {
    const formData = {
        fullName: document.getElementById('fullName').value,
        birthDate: document.getElementById('birthDate').value,
        placeOfResidence: document.getElementById('placeOfResidence').value,
        phoneNumber: document.getElementById('phoneNumber').value,
        idCardNumber: document.getElementById('idCardNumber').value,
        department: document.getElementById('department').value,
        region: document.getElementById('region').value,
        identityPhoto: photoData,
        registrationDate: new Date().toLocaleString('fr-FR')
    };

    const votingId = 'VID-' + Date.now().toString().slice(-8);

    let voters = JSON.parse(localStorage.getItem('voters') || '[]');
    voters.push({
        votingId: votingId,
        ...formData,
        hasVoted: false
    });
    localStorage.setItem('voters', JSON.stringify(voters));

    document.getElementById('votingId').textContent = votingId;
    document.getElementById('receiptName').textContent = formData.fullName;
    document.getElementById('receiptBirthDate').textContent = formData.birthDate;
    document.getElementById('receiptResidence').textContent = formData.placeOfResidence;
    document.getElementById('receiptPhone').textContent = formData.phoneNumber;
    document.getElementById('receiptIdCard').textContent = formData.idCardNumber;
    document.getElementById('receiptDepartment').textContent = formData.department;
    document.getElementById('receiptRegion').textContent = formData.region;
    document.getElementById('receiptDate').textContent = formData.registrationDate;

    const modal = new bootstrap.Modal(document.getElementById('receiptModal'));
    modal.show();

    document.getElementById('registrationForm').reset();
}

function copyVotingId() {
    const votingId = document.getElementById('votingId').textContent;
    navigator.clipboard.writeText(votingId).then(() => {
        alert('Identifiant de vote copié dans le presse-papiers!');
    });
}

function printReceipt() {
    window.print();
}
