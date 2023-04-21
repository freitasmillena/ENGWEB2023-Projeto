function checkPasswordStrength(password) {
    let strength = 0;

    //At least 8 chars
    if(password.length >= 8) strength ++;

    //At least one uppercase letter
    if(/[A-Z]/.test(password)) strength ++;

    //At least one lowercase letter
    if(/[a-z]/.test(password)) strength ++;

    //At least one number
    if(/\d/.test(password)) strength ++;

    //At least one special character
    if(/[^A-Za-z0-9]/.test(password)) strength ++;

    return strength;

}

function updateStrengthMeter(password){
    const strengthMeter = document.getElementById('strengthMeter');
    const strengthLevel = document.getElementById('strengthLevel');
    const strength = checkPasswordStrength(password);

    strengthMeter.style.width = `${(strength / 10) * 100}%`

    let strengthText = '';

    if(strength == 0){
    
    }
    
    else if(strength < 3) {
        strengthMeter.style.backgroundColor = '#FF4D4D';
        strengthText = 'Weak';
    
    }
    
    else if(strength < 4) {
        strengthMeter.style.backgroundColor = '#FFC300';
        strengthText = 'Medium';
    }

    else if(strength < 5) {
        strengthMeter.style.backgroundColor = '#87C55F';
        strengthText = 'Strong';
    }

    else {
        strengthMeter.style.backgroundColor = '#4CAF50';
        strengthText = 'Very Strong';
    }   

    strengthLevel.textContent = strengthText;


}

function updatePasswordRequirements(password){
    const lengthReq = document.getElementById('lengthReq');
    const uppercaseReq = document.getElementById('uppercaseReq');
    const lowercaseReq = document.getElementById('lowercaseReq');
    const numberReq = document.getElementById('numberReq');
    const specialCharReq = document.getElementById('specialCharReq');
    const passwordMatchReq = document.getElementById('passwordMatchReq');
    const passwordInput = document.getElementById('passwordInput');
    const confirmPasswordInput = document.getElementById('confirmPasswordInput');

    lengthReq.style.color = password.length >= 8 ? '#4CAF50' : '#FF4D4D';
    uppercaseReq.style.color = /[A-Z]/.test(password) ? '#4CAF50' : '#FF4D4D';
    lowercaseReq.style.color = /[a-z]/.test(password) ? '#4CAF50' : '#FF4D4D';
    numberReq.style.color = /\d/.test(password) ? '#4CAF50' : '#FF4D4D';
    specialCharReq.style.color = /[^A-Za-z0-9]/.test(password) ? '#4CAF50' : '#FF4D4D';

    console.log(confirmPasswordInput.value)

    if(confirmPasswordInput.value === password && password != '') {
        passwordMatchReq.style.color = '#4CAF50';
    }
    else {
        passwordMatchReq.style.color = '#FF4D4D';
    }

    if(checkPasswordStrength(password) == 5) passwordInput.setCustomValidity('');
    else passwordInput.setCustomValidity('Password does not meet the requirements.');

    
}

function confirmPasswordMatch() {
    const passwordInput = document.getElementById('passwordInput');
    const confirmPasswordInput = document.getElementById('confirmPasswordInput');

    if(passwordInput.value === confirmPasswordInput.value) {
        confirmPasswordInput.setCustomValidity('');
    }
    else {
        confirmPasswordInput.setCustomValidity('Passwords do not match.');
    }
}



document.addEventListener('DOMContentLoaded',() => {
    const passwordInput = document.getElementById('passwordInput');
    const confirmPasswordInput = document.getElementById('confirmPasswordInput');
    let password = '';
    passwordInput.addEventListener('input', (event) => {
        password = event.target.value;
        updateStrengthMeter(password);
        updatePasswordRequirements(password);
        confirmPasswordMatch();
    });

    confirmPasswordInput.addEventListener('input', () => {
        confirmPasswordMatch();
        updatePasswordRequirements(password);
    });
})







function formatFileSize(size){
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
    }

    return `${size.toFixed(2)} ${units[unitIndex]}`;
}

document.addEventListener('DOMContentLoaded', () => {
    const privateInput = document.getElementById('dot-2');
    const publicInput = document.getElementById('dot-1');
    const groupsHidden = document.getElementById('groupsHidden');

    privateInput.addEventListener('click', () => {
        groupsHidden.classList.remove('hidden');
    })

    publicInput.addEventListener('click', () => {
        if(!groupsHidden.classList.contains('hidden'))
        groupsHidden.classList.add('hidden');
    })
})


document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('fileInput');
    const fileInfo = document.getElementById('fileInfo');

    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const fileSize = formatFileSize(file.size);
            fileInfo.innerHTML = `
            <li class="row">
                            <div class="content upload">
                              <i class="fas fa-file-alt"></i>
                              <div class="details">
                                <span class="name">${file.name} • Uploaded</span>
                                <span class="size">${file.type}</span>
                                <span class="size">${fileSize}</span>
                              </div>
                            </div>
                            <button id="removeFileButton" type="button" class="removeButton"><i class="fa-solid fa-xmark"></i></button>
                          </li>
            `
            fileInfo.classList.remove('hidden');

            const removeFileButton = document.getElementById('removeFileButton');
            removeFileButton.addEventListener('click', () => {
                fileInput.value = '';
                fileInfo.classList.add('hidden');
            });
        }
        else {
            fileInfo.classList.add('hidden');
        }
    })
})


