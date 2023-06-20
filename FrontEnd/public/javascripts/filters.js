document.addEventListener('DOMContentLoaded', function() {

    // Get the filter-by-type select element
    const filterByTypeSelect = document.getElementById('filter-by-type');

    // Get the sort-by select element
    const sortBySelect = document.getElementById('sort-by');

    // Get the filter-by-type select element
    const filterByCategSelect = document.getElementById('filter-by-categ');

    const categSelectedSelect = document.getElementById('filter-by-categ-selected');
    const conditionSelect = document.getElementById('filter-by-symb-selected');
    const categValueInput = document.getElementById('filter-categ-selected');
    const applyButton = document.getElementById('filter-button');
  

    console.log(applyButton);
  
    applyButton.addEventListener('click', function () {
      const categSelected = categSelectedSelect.value;
      const condition = conditionSelect.value;
      const categValue = categValueInput.value;
    
      if (categSelected && condition && categValue) {
        const url = `/recursos/cond/${categSelected}_${condition}_${categValue}`;
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