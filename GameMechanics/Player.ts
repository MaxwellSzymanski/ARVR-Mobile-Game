///<reference path="ItemSet.ts"/>
//@ts-check

interface Date {
    day: number;
    month: number;
    year: number;
}

class Player {
    // Personal Information
    private _firstName: String;
        get firstName(): String {return this._firstName;}
        set firstName(firstName: String) {this._firstName = firstName;}
    private _lastName: String;
        get lastName(): String {return this._lastName;}
        set lastName(lastName: String) {this._lastName = lastName;}
    private _dateOfBirth: Date;
        get dateOfBirth(): Date {return this._dateOfBirth;}
        set dateOfBirth(dateOfBirth: Date) {this._dateOfBirth = dateOfBirth;}
    private _location: number[] = new Array(2);
        get location(): number[] {return this._location;}
        set location(location: number[]) {this._location = location;}
    private _id: number;
        get id(): number {return this._id;}
        set id(id: number) {this._id = id;}
    // Player Stats
    private _level: number;
        get level(): number {return this._level;}
        set level(level: number) {this._level = level;}
    private _health: number[] = new Array(2);
        get health(): number[] {return this._health;}
        set health(health: number[]) {this._health = health;}
    private _attack: number[] = new Array(2);
        get attack(): number[] {return this._attack;}
        set attack(attack: number[]) {this._attack = attack;}
    private _defense: number[] = new Array(2);
        get defense(): number[] {return this._defense;}
        set defense(defense: number[]) {this._defense = defense;}
    private _visibility: number[] = new Array(2);
        get visibility(): number[] {return this._visibility;}
        set visibility(visibility: number[]) {this._visibility = visibility;}
    private _range: number[] = new Array(2);
        get range(): number[] {return this._range;}
        set range(range: number[]) {this._range = range;}
    private _accuracy: number[] = new Array(2);
        get accuracy(): number[] {return this._accuracy;}
        set accuracy(accuracy: number[]) {this._accuracy = accuracy;}
    private _evasion: number[] = new Array(2);
        get evasion(): number[] {return this._evasion;}
        set evasion(evasion: number[]) {this._evasion = evasion;}
    // Achievements
    private _kills: number; // KILLER
        get kills(): number {return this._kills;}
        set kills(kills: number) {this._kills = kills;}
    private _itemsCollected: number; // COLLECTOR
        get itemsCollected(): number {return this._itemsCollected;}
        set itemsCollected(itemsCollected: number) {this._itemsCollected = itemsCollected;}
    private _itemsUsed: number;
        get itemsUsed(): number {return this._itemsUsed;}
        set itemsUsed(itemsUsed: number) {this._itemsUsed = itemsUsed;}
    private _damageDone: number; // WARRIOR
        get damageDone(): number {return this._damageDone;}
        set damageDone(damageDone: number) {this._damageDone = damageDone;}
    private _distanceWalked: number; // WALKER
        get distanceWalked(): number {return this._distanceWalked;}
        set distanceWalked(distanceWalked: number) {this._distanceWalked = distanceWalked;}
    private _othersHealed: number; // HEALER
        get othersHealed(): number {return this._othersHealed;}
        set othersHealed(othersHealed: number) {this._othersHealed = othersHealed;}
    // Items
    private _items: ItemSet;
    private _activeItems: ItemSet;

    /**
     * Does damage to the opponent, and looks at any attack, defense and health bonuses.
     * @param {Player} opponent - The opponent that will be attacked.
     */
    attackPlayer(opponent: Player): number {
        // Calculate own attack
        var attack: number = this.attack[0];
        if (!opponent._activeItems.containsType(ItemType.AttackBreak)) {
            attack += this.attack[1]
        }
        // Calculate opponents defense
        var defense: number = opponent.defense[0];
        if (!this._activeItems.containsType(ItemType.DefenseBreak)) {
            defense += opponent.defense[1]
        }
        // Hit or miss
        var oppEvasion = opponent.evasion[0] * opponent.evasion[1]; 
        if (oppEvasion > Math.random()) {
            return -1;
        };
        var ownAccuracy = this.accuracy[0] * this.accuracy[1];
        if (ownAccuracy > Math.random()) {
            return -2;
        };
        // Do damage to opponent
        var damage: number = attack * attack / (attack + defense)
        if (opponent.health[1] != 0) {
            let residue = opponent.health[1] - damage;
            if (residue <= 0) {
                opponent._activeItems.remove(ItemType.HealthUp);
                opponent.health = [opponent.health[0] - residue, 0];
            }
            else {
                opponent.health[1] = residue;
            }
        }
        else {
            opponent.health[0] -= damage;
        }
        return damage;
    }

    useItem(item: Item) {
        if (!this._items.containsItem(item)) throw "Item is not in player's inventory, can't be used.";
        switch(item.type) {
            case ItemType.RangeUp: {
                this.range[1] *= 1 + (item.tier * 0.1);
                this._activeItems.addItem(item);
                break;
            }
            case ItemType.AttackUp: {
                this.attack[1] *= 1 + (item.tier * 0.1);
                this._activeItems.addItem(item);
                break;
            }
            case ItemType.DefenseUp: {
                this.defense[1] *= 1 + (item.tier * 0.1);
                this._activeItems.addItem(item);
                break;
            }
            case ItemType.VisibilityDown: {
                this.visibility[1] *= 1 - (item.tier * 0.1);
                this._activeItems.addItem(item);
                break;
            }
            case ItemType.RangeUp: {
                this.range[1] *= 1 + (item.tier * 0.1);
                this._activeItems.addItem(item);
                break;
            }

        }
    }

    degreesToRadians(degrees) {
        return degrees * Math.PI / 180;
    }

    distanceBetween(lat1, lon1, lat2, lon2) {
        var earthRadiusKm = 6371;

        var dLat = this.degreesToRadians(lat2-lat1);
        var dLon = this.degreesToRadians(lon2-lon1);

        lat1 = this.degreesToRadians(lat1);
        lat2 = this.degreesToRadians(lat2);

        var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return earthRadiusKm * c;
    }
}


enum Trait {
    Killer,
    Defender,
    Agile,
    Thief,
    Runner
}