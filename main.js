// Catturiamo il riquadro della lista pokemon
let list = document.querySelector("#list");

// Catturiamo i tag della sezione dettaglio
let pokemon_img = document.querySelector("#pokemon_img")
let pokemon_type = document.querySelector("#pokemon_type")
let pokemon_description = document.querySelector("#pokemon_description")


// Teniamo conto di quanti pokemon vogliamo mostrare
const pokemonCount = 151;
let pokedex = {};

// Al caricamento della pagina facciamo partire una funzione asincrona che andra a richiamare un altra funzione asincrona che ci permettera di ricevere i dati dei pokemon.
window.onload = async function(){
    for(let i = 1; i <= pokemonCount; i++){
        await getPokemon(i);

        // Adesso andiamo a creare gli elementi che comporranno la nostra lista di pokemon
        let createPokemon = document.createElement("div");
        createPokemon.id = i;
        createPokemon.innerText = i.toString() + " " + pokedex[i]["name"].toUpperCase();
        createPokemon.classList.add("pokemon-name");
        
        // Adesso creaiamo un event listener che al click sul nome del pokemon mostri i dettagli
        createPokemon.addEventListener("click", updatePokemon);

        // ed infine appendiamo gli elementi appena creati per comporre la nostra lista di pokemon
        list.appendChild(createPokemon);
        console.log(createPokemon);
    }
    console.log(pokedex);
};

// Questa funzione asincrona fa partire le richieste per raccogliere i dati
async function getPokemon(number){
    // qui incapsuliamo l'url
    let url = `https://pokeapi.co/api/v2/pokemon/${number}`;

    // Adesso agiamo in modo asincrono per recuperare il dato direttamente dall'url incapsulato precedentemente
    let response = await fetch(url);
    // console.log(response);
    
    // Dopo aver fatto partire la richiesta sopra, incapsuliamo il risultato e trasformiamo la response in oggetto json.
    let pokemon = await response.json();
    // console.log(pokemon);

    // a questo punto lavorando con un oggetto possiamo raccogliere i dati che ci interessano. Esempio {name: bulbasaur}
    let pokemonName = pokemon["name"];
    // console.log(pokemonName);
    
    // In questo caso essendo un array quello che dobbiamo recuperare non possiamo usare semplicemente la dot syntax.
    let pokemonType = pokemon["types"];
    // console.log(pokemonType);
    
    // Qui non solo accediamo all'array sprites ma andiamo anche a prendere il dato che ci interessa con ["front_default"]
    let pokemonImg = pokemon["sprites"]["front_default"];
    // console.log(pokemonImg);

    let pokemonStats = pokemon["stats"];
    // console.log(pokemonStats);

    // Qui invece abbiamo a che fare di nuovo con il fetch poiche tutto quello che riguarda i dettagli del pokemon (come ad esempio la descrizione) sono inseriti all'interno di un altro URL ma comunque all'interno dell'oggetto pokemon.
    response = await fetch(pokemon["species"]["url"]);

    // E qui andiamo di nuovo a catturare la risposta in formato json.
    let pokemonDescription = await response.json();

    // E ora riassegnamo a pokemon description il valore che ci serve;
    pokemonDescription = pokemonDescription["flavor_text_entries"][9]["flavor_text"];
    // console.log(pokemonDescription);


    // Andiamo a popolare adesso il nostro oggetto vuoto pokedex creato in precedenza
    pokedex[number] = {"name" : pokemonName, "img" : pokemonImg, "types" : pokemonType, "description" : pokemonDescription, "stats" : pokemonStats}


};



// Creiamo la funzione di update della colonna di dettaglio

function updatePokemon(){
    // andiamo a popolare il campo src del tag img prendendo in riferimento l'id del pokemon e l'url nel campo img
    pokemon_img.src = pokedex[this.id]["img"];

    // Puliamo lo span con all'interno i tipi dei pokemon
    while (pokemon_type.firstChild){
        pokemon_type.firstChild.remove();
    }

    // Adesso aggiorniamo i tipi dei pokemon
    let types = pokedex[this.id]["types"];
    for(let i = 0; i < types.length; i++){
        let type = document.createElement("span");
        type.innerText = types[i]["type"]["name"].toUpperCase();
        
        // Qui andiamo ad aggiungere una classe che ha come nome il nome del tipo del pokemon per poter creare background diversi per ogni tipo.
        type.classList.add(types[i]["type"]["name"]);

        // Infine appendiamo gli span appena creati al div catturato in precedenza
        pokemon_type.append(type);

        // Ora passiamo alla descrizione
        pokemon_description.innerText = pokedex[this.id]["description"];
    }

}
