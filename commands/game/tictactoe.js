const { Command } = require('discord.js-commando')

module.exports = class TicTacToeCommand extends Command{
    constructor(client){
        super(client, {
            name : 'tictactoe',
            aliases : ['ttt'],
            group : 'utility',
            memberName : 'tictactoe',
            description : 'Play Tic Tac Toe with your friend now',
            examples : [client.commandPrefix + 'tictactoe', client.commandPrefix + 'ttt @user'],
            guildOnly: true,
            throttling : {
                usages : 1,
                duration : 5
            },
            args:[
                {
                    key:'opponent',
                    prompt : 'Who do you want to challenge?',
                    type : 'member',
                }
            ]
        });
    }

    run(message, {opponent}){
        if (opponent.bot) return message.say(`You can't play against bot`);
        if (opponent.id === message.author.id) return message.say(`You can't play against yourself`);
        confirm(message, opponent).then( () => {
            var winner;
            var turn = 1;
            var boardgame = [1,2,3,4,5,6,7,8,9]
            var player1 = {
                player: message.author,
                mark: "X"
            }
            var player2 = {
                player: opponent,
                mark: "O"
            }
            var currentturn = true;
            while(winner == null && turn <= 9){
                var player = currentturn ? player1 : player2;
                message.say(`${player.player} Turn Your Mark is ${player.mark}`);
                message.say(`|_${boardgame[0]}_|_${boardgame[1]}_|_${boardgame[2]}_|\n`+
                            `|_${boardgame[3]}_|_${boardgame[4]}_|_${boardgame[5]}_|\n`+
                            `|_${boardgame[6]}_|_${boardgame[7]}_|_${boardgame[8]}_|`);
                message.say(` Pick A Number on the board to place your mark`)
                message.channel.awaitMessages(m => m.author.id === player.player.id, { max: 1, time: 180000, errors: ['time'] })
                    .then(collected => {
                        let answer = collected.first();
                        let command = answer.content;
                        if (typeof boardgame[command - 1] == 'number'){
                            boardgame[command - 1] = player.mark
                            turn += 1
                        }
                        else{
                            message.say(`Input has been taken or not valid, next player turn`)
                        }
                    }).catch( () => {
                        message.say(`Time up!, next player turn`)
                    })
                    currentturn = !currentturn
                    if (verifywin(boardgame)){
                        winner = player;
                    }
            }
            message.say(`${winner.player} is the winner`)
            message.say(`|_${boardgame[0]}_|_${boardgame[1]}_|_${boardgame[2]}_|\n`+
                        `|_${boardgame[3]}_|_${boardgame[4]}_|_${boardgame[5]}_|\n`+
                        `|_${boardgame[6]}_|_${boardgame[7]}_|_${boardgame[8]}_|`)
        }).catch( () => {
            return message.say(`Random answer detected Command Cancelled`);
        })
    }
}

function confirm(message, opponent){
    return new Promise((resolve, reject) => {
        message.channel.send(`${message.member} challenge ${opponent} to game of Tic Tac Toe. Do you accept the challenge? (Yes/No)`).then(m => {
            message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, time: 180000, errors: ['time'] })
            .then(collected => {
                let answer = collected.first();
                let command = answer.content;
                if(command.toLowerCase() == 'yes'){
                    resolve(command);
                }
                else if (command.toLowerCase() == 'no'){
                    return message.say(`${opponent} declined the challenge, ${message.member}`)
                }
                else{
                    reject();
                }
            })
            .catch( collected => {
                return message.channel.send(`Command Cancelled`)
            });
        })
    })
}

function verifywin(boardgame){
    return (boardgame[0] === boardgame[1] && boardgame[0] === boardgame[2])
    || (boardgame[0] === boardgame[3] && boardgame[0] === boardgame[6])
    || (boardgame[3] === boardgame[4] && boardgame[3] === boardgame[5])
    || (boardgame[1] === boardgame[4] && boardgame[1] === boardgame[7])
    || (boardgame[6] === boardgame[7] && boardgame[6] === boardgame[8])
    || (boardgame[2] === boardgame[5] && boardgame[2] === boardgame[8])
    || (boardgame[0] === boardgame[4] && boardgame[0] === boardgame[8])
    || (boardgame[2] === boardgame[4] && boardgame[2] === boardgame[6]);
}