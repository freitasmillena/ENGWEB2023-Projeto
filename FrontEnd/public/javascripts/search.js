let selectedResults = [];

document.addEventListener("DOMContentLoaded", function() {
    var searchInput = document.getElementById("searchInput");
    searchInput.addEventListener("keyup", function(e) {
    const keyword = e.target.value
    
    const token = getCookie('token');
    
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


