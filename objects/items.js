function loadItems() {
    class item {
        constructor(name, sellValue, description) {
            this.name = name;
            this.sellValue = sellValue;

            this.description = description;
            this.use;

            this.amount = 1; // used for stacking items
        }
    }

    //                     (name, sellvalue)
    var feather = new item("Feather", 200);
    var test = new item("Test", 1000);
    var rockShard = new item("Rock shard", 550)

    const _items = {feather, test, rockShard} // object so it can be accessed easier

    // item Descriptions --------------------
    feather.description = "Plucked from a helpless peaceful bird, you monster."
    test.description = "HFDSKJFHDSLKFJHDSLFJDLZSFJASLIFJ SLDF OSDJF JSFSDOJHF"
    rockShard.description = "The rock had a family."


    // item functions ---------------
    test.use = function(user){   
        user.armyEfficiency *= 2
        console.log("doubled army efficiency!")
    }
    
    module.exports = {item, _items, loadItems}
    return _items
}

module.exports = {loadItems}