const asciify = require('asciify-image');
const path = require('path');
const fs = require('fs');

class PokemonAnimation {
    #framesDir = '';
    #frameFiles = [];
    #frameDuration;
    #options = {
        color: true,
        fit: 'box',
        height: process.stdout.rows
    };

    constructor(framesDir, frameDuration, options) {
        if (!arguments.length) {
            throw new Error('Frames directory for the pokemon is required');
        }

        this.#framesDir = framesDir;
        this.#frameFiles = fs.readdirSync(framesDir);
        this.#frameDuration = frameDuration ? frameDuration : 50; // ms

        if (options) {
            this.#options.color = ('color' in options) ? options.color : true;
            this.#options.fit = ('fit' in options) ? options.fit : 'box';
            this.#options.height = ('height' in options) ? options.height : process.stdout.rows;
        }
    }

    async playOneCycle() {
        for (let i = 0; i < this.#frameFiles.length; i++) {
            const gifPath = path.join(this.#framesDir, this.#frameFiles[i]);

            const asciified = await asciify(gifPath, this.#options);
            console.log(asciified);

            await this.#sleep(this.#frameDuration);
        }
    }

    async playMutltipleCycles(rounds) {
        if (!rounds) {
            throw new Error('repeating times must be specified');
        }

        for (let i = 0; i < rounds; i++) {
            await this.playOneCycle();
        }
    }

    #sleep = (ms) => {
        if (!ms) {
            throw new Error('Sleep time is not specfied');
        }

        return new Promise(resolve => setTimeout(resolve, ms));
    }

    getOptions() {
        return this.#options;
    }

    getFrameFiles() {
        return this.#frameFiles;
    }

    getFramesDir() {
        return this.#framesDir;
    }
}

// const pikuchuFramesPath = path.join('../frames', 'pikachu-running');
// const pikachuAnimation = new PokemonAnimation(pikuchuFramesPath, 75);
// pikachuAnimation.playMutltipleCycles(10);

module.exports = PokemonAnimation;
