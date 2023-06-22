function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}


document.addEventListener('DOMContentLoaded', function() {
    function openDeleteModal() {
      console.log("open modal")
        $('#deleteModal').modal('show');
    }

   

    document.getElementById('openModalButton').addEventListener('click', openDeleteModal);
    document.getElementById('confirmDelete').addEventListener('click', function() {
        var groupId = document.getElementById('deleteModal').dataset.groupId;
        console.log("GROUPS");
        axios.get('/deleteGroup/' + groupId)
        .then(function(response) {
            $('#deleteModal').modal('hide');
            // Perform the redirection.
            if(response.data.redirect) {
                window.location.href = response.data.redirect;
              }
        })
        .catch(function(error) {
            console.error(error);
        });
    });

    
    //Remove user from group
 
    let deleteUserModal = document.getElementById('deleteUserModal');
    let confirmDeleteUserButton = document.getElementById('confirmDeleteUser');
    let userToDelete = null;
    let group = null;
    // Listen for the modal being shown
    $(deleteUserModal).on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget); // Button that triggered the modal
        userToDelete = button.data('user'); // Extract user from data-* attributes
        group = button.data('group'); // Extract group from data-* attributes
    });

    confirmDeleteUserButton.addEventListener('click', function() {
       console.log("Removing user: " + userToDelete);
       console.log('/group/' + group + '/deleteUser/' + userToDelete)
       axios.get('/group/' + group + '/deleteUser/' + userToDelete)
            .then(function(response) {
                $('#deleteUserModal').modal('hide');
                if(response.data.redirect) {
                    window.location.href = response.data.redirect;
                  }
            })
            .catch(function(error) {
                console.error(error);
            }); 
    });


    // Search to add users
    let searchInput = document.getElementById('searchInput');
    let addUsersButton = document.getElementById('addUsersButton');
    let participants = addUsersButton.dataset.participants.split(',');
    
    let selectedResults = []

    searchInput.addEventListener("keyup", function(e) {
        const keyword = e.target.value
        
        const token = getCookie('token');
        
        if (keyword.length < 1) {
            $("#userResult").html('');  // clear the search results
            return;
        }
      
        if (!token) return;
      
        $.get(`http://localhost:8002/users/search/${keyword}?token=${token}`, function(users) {
        
          let resultsHtml = '';
          
          users.dados.forEach(user => {
            
            if(!participants.includes(user.username)) {
              resultsHtml += `<div class='result-item' data-value='${user.username}'><b>User: </b> ${user.username}</div>`
            }
          });
           $("#userResult").html(resultsHtml);
      
          $('.result-item').on('click', function() {
            const value = $(this).attr('data-value');
           
            selectedResults.push(value);
            addUsersButton.disabled = false;
            // Adicione o item selecionado ao container de itens selecionados
            let selectedItemHtml = `<div class='selected-item' data-value='${value}'>
              <b>user: </b> ${value} 
              <span class='remove-item'><i class="fa-solid fa-xmark"></i></span>
            </div>`;
            $("#selectedUsers").append(selectedItemHtml);
          
            $(this).addClass('selected'); // hide the selected item
          });
          
      })
      .fail(function() {
        console.log('Error: Could not reach the Auth.');
      });
           
      
    });

    $(document).on('click', '.remove-item', function() {
        // Remova o item selecionado do container
        $(this).parent().remove();
      
        // Remova o item selecionado do array selectedResults
        const value = $(this).parent().attr('data-value');
        selectedResults = selectedResults.filter(item => item !== value);
      
        // Remova a classe 'selected' do item que foi removido dos itens selecionados
        $(`.result-item[data-value='${value}']`).removeClass('selected');

        console.log(addUsersButton.disabled = selectedUsers.length === 0)
        console.log(selectedResults)
        addUsersButton.disabled = selectedResults.length === 0;
    });


    // Handle addUsersButton click
  addUsersButton.addEventListener('click', function() {
      
    let group = addUsersButton.getAttribute('data-group');
    console.log("add to group: " + group)
    console.log("users: " + selectedResults)
    
    axios.get('/group/' + group + '/addUsers', { params: { selectedResults } })
            .then(function(response) {
                
                if(response.data.redirect) {
                    window.location.href = response.data.redirect;
                  }
            })
            .catch(function(error) {
                console.error(error);
            }); 
      /* // Clear selectedUsers array
      selectedUsers = [];
    
      // Disable addUsersButton
      addUsersButton.disabled = true; */
    
  });
});