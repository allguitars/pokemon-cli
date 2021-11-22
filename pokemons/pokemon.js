class Pokemon {
    #id
    #name
    #types
    #encounterLocations;  // includes encounter methods
    #stats
    #locationAreaEncountersUrl
    #date

    constructor(data) {
        this.#id = data.id;
        this.#name = data.name;
        this.#locationAreaEncountersUrl = data.location_area_encounters;

        this.#types = [];
        data.types.forEach(type => {
            this.#types.push(type.type.name);
        });

        this.#stats = {};
        data.stats.forEach(stat => {
            this.#stats[stat.stat.name] = stat.base_stat;
        });

        this.#date = Date.now();
    }

    getId() {
        return this.#id;
    }

    getName() {
        return this.#name;
    }

    getTypes() {
        return this.#types;
    }

    getLocationAreaEncountersUrl() {
        return this.#locationAreaEncountersUrl;
    }

    getEncounterLocations() {
        return this.#encounterLocations;
    }

    getStats() {
        return this.#stats;
    }

    getDate() {
        return this.#date;
    }

    setEncounterLocations(encounterLocations) {
        this.#encounterLocations = encounterLocations;
    }

    setStats(stats) {
        this.#stats = stats;
    }

    // string for saving to files
    generateJsonString() {
        const obj = {
            id: this.#id,
            name: this.#name,
            types: this.#types,
            encounterLocations: this.#encounterLocations,
            stats: this.#stats,
            date: this.#date
        };

        const jsonString = JSON.stringify(obj, 2, null);
        return jsonString;
    }
}

module.exports = Pokemon;