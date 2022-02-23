class trinket {
    constructor(name, bonus, bonusType, strength, dropRate, max) {
        this.name = name;
        this.bonus = bonus;
        this.bonusType = bonusType;
        this.strength = strength; // basically just the amount
        this.dropRate = dropRate; // 100 == 100%
        this.max = max; // max bonus the trinket can stack up to
    }
}
// (name, bonus, bonusType, strength, droprate, max, baseBonus)
var testTrinket = new trinket("Test Trinket", 5, "Army kills", 1, 100, 1000);

class item {
    constructor(name, dropRate, sellValue, amount, image) {
        this.name = name;
        this.dropRate = dropRate; // 100 == 100%
        this.sellValue = sellValue;
        this.amount = amount; // used for stacking items
    }
}

// (name, dropRate, sellvalue, amount)
var feather = new item("Feather", 100, 0, 1);
var test = new item("Test", 100, 0, 1);
var rockShard = new item("Rock shard", 5, 1, 0)

class monster {
    constructor(eName, goldEarn, xpEarn, drops) {
        this.eName = eName;
        this.goldEarn = goldEarn;
        this.xpEarn = xpEarn;
        this.drops = drops;
    }
}
// Monsters
// forest                     NAME             GOLD     XP      DROPS             
var rock     = new monster ( "Rock",            1,      1,      [test],          );
var stick    = new monster ( "Stick",           1,      1,      [testTrinket],   );
var bird     = new monster ( "Bird",            2,      1,      [feather],       );
var bush     = new monster ( "Bush",            3,      2,      [],              );
var tree     = new monster ( "Tree",           10,      8,      [],              );
var wolf     = new monster ( "Wolf",           20,     16,      [],              );

// caves
var bat      = new monster ( "Bat",             3,      1,      [],              );
var scorpion = new monster ( "Scorpion",        3,      1,      [],              );
var spider   = new monster ( "Spider",          5,      3,      [],              );
var batHorde = new monster ( "Bat horde",       7,      4,      [],              );
var skeleton = new monster ( "Skeleton",       19,     14,      [],              );
var bear     = new monster ( "Bear",           35,     26,      [],              );

// Jungle
var centpide = new monster ( "Centipede",       7,      3,      [],              );
var toucan   = new monster ( "Toucan",         10,      4,      [],              );
var snake    = new monster ( "Snake",          12,      8,      [],              );
var monkey   = new monster ( "Monkey",         18,     12,      [],              );
var tiger    = new monster ( "Tiger",          30,     24,      [],              );
var hippo    = new monster ( "Hippo",          62,     40,      [],              );

// Areas
class area {
    constructor(name, prestigeReq, monsters, level, upgradeCost) {
        this.name = name;
        this.prestigeReq = prestigeReq;
        this.monsters = monsters;
        this.upgradeCost = upgradeCost;
        // this.level = 0;
        // this.miniBoss = false;
        // this.megaBoss = false;
        // this.isMaxed = false;
        // this.multiplier = 1.0;
    }
}

//                      NAME    PRESTIGE        ENEMIES
var forest = new area("Forest",     0,      [rock, stick, bird, bush, tree, wolf], 1250);
var cave   = new area("Cave",       1,      [bat, scorpion, spider, batHorde, skeleton, bear], 2000);
var jungle = new area("Jungle",     3,      [centpide, toucan, snake, monkey, tiger, hippo], 4800);

// Array of every Area
var Areas = [forest, cave, jungle];

module.exports = {Areas, item, trinket, area};