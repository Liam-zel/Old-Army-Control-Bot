// // - agree button
// // - remove / add button


// class off_item {
//     constructor(name, dropRate, sellValue, amount) {
//         this.name = name;
//         this.dropRate = dropRate; // 100 == 100%
//         this.sellValue = sellValue;
//         this.amount = amount; // used for stacking items
//     }
// }


// const { prefix, botColour, client } = require("../main.js")
// const disbut = require('discord-buttons');

// const contentAmount = 8;


// // CREATE PAGE
// function createPage(offset, user) {
//     var listElements = "\u200B";

//     const selectionMenu = new disbut.MessageMenu()
//     .setID('selectionMenu')
//     .setPlaceholder('Select items');

//     for (var i = offset * contentAmount; i < contentAmount * (offset + 1); i++) {
//         if (user.inventory[i] === undefined) break;
        
//         listElements += user.inventory[i].name + " `x" + user.inventory[i].amount + "`\n";

//         var item = new disbut.MessageMenuOption()
//         .setLabel(user.inventory[i].name)
//         .setValue(user.inventory[i].name)

//         selectionMenu.addOption(item);
//     }

//     return listElements;
// }


// // UPDATE OFFER
// function updateOffer(offer) {
//     var offerList = "\u200B";

//     for (var i = 0; i < offer.length; i++) {
//         offerList += offer[i].name + "`x" + offer[i].amount + "`\n";
//     }

//     return offerList;
// }


// // CREATE MENU
// function createMenu(offset, user) {

//     const selectionMenu = new disbut.MessageMenu()
//     .setID('selectionMenu')
//     .setPlaceholder('Select items');

//     var x = 0;

//     for (var i = offset * contentAmount; i < contentAmount * (offset + 1); i++) {
//         if (user.inventory[i] === undefined) break;

//         var item = new disbut.MessageMenuOption()
//         .setLabel(user.inventory[i].name)
//         .setValue(user.inventory[i].name)

//         selectionMenu.addOption(item);
//         x++;
//     }

//     // all items on page have been offered
//     if (x == 0) {
//         var placeHolder = new disbut.MessageMenuOption()
//         .setLabel("There are no items left to give on this page!")
//         .setValue("placeholder");

//         selectionMenu.addOption(placeHolder);
//     }

//     selectionMenu.setMaxValues(x);

//     return selectionMenu;
// }


// // FIND OFFER
// function findOffer(object) {
//     var activeOffers = module.exports.activeOffers;

//     var offer;

//     for (var i = 0; i < activeOffers.length; i++) {
//         if(object.message.embeds[0].description == ("Trade: " + activeOffers[i].tradeID) || object.message.senEmbed.description == ("Trade: " + activeOffers[i].tradeID)) {
//             offer = activeOffers[i];
//         }
//     }

//     return offer;
// }


// // TRANSFER ITEMS
// function transferItems(offer) {

// }


// // UPDATE MESSAGE
// function updateMessage(message, embed, menu) {
//     message.update({
//         embed: embed, 
//         components: [message.components[0], menu, message.components[2], message.components[3]]
//     });
// }

// // FIELDS IN EMBEDS ARE PART OF THE OBJECT!!! YOU CAN EDIT THEM BY GOING embed.fields[index] (then they have a title, value and inline)

// module.exports = {
//     name: "trade",
//     description: "Trade items or money with other people!",
//     alias: "None",
//     example: "trade {user}\n" + prefix + "trade <@812674338112274453>",
//     activeOffers: [],

//     execute(message, args, Discord, user, client) {

//         if (message.mentions.users.first() != undefined) {

//             var mentioned = message.mentions.users.first();
        
//             if (mentioned.id === message.author.id) {
//                 message.reply("You can't trade with yourself!");
//                 return;
//             }


//             var menAcc = undefined;
//             var hasAccount = false;
//             for (var i = 0; i < client.data.users.length; i++) {

//                 if (mentioned.id === client.data.users[i].userID) {
//                     hasAccount = true;
//                     menAcc = client.data.users[i]; 
//                     break;
//                 }
//             }

//             if (!hasAccount) {
//                 message.reply("This person doesn't have a registered account!\nYou can't trade with them!");
//                 return;
//             }

//             // check to see if they have any items (not to prevent donations, but just because there can't be 0 options on a clickMenu)
//             if (user.inventory.length === 0) {
//                 message.reply("You don't have anything to trade!");
//                 return;
//             }
//             if (menAcc.inventory.length === 0) {
//                 message.reply("This person doesn't have anything to trade!");
//                 return;
//             }

//             var randomNum = Math.floor(Math.random() * 10000) + 1000; // between 1000 -> 19999

//             const senderEmbed = new Discord.MessageEmbed()
//             .setColor(botColour)
//             .setDescription("Trade: " + randomNum)
//             .setTimestamp()
//             .setTitle("__Outbound trade to " + mentioned.username + "!__")
//             .setAuthor("To: " + mentioned.username + "#" + mentioned.discriminator, mentioned.avatarURL())
//             .addField("__Your inventory__", createPage(0, user), true)
//             .addField("__You give:__", "\u200B", true)
//             .addField("__You get:__", "\u200B", true)
//             .setFooter("page 1 of " + Math.ceil(user.inventory.length / contentAmount));
    
//             const receiverEmbed = new Discord.MessageEmbed()
//             .setColor(botColour)
//             .setDescription("Trade: " + randomNum)
//             .setTimestamp()
//             .setTitle("__Inbound trade from " + message.author.username + "!__")
//             .setAuthor("From: " + message.author.username + "#" + message.author.discriminator, message.author.avatarURL())
//             .addField("__Your inventory__", createPage(0, menAcc), true)
//             .addField("__You give:__", "\u200B", true)
//             .addField("__You get:__", "\u200B", true)
//             .setFooter("page 1 of " + Math.ceil(menAcc.inventory.length / contentAmount));




//             message.channel.send("<@" + mentioned.id + ">, You have 2 minutes to react to this message with ✅ to accept the inbound trade from: <@" + message.author.id + ">").then(msg => {
//                 msg.react('✅');

//                 var offerPos = module.exports.activeOffers.length;

//                 module.exports.activeOffers[offerPos] = {
//                     msgID: msg.id,

//                     receiver: mentioned,
//                     recData: menAcc,
//                     recOffset: 0,
//                     recOffer: [],
//                     recQuantity: 1,
//                     recEmbed: receiverEmbed,
//                     recAccepted: false,

//                     sender: message.author,
//                     senData: user,
//                     senOffset: 0,
//                     senOffer: [],
//                     senQuantity: 1,    
//                     senEmbed: senderEmbed,
//                     senAccepted: false,
 
//                     tradeID: randomNum,

//                     acceptedTrade: false
//                 }

//                 var timer = setInterval(() => {
//                     module.exports.activeOffers.splice(0, 1); // deletes first item in the array (which is always the oldest)
//                     msg.reactions.removeAll();
//                     clearInterval(timer);
//                 }, 120000 ) // 120,000ms == 2 mins
//             })



//         }
//         else {
//             message.reply("Cant find that user! You need to mention a user to trade with them!\n`" + 
//             prefix + "trade {user}`\n`" + prefix + "trade <@812674338112274453>`")
//         }

//     }
// }


// // check for reaction
// client.on("messageReactionAdd", (reaction, user) => {
//     if (user.bot) return;

//     const activeOffers = module.exports.activeOffers;


//     for (var i = 0; i < activeOffers.length; i++) {

//         // found message
//         if (reaction.lastMessageID === activeOffers.msgID) {

//             // dont resend embeds if they already accepted trade
//             if (user.id === activeOffers[i].receiver.id && activeOffers[i].acceptedTrade === true) break;

//             if (activeOffers[i].receiver.id === user.id) {

//                 // send embeds to sender and receiver
//                 var sendEmbed = activeOffers[i].senEmbed; // 0 == sender
//                 var recEmbed = activeOffers[i].recEmbed; // 1 == receiver

//                 // buttons & menus
//                 const nextPage = new disbut.MessageButton()
//                 .setID("t_nextPage")
//                 .setStyle("blurple")
//                 .setLabel("Next Page")
//                 .setDisabled(false);

//                 const previousPage = new disbut.MessageButton()
//                 .setID("t_previousPage")
//                 .setStyle("blurple")
//                 .setLabel("Previous Page")
//                 .setDisabled();

//                 const adding = new disbut.MessageButton()
//                 .setID("adding")
//                 .setStyle("grey")
//                 .setLabel("Adding");

//                 const buttonRow = new disbut.MessageActionRow()
//                 .addComponent(previousPage)
//                 .addComponent(nextPage)
//                 .addComponent(adding)


//                 var spacing = "\u2000\u2000\u2000\u2000\u2000\u2000\u2000\u2000\u2000\u2000\u2000";

//                 const accept = new disbut.MessageButton()
//                 .setID("accept")
//                 .setStyle("green")
//                 .setLabel(spacing + "Accept" + spacing);

//                 // const cross = new disbut.MessageButton()
//                 // .setID("cross")
//                 // .setStyle("red")
//                 // .setLabel("❌")
//                 // .setDisabled();

//                 const acceptRow = new disbut.MessageActionRow()
//                 .addComponent(accept)
//                 //.addComponent(cross);


//                 // ---- Menus

//                 const recMenu = createMenu(activeOffers[i].recOffset, activeOffers[i].recData);
//                 const recMenuRow = new disbut.MessageActionRow()
//                 .addComponent(recMenu);

//                 const senMenu = createMenu(activeOffers[i].senOffset, activeOffers[i].senData);
//                 const senMenuRow = new disbut.MessageActionRow()
//                 .addComponent(senMenu);

                
//                 const one = new disbut.MessageMenuOption()
//                 .setLabel("1x")
//                 .setValue("1")

//                 const five = new disbut.MessageMenuOption()
//                 .setLabel("5x")
//                 .setValue("5");

//                 const ten = new disbut.MessageMenuOption()
//                 .setLabel("10x")
//                 .setValue("10");

//                 const twentyFive = new disbut.MessageMenuOption()
//                 .setLabel("25x")
//                 .setValue("25");

//                 const half = new disbut.MessageMenuOption()
//                 .setLabel("Half")
//                 .setValue("Half");

//                 const all = new disbut.MessageMenuOption()
//                 .setLabel("All")
//                 .setValue("All");

//                 const quantityMenu = new disbut.MessageMenu()
//                 .setID("quantityMenu")
//                 .setPlaceholder("quantity")
//                 .addOption(one)
//                 .addOption(five)
//                 .addOption(ten)
//                 .addOption(twentyFive)
//                 .addOption(half)
//                 .addOption(all);


//                 const quantityRow = new disbut.MessageActionRow()
//                 .addComponent(quantityMenu);


//                 client.users.fetch(activeOffers[i].sender.id).then(sUser => {
//                     sUser.send({embed: sendEmbed, components: [buttonRow, senMenuRow, acceptRow, quantityRow]});
//                 })
               
//                 client.users.fetch(activeOffers[i].receiver.id).then(rUser => {
//                     rUser.send({embed: recEmbed, components: [buttonRow, recMenuRow, acceptRow, quantityRow]});
//                 })

//                 activeOffers[i].acceptedTrade = true;
//             }

//         }
//     }


// });




// //  ----------------------------------------------------- BUTTONS AND MENUS ----------------------------------------------------- 



// // CHECK for button 
// client.on("clickButton", async (button) => {  

//     // NEXT
//     if (button.id === "t_nextPage") {

//         var offer = findOffer(button);


//         // RECEIVE NEXT ------------------------------------------------------------------------------------
//         if (button.clicker.id === offer.receiver.id) {

//             // page dealing
//             offer.recOffset++;

//             if (offer.recData.inventory[offer.recOffset * contentAmount] === undefined) {
//                 offer.recOffset--;
//             }

            
//             if (offer.recData.inventory[(offer.recOffset + 1) * contentAmount] === undefined) {
//                 button.message.components[0].components[1].setDisabled();
//                 button.message.components[0].components[0].setDisabled(false);
//             }

//             if (offer.recOffset > 0) button.message.components[0].components[0].setDisabled(false);
//             else button.message.components[0].components[0].setDisabled();


//             // sending + updating
//             offer.recEmbed.fields[0].value = createPage(offer.recOffset, offer.recData) // offset, user
//             offer.recEmbed.footer.text = "page " + (offer.recOffset + 1) + " of " + Math.ceil(offer.recData.inventory.length / contentAmount);

//             const recMenu = createMenu(offer.recOffset, offer.recData);
//             const recSelectionMenu = new disbut.MessageActionRow()
//             .addComponent(recMenu);

//             updateMessage(button.message, offer.recEmbed, recSelectionMenu);
//         }


//         // SEND NEXT ------------------------------------------------------------------------------------
//         else if (button.clicker.id === offer.sender.id) {

//             // page dealing
//             offer.senOffset++;

//             if (offer.senData.inventory[offer.senOffset * contentAmount] === undefined) {
//                 offer.senOffset--;
//             }

            
//             if (offer.senData.inventory[(offer.senOffset + 1) * contentAmount] === undefined) {
//                 button.message.components[0].components[1].setDisabled();
//                 button.message.components[0].components[0].setDisabled(false);
//             }

//             if (offer.senOffset > 0) button.message.components[0].components[0].setDisabled(false);
//             else button.message.components[0].components[0].setDisabled();


//             // sending + updating
//             offer.senEmbed.fields[0].value = createPage(offer.senOffset, offer.senData) // offset, user
//             offer.senEmbed.footer.text = "page " + (offer.senOffset + 1) + " of " + Math.ceil(offer.senData.inventory.length / contentAmount);

//             const senMenu = createMenu(offer.senOffset, offer.senData);
//             const senSelectionMenu = new disbut.MessageActionRow()
//             .addComponent(senMenu);

//             updateMessage(button.message, offer.senEmbed, senSelectionMenu);
//         }
//     }



//     // PREVIOUS
//     else if (button.id === "t_previousPage") {

//         var offer = findOffer(button);


//         // RECEIVE PREVIOUS ------------------------------------------------------------------------------------
//         if (button.clicker.id === offer.receiver.id) {

//             // page dealing
//             offer.recOffset--;

//             if (offer.recOffset < 0) {
//                 offer.recOffset++;
//             }

//             if (offer.recOffset > 0) button.message.components[0].components[0].setDisabled(false);
//             else button.message.components[0].components[0].setDisabled();

//             // should always be able to go forward if you go back
//             button.message.components[0].components[1].setDisabled(false);


//             // sending + updating
//             offer.recEmbed.fields[0].value = createPage(offer.recOffset, offer.recData) // offset, user
//             offer.recEmbed.footer.text = "page " + (offer.recOffset + 1) + " of " + Math.ceil(offer.recData.inventory.length / contentAmount);

//             const recMenu = createMenu(offer.recOffset, offer.recData);
//             const recSelectionMenu = new disbut.MessageActionRow()
//             .addComponent(recMenu);

//             updateMessage(button.message, offer.recEmbed, recSelectionMenu);
//         }

//         // SEND PREVIOUS ------------------------------------------------------------------------------------
//         else if (button.clicker.id === offer.sender.id) {

//             // page dealing
//             offer.senOffset--;

//             if (offer.senOffset < 0) {
//                 offer.senOffset++;
//             }

//             if (offer.senOffset > 0) button.message.components[0].components[0].setDisabled(false);
//             else button.message.components[0].components[0].setDisabled();

//             // should always be able to go forward if you go back
//             button.message.components[0].components[1].setDisabled(false);


//             // sending + updating
//             offer.senEmbed.fields[0].value = createPage(offer.senOffset, offer.senData) // offset, user
//             offer.senEmbed.footer.text = "page " + (offer.senOffset + 1) + "of " + Math.ceil(offer.senData.inventory.length / contentAmount);

//             const senMenu = createMenu(offer.senOffset, offer.senData);
//             const senSelectionMenu = new disbut.MessageActionRow()
//             .addComponent(senMenu);


//             updateMessage(button.message, offer.senEmbed, senSelectionMenu);
//         }
//     }


//     // -------------------- ADDING / SUBTRACTING ITEMS -------------------- 
//     else if (button.id === "adding") {
//         var offer = findOffer(button);

//         const removing = new disbut.MessageButton()
//         .setID("removing")
//         .setStyle("red")
//         .setLabel("Removing");

//         // RECEIVER ADD
//         if (button.clicker.id === offer.receiver.id) {
//             offer.recRemoving = true;
            
//             const removeRow = new disbut.MessageActionRow()
//             .addComponent(button.message.components[0].components[0])
//             .addComponent(button.message.components[0].components[1])
//             .addComponent(removing)

//             button.message.update({
//                 embed: offer.recEmbed,
//                 components: [removeRow, button.message.components[1], button.message.components[2], button.message.components[3]]
//             })
//         }

        
//         // SENDER ADD
//         else if (button.clicker.id === offer.sender.id) {
//             offer.senRemoving = true;
            
//             const removeRow = new disbut.MessageActionRow()
//             .addComponent(button.message.components[0].components[0])
//             .addComponent(button.message.components[0].components[1])
//             .addComponent(removing)

//             button.message.update({
//                 embed: offer.senEmbed,
//                 components: [removeRow, button.message.components[1], button.message.components[2], button.message.components[3]]
//             })
//         }
//     }

//     else if (button.id === "removing") {
//         var offer = findOffer(button);

//         const adding = new disbut.MessageButton()
//         .setID("adding")
//         .setStyle("grey")
//         .setLabel("Adding");

//         // RECEIVER ADD
//         if (button.clicker.id === offer.receiver.id) {
//             offer.recRemoving = false;
            
//             const addRow = new disbut.MessageActionRow()
//             .addComponent(button.message.components[0].components[0])
//             .addComponent(button.message.components[0].components[1])
//             .addComponent(adding)

//             button.message.update({
//                 embed: offer.recEmbed,
//                 components: [addRow, button.message.components[1], button.message.components[2], button.message.components[3]]
//             })
//         }

        
//         // SENDER ADD
//         else if (button.clicker.id === offer.sender.id) {
//             offer.senRemoving = false;
            
//             const addRow = new disbut.MessageActionRow()
//             .addComponent(button.message.components[0].components[0])
//             .addComponent(button.message.components[0].components[1])
//             .addComponent(adding)

//             button.message.update({
//                 embed: offer.senEmbed,
//                 components: [addRow, button.message.components[1], button.message.components[2], button.message.components[3]]
//             })
//         }
//     }


//     // -------------------- ACCEPTING TRADE -------------------- 
//     else if (button.id === "accept") {
//         var offer = findOffer(button);

//         // RECEIVER ACCEPT
//         if (button.clicker.id === offer.receiver.id) {
//             client.users.cache.get(offer.sender.id).send(offer.sender.username + " has locked in their trade!\nPress the accept button to complete the trade!")

//         }

        
//         // SENDER ACCEPT
//         else if (button.clicker.id === offer.sender.id) {

//         }
//     } 
// });



// // CHECK for menu
// client.on("clickMenu", async (menu) => {

//     // SELECTION MENU
//     if (menu.id === 'selectionMenu') {
//         var offer = findOffer(menu);  


//         // RECIEVER ------------------------------------------------------------------------------------
//         if (menu.clicker.id === offer.receiver.id) {
//             var amount = offer.recQuantity;
    

//             for (var i = 0; i < menu.values.length; i++) { 
                
//                 var itemPos = undefined;


//                 for (var j = 0; j < offer.recData.inventory.length; j++) {
//                     if (offer.recData.inventory[j].name === menu.values[i]) {
//                         itemPos = j;
//                     }
//                 }
//                 if (itemPos === undefined) break;


//                 // HALF AMOUNT
//                 if (amount == 0.5) amount = Math.round(offer.recData.inventory[itemPos].amount / 2);


//                 var offerPos = offer.recOffer.length;
//                 var alreadyOffered = false;

//                 for (var j = 0; j < offer.recOffer.length; j++) {
//                     if (menu.values[i] == offer.recOffer[j].name) {
//                         alreadyOffered = true;
//                         offerPos = j;
//                     }
//                 }



//                 // add offered item to offer
//                 if (alreadyOffered) {
//                     offer.recOffer[offerPos].amount += amount;
//                 }
//                 else {
//                     var item = offer.recData.inventory[itemPos];
//                     offer.recOffer[offerPos] = new off_item(item.name, item.dropRate, item.sellValue, amount) // name, droprate, sellvalue, amount 
//                 }

//                 offer.recData.inventory[itemPos].amount -= amount;


//                 // when items all have images, fetch the image before this command using the item name (make emoji names same as item names)
//             }


//             var offerList = updateOffer(offer.recOffer);
//             offer.recEmbed.fields[1].value = offerList;
//             offer.senEmbed.fields[2].value = offerList;
            
//             // reset trade accepted
//             offer.recAccepted = false;
//             offer.senAccepted = false;

//             offer.recEmbed.fields[0].value = createPage(offer.recOffset, offer.recData);

//             const recMenu = createMenu(offer.recOffset, offer.recData);
//             const recSelectionMenu = new disbut.MessageActionRow()
//             .addComponent(recMenu);

//             updateMessage(menu.message, offer.recEmbed, recSelectionMenu);
//         }


//         // SENDER ------------------------------------------------------------------------------------
//         else if (menu.clicker.id === offer.sender.id) {
//             var amount = offer.senQuantity;
    

//             for (var i = 0; i < menu.values.length; i++) { 
                
//                 var itemPos = undefined;


//                 for (var j = 0; j < offer.senData.inventory.length; j++) {
//                     if (offer.senData.inventory[j].name === menu.values[i]) {
//                         itemPos = j;
//                     }
//                 }
//                 if (itemPos === undefined) break;

//                 // HALF AMOUNT
//                 if (amount == 0.5) amount = Math.round(offer.senData.inventory[itemPos].amount / 2);


//                 var offerPos = offer.senOffer.length;
//                 var alreadyOffered = false;

//                 for (var j = 0; j < offer.senOffer.length; j++) {
//                     if (menu.values[i] == offer.senOffer[j].name) {
//                         alreadyOffered = true;
//                         offerPos = j;
//                     }
//                 }

//                 // add offered item to offer
//                 if (alreadyOffered) {
//                     offer.senOffer[offerPos].amount += amount;
//                 }
//                 else {
//                     var item = offer.senData.inventory[itemPos];
//                     offer.senOffer[offerPos] = new off_item(item.name, item.dropRate, item.sellValue, amount) // name, droprate, sellvalue, amount 
//                 }

//                 offer.senData.inventory[itemPos].amount -= amount;


//                 // when items all have images, fetch the image before this command using the item name (make emoji names same as item names)
//             }


//             var offerList = updateOffer(offer.senOffer);
//             offer.senEmbed.fields[1].value = offerList;
//             offer.recEmbed.fields[2].value = offerList;
            
//             // reset trade accepted
//             offer.senAccepted = false;
//             offer.recAccepted = false;
            
//             offer.senEmbed.fields[0].value = createPage(offer.senOffset, offer.senData);

//             const senMenu = createMenu(offer.senOffset, offer.senData);
//             const senSelectionMenu = new disbut.MessageActionRow()
//             .addComponent(senMenu);

//             updateMessage(menu.message, offer.senEmbed, senSelectionMenu);
//         }

//     }


//     // QUANTITY MENU
//     else if (menu.id === "quantityMenu") {
//         var offer = findOffer(menu);

//         // RECEIVER -----------------------------------------------------
//         if (menu.clicker.id === offer.receiver.id) {
//             if (menu.values[0] == "Half") {
//                 offer.recQuantity = 0.5;
//             }
//             else if (menu.values[0] == "All") {
//                 offer.recQuantity = 9999999;
//             }
//             else offer.recQuantity = parseInt(menu.values[0]);


//             const recMenu = createMenu(offer.recOffset, offer.recData);

//             const recSelectionMenu = new disbut.MessageActionRow()
//             .addComponent(recMenu);

//             updateMessage(menu.message, offer.recEmbed, recSelectionMenu);
//         }


//         // SENDER   -----------------------------------------------------
//         else if (menu.clicker.id === offer.sender.id) {
//             if (menu.values[0] === "Half") {
//                 offer.senQuantity = 0.5;
//             }
//             else if (menu.values[0] === "All") {
//                 offer.senQuantity = 9999999;
//             }
//             else offer.senQuantity = parseInt(menu.values[0]);


//             const senMenu = createMenu(offer.senOffset, offer.senData);

//             const senSelectionMenu = new disbut.MessageActionRow()
//             .addComponent(senMenu);

//             updateMessage(menu.message, offer.senEmbed, senSelectionMenu);
//         }
//     }
// });

// console.log("trade.js loaded");