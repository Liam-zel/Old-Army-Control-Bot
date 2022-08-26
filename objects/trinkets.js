function loadTrinkets() {
    class trinket {
        constructor(name, bonus, bonusType, max) {
            this.name = name;
            this.bonus = bonus;
            this.bonusType = bonusType; 
            this.max = max; // max bonus the trinket can stack up to

            this.strength = 1; // basically just the amount
        }
    }
    //                           (  name,           bonus,     bonusType,      max)
    let testTrinket = new trinket("Test trinket",   5,        "Army kills",      1000);
    
    const trinkets = {testTrinket} // object so it can be accessed easier
    
    module.exports = {trinket, trinkets, loadTrinkets}
    return trinkets
}

module.exports = {loadTrinkets}