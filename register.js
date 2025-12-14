document.getElementById('registrationForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = {
        fullName: document.getElementById('fullName').value,
        phoneNumber: document.getElementById('phoneNumber').value,
        idCardNumber: document.getElementById('idCardNumber').value,
        department: document.getElementById('department').value,
        region: document.getElementById('region').value,
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
    document.getElementById('receiptPhone').textContent = formData.phoneNumber;
    document.getElementById('receiptIdCard').textContent = formData.idCardNumber;
    document.getElementById('receiptDepartment').textContent = formData.department;
    document.getElementById('receiptRegion').textContent = formData.region;
    document.getElementById('receiptDate').textContent = formData.registrationDate;
    
    const modal = new bootstrap.Modal(document.getElementById('receiptModal'));
    modal.show();
    
    document.getElementById('registrationForm').reset();
});

function copyVotingId() {
    const votingId = document.getElementById('votingId').textContent;
    navigator.clipboard.writeText(votingId).then(() => {
        alert('Identifiant de vote copié dans le presse-papiers!');
    });
}

function printReceipt() {
    window.print();
}
