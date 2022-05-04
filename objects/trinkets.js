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
let testTrinket = new trinket("Test Trinket", 5, "Army kills", 1, 100, 1000);

const trinkets = {testTrinket}



module.exports = {trinket, trinkets}