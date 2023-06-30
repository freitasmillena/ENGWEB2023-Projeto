
window.onload = function() {
    var chk = document.getElementById('chk');
    var main = document.querySelector('.main');
  
    chk.addEventListener('change', function() {
      if(this.checked) {
        main.classList.add('expanded');
      } else {
        main.classList.remove('expanded');
      }
    });
      
}
  
  
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


$(document).ready(function() {
    var usernameInput = $('#username');
    var errorMessage = $('#error-message');
    let submitButton = $('#submit-button'); 
    var emailInput = $('#email');
    var errorMessageEmail = $('#error-message-email');

    let isUsernameAvailable = false;
    let isEmailAvailable = false;
  
    function updateSubmitButtonState() {
      if (isUsernameAvailable && isEmailAvailable) {
        submitButton.prop('disabled', false); // Habilita o botão de envio
        submitButton.removeClass('button-disabled');
      } else {
        submitButton.prop('disabled', true); // Desabilita o botão de envio
        submitButton.addClass('button-disabled');
      }
    }
  
    usernameInput.on('blur', function() {
      var username = this.value;
      $.get('http://localhost:8002/users/username/' + username, function(data) {
        if(data.dados != null) {
            errorMessage.text('Username is not available.');
            errorMessage.css('color', 'red');
            isUsernameAvailable = false;
        } else {
            errorMessage.text('Username is available.');
            errorMessage.css('color', 'green');
            isUsernameAvailable = true;
        }
        updateSubmitButtonState();
      })
      .fail(function() {
        console.log('Error: Could not reach the API.');
      });
    });

    emailInput.on('blur', function() {
        var email = this.value;
        $.get('http://localhost:8002/users/email/' + email, function(data) {
          if(data.dados != null) {
                errorMessageEmail.text('Email is not available.');
                errorMessageEmail.css('color', 'red');
                isEmailAvailable = false;
              
          } else {
                errorMessageEmail.text('Email is available.');
                errorMessageEmail.css('color', 'green');
                isEmailAvailable = true;
          }
          updateSubmitButtonState();
        })
        .fail(function() {
          console.log('Error: Could not reach the API.');
        });
      });
  });
  




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
    const fileSizeInput = document.getElementById('fileSize');
    const fileTypeInput = document.getElementById('fileType');

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
            fileSizeInput.value = file.size;
            fileTypeInput.value = file.type;

            const removeFileButton = document.getElementById('removeFileButton');
            removeFileButton.addEventListener('click', () => {
                fileInput.value = '';
                fileInfo.classList.add('hidden');
                fileSizeInput.value = '';
                fileTypeInput.value = '';
            });
        }
        else {
            fileInfo.classList.add('hidden');
            fileSizeInput.value = '';
            fileTypeInput.value = '';
        }
    })
})


var bookmarkIcon = document.getElementById("bookmarkIcon");
var bookmarkPopup = document.querySelector(".bookmarkPopup");

// Check if file is already in favorites
function checkIfFavorite(userId, fileId) {
  axios
    .get('/favorites/' + userId)
    .then(response => {
      
      var favorites = response.data
      

      if (favorites.includes(fileId)) {
       
        bookmarkIcon.classList.remove('fa-regular');
        bookmarkIcon.classList.add('fa-solid');
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
}



// Add or remove from favorites
function toggleFavorite(userId, fileId) {
  if (bookmarkIcon.classList.contains('fa-regular')) {
    
    // Add to favorites
    bookmarkIcon.classList.remove('fa-regular');
    bookmarkIcon.classList.add('fa-solid');
    bookmarkPopup.textContent = 'Saved!';

    axios
      .get('/addfavorites/' + fileId + '/user/' + userId)
      .then(response => {
        console.log(response.data); // Added to favorites
      })
      .catch(error => {
        console.error('Error:', error);
      });
  } else {
    // Remove from favorites
    bookmarkIcon.classList.remove('fa-solid');
    bookmarkIcon.classList.add('fa-regular');
    bookmarkPopup.textContent = 'Removed';

    axios
      .get('/removefavorites/' + fileId + '/user/' + userId, { userId, fileId })
      .then(response => {
        console.log(response.data); // Removed from favorites
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }
}

// Usage example
const userId = bookmarkIcon.dataset.user
const fileId = parseInt(bookmarkIcon.dataset.file)

console.log(userId, fileId)

checkIfFavorite(userId, fileId);

bookmarkIcon.addEventListener('click', function() {
  toggleFavorite(userId, fileId);

  bookmarkPopup.classList.add('active');
  setTimeout(function() {
    bookmarkPopup.classList.remove('active');
  }, 2000);
});

// Delete File
let deleteFileModal = document.getElementById('deleteFileModal');
let confirmDeleteFileButton = document.getElementById('confirmDeleteFile');
let file = null;
let creator = null;

// Listen for the modal being shown
$(deleteFileModal).on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget); // Button that triggered the modal
    file = button.data('file'); 
    creator = button.data('creator'); 
})
confirmDeleteFileButton.addEventListener('click', function() {
   console.log("Removing file: " + file);
   console.log('/recursos/' + file)
   axios.delete('/recursos/' + file + '/creator/' + creator)
        .then(function(response) {
            $('#deleteFileModal').modal('hide');
            if(response.data.redirect) {
                window.location.href = response.data.redirect;
              }
        })
        .catch(function(error) {
            console.error(error);
        }); 
});

// Delete Comment
let deleteCommentModal = document.getElementById('deleteCommentModal');
let confirmDeleteCommentButton = document.getElementById('confirmDeleteComment');
let fileComment = null;
let user = null;
let commentId = null;

// Listen for the modal being shown
$(deleteCommentModal).on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget); // Button that triggered the modal
    fileComment = button.data('file'); 
    user = button.data('user');
    commentId = button.data('comment'); 
})
confirmDeleteCommentButton.addEventListener('click', function() {
   console.log("Removing comment: " + commentId);
   
   axios.delete('/recursos/' + fileComment + '/removeComment/' + commentId + '/user/' + user)
        .then(function(response) {
            $('#deleteCommentModal').modal('hide');
            if(response.data.redirect) {
                window.location.href = response.data.redirect;
              }
        })
        .catch(function(error) {
            console.error(error);
        }); 
});


// Update comment
var toggleIcons = document.getElementsByClassName("toggleIcon");

Array.from(toggleIcons).forEach(function(icon) {
  icon.addEventListener("click", function() {
    var commentId = this.getAttribute("data-comment-id");
    var commentForm = document.querySelector(`form[data-comment-id="${commentId}"]`);

    if (commentForm.style.display === "none") {
      commentForm.style.display = "block";
    } else {
      commentForm.style.display = "none";
    }
  });
});


document.addEventListener('DOMContentLoaded', function() {
  var previewContainer = document.getElementById('previewContainer');
  var resourceName = previewContainer.getAttribute('data-resource');
  var filePath = previewContainer.getAttribute('data-path');
  
  // Extract the file extension
  var fileExtension = resourceName.split('.').pop().toLowerCase();
  console.log("path: " + filePath)
  
  // Check the file type and render the appropriate preview or message
  if (isImageFile(fileExtension)) {
    renderImagePreview(resourceName, filePath);
  } else if (isPDFFile(fileExtension)) {
    renderPDFPreview(resourceName);
  } else if (isTextFile(fileExtension)) {
    renderTextPreview(resourceName);
  } else if (isPresentationFile(fileExtension)) {
    renderPresentationPreview(resourceName);
  } else {
    displayUnsupportedMessage();
  }
});

// Functions to check file types

function isImageFile(extension) {
  return ['jpg', 'jpeg', 'png', 'gif'].includes(extension);
}

function isPDFFile(extension) {
  return ['pdf'].includes(extension);
}


function isTextFile(extension) {
  return ['txt', 'c', 'py', 'java', 'cpp', 'js', 'pug', 'hs', 'json', 'html', 'css', 'csv'].includes(extension);
}



function isPresentationFile(extension) {
  return ['ppt', 'pptx'].includes(extension);
}

// Functions to render previews or display messages

function renderImagePreview(resourceName, path) {
  var previewImage = document.createElement('img');
  previewImage.src = '/fileStorage/' + resourceName;
  previewImage.style.display = 'block';
  previewImage.style.margin = '0 auto';
  previewContainer.appendChild(previewImage);
  
}


function renderPDFPreview(resourceName) {
  var previewIframe = document.createElement('iframe');
  previewIframe.src = '/fileContents/pdf.html?file=' + encodeURIComponent(resourceName);
  previewIframe.style.display = 'block';
  previewIframe.style.margin = '0 auto';
  previewContainer.appendChild(previewIframe);
}

function renderTextPreview(resourceName) {
  var previewIframe = document.createElement('iframe');
  previewIframe.src = '/fileContents/text.html?file=' + encodeURIComponent(resourceName);
  previewIframe.style.display = 'block';
  previewIframe.style.margin = '0 auto';
  previewContainer.appendChild(previewIframe);
}


function renderPresentationPreview(resourceName) {
  var previewIframe = document.createElement('iframe');
  previewIframe.src = '/fileContents/ppt.html?file=' + encodeURIComponent(resourceName);
  previewIframe.style.display = 'block';
  previewIframe.style.margin = '0 auto';
  previewContainer.appendChild(previewIframe);
}

function displayUnsupportedMessage() {
  var messageElement = document.createElement('p');
  messageElement.textContent = 'Preview is not available for this file type.';
  previewContainer.appendChild(messageElement);
}
