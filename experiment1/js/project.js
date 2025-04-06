// project.js - purpose and description here
// Author: Jackie Sanchez
// Date:4/6/2025

// NOTE: This is how we might start a basic JavaaScript OOP project

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file

// define a class
class MyProjectClass {
  // constructor function
  constructor(param1, param2) {
    // set properties using 'this' keyword
    this.property1 = param1;
    this.property2 = param2;
  }
  
  // define a method
  myMethod() {
    // code to run when method is called
  }
}

function main() {
  const fillers = {
    weapon: ["Sword", "Short Sword", "Long Sword", "Daggar", "Halberd", "Wand", "Staff", "Glave", "Axe", "Katana", "Mace", "Whip", "Shortbow", "Longbow", "Bow", "Crossbow", "Hammer", "Katar", "Quarterstaff","Flail", "Trident", "Scimitar", "Javelin", "Lance"],
    name: ["Emberheart", "Empress Vaelith", "The Shattered Veil", "Grand Oracle Ysmera Deepgaze", "Baron Oren Mirewing", "The VoidKissed", "Silver Thorn", "The Windgrave", "Princess Nyxaria Storm Breath", "High Empress Emerald", "Battlemaiden Thryssa", "Saint Solenne"],
    descriptors: [", the Ruthless", ", the Wise", ", the Brave", ", the Valiant", ", the Betrayer", ", the Blessed", ", the Fallen", ", the Mystical", " ", ", the Ancient", ", the Leer", ", the Graceful", ", the Compassionate"],
    use:["wielded", "forged", "gifted to the people", "sanctioned", "drawn from the River of Mirewing", "sung into being", "conjured" ,"crafted in silence", "shaped by the Gods", "grown from a cursed seed" ,"stolen from an evil Archmage", "carved from a Elderwood tree"],
    event:["Siege of the Shattered Moons", "Breaking of the Storm", "opening of the Mystical Vaults", "Silencing of the Helpless", "Ending of the Void", "Slaying of the Titans", "Restoration of Faith", "Party of Fae", "Destruction of the MageLord"],
    eventDescription:["bloody", "peaceful", "massacre of", "enlightenment", "joyful", "simple", "gleaming", "dreadful", "crusade", "blessed", "grueling", "shining", "meticulous"],
    statType:["strength", "dexterity", "wisdom", "constitution", "intelligence", "charisma"],
    posStatNum:["+1", "+2", "+3", "+4"],
    negStatNum:["-1", "-2"],
    uniquePerk:["Cannot be moved", "Gain advatage on saving throws", "Cannot be frightened", "Gain an extra spell slot", "Deal addition 2D8 damage", "Never lose concentration on spells", "Can now fly", "Cannot be surprised", "Add +4 to initiative"]
    
  };
  
  
  
  const template = `The $weapon of $name$descriptors
  
  This weapon was $use for the $eventDescription $event.  
    
  $posStatNum $statType 
  $negStatNum $statType
  $uniquePerk
  
  `;
  
  
  // STUDENTS: You don't need to edit code below this line.
  
  const slotPattern = /\$(\w+)/;
  
  function replacer(match, name) {
    let options = fillers[name];
    if (options) {
      return options[Math.floor(Math.random() * options.length)];
    } else {
      return `<UNKNOWN:${name}>`;
    }
  }
  
  function generate() {
    let story = template;
    while (story.match(slotPattern)) {
      story = story.replace(slotPattern, replacer);
    }
  
    /* global box */
    $("#box").text(story);
  }
  
  /* global clicker */
  $("#clicker").click(generate);
  
  generate();
  

}

// let's get this party started - uncomment me
main();