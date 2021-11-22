const { fetchData } = require('../utils/http-utils');
const fs = require('fs');
const moment = require('moment');
const API = require('../constants/api');
const retentionPolicy = require('../constants/retention-policy');

const listContent = fs.readFileSync('./db/pokemon-list.txt', 'utf8');
let pokemonList = JSON.parse(listContent);

exports.getPokemonByIdOrName = async (idOrName) => {
    try {
        const url = `${API.POKEMON}/${idOrName}`;
        const data = await fetchData(url);
        return data;
    } catch (error) {
        throw error;
    }
}

exports.retrieveEncounterLocations = async (pokemon, specifiedRegion) => {
    try {
        const encountersUrl = pokemon.getLocationAreaEncountersUrl();    // E.g. https://pokeapi.co/api/v2/pokemon/1/encounters
        const encountersData = await fetchData(encountersUrl);

        const encounterLocations = [];

        await Promise.all(encountersData.map(async (encounter) => {
            const locationAreaUrl = encounter.location_area.url;         // E.g. https://pokeapi.co/api/v2/location-area/281/

            const locationAreaData = await fetchData(locationAreaUrl);
            const locationUrl = locationAreaData.location.url;           // E.g. https://pokeapi.co/api/v2/location/68/

            // fetch the location data to obtain region name
            const locationData = await fetchData(locationUrl);

            // only store the locations and related methods in Kanto!
            if (locationData.region.name === specifiedRegion) {
                const encounterInfo = {};
                encounterInfo['location'] = encounter.location_area.name;

                // collect methods for the location
                const methods = [];

                /**
                 * There are different places in PokeAPI that store methods information
                 */

                // ---- The first place I found encounter method information ----

                // encounter.version_details.forEach(versionDetail => {
                //     versionDetail.encounter_details.forEach(encounterDetail => {
                //         methods.push({
                //             name: encounterDetail.method.name,
                //             chance: encounterDetail.chance
                //         });
                //     });
                // });

                // -------- Another place that has method information --------
                // I am assuming the assessment requires this one

                locationAreaData.encounter_method_rates.forEach(encounterMethodRate => {
                    const method = encounterMethodRate.encounter_method.name;
                    methods.push(method);
                })

                encounterInfo['methods'] = methods;
                encounterLocations.push(encounterInfo);
            }
        }));

        pokemon.setEncounterLocations(encounterLocations);
    } catch (error) {
        throw error;
    }
}

exports.saveData = (pokemon) => {
    try {
        const id = pokemon.getId();
        const name = pokemon.getName();
        const filename = `${id}.txt`;
        const filePath = (`./db/${filename}`);
        const listPath = ('./db/pokemon-list.txt');

        fs.writeFileSync(filePath, pokemon.generateJsonString());

        // maintain the list
        const pokemonItem = {
            id,
            name
        };

        // remove the existing one from list
        pokemonList = pokemonList.filter(item => {
            return item.id !== pokemonItem.id;
        });

        pokemonList.push(pokemonItem);

        fs.writeFileSync(listPath, JSON.stringify(pokemonList, null, 2));
    } catch (error) {
        throw error;
    }
}

// returns the profile only when the id is found in cache, AND profile has not yet expired 
exports.getChachedProfile = (idOrName) => {
    const id = findCachedId(idOrName);

    if (!id) return null;  // profile is not in cache

    const filePath = `./db/${id}.txt`;
    const content = fs.readFileSync(filePath, 'utf8');
    const profile = JSON.parse(content);

    if (hasExpired(profile.date)) {  // profile has expired
        return null;
    }

    return profile;
}

// determine if the user inputs an id or a name (Poke API supports both id and name search)
function isName(idOrName) {
    return (typeof idOrName === 'string' || idOrName instanceof String);
}

// determine if the data in cache has expired or not
function hasExpired(date) {
    const dateOfSave = moment(date);
    const diff = moment(Date.now()).diff(dateOfSave, 'days');
    return (diff > retentionPolicy.POKEMON_CACHE);  // data has existed for more than a week
}

// seach id from the cached list
function findCachedId(idOrName) {
    let result;
    if (isName(idOrName)) {
        result = pokemonList.find(p => { return p.name === idOrName });  // find by name
    } else {
        result = pokemonList.find(p => { return p.id === idOrName });    // find by id
    }

    if (result) {
        return result.id;
    } else {
        return null;
    }
}
