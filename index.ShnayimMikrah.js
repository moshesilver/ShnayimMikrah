const response = await fetch(
  "https://raw.githubusercontent.com/Sefaria/Sefaria-Export/master/json/Tanakh/Torah/Genesis/Hebrew/Tanach%20with%20Ta'amei%20Hamikra.json"
);
const targumResponse = await fetch(
  "https://raw.githubusercontent.com/Sefaria/Sefaria-Export/master/json/Tanakh/Targum/Onkelos/Torah/Onkelos%20Genesis/Hebrew/Onkelos%20Genesis.json"
);
let data = await response.json();
let targumData = await targumResponse.json();

let numPerakim = data.text.length;

let perekSelectElement = document.getElementById("perekSelect");
for (let i = 0; i < numPerakim; i++) {
  let optionElement = document.createElement("option");
  optionElement.innerText = i + 1;
  perekSelectElement.appendChild(optionElement);
}

let textArea = document.getElementById("textArea");

function choosePerek(perek) {
  let psukim = "";
  console.log(perek);
  for (let pasukIX in data.text[perek]) {
    let pasuk = data.text[perek][pasukIX];
    let targum = targumData.text[perek][pasukIX];
    psukim += `<div>${pasuk}</div>`;
    psukim += `<div>${pasuk}</div>`;
    psukim += `<div>${targum}</div>`; // BUG - if targum pasuk is too long colon is in middle of text
    psukim += `<br>`;
  }
  textArea.innerHTML = psukim;
}

perekSelectElement.addEventListener("change", (e) =>
  choosePerek(e.target.value - 1)
);

// Choose a default perek.  Convenient when developing.
choosePerek(0);
