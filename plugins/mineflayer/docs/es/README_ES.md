# Mineflayer

[![NPM version](https://badge.fury.io/js/mineflayer.svg)](http://badge.fury.io/js/mineflayer)
[![Build Status](https://github.com/PrismarineJS/mineflayer/workflows/CI/badge.svg)](https://github.com/PrismarineJS/mineflayer/actions?query=workflow%3A%22CI%22)
[![Discord](https://img.shields.io/badge/chat-on%20discord-brightgreen.svg)](https://discord.gg/GsEFRM8)
[![Gitter](https://img.shields.io/badge/chat-on%20gitter-brightgreen.svg)](https://gitter.im/PrismarineJS/general)
[![Irc](https://img.shields.io/badge/chat-on%20irc-brightgreen.svg)](https://irc.gitter.im/)

[![Try it on gitpod](https://img.shields.io/badge/try-on%20gitpod-brightgreen.svg)](https://gitpod.io/#https://github.com/PrismarineJS/mineflayer)

| 馃嚭馃嚫 [Ingl茅s](README.md) | 馃嚪馃嚭 [Ruso](README_RU.md) | 馃嚜馃嚫 [Espa帽ol](README_ES.md) |
|------------------------|-------------------------|----------------------------|

Crea bots de Minecraft con una API JavaScript potente, estable y de alto nivel.

驴Primera vez usando node.js? Puede que te interese empezar con el tutorial [tutorial](tutorial.md)

## Caracter铆sticas

 * Soporta Minecraft 1.8, 1.9, 1.10, 1.11, 1.12, 1.13, 1.14, 1.15 y 1.16.
 * Rastreo e informaci贸n de entidades.
 * Informaci贸n de bloques. Puedes solicitar informaci贸n de todo lo que te rodea.
 * F铆sica y movimiento b谩sicos: actualmente los bloques son "s贸lidos" o "vac铆os".
 * Atacar entidades y usar veh铆culos.
 * Gesti贸n del inventario.
 * Crafteo, cofres, dispensadores, mesas de encantamiento.
 * Excavar y contruir.
 * Cosas diversas como conocer tu salud y si est谩 lloviendo.
 * Activar bloques y usar objetos.
 * Chat.

### Planes a futuro

Echa un vistazo a nuestros [proyectos actuales](https://github.com/PrismarineJS/mineflayer/wiki/Big-Prismarine-projects)

## Instalaci贸n

`npm install mineflayer`

## Documentaci贸n

| link | descripci贸n |
|---|---|
|[tutorial](tutorial.md) | Empezar con node.js y mineflayer |
| [FAQ.md](FAQ.md) | Alguna duda? Mira esto primero! |
| [api.md](api.md) [unstable_api.md](unstable_api.md) | Toda la documentaci贸n de la API |
| [history.md](history.md) | Historial de cambios de Mineflayer |
| [examples/](https://github.com/PrismarineJS/mineflayer/tree/master/examples) | Todos los ejemplos para mineflayer |

## Contribuir

Por favor, lee [CONTRIBUTING.md](CONTRIBUTING.md) y [prismarine-contribute](https://github.com/PrismarineJS/prismarine-contribute)

## Uso

**V铆deo**

Puedes encontrar un v铆deo tutorial que explica el proceso inicial para empezar un bot [aqu铆](https://www.youtube.com/watch?v=ltWosy4Z0Kw) (en ingl茅s).  

**Empezando**

Sin especificar una versi贸n, la versi贸n del servidor se detectar谩 autom谩ticamente, puedes configurar una versi贸n espec铆fica utilizando la opci贸n de versi贸n.
Por ejemplo `version:" 1.8 "`.

### Ejemplo
```js
const mineflayer = require('mineflayer')

const bot = mineflayer.createBot({
  host: "localhost", // opcional
  port: 25565,       // opcional
  username: "email@example.com", // el correo electr贸nico y contrase帽a s贸lo son necesarios   
  password: "12345678",          // para servidores con el flag online-mode=true
  version: false                 // el valor false implica detectar la versi贸n autom谩ticamente, puedes configurar una versi贸n espec铆fica utilizando por ejemplo "1.8.8"
})

bot.on('chat', function (username, message) {
  if (username === bot.username) return
  bot.chat(message)
})

// Imprimir errores y la raz贸n si eres kickeado:
bot.on('kicked', (reason, loggedIn) => console.log(reason, loggedIn))
bot.on('error', err => console.log(err))
```

### See what your bot is doing

Gracias al proyecto [prismarine-viewer](https://github.com/PrismarineJS/prismarine-viewer), puedes ver en una pesta帽a del navegador qu茅 est谩 haciendo tu bot.
Solo tienes que ejecutar `npm install prismarine-viewer` y a帽adir lo siguiente a tu bot:
```js
const mineflayerViewer = require('prismarine-viewer').mineflayer
bot.once('spawn', () => {
  mineflayerViewer(bot, { port: 3007, firstPerson: true })
})
```
Y podr谩s ver una representaci贸n *en vivo* como esta:

[<img src="https://prismarine.js.org/prismarine-viewer/test_1.16.1.png" alt="viewer" width="500">](https://prismarine.js.org/prismarine-viewer/)

#### M谩s ejemplos

| ejemplo | descripci贸n |
|---|---|
|[viewer](https://github.com/PrismarineJS/mineflayer/tree/master/examples/viewer) | Visualiza lo que ve tu bot en el buscador |
|[pathfinder](https://github.com/Karang/mineflayer-pathfinder/blob/master/examples/test.js) | Haz que tu bot vaya a una ubicaci贸n autom谩ticamente |
|[chest](https://github.com/PrismarineJS/mineflayer/blob/master/examples/chest.js) | Aprende a usar cofres, hornos, dispensadores y mesas de encantamiento |
|[digger](https://github.com/PrismarineJS/mineflayer/blob/master/examples/digger.js) | Aprende como crear un bot que pueda cavar romper un bloque |
|[discord](https://github.com/PrismarineJS/mineflayer/blob/master/examples/discord.js) | Conecta un bot de discord con un bot de mineflayer |
|[jumper](https://github.com/PrismarineJS/mineflayer/blob/master/examples/jumper.js) | Aprende a moverte, saltar, ir en vehiculos y atacar entidades cercanas |

Puedes encontrar muchos m谩s ejemplos en la carpeta de [ejemplos](https://github.com/PrismarineJS/mineflayer/tree/master/examples)

### Modulos

Una buena porcion del desarrollo se esta produciendo dentro de peque帽os paquetes npm que son usados por mineflayer

#### The Node Way&trade;

> "When applications are done well, they are just the really application-specific, brackish residue that can't be so easily abstracted away. All the nice, reusable components sublimate away onto github and npm where everybody can collaborate to advance the commons." 鈥? substack from ["how I write modules"](https://gist.github.com/substack/5075355)

#### M贸dulos
Estos son los m贸dulos principales que forman mineflayer:

| m贸dulo | descripci贸n |
|---|---|
| [minecraft-protocol](https://github.com/PrismarineJS/node-minecraft-protocol) | Analiza y crea paquetes de minecraft, autentificaci贸n and encriptaci贸n.
| [minecraft-data](https://github.com/PrismarineJS/minecraft-data) | Modulo independiente de lenguaje que provee datos de minecraft para clientes, servidores y librer铆as.
| [prismarine-physics](https://github.com/PrismarineJS/prismarine-physics) | Motor f铆sico para las entidades de minecraft
| [prismarine-chunk](https://github.com/PrismarineJS/prismarine-chunk) | Representa un chunk de minecraft
| [node-vec3](https://github.com/PrismarineJS/node-vec3) | Matem谩ticas de vectores 3d con tests unitarios
| [prismarine-block](https://github.com/PrismarineJS/prismarine-block) | Representa un bloque y su informaci贸n asociada en Minecraft
| [prismarine-chat](https://github.com/PrismarineJS/prismarine-chat) | Analizador de mensajes de chat (extra铆do de mineflayer)
| [node-yggdrasil](https://github.com/PrismarineJS/node-yggdrasil) | Librer铆a Node.js para interactuar con el sistema de autentificaci贸n de Mojang conocido como Yggdrasil.
| [prismarine-world](https://github.com/PrismarineJS/prismarine-world) | Implementaci贸n principal de los mundos de Minecraft para Prismarine
| [prismarine-windows](https://github.com/PrismarineJS/prismarine-windows) | Representa ventanas en minecraft
| [prismarine-item](https://github.com/PrismarineJS/prismarine-item) | Representa un item y su informaci贸n asociada en Minecraft
| [prismarine-nbt](https://github.com/PrismarineJS/prismarine-nbt) | Analizador de NBT para node-minecraft-protocol
| [prismarine-recipe](https://github.com/PrismarineJS/prismarine-recipe) | Representa recetas/crafteos en Minecraft
| [prismarine-biome](https://github.com/PrismarineJS/prismarine-biome) | Representa un bioma y su informaci贸n asociada en Minecraft
| [prismarine-entity](https://github.com/PrismarineJS/prismarine-entity) | Representa una entidad y su informaci贸n asociada en Minecraft

### Depuraci贸n

Puedes habilitar la depuraci贸n del protocolo utilizando la variable de entorno `DEBUG`:

```bash
DEBUG="minecraft-protocol" node [...]
```

En windows :
```
set DEBUG=minecraft-protocol
node your_script.js
```
## Complementos de terceros

Mineflayer tiene la capacidad de instalar complementos; cualquiera puede crear un complemento que agregue
un API de nivel superior a Mineflayer.

Los m谩s actualizados y 煤tiles son:

 * [pathfinder](https://github.com/Karang/mineflayer-pathfinder) - algoritmo de busqueda A* avanzado con muchas caracter铆sticas configurables
 * [prismarine-viewer](https://github.com/PrismarineJS/prismarine-viewer) - visualizador de chunks basado en web
 * [web-inventory](https://github.com/ImHarvol/mineflayer-web-inventory) - visualizador de inventario basado en web
 * [statemachine](https://github.com/TheDudeFromCI/mineflayer-statemachine) - API de aut贸mata infinito para comportamientos m谩s complejos
 * [Armor Manager](https://github.com/G07cha/MineflayerArmorManager) - gesti贸n autom谩tica de armaduras
 * [Collect Block](https://github.com/TheDudeFromCI/mineflayer-collectblock) - API r谩pida y simple para recolectar bloques.
 * [Dashboard](https://github.com/wvffle/mineflayer-dashboard) - Panel de instrumentos para un bot de Mineflayer


Pero tambi茅n echa un vistazo a:

 * [navigate](https://github.com/andrewrk/mineflayer-navigate/) - moverse f谩cilmente
   utlizando el algoritmo de b煤squeda A* [YouTube Demo](https://www.youtube.com/watch?v=O6lQdmRz8eE)
 * [radar](https://github.com/andrewrk/mineflayer-radar/) - interfaz de radar
   basada en web utilizando canvas y socket.io [YouTube Demo](https://www.youtube.com/watch?v=FjDmAfcVulQ)
 * [blockfinder](https://github.com/Darthfett/mineflayer-blockFinder) - encontrar bloques en el mundo 3D
 * [scaffold](https://github.com/andrewrk/mineflayer-scaffold) - moverse a un destino
   espec铆fico incluso si es necesario construir o rompler bloques para lograrlo
   [YouTube Demo](http://youtu.be/jkg6psMUSE0)
 * [auto-auth](https://github.com/G07cha/MineflayerAutoAuth) - autenticaci贸n basada en chat
 * [Bloodhound](https://github.com/Nixes/mineflayer-bloodhound) - determinar qui茅n y qu茅 es responsable de da帽ar a otra entidad
 * [tps](https://github.com/SiebeDW/mineflayer-tps) - obtener los tps actuales (tps procesados)

## Proyectos que utilizan Mineflayer

 * [rom1504/rbot](https://github.com/rom1504/rbot)
   - [YouTube - building a spiral staircase](https://www.youtube.com/watch?v=UM1ZV5200S0)
   - [YouTube - replicating a building](https://www.youtube.com/watch?v=0cQxg9uDnzA)
 * [Darthfett/Helperbot](https://github.com/Darthfett/Helperbot)
 * [vogonistic/voxel](https://github.com/vogonistic/mineflayer-voxel) - visualizar que est谩
   haciendo el bot utilizando voxel.js
 * [JonnyD/Skynet](https://github.com/JonnyD/Skynet) -  registrar la actividad del jugador en una API en l铆nea
 * [MinecraftChat](https://github.com/rom1504/MinecraftChat) (煤ltima versi贸n de c贸digo abierto, creada por AlexKvazos) -  Cliente de chat en web para Minecraft <https://minecraftchat.net/>
 * [Cheese Bot](https://github.com/Minecheesecraft/Cheese-Bot) - bot basado en complementos con una GUI limpia. Hecho con Node-Webkit. http://bot.ezcha.net/
 * [Chaoscraft](https://github.com/schematical/chaoscraft) - bot de Minecraft usando algoritmos gen茅ticos, ver [sus videos de youtube](https://www.youtube.com/playlist?list=PLLkpLgU9B5xJ7Qy4kOyBJl5J6zsDIMceH)
 * [hexatester/minetelegram](https://github.com/hexatester/minetelegram) -  puente de Telegram, construido sobre Mineflayer y Telegraf.
 * [and hundreds more](https://github.com/PrismarineJS/mineflayer/network/dependents) - todos los proyectos que github detecta usando mineflayer

## Pruebas Unitarias

Despu茅s de clonar el proyecto, se requiere una configuraci贸n adicional para ejecutar las pruebas, pero una vez hecho esto, es muy f谩cil ejecutarlas

### Preparaci贸n

Para que todas las pruebas se ejecuten correctamente, primero debes:

1. crear una nueva carpeta donde se ubicar谩 el jar del servidor de Minecraft
2. definir la variable de entorno MC_SERVER_JAR_DIR para esta carpeta

Ejemplo:

1. `mkdir server_jars`
2. `export MC_SERVER_JAR_DIR=/full/path/to/server_jars`

Donde "/full/path/to/" es la ruta completa.

### Ejecutar todas las pruebas

Simplemente ejecuta: `npm test`

### Ejecutar pruebas para una versi贸n espec铆fica de Minecraft
Ejecuta `npm test -- -g <version>`, donde `<version>` es una versi贸n de minecraft, es decir, `1.12`, `1.15.2`...

### Ejecutar una pruebas espec铆fica
Ejecuta `npm test -- -g <test_name>`, donde `<test_name>` es el nombre de la prueba que quieres ejecutar por ejemplo `bed`, `useChests`, `rayTrace`...

## Licencia

[MIT](LICENSE)
