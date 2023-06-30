document.addEventListener('DOMContentLoaded', function() {

    // Get the filter-by-type select element
    const filterByTypeSelect = document.getElementById('filter-by-type');

    // Get the sort-by select element
    const sortBySelect = document.getElementById('sort-by');

    // Get the filter-by-type select element
    const filterByCategSelect = document.getElementById('filter-by-categ');

    // Get the filter-by-group select element
    const filterByGroupSelect = document.getElementById('filter-by-group');

    const categSelectedSelect = document.getElementById('filter-by-categ-selected');
    const conditionSelect = document.getElementById('filter-by-symb-selected');
    const categValueInput = document.getElementById('filter-categ-selected');
    const applyButton = document.getElementById('filter-button');

    const optionsForSize = [
      { value: 'greater', text: '>' },
      { value: 'less', text: '<' },
      { value: 'greaterOrEqual', text: '>=' },
      { value: 'lessOrEqual', text: '<=' },
      { value: 'equals', text: '==' },
      { value: 'notEqual', text: '!=' },
    ];
  
    const optionsForOther = [
      { value: 'equals', text: '==' },
      { value: 'notEqual', text: '!=' },
      { value: 'contains', text: 'contains' },
      { value: 'notContains', text: 'not contains' },
      { value: 'startsWith', text: 'starts with' },
      { value: 'endsWith', text: 'ends with' },
    ];
    

    $('#filter-by-categ-selected').change(function() {
      const selectedValue = $(this).val();
      let optionsToUse = [];

      // show the correct options
  
      if (selectedValue === 'size' || selectedValue === 'created' || selectedValue === 'modified') {
        optionsToUse = optionsForSize;
      } else if (selectedValue !== '') {
        optionsToUse = optionsForOther;
      }
  
      const symbSelect = $('#filter-by-symb-selected');
      symbSelect.empty();
  
      $.each(optionsToUse, function(index, option) {
        symbSelect.append($('<option></option>').attr('value', option.value).text(option.text));
      });
    });

  
    applyButton.addEventListener('click', function () {
      const categSelected = categSelectedSelect.value;
      const condition = conditionSelect.value;
      const categValue = categValueInput.value;

      var url = ""

      // if the filter-by-categ-selected is equals to created or modified
      // then we need to change the url to /recursos/cond/created_cond_value
      if (categSelected === "created" || categSelected === "modified") {
        const parts = categValue.split('/');
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10);
        const day = parseInt(parts[2], 10);
        var date = ""
        if (month < 10)
          date = year + '-0' + month + '-' + day;
        else
          date = year + '-' + month + '-' + day;          

        url = `/recursos/cond/${categSelected}_${condition}_${date}`;
      }
      else
        url = `/recursos/cond/${categSelected}_${condition}_${categValue}`;
    
      if (categSelected && condition && categValue) {
        console.log(url);
        window.location.href = url;
      }
    });



    // Add an event listener to the select element
    filterByTypeSelect.addEventListener('change', function() {
      // Get the selected option value
      const selectedType = this.value;

      if ( selectedType === "all") {
        // Go to the url without the filter
        window.location.href = '/recursos';
      }

      else {
        // Construct the URL based on the selected option
        const url = `/recursos/tipos/${selectedType}`;
        
        // Navigate to the constructed URL
        window.location.href = url;
      }
    });

    // Add an event listener to the select element
    filterByCategSelect.addEventListener('change', function() {
        // Get the selected option value
        const selectedCateg = this.value;
  
        if ( selectedCateg === "all") {
          // Go to the url without the filter
          window.location.href = '/recursos';
        }
  
        else {
          // Construct the URL based on the selected option
          const url = `/recursos/categorias/${selectedCateg}`;
          
          // Navigate to the constructed URL
          window.location.href = url;
        }
      });
    
    // Add an event listener to the select element
    filterByGroupSelect.addEventListener('change', function() {
      // Get the selected option value
      const selectedGroup = this.value;

      if ( selectedGroup === "all") {
        // Go to the url without the filter
        window.location.href = '/recursos';
      }

      else {
        // Construct the URL based on the selected option
        const url = `/recursos/grupos/${selectedGroup}`;

        // Navigate to the constructed URL
        window.location.href = url;
      }
    });

  
    // Add an event listener to the select element
    sortBySelect.addEventListener('change', function() {

      // Get the selected sort option value
      const selectedSort = this.value;

      // Parse the current URL
      const url = new URL(window.location.href);

      // Add the sort query parameter to the existing URL
      url.searchParams.set('sort', selectedSort);

      // Update the URL without navigating to a new page
      history.pushState(null, null, url);

      // Reload the page
      window.location.reload();
    });


    var searchInput = document.getElementById("searchRec");
    searchInput.addEventListener("keyup", function(e) {
      const keyword = e.target.value

      // Parse the current URL
      const url = new URL(window.location.href);

      // Add the search query parameter to the existing URL
      url.searchParams.set('search', keyword);

      // Update the URL without navigating to a new page
      history.pushState(null, null, url);

      // Reload the page
      window.location.reload();

    });



    // categSelectedSelect.addEventListener('change', constructUrl);
    // conditionSelect.addEventListener('change', constructUrl);
    // categValueInput.addEventListener('input', constructUrl);

  });