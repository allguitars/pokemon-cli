const {
    getPokemonByIdOrName,
    getChachedProfile,
    retrieveEncounterLocations,
    saveData,
} = require('./pokemon-utils');
const Pokemon = require('../pokemons/pokemon');

exports.query = async (idOrName) => {
    try {
        // *** Find in cache. must not expire
        let profile = getChachedProfile(idOrName);

        // *** Not in cache, fetch from API
        if (!profile) {
            const pokemonData = await getPokemonByIdOrName(idOrName);
            const pokemon = new Pokemon(pokemonData);

            // *** encounter locations for Kanto
            await retrieveEncounterLocations(pokemon, 'kanto');

            // save new data
            saveData(pokemon);
            profile = getChachedProfile(idOrName);
        }

        return profile;
    } catch (error) {
        console.log(error);
    }
}
