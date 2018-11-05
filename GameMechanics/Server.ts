///<reference path="ItemEvent.ts"/>
///<reference path="Player.ts"/>

class Server {
    activeEvents: [ItemEvent];
    activePlayers: [Player];

    getVisiblePlayers(self: Player): [Player] {
        var visiblePlayers: [Player];
        for (let player of this.activePlayers) {
            if (!(player.id == self.id) && this.inRange(self, player)) {
                visiblePlayers.push(player)
            }
        }
        return visiblePlayers;
    }

    inRange(player1: Player, player2: Player): boolean {
        let range = player1.range[0] + player1.range[1] + player2.visibility[0] + player2.visibility[1];
        let distance = player1.distanceBetween(player1.location[0], player1.location[1], player2.location[0], player2.location[1]);
        if (distance <= range) {
            return true;
        }
        return false;
    }

    
}