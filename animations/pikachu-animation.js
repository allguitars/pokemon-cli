const PokemonAnimation = require('./pokemon-animation.js');
const { join } = require('path');

const pikuchuFramesPath = join(__dirname, 'frames', 'pikachu-running');
// const pikuchuFramesPath = join(__dirname, 'frames', 'charizard-dragon');
// const pikuchuFramesPath = join(__dirname, 'frames', 'mew');


const pikachuAnimation = new PokemonAnimation(pikuchuFramesPath);

exports.play = async (times) => {
    await pikachuAnimation.playMutltipleCycles(times);
}
