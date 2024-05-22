import { hexToHsl } from './color-converter.js';
import { autocomplete } from './autocomplete.js';

let results = document.querySelector('.results');
let searchInput = document.querySelector('#search');
let hueSlider = document.querySelector('#hue');

fetch("shadelisting.shade.json").then(success => {
  success.json().then(data => {
    let shades = data.shade;
    let colorNames = shades.map(color => color.entityName);
    
    autocomplete(searchInput, colorNames);
    
    // Display initial results (filtered by page number 15 as example)
    let initialFilteredObjects = shades.filter(obj => obj.pageNumber === '15');
    displayResults(initialFilteredObjects);

    // Event listener for search input
    searchInput.addEventListener('input', () => searchShades(shades));

    // Event listener for hue slider
    hueSlider.addEventListener('change', () => {
      let hue = Number(hueSlider.value);
      let minHue = hue - 10;
      let maxHue = hue + 10;
      let filteredByHue = filterByHue(shades, minHue, maxHue);
      displayResults(filteredByHue);
    });
  });
});

function searchShades(shades) {
  let searchValue = searchInput.value;
  if (searchValue.length === 0) {
    return;
  }
  let foundObjects = shades.filter(obj => 
    obj.entityName.toLowerCase().includes(searchValue.toLowerCase()) || 
    obj.entityCode.toLowerCase().includes(searchValue)
  );

  if (foundObjects.length !== 0) {
    displayResults(foundObjects);
  } else {
    results.innerHTML = 'No Matches';
  }
}

function displayResults(objects) {
  results.innerHTML = '';
  objects.forEach(val => addCard(val));
}

function addCard(colorObj) {
  let card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `
    <div class="colorBox" style="background:${colorObj.shadeHexCode}"></div>
    <div class="title">
      <span class="colorName">${colorObj.entityName}</span>
      <span class="colorCode">${colorObj.entityCode}</span>
    </div>`;
  results.appendChild(card);
}

function filterByHue(array, minHue, maxHue) {
  return array.filter(obj => {
    let [h, , ] = hexToHsl(obj.shadeHexCode);
    return (h >= minHue && h <= maxHue);
  });
}
