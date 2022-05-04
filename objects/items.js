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

const items = [feather, test, rockShard]

// item Descriptions --------------------
feather.description = "Plucked from a helpless peaceful bird, you monster."
test.description = "HFDSKJFHDSLKFJHDSLFJDLZSFJASLIFJ SLDF OSDJF JSFSDOJHF"
rockShard.description = "The rock had a family."


// item functions ---------------
test.use = function(user){   
    user.armyEfficiency *= 2
    console.log("doubled army efficiency!")
}



module.exports = {item, items}