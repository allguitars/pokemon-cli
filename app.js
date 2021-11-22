const pikuchuAnimation = require('./animations/pikachu-animation');
const { selectSearchType, inputIdOrName } = require('./interactive-cli/prompts');
const { query } = require('./pokemons/pokemon-query');
const { printProfile } = require('./utils/print-utils');
const welcomeScreen = require('text-animation');
const width = Math.ceil(process.stdout.columns);
const height = Math.ceil(process.stdout.rows * 0.33);

let keyword;
let isName;

welcomeScreen({
    text: 'Pokemon CLI',
    animation: 'bottom-top',
    delay: 50,
    size: `${width}x${height}`,
    font: 'Isometric3'
}, () => { main(); });

async function main() {
    // user should select id or name as search keyword
    isName = await selectSearchType();
    keyword = await inputIdOrName(isName);

    // trainsition animation
    await pikuchuAnimation.play(6);

    const pokemonProfile = await query(keyword);
    printProfile(pokemonProfile);
}
