
class Item {
    type: ItemType;
    tier: number; // Values: 0 (none), 1, 2, 3
    duration: number; // Values: in seconds.
}

/**
 *
 * 1-99: Stat boosts
 * 100-199:
 * 200-299: Opponent status inflictors
 * 300-399: Damage items
 *
 */
enum ItemType {
    Heal = 1,
    HealthUp,
    AttackUp = 3 ,
    DefenseUp = 4,
    HealOther = 2,
    AttackBreak,
    DefenseBreak,
    VisibilityDown,
    RangeUp,
    RangeDownOPP = 200,
    VisibilityUpOPP = 201,
    DamageBomb = 300,
    Poison = 301
}

