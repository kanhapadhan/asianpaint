let results = document.querySelector('.results');
let searchInput = document.querySelector('#search');
let hueSlider = document.querySelector('#hue');

fetch("shadelisting.shade.json").then(success => {
  success.json().then(data => {
    let shades = data.shade;

    let filteredObjects = shades.filter(obj => obj.pageNumber === '15');
    displayResults(filteredObjects)
    //displayResults(shades); // Display all shades initially

    // Search functionality
    searchInput.addEventListener('input', () => {
      
      let searchValue = searchInput.value;
      if (searchValue.length === 0) {
        return
      }
      let foundObjects = shades.filter(obj => obj.entityName.toLowerCase().includes(searchValue.toLowerCase()) || obj.entityCode.toLowerCase().includes(searchValue));
      
      if (foundObjects.length!=0) {
        displayResults(foundObjects);
      } else {
        results.innerHTML = 'No Matches'
      }
      //console.log(foundObjects.length)
    });
    
    hueSlider.addEventListener('change',()=>{
      let hue = Number(hueSlider.value)
      let min = hue - 10
      let max = hue + 10
      console.log(min,max)
      let foundObjs = shades.filterByHue(min,max)
      displayResults(foundObjs)
    })
  });
});

function displayResults(objects) {
  results.innerHTML = '';
  objects.forEach(val => {
    addCard(val);
  });
}

function addCard(colorObj) {
  let card = document.createElement('div'); 
  card.className = 'card';
  card.innerHTML = `<div class="colorBox" style="background:${colorObj.shadeHexCode}"></div>
        <div class="title">
            <span class="colorName">${colorObj.entityName}</span>
            <span class="colorCode">${colorObj.entityCode}</span>
        </div>`;
  results.appendChild(card);
}

Array.prototype.filterByHue = function(minHue, maxHue) {
  let foundObjects = this.filter(obj => {
    let [h, , ] = hexToHsl(obj.shadeHexCode);
    return (h > minHue && h < maxHue); 
  });
  return foundObjects;
};

function filterByHue(array, minHue, maxHue) {
  let foundObjects = array.filter(obj => {
    let [h, , ] = hexToHsl(obj.shadeHexCode);
    return (h >= minHue && h <= maxHue); 
  });
  return foundObjects;
};

