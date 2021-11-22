const Table = require('cli-table3');
const colors = require('colors');
const moment = require('moment');

exports.printProfile = (profile) => {
    const encounterLocations =
        profile.encounterLocations.length !== 0 ?
            profile.encounterLocations :
            '-';

    const table = new Table({
        chars: {
            'top': '═'
            , 'top-mid': '╤'
            , 'top-left': '╔'
            , 'top-right': '╗'
            , 'bottom': '═'
            , 'bottom-mid': '╧'
            , 'bottom-left': '╚'
            , 'bottom-right': '╝'
            , 'left': '║'
            , 'left-mid': '╟'
            , 'right': '║'
            , 'right-mid': '╢'
        },
        head: [
            {
                content: colors.brightRed('ID'),
                hAlign: 'center'
            },
            {
                content: colors.brightRed('Name'),
                hAlign: 'center'
            },
            {
                content: colors.brightRed('Types'),
                hAlign: 'center'
            },
            {
                content: colors.brightRed('Encounter Locations in Kanto'),
                hAlign: 'center'
            },
            {
                content: colors.brightRed('Stats'),
                hAlign: 'center'
            },
            {
                content: colors.brightRed('Date'),
                hAlign: 'center'
            }
        ]
    });

    table.push(
        [
            {
                content: colors.brightWhite(profile.id),
                vAlign: 'center'
            },
            {
                content: colors.brightWhite(profile.name),
                vAlign: 'center'
            },
            {
                content: colors.brightWhite(profile.types.toString()),
                vAlign: 'center'
            },
            {
                content: colors.brightWhite(JSON.stringify(encounterLocations, null, 2)),
                vAlign: 'center'
            },
            {
                content: colors.brightWhite(JSON.stringify(profile.stats, null, 2)),
                vAlign: 'center'
            },
            {
                content: colors.brightWhite(JSON.stringify(moment(profile.date), null, 2)),
                vAlign: 'center'
            }
        ]
    );

    console.clear();
    console.log(table.toString());
}
