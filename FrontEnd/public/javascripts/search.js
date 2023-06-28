
let selectedResults = [];
let selectedResultsUpdate = [];

// Upload Form

document.addEventListener("DOMContentLoaded", function() {
  const token = getCookie('token');
  
  //Dropdown Categorias

    
    $(document).ready(function() {
      $.get(`http://localhost:7777/api/categorias?token=${token}`, function(data) {
        for(var i = 0; i < data.length; i++) {
          var opt = $('<option></option>').val(data[i].name).html(data[i].name);
          $('#category').append(opt);
        }
      })
      .fail(function(error) {
        console.error('Error:', error);
      });
    });
    

    var searchInput = document.getElementById("searchInput");
    searchInput.addEventListener("keyup", function(e) {
    const keyword = e.target.value
    
    
    
    if (keyword.length < 1) {
        $("#searchResult").html('');  // clear the search results
        return;
    }

    if (!token) return;

    $.get(`http://localhost:8002/users/search/${keyword}?token=${token}`, function(users) {
    $.get(`http://localhost:7777/api/search/groups/${keyword}?token=${token}`, function(groups) {
      let resultsHtml = '';
      
      users.dados.forEach(user => resultsHtml += `<div class='result-item' data-type='user' data-value='${user.username}' data-name='${user.username}'><b>User: </b> ${user.username}</div>`);
      groups.forEach(group => resultsHtml += `<div class='result-item' data-type='group' data-value='${group._id}' data-name='${group.name}'><b>Group: </b> ${group.name} <b>owner: </b> ${group.owner}</div>`);
      $("#searchResult").html(resultsHtml);

      $('.result-item').on('click', function() {
        const type = $(this).attr('data-type');
        const value = $(this).attr('data-value');
        const name = $(this).attr('data-name');

        selectedResults.push({ type, value });
      
        // Adicione o item selecionado ao container de itens selecionados
        let selectedItemHtml = `<div class='selected-item' data-type='${type}' data-value='${value}'>
          <b>${type}: </b> ${name} 
          <span class='remove-item'><i class="fa-solid fa-xmark"></i></span>
        </div>`;
        $("#selectedItems").append(selectedItemHtml);
      
        $(this).addClass('selected'); // hide the selected item
      });

      
      
    })
    .fail(function() {
        console.log('Error: Could not reach the API.');
      });
  })
  .fail(function() {
    console.log('Error: Could not reach the Auth.');
  });
       

    });
  });


  $(document).on('click', '.remove-item', function() {
    // Remova o item selecionado do container
    $(this).parent().remove();
  
    // Remova o item selecionado do array selectedResults
    const type = $(this).parent().attr('data-type');
    const value = $(this).parent().attr('data-value');
    selectedResults = selectedResults.filter(item => item.type !== type || item.value !== value);
  
    // Remova a classe 'selected' do item que foi removido dos itens selecionados
    $(`.result-item[data-type='${type}'][data-value='${value}']`).removeClass('selected');
  });
  


document.addEventListener("DOMContentLoaded", function() {
    var myForm = document.getElementById("myForm");
    myForm.addEventListener("click", function(e) {
    
      
      const usernamesList = selectedResults
      .filter(result => result.type === "user" && result.value !== "") // Remova valores vazios
      .map(result => result.value);
    const groupsList = selectedResults
      .filter(result => result.type === "group" && result.value !== "") // Remova valores vazios
      .map(result => parseInt(result.value));

      console.log(usernamesList)
      console.log(groupsList)

      const usernamesInput = document.createElement("input");
      usernamesInput.setAttribute("type", "hidden");
      usernamesInput.setAttribute("name", "usernames[]");
      usernamesList.forEach(username => {
        console.log("username: " + username)
        const input = document.createElement("input");
        input.setAttribute("type", "hidden");
        input.setAttribute("name", "usernames[]");
        input.setAttribute("value", username);
        usernamesInput.appendChild(input);
        
      });
      this.appendChild(usernamesInput);
  
      const groupsInput = document.createElement("input");
      groupsInput.setAttribute("type", "hidden");
      groupsInput.setAttribute("name", "groups[]");
      groupsList.forEach(group => {
        console.log("group: " + group)
        const input = document.createElement("input");
        input.setAttribute("type", "hidden");
        input.setAttribute("name", "groups[]");
        input.setAttribute("value", group);
        groupsInput.appendChild(input);
        
      });
      this.appendChild(groupsInput);
});
});
  


function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}


// Groups Form
document.addEventListener("DOMContentLoaded", function() {
  var searchInput = document.getElementById("searchUser");
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
    
    users.dados.forEach(user => resultsHtml += `<div class='result-item' data-value='${user.username}'><b>User: </b> ${user.username}</div>`);
     $("#userResult").html(resultsHtml);

    $('.result-item').on('click', function() {
      const value = $(this).attr('data-value');
     
      selectedResults.push(value);
    
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
});

$(document).on('click', '.remove-item', function() {
  // Remova o item selecionado do container
  $(this).parent().remove();

  // Remova o item selecionado do array selectedResults
  const value = $(this).parent().attr('data-value');
  selectedResults = selectedResults.filter(item => item !== value);

  // Remova a classe 'selected' do item que foi removido dos itens selecionados
  $(`.result-item[data-value='${value}']`).removeClass('selected');
});

document.addEventListener("DOMContentLoaded", function() {
  var myForm = document.getElementById("groupForm");
  myForm.addEventListener("click", function(e) {
  
    
    const usernamesList = selectedResults
    
  
    console.log(usernamesList)
    

    const usernamesInput = document.createElement("input");
    usernamesInput.setAttribute("type", "hidden");
    usernamesInput.setAttribute("name", "usernames");
    usernamesList.forEach(username => {
      console.log("username: " + username)
      const input = document.createElement("input");
      input.setAttribute("type", "hidden");
      input.setAttribute("name", "usernames");
      input.setAttribute("value", username);
      usernamesInput.appendChild(input);
      
    });
    this.appendChild(usernamesInput);
});


});

$(document).ready(function() {
  var categories = $('#categoriesData').data('categories');
  var submitButton = $('#submitCategory');
  var namesArray = categories.map(function(obj) {
    return obj.name;
  });
  
  console.log(namesArray);

  // add input event listener
  $('#categoryInput').on('input', function() {
    var inputVal = $(this).val();
    if (namesArray.includes(inputVal)) {
      $('#error-message').text('Category is not available.');
      $('#error-message').css('color', 'red');
      submitButton.prop('disabled', true); 
    } else {
      $('#error-message').text('Category is available.');
      $('#error-message').css('color', 'green');
      submitButton.prop('disabled', false); 
    }
  });
});

//Update form
document.addEventListener("DOMContentLoaded", function() {
  const token = getCookie('token');
  var fileCategory = $('#categoryUpdate').data('file-category');
  var fileSelectedGroups= $('#dot-2-update').data('groups'); 
  var fileSelectedUsers= $('#dot-2-update').data('users'); 
  var fileVisibility= $('#dot-2-update').data('visibility'); 
  var creator= $('#dot-2-update').data('creator'); 
  const groupsHidden = document.getElementById('groupsHidden');
  console.log("groups: " + fileSelectedGroups)
  console.log("users: " + fileSelectedUsers)

  const privateInput = document.getElementById('dot-2-update');
  const publicInput = document.getElementById('dot-1-update');
    
  privateInput.addEventListener('click', () => {
      groupsHidden.classList.remove('hidden');
  })
  publicInput.addEventListener('click', () => {
      if(!groupsHidden.classList.contains('hidden'))
      groupsHidden.classList.add('hidden');
  })


  //Dropdown Categorias

    
    $(document).ready(function() {
      $.get(`http://localhost:7777/api/categorias?token=${token}`, function(data) {
        for(var i = 0; i < data.length; i++) {
          var opt = $('<option></option>').val(data[i].name).html(data[i].name);
          if (data[i].name === fileCategory) {
            opt.attr('selected', 'selected');
          }
          $('#categoryUpdate').append(opt);
        }
      })
      .fail(function(error) {
        console.error('Error:', error);
      });
    });
    

  //Visibility Private => show groups and users
  if (fileVisibility === 'private') {
    groupsHidden.classList.remove('hidden');
    fileSelectedGroups.forEach(item => {
      $.get(`http://localhost:7777/api/groups/${item}?token=${token}`, function(group) {
        selectedResultsUpdate.push({ type:'group', value: group._id.toString()});
        console.log(group._id)
        // Add the selected item to the #selectedItemsUpdate element
        let selectedItemHtml = `<div class='selected-item' data-type='group' data-value='${group._id}'>
          <b>group: </b> ${group.name} 
          <span class='remove-item-update'><i class="fa-solid fa-xmark"></i></span>
        </div>`;
        $("#selectedItemsUpdate").append(selectedItemHtml);
      })
      .fail(function() {
          console.log('Error: Could not reach the API.');
        });

    
    });

    fileSelectedUsers.forEach(item => {
      if(item != creator) {
        selectedResultsUpdate.push({ type:"user", value: item });

        // Add the selected item to the #selectedItemsUpdate element
        let selectedItemHtml = `<div class='selected-item' data-type='user' data-value='${item}'>
          <b>user: </b> ${item} 
          <span class='remove-item-update'><i class="fa-solid fa-xmark"></i></span>
        </div>`;
        $("#selectedItemsUpdate").append(selectedItemHtml);
      }
      
    });
  }  




    var searchInput = document.getElementById("searchInput");
    searchInput.addEventListener("keyup", function(e) {
    const keyword = e.target.value
    
    
    
    if (keyword.length < 1) {
        $("#searchResultUpdate").html('');  // clear the search results
        return;
    }

    if (!token) return;

    $.get(`http://localhost:8002/users/search/${keyword}?token=${token}`, function(users) {
    $.get(`http://localhost:7777/api/search/groups/${keyword}?token=${token}`, function(groups) {
      
      let resultsHtml = '';
      
      users.dados.forEach(user => {
        var hasValue = selectedResultsUpdate.some(item => item.value === user.username);
        if(!hasValue || creator != user.username){
          resultsHtml += `<div class='result-item-update' data-type='user' data-value='${user.username}' data-name='${user.username}'><b>User: </b> ${user.username}</div>`}
        }
        );
      groups.forEach(group => {
        if(group._id != 0){
          var hasValue = selectedResultsUpdate.some(item => item.value === group._id.toString());
          if(!hasValue){
          resultsHtml += `<div class='result-item-update' data-type='group' data-value='${group._id}' data-name='${group.name}'><b>Group: </b> ${group.name} <b>owner: </b> ${group.owner}</div>`}
        }
        }
         );
      $("#searchResultUpdate").html(resultsHtml);

      $('.result-item-update').on('click', function() {
        const type = $(this).attr('data-type');
        const value = $(this).attr('data-value');
        const name = $(this).attr('data-name');

        selectedResultsUpdate.push({ type, value });
      
        // Adicione o item selecionado ao container de itens selecionados
        let selectedItemHtml = `<div class='selected-item' data-type='${type}' data-value='${value}'>
          <b>${type}: </b> ${name} 
          <span class='remove-item-update'><i class="fa-solid fa-xmark"></i></span>
        </div>`;
        $("#selectedItemsUpdate").append(selectedItemHtml);
      
        $(this).addClass('selected'); // hide the selected item
      });

      
      
    })
    .fail(function() {
        console.log('Error: Could not reach the API.');
      });
  })
  .fail(function() {
    console.log('Error: Could not reach the Auth.');
  });
       

    }); 
  });

$(document).on('click', '.remove-item-update', function() {
    // Remova o item selecionado do container
    $(this).parent().remove();
  
    // Remova o item selecionado do array selectedResults
    const type = $(this).parent().attr('data-type');
    const value = $(this).parent().attr('data-value');
   
    
    selectedResultsUpdate = selectedResultsUpdate.filter(item => item.type !== type || item.value !== value);
  
    // Remova a classe 'selected' do item que foi removido dos itens selecionados
    $(`.result-item-update[data-type='${type}'][data-value='${value}']`).removeClass('selected');
  });

document.addEventListener("DOMContentLoaded", function() {
    var myForm = document.getElementById("myFormUpdate");
    myForm.addEventListener("click", function(e) {
    
      const visibility = document.querySelector('input[name="visibility"]:checked').value;

    // If visibility is public, clear the selectedResultsUpdate array
    if (visibility === 'public') {
      selectedResultsUpdate = [];
    }
    else {
      selectedResultsUpdate.forEach(item => console.log(item))
      const usernamesListUpdate = selectedResultsUpdate
      .filter(result => result.type === "user" && result.value !== "") // Remova valores vazios
      .map(result => result.value);
    const groupsListUpdate = selectedResultsUpdate
      .filter(result => result.type === "group" && result.value !== "") // Remova valores vazios
      .map(result => parseInt(result.value));

      console.log(usernamesListUpdate)
      console.log(groupsListUpdate)

      const usernamesInputUpdate = document.createElement("input");
      usernamesInputUpdate.setAttribute("type", "hidden");
      usernamesInputUpdate.setAttribute("name", "usernames");
      usernamesListUpdate.forEach(username => {
        console.log("username: " + username)
        const input = document.createElement("input");
        input.setAttribute("type", "hidden");
        input.setAttribute("name", "usernames");
        input.setAttribute("value", username);
        usernamesInputUpdate.appendChild(input);
        
      });
      this.appendChild(usernamesInputUpdate);
  
      const groupsInputUpdate = document.createElement("input");
      groupsInputUpdate.setAttribute("type", "hidden");
      groupsInputUpdate.setAttribute("name", "groups");
      groupsListUpdate.forEach(group => {
        console.log("group: " + group)
        const input = document.createElement("input");
        input.setAttribute("type", "hidden");
        input.setAttribute("name", "groups");
        input.setAttribute("value", group);
        groupsInputUpdate.appendChild(input);
        
      });
      this.appendChild(groupsInputUpdate);
    }
    
});
});