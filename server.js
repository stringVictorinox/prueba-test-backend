const express = require("express");
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 3977;

app.use(cors());

app.get('/', (req, res) => {
    res.status(200).send({ msg: '¡Hola, Mundoo!'})
})

app.get('/pokedex', async (req, res) => {
    try {
        const limit = 80;
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}`);
        //const response = await fetch(`https://prueba-test-backend-production.up.railway.app/pokedex`)
        const data = await response.json();

        const pokemonList = await Promise.all(data.results.map(async (pokemon) => {
            const detailsResponse = await fetch(pokemon.url);
            const detailsData = await detailsResponse.json();

            return {
                name: detailsData.name,
                id: detailsData.id,
                height: detailsData.height,
                weight: detailsData.weight,
                experience: detailsData.base_experience,
            };
        }));

        res.json(pokemonList);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener la lista de Pokémon' });
    }
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}.`);
})
