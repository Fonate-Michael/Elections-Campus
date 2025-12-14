const registrationTypeInputs = document.querySelectorAll('input[name="registrationType"]');
const candidateFields = document.getElementById('candidateFields');
const submitButtonText = document.getElementById('submitButtonText');
const electionTypeSelect = document.getElementById('electionType');
const eligibilityConditionsDiv = document.getElementById('eligibilityConditions');

const eligibilityConditions = {
    legislative: [
        "Être citoyen camerounais",
        "Avoir au moins 25 ans révolus",
        "Être inscrit sur la liste électorale",
        "Ne pas avoir été condamné à une peine d'emprisonnement de plus de 6 mois"
    ],
    presidential: [
        "Être citoyen camerounais de naissance",
        "Avoir au moins 35 ans révolus",
        "Être inscrit sur la liste électorale",
        "Ne pas avoir été condamné à une peine d'emprisonnement de plus de 6 mois"
    ],
    municipal: [
        "Être citoyen camerounais",
        "Avoir au moins 21 ans révolus",
        "Être inscrit sur la liste électorale de la commune concernée",
        "Ne pas avoir été condamné à une peine d'emprisonnement de plus de 6 mois"
    ]
};

registrationTypeInputs.forEach(input => {
    input.addEventListener('change', function () {
        if (this.value === 'candidate') {
            candidateFields.style.display = 'block';
            submitButtonText.textContent = "S'Inscrire comme Candidat";
            document.getElementById('candidateParty').required = true;
            document.getElementById('electionType').required = true;
            document.getElementById('confirmEligibility').required = true;
            document.getElementById('candidatePhoto').required = true;
        } else {
            candidateFields.style.display = 'none';
            submitButtonText.textContent = "S'Inscrire comme Électeur";
            document.getElementById('candidateParty').required = false;
            document.getElementById('electionType').required = false;
            document.getElementById('confirmEligibility').required = false;
            document.getElementById('candidatePhoto').required = false;
        }
    });
});

electionTypeSelect.addEventListener('change', function () {
    const selectedType = this.value;
    if (selectedType && eligibilityConditions[selectedType]) {
        const conditions = eligibilityConditions[selectedType];
        eligibilityConditionsDiv.innerHTML = '<ul class="mb-0">' +
            conditions.map(c => `<li>${c}</li>`).join('') +
            '</ul>';
    } else {
        eligibilityConditionsDiv.innerHTML = '<p class="mb-0 text-muted">Sélectionnez un type d\'élection</p>';
    }
});

document.getElementById('registrationForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const registrationType = document.querySelector('input[name="registrationType"]:checked').value;

    if (registrationType === 'candidate') {
        if (!document.getElementById('confirmEligibility').checked) {
            alert('Vous devez confirmer que vous remplissez toutes les conditions d\'éligibilité');
            return;
        }

        const candidatePhotoInput = document.getElementById('candidatePhoto');
        if (!candidatePhotoInput.files || !candidatePhotoInput.files[0]) {
            alert('La photo de campagne est obligatoire pour les candidats');
            return;
        }
    }

    const photoInput = document.getElementById('identityPhoto');
    const candidatePhotoInput = document.getElementById('candidatePhoto');

    let photoData = null;
    let candidatePhotoData = null;
    let photosToLoad = 0;
    let photosLoaded = 0;

    function checkAndSave() {
        photosLoaded++;
        if (photosLoaded === photosToLoad) {
            if (registrationType === 'voter') {
                saveVoterData(photoData);
            } else {
                saveCandidateData(photoData, candidatePhotoData);
            }
        }
    }

    if (photoInput.files && photoInput.files[0]) {
        photosToLoad++;
        const file = photoInput.files[0];
        if (file.size > 2 * 1024 * 1024) {
            alert('La photo d\'identité est trop volumineuse. Taille maximale: 2MB');
            return;
        }
        const reader = new FileReader();
        reader.onload = function (event) {
            photoData = event.target.result;
            checkAndSave();
        };
        reader.readAsDataURL(file);
    }

    if (registrationType === 'candidate' && candidatePhotoInput.files && candidatePhotoInput.files[0]) {
        photosToLoad++;
        const file = candidatePhotoInput.files[0];
        if (file.size > 2 * 1024 * 1024) {
            alert('La photo de campagne est trop volumineuse. Taille maximale: 2MB');
            return;
        }
        const reader = new FileReader();
        reader.onload = function (event) {
            candidatePhotoData = event.target.result;
            checkAndSave();
        };
        reader.readAsDataURL(file);
    }

    if (photosToLoad === 0) {
        if (registrationType === 'voter') {
            saveVoterData(null);
        } else {
            saveCandidateData(null, null);
        }
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

    const modalElement = document.getElementById('receiptModal');
    const modal = new bootstrap.Modal(modalElement);
    
    modalElement.addEventListener('hidden.bs.modal', function () {
        document.getElementById('registrationForm').reset();
    }, { once: true });
    
    modal.show();
}

function saveCandidateData(photoData, candidatePhotoData) {
    const birthDate = new Date(document.getElementById('birthDate').value);
    const age = Math.floor((new Date() - birthDate) / (365.25 * 24 * 60 * 60 * 1000));
    const electionType = document.getElementById('electionType').value;

    const minAges = {
        legislative: 25,
        presidential: 35,
        municipal: 21
    };

    if (age < minAges[electionType]) {
        alert(`Vous devez avoir au moins ${minAges[electionType]} ans pour ce type d'élection. Vous avez ${age} ans.`);
        return;
    }

    const formData = {
        fullName: document.getElementById('fullName').value,
        birthDate: document.getElementById('birthDate').value,
        placeOfResidence: document.getElementById('placeOfResidence').value,
        phoneNumber: document.getElementById('phoneNumber').value,
        idCardNumber: document.getElementById('idCardNumber').value,
        department: document.getElementById('department').value,
        region: document.getElementById('region').value,
        identityPhoto: photoData,
        party: document.getElementById('candidateParty').value,
        electionType: electionType,
        candidatePhoto: candidatePhotoData,
        registrationDate: new Date().toLocaleString('fr-FR')
    };

    const candidateId = 'CID-' + Date.now().toString().slice(-8);

    let candidates = JSON.parse(localStorage.getItem('candidates') || '[]');

    const nextId = candidates.length > 0 ? Math.max(...candidates.map(c => c.id)) + 1 : 1;

    candidates.push({
        id: nextId,
        candidateId: candidateId,
        name: formData.fullName,
        party: formData.party,
        electionType: formData.electionType,
        department: formData.department,
        region: formData.region,
        photo: formData.candidatePhoto,
        votes: 0,
        ...formData
    });

    localStorage.setItem('candidates', JSON.stringify(candidates));

    alert(`Inscription réussie!\n\nVotre ID de candidat: ${candidateId}\nNom: ${formData.fullName}\nParti: ${formData.party}\nType d'élection: ${formData.electionType}\n\nVous apparaîtrez maintenant dans les bulletins de vote.`);

    document.getElementById('registrationForm').reset();
    document.querySelector('input[name="registrationType"][value="voter"]').checked = true;
    candidateFields.style.display = 'none';
    submitButtonText.textContent = "S'Inscrire comme Électeur";
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
