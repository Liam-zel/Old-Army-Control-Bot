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
    constructor(name, dropRate, sellValue, amount, description, use) {
        this.name = name;
        this.sellValue = sellValue;
        this.amount = amount; // used for stacking items
        this.description = description;
        this.use = use;
    }
}

// (name, dropRate, sellvalue, amount, description)
var feather = new item("Feather", 100, 200, 1, undefined, undefined);
var test = new item("Test", 100, 1000, 100, undefined, undefined);
var rockShard = new item("Rock shard", 550, 1, 0, undefined, undefined)

var items = [feather, test, rockShard]

// item Descriptions --------------------
feather.description = "Plucked from a helpless peaceful bird, you monster."
test.description = "HFDSKJFHDSLKFJHDSLFJDLZSFJASLIFJ SLDF OSDJF JSFSDOJHF"
rockShard.description = "The rock had a family."


// item functions ---------------
test.use = function use() {
    console.log("x")
}

class monster {
    constructor(eName, goldEarn, xpEarn, drops, dropRates) {
        this.eName = eName;
        this.goldEarn = goldEarn; // ---------------- STORED IN CENTS ----------------
        this.xpEarn = xpEarn;
        this.drops = drops;
        this.dropRates = dropRates; // 100 == 100%
    }
}
// Monsters
// forest                     NAME              GOLD       XP          DROPS                     DROPRATES       
var rock     = new monster ( "Rock",            10,        1,      [rockShard],                  [10]);
var stick    = new monster ( "Stick",           15,        1,      [testTrinket],                [5]);
var bird     = new monster ( "Bird",            30,        2,      [feather],                    [10]);
var bush     = new monster ( "Bush",            45,        3,      [],                           []);
var tree     = new monster ( "Tree",            100,       5,      [],                           []);
var wolf     = new monster ( "Wolf",            250,      15,      [test, feather, rockShard],   [100, 85, 5]);

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
    constructor(name, prestigeReq, monsters, upgradeCost) {
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

//                      NAME    PRESTIGE        ENEMIES (--> upgrade cost)
var forest = new area("Forest",     0,      [rock, stick, bird, bush, tree, wolf], 1250);
var cave   = new area("Cave",       1,      [bat, scorpion, spider, batHorde, skeleton, bear], 2000);
var jungle = new area("Jungle",     3,      [centpide, toucan, snake, monkey, tiger, hippo], 4800);

// Array of every Area
var Areas = [forest, cave, jungle];

module.exports = {Areas, item, trinket, area, items};