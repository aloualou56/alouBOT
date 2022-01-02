const mineflayer = require("./plugins/mineflayer")
const fs = require('fs')
let rawdata = fs.readFileSync('config.json');
let data = JSON.parse(rawdata);
const worker = require('worker_threads');
const async = require('./plugins/async')
const mc = require('./plugins/minecraft-protocol')
const vec3 = require('./plugins/vec3')
const toolPlugin = require("./plugins/mineflayer-tool").plugin
const pvp = require("./plugins/mineflayer-pvp").plugin
const autoeat = require("./plugins/mineflayer-auto-eat")
const scanffold = require("./plugins/mineflayer-scaffold")
const Inventory = require("./inventory");
const owner = process.argv[3] || data['OWNER']
const pass = process.argv[4]
const armorManager = require("./plugins/mineflayer-armor-manager")
const host = data['IP']
const port = data['PORT']
const quiet = data['QuietMODE']

function checkbeforestarting(host, port, quiet, owner) {
  switch (quiet) {
    case "Y":
    case "Yes":
    case "yes":
    case "N":
    case "No":
    case "Nope":
    case "true":
    case "no":
    case "false":
      console.log("Valid QuietMODE option.")
      break;
  
    default:
      console.log('please enter a valid QuietMODE value (Y or Yes or yes or N or No ro no or Nope).' + ' The program will close.')
      process.exit(0)
  }
  
  
  
  if (host == '') {
      console.log('Please enter a server IP.' + ' The program will close.')
      process.exit(0)
  } else {
    console.log("Valid host IP.")
  }
  
  if (port == '') {
      console.log('Please enter a valid port.' + " If the server doesn't have a IP please enter the default IP '25565'. " + ' The program will close.')
      process.exit(0)
  } else {
    console.log("Valid port number.")
  }
  
  if (owner == '') {
    console.log("Please enter the owner's name. " + "the program will close.")
    process.exit(0)
  } else {
    console.log("Valid owner's name")
  }

}

switch (quiet) {
  case "Y":
  case "Yes":
  case "yes":
  case 'true':
  case "N":
  case "No":
  case "Nope":
  case "no":
  case "false":
    console.log("Valid QuietMODE option.")
    break;

  default:
    console.log('please enter a valid QuietMODE value (Y or Yes or yes or N or No ro no or Nope).' + ' The program will close.')
    process.exit(0)
}



if (host == '') {
    console.log('Please enter a server IP.' + ' The program will close.')
    process.exit(0)
} else {
  console.log("Valid host IP.")
}

if (port == '') {
    console.log('Please enter a valid port.' + " If the server doesn't have a IP please enter the default IP '25565'. " + ' The program will close.')
    process.exit(0)
} else {
  console.log("Valid port number.")
}

if (owner == '') {
  console.log("Please enter the owner's name. " + "the program will close.")
  process.exit(0)
} else {
  console.log("Valid owner's name")
}

const bot = mineflayer.createBot({
    username: "alouBOT",
    host: host,
    port: port

})

const inventory = new Inventory({ bot });

const { pathfinder, Movements, goals } = require("mineflayer-pathfinder")
const {
    GoalNear,
    GoalBlock,
    GoalXZ,
    GoalY,
    GoalInvert,
    GoalFollow
} = require("mineflayer-pathfinder").goals


setInterval(() =>{
    if (isAttackingMobs === "false") return
    const mobFilter = e => e.type === "mob"
    const mob = bot.nearestEntity(mobFilter)

    if (!mob) return

    if (mob && mob.kind.toString().toLowerCase().includes('hostile')) {
        bot.pvp.attack(mob)
        }
},1000);

bot.once('spawn', () => {
    bot.loadPlugin(pathfinder)
    bot.loadPlugin(pvp)
    bot.loadPlugin(scanffold)
    bot.loadPlugin(autoeat)
    bot.loadPlugin(toolPlugin)
    bot.loadPlugin(armorManager)
        
    const mcData = require('minecraft-data')(bot.version)

    const movements = new Movements(bot, mcData)
    movements.canDig = false
    bot.pathfinder.setMovements(movements)

    console.log("connected")
    bot.settings.viewDistance = 'normal'
})

var isAttackingMobs = "false"



bot.once('spawn', () => {
    bot.chat('/login 1234567890')
})

bot.on("kicked", (reason, loggedIn) => {
    console.log("KICKED"+ reason)
})


bot.on('playerCollect', (collector, itemDrop) => {
  if (collector !== bot.entity) return
  
  setTimeout(() => {
    const sword = bot.inventory.items().find(item => item.name.includes('sword'))
    if (sword) bot.equip(sword, 'hand')
  }, 150)
})
  
bot.on('playerCollect', (collector, itemDrop) => {
  if (collector !== bot.entity) return
  
  setTimeout(() => {
    const shield = bot.inventory.items().find(item => item.name.includes('shield'))
    if (shield) bot.equip(shield, 'off-hand')
  }, 250)
})
  
let guardPos = null
  
function guardArea (pos) {
  guardPos = pos.clone()
  
  if (!bot.pvp.target) {
    moveToGuardPos()
  }
}
  
function stopGuarding () {
  guardPos = null
  bot.pvp.stop()
  bot.pathfinder.setGoal(null)
}
  
function moveToGuardPos () {
  const mcData = require('minecraft-data')(bot.version)
  bot.pathfinder.setMovements(new Movements(bot, mcData))
  bot.pathfinder.setGoal(new goals.GoalBlock(guardPos.x, guardPos.y, guardPos.z))
}
  
bot.on('stoppedAttacking', () => {
  if (guardPos) {
    moveToGuardPos()
  }
})
  
 
setInterval(() =>{
  if (!guardPos) return
  const mobFilter = e => e.type === "mob"
  const mob = bot.nearestEntity(mobFilter)

  if (!mob) return

  if (mob && mob.kind.toString().toLowerCase().includes('hostile')) {
    bot.pvp.attack(mob)
    }
},1000);


bot.on("chat", function(username, message) {
  if (message === "hi")
  bot.chat("Hi there")
}
 

,function itemToString (item) {
  if (item) {
    return `${item.name} x ${item.count}`
  } else {
    return '(nothing)'
  }
})


bot.once('spawn', () => {
  bot.autoEat.options = {
    priority: 'foodPoints',
    startAt: 17,
    bannedFood: []
  }
})

function sayItems (items = bot.inventory.items()) {
  const output = items.map(itemToString).join(', ')
  if (output) {
    bot.chat(output)
  } else {
    bot.chat('empty')
  }
}

function itemToString (item) {
  if (item) {
    return `${item.name} x ${item.count}`
  } else {
    return '(nothing)'
  }
}

bot.once("spawn", () => {
    const mcData = require("minecraft-data")(bot.version);
  
   const defaultMove = new Movements(bot, mcData);

  bot.on("path_update", r => {
    const nodesPerTick = ((r.visitedNodes * 50) / r.time).toFixed(2);
    console.log(
      `I can get there in ${
        r.path.length
      } moves. Computation took ${r.time.toFixed(2)} ms (${
        r.visitedNodes
      } nodes, ${nodesPerTick} nodes/tick)`
    );
  });

  bot.on("goal_reached", goal => {
    console.log("Here I am !");
  });

  if (quiet === 'true' || quiet === 'Y' || quiet === 'Yes' || quiet === 'yes' ) {
    bot.on("chat", (username, message) => {
      if (username === bot.username) return;
      var pmessage = message.split(' ')
      const target = bot.players[username] ? bot.players[username].entity : null;
  
      if (username === bot.username) return
      if (username != owner) {
          console.log("Player " + username + "OXI FREE COMMAND FOR YOU")
          return
      }
  
      // command gia ELA
      if (message === "_come") {
        if (!target) {
          console.log("I don't see you !");
          return;
        }
        const p = target.position;
  
        bot.pathfinder.setMovements(defaultMove);
        bot.pathfinder.setGoal(new GoalNear(p.x, p.y, p.z, 1));
  
        // command gia Pane kapou x y z
      } else if (message.startsWith("goto")) {
        const cmd = message.split(" ");
  
        if (cmd.length === 4) {
          // goto x y z
          const x = parseInt(cmd[1], 10);
          const y = parseInt(cmd[2], 10);
          const z = parseInt(cmd[3], 10);
  
          bot.pathfinder.setMovements(defaultMove);
          bot.pathfinder.setGoal(new GoalBlock(x, y, z));
        } else if (cmd.length === 3) {
          // goto x z
          const x = parseInt(cmd[1], 10);
          const z = parseInt(cmd[2], 10);
  
          bot.pathfinder.setMovements(defaultMove);
          bot.pathfinder.setGoal(new GoalXZ(x, z));
        } else if (cmd.length === 2) {
          // goto y
          const y = parseInt(cmd[1], 10);
  
          bot.pathfinder.setMovements(defaultMove);
          bot.pathfinder.setGoal(new GoalY(y));
        }
  
        // command akolouda
      } else if (message === "_follow") {
        if (!target) {
          console.log("I can't see " + username)
          return
        }
        bot.pathfinder.setMovements(defaultMove);
        bot.pathfinder.setGoal(new GoalFollow(target, 3), true);
        isAttackingMobs = "false"
        
        // command apofige
      } else if (message === "_avoid") {
        bot.pathfinder.setMovements(defaultMove);
        bot.pathfinder.setGoal(new GoalInvert(new GoalFollow(target, 5)), true);
  
        // command stamata(to Pathfinder an dimame kala)
      
  
        // command gia na parei block(dokimastiko gia allo command pio poly xD)
      }
      
  
      if (message === "_stop") {
        console.log('stopping')
        stopGuarding()
    }
  
    if (message == "_tp") {
        bot.chat('/teleport ' + bot.username + " " + username)
       
        console.log("Teleported to " + username)
    }
  
    
  
    
    if (message === '_guard') {
        const player = bot.players[username]
  
        if (!player) {
          console.log("I can't see the eria. If I can't see the player I can't find the eria to guard")
          return
        }
  
      bot.chat("I will guard this area from mobs")
      guardArea(player.entity.position)
    }
  
    if (message === "_list") {
      sayItems()
    }
    if (message === "_fight me") {
        const player = bot.players[username]
  
        if (!player) {
          console.log("can't see the player")
          return
        }
  
        
        bot.pvp.attack(player.entity)
    }
    
    if (message === '_fight') {
        const player = bot.players[username]
  
        if (!player) {
          console.log("can't see the" + username)
          return
        }
  
        
        bot.pvp.attack(player.entity)
    }
  
    
  
    if (pmessage[0] === "_attack") {
        if (pmessage[1] === "hostiles") {
            isAttackingMobs = "true"
            console.log("Attacking Hostiles!")
            
        }
        else {
            const player = bot.players[pmessage[1]]
            if (!player) {
                
              return
            }
            if (pmessage[1]) {
              bot.pvp.attack(player.entity)
              }
        }
  
  } 
  
  else if (quiet === 'false' || quiet === 'N' || quiet === 'no' || quiet === 'No' || quiet === 'Nope') {

   bot.on("chat", (username, message) => {
     if (username === bot.username) return;
     var pmessage = message.split(' ')
     const target = bot.players[username] ? bot.players[username].entity : null;

     if (username === bot.username) return
     if (username != owner) {
         console.log("Player " + username + "OXI FREE COMMAND FOR YOU")
         return
     }

     // command gia ELA
     if (message === "_come") {
       if (!target) {
         bot.chat("I don't see you !");
         return;
       }
       const p = target.position;

       bot.pathfinder.setMovements(defaultMove);
       bot.pathfinder.setGoal(new GoalNear(p.x, p.y, p.z, 1));

       // command gia Pane kapou x y z
     } else if (message.startsWith("_goto")) {
       const cmd = message.split(" ");

       if (cmd.length === 4) {
         // goto x y z
         const x = parseInt(cmd[1], 10);
         const y = parseInt(cmd[2], 10);
         const z = parseInt(cmd[3], 10);

         bot.pathfinder.setMovements(defaultMove);
         bot.pathfinder.setGoal(new GoalBlock(x, y, z));
       } else if (cmd.length === 3) {
         // goto x z
         const x = parseInt(cmd[1], 10);
         const z = parseInt(cmd[2], 10);

         bot.pathfinder.setMovements(defaultMove);
         bot.pathfinder.setGoal(new GoalXZ(x, z));
       } else if (cmd.length === 2) {
         // goto y
         const y = parseInt(cmd[1], 10);

         bot.pathfinder.setMovements(defaultMove);
         bot.pathfinder.setGoal(new GoalY(y));
       }

       // command akolouda
     } else if (message === "follow") {
       bot.pathfinder.setMovements(defaultMove);
       bot.pathfinder.setGoal(new GoalFollow(target, 3), true);
      
       // command apofige
     } else if (message === "avoid") {
       bot.pathfinder.setMovements(defaultMove);
       bot.pathfinder.setGoal(new GoalInvert(new GoalFollow(target, 5)), true);

       // command stamata(to Pathfinder an dimame kala)
    

       // command gia na parei block(dokimastiko gia allo command pio poly xD)
     }
    

     if (message === "_stop") {
       console.log('stopping')
        stopGuarding()
   }

   if (message == "_tp") {
       bot.chat('/teleport ' + bot.username + " " + username)
       bot.whisper(username, "I AM HERE " + username)
       console.log("Teleported to " + username)
   }

   if (message == "_follow") {
      if (!target) {
          bot.chat("i cant see you")
          return
       }
       bot.whisper(username, "FOLLOWING YOU")
       console.log("FOLLOWING " + username)
       bot.pathfinder.setGoal(new GoalFollow(target, 3), true)
       isAttackingMobs = "false"
   }

  
   if (message === '_guard') {
       const player = bot.players[username]

       if (!player) {
           bot.chat("COME HERE TO PLAY")
           return
       }

       bot.chat("I will guard this area from mobs")
       guardArea(player.entity.position)
   }

   if (message === "_list") {
     sayItems()
   }
   if (message === "_fight me") {
       const player = bot.players[username]

       if (!player) {
           bot.chat("I can't see you")
           return
       }

       bot.chat("You are dead my friend")
       bot.pvp.attack(player.entity)
   }
  
   if (message === '_fight') {
       const player = bot.players[username]

       if (!player) {
           bot.chat("come here looser")
           return
       }

       bot.chat("LETS DANCE")
       bot.pvp.attack(player.entity)
   }

  

   if (pmessage[0] === "_attack") {
       if (pmessage[1] === "hostiles") {
           isAttackingMobs = "true"
           console.log("Attacking Hostiles!")
           bot.chat("Attacking hostiles!")
       }
       else {
           const player = bot.players[pmessage[1]]
           if (!player) {
               bot.chat("Come here you cower "+ player)
               return
           }
           if (pmessage[1]) {
               bot.pvp.attack(player.entity)
             }
       }

      }
    }
  ,);
  
 }
})}})