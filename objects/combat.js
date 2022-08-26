const { loadTrinkets } = require("./trinkets")
const { loadItems, item } = require("./items")

function loadObjects() {
    const _items = loadItems() // returns items array
    const trinkets = loadTrinkets() // returns trinkets array

    return new Promise((resolve, reject) => {

        let i = _items
        let t = trinkets

        const { item } = require("./items")
        const { trinket } = require("./trinkets")

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
        // forest                     NAME                 GOLD           XP        Empty drops array (initialized below)
        var rock     = new monster ( "Rock",               10,            1         ,[]);
        var stick    = new monster ( "Stick",              15,            1         ,[]);
        var bird     = new monster ( "Bird",               30,            2         ,[]);
        var bush     = new monster ( "Bush",               45,            3         ,[]);
        var tree     = new monster ( "Tree",               100,           5         ,[]);
        var wolf     = new monster ( "Wolf",               250,           15        ,[]);

        // caves    
        var bat      = new monster ( "Bat",                3,             1         ,[]);
        var scorpion = new monster ( "Scorpion",           3,             1         ,[]);
        var spider   = new monster ( "Spider",             5,             3         ,[]);
        var batHorde = new monster ( "Bat horde",          7,             4         ,[]);
        var skeleton = new monster ( "Skeleton",           19,            14        ,[]);
        var bear     = new monster ( "Bear",               35,            26        ,[]);

        // Jungle  
        var centpide = new monster ( "Centipede",          7,             3         ,[]);
        var toucan   = new monster ( "Toucan",             10,            4         ,[]);
        var snake    = new monster ( "Snake",              12,            8         ,[]);
        var monkey   = new monster ( "Monkey",             18,            12        ,[]);
        var tiger    = new monster ( "Tiger",              30,            24        ,[]);
        var hippo    = new monster ( "Hippo",              62,            40        ,[]);
        
        // DROPS
        rock.drops = [i.rockShard, i.test]//[find(i, "Rock shard"), find(i, "Test")]
        rock.dropRates = [10, 100]

        stick.drops = [t.testTrinket]
        stick.dropRates = [100]

        bird.drops = [i.feather]
        bird.dropRates = [10]
        
        wolf.drops = [i.test, i.feather, i.rockShard]
        wolf.dropRates = [100, 85, 5]

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
        const Areas = [forest, cave, jungle];

        // console.log("1", Object.keys(_items))
        // console.log("2", Object.values(_items))
        // console.log("3", Object.entries(_items))

        const items = Object.values(_items)

        resolve(module.exports = {area, monster, item, trinket, 
                                  Areas, items, trinkets})   
    })
}

loadObjects()
//module.exports = {loadObjects}


function _findIndex(array, itemName) {
    const newArray = array.map(x => x.name)  

    //console.log(newArray.indexOf(itemName))

    return array[newArray.indexOf(itemName)]
} 