// Add a click event listener to the element with id "search" and call the getPokemon function when clicked.
document.querySelector("#search").addEventListener("click", getPokemon);

// Function to capitalize the first letter of a string.
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Function to convert a string to lowercase.
function lowerCaseName(string) {
  return string.toLowerCase();
}

// Function to fetch and display Pokemon information.
function getPokemon(e) {
  // Get the value entered in the input field with id "pokemonName".
  const name = document.querySelector("#pokemonName").value;

  // Convert the entered name to lowercase.
  const pokemonName = lowerCaseName(name);

  // Fetch Pokemon data from the PokeAPI using the entered name.
  fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
    .then((response) => response.json())
    .then((data) => {
      // Extract the types of the Pokemon and join them into a comma-separated string.
      const types = data.types.map((typeData) => typeData.type.name).join(", ");
      
      // Get the URL to fetch species data.
      const flavorText = data.species.url;

      // Update the HTML content to display Pokemon information.
      document.querySelector(".pokemonBox").innerHTML = `
      <div>
        <img
          src="${data.sprites.other["official-artwork"].front_default}"
          alt="Pokemon name"
        />
      </div>
      <div class="pokemonInfos">
        <h1>${capitalizeFirstLetter(data.name)}</h3>
        <p>Weight: ${data.weight}</p>
        <p>Types: ${types}</p>
        <p>Ability: ${data.abilities.map((ability) => capitalizeFirstLetter(ability.ability.name)).join(", ")}</p>
        <p class="flavorText">Species Flavor Text:</p>
      </div>`;

      // Fetch species data using the flavorText URL.
      fetch(flavorText)
        .then((response) => response.json())
        .then((speciesData) => {
          // Find the English flavor text entry, if available.
          const flavorTextEntries = speciesData.flavor_text_entries;
          const englishFlavorText = flavorTextEntries.find(
            (entry) => entry.language.name === "en"
          );

          // Display the flavor text or a message if not available.
          if (englishFlavorText) {
            document.querySelector(".flavorText").textContent =
              englishFlavorText.flavor_text;
          } else {
            document.querySelector(".flavorText").textContent =
              "No flavor text available";
          }
        })
        .catch((error) => {
          console.error("Error fetching species data:", error);
        });
    })
    .catch((err) => {
      // Display a message when the Pokemon is not found.
      document.querySelector(".pokemonBox").innerHTML = `
      <h4>Pokemon not found 😞</h4>
      `;
      console.log("Pokemon not found", err);
    });

  // Prevent the default form submission behavior.
  e.preventDefault();
}

