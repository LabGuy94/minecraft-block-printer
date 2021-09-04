const mineflayer = require('mineflayer')
const getPixels = require("get-pixels")
fs = require('fs');
bot = mineflayer.createBot({username: "bot1"})
imgpath = 'logo(1).png'
//some of the colors came from https://github.com/MakkusuOtaku/mc-printer/blob/main/palettes.json
let ColorTable = [
    {name:'white_concrete', hex: '#ffffff'},
    {name:'light_gray_concrete', hex: '#9c9d97'},
    {name:'gray_concrete', hex: '#474f52'},
    {name:'black_concrete', hex: '#1d1c21'},
    {name:'yellow_concrete', hex: '#ffd83d'},
    {name:'orange_concrete', hex: '#f9801d'},
    {name:'red_concrete', hex: '#b02e26'},
    {name:'brown_concrete', hex: '#825432'},
    {name:'lime_concrete', hex: '#80c71f'},
    {name:'green_concrete', hex: '#5d7c15'},
    {name:'light_blue_concrete', hex: '#3ab3da'},
    {name:'cyan_concrete', hex: '#169c9d'},
    {name:'blue_concrete', hex: '#3c44a9'},
    {name:'pink_concrete', hex: '#f38caa'},
    {name:'magenta_concrete', hex: '#c64fbd'},
    {name:'purple_concrete', hex: '#8932b7'},
    {name:'white_wool', hex: '#FFe4e4e4'},
    {name:'light_gray_wool', hex: '#FFa0a7a7'},
    {name:'dark_gray_wool', hex: 'FF414141'},
    {name:'black_wool', hex: '#FF181414'},
    {name:'red_wool', hex: '#FF9e2b27'},
    {name:'orange_wool', hex: '#FFea7e35'},
    {name:'yellow_wool', hex: '#FFc2b51c'},
    {name:'lime_green_wool', hex: '#FF39ba2e'},
    {name:'green_wool', hex: '#FF364b18'},
    {name:'light_blue_wool', hex: '#FF6387d2'},
    {name:'cyan_wool', hex: '#FF267191'},
    {name:'blue_wool', hex: '#FF253193'},
    {name:'purple_wool', hex: '#FF7e34bf'},
    {name:'magenta_wool', hex: '#FFbe49c9'},
    {name:'pink_wool', hex: '#FFd98199'},
    {name:'brown_wool', hex: '#FF56331c'},
    {name:"white_terracotta", colour: [209, 177, 161]},
    {name:"orange_terracotta", colour: [160, 83, 37]},
    {name:"magenta_terracotta", colour: [149, 87, 108]},
    {name:"light_blue_terracotta", colour: [112, 108, 138]},
    {name:"yellow_terracotta", colour: [185, 132, 35]},
    {name:"lime_terracotta", colour: [103, 117, 52]},
    {name:"pink_terracotta", colour: [160, 77, 78]},
    {name:"gray_terracotta", colour: [57, 42, 36]},
    {name:"light_gray_terracotta", colour: [135, 106, 97]},
    {name:"cyan_terracotta", colour: [86, 90, 91]},
    {name:"purple_terracotta", colour: [118, 69, 86]},
    {name:"blue_terracotta", colour: [74, 59, 91]},
    {name:"brown_terracotta", colour: [77, 50, 36]},
    {name:"green_terracotta", colour: [75, 82, 42]},
    {name:"red_terracotta", colour: [142, 60, 46]},
    {name:"black_terracotta", colour: [37, 22, 16]},
    {name:"terracotta", colour: [149, 91, 66]}
];
//function came from https://github.com/MakkusuOtaku/mc-printer/blob/main/
async function loadImage(path) {
    return new Promise(resolve=>{
        getPixels(path, (err, image)=>{
            resolve(image);
        });
    });
}
//Hex2RGB and findClosestColorRGB came from https://stackoverflow.com/questions/44217275/convert-rgb-color-to-closest-valid-css3-color-name with slight changes

Hex2RGB = function(hex) {
    if (hex.lastIndexOf('#') > -1) {
        hex = hex.replace(/#/, '0x');
    } else {
        hex = '0x' + hex;
    }
    var r = hex >> 16;
    var g = (hex & 0x00FF00) >> 8;
    var b = hex & 0x0000FF;
    return {r:r, g:g, b:b};
};
function findClosestColorRGB(r, g, b, table)
{
    var rgb = {r:r, g:g, b:b};
    var delta = 3 * 256*256;
    var temp = {r:0, g:0, b:0};
    var nameFound = 'black';
    
    for(i=0; i<table.length; i++)
    {
        if(table[i].hex){
            temp = Hex2RGB(table[i].hex);
            if(Math.pow(temp.r-rgb.r,2) + Math.pow(temp.g-rgb.g,2) + Math.pow(temp.b-rgb.b,2) < delta)
            {
                delta = Math.pow(temp.r-rgb.r,2) + Math.pow(temp.g-rgb.g,2) + Math.pow(temp.b-rgb.b,2);
                nameFound = table[i].name;
            }
        }else{
            if(table[i].colour){
                temp = { r: table[i].colour[0], g: table[i].colour[1], b: table[i].colour[2]}
                if(Math.pow(temp.r-rgb.r,2) + Math.pow(temp.g-rgb.g,2) + Math.pow(temp.b-rgb.b,2) < delta)
                {
                    delta = Math.pow(temp.r-rgb.r,2) + Math.pow(temp.g-rgb.g,2) + Math.pow(temp.b-rgb.b,2);
                    nameFound = table[i].name;
                }
            }
        }
    }
    return nameFound;
}
bot.once('spawn', async () => {
    let image = await loadImage(imgpath)
    let x = Math.floor(image.shape[0]);
    let z = Math.floor(image.shape[1]);
    let z2 = 0
    for(let i = 0;i < x*z; i++){
        if(i > x){
            i = 0
            z2 = z2 + 1
        }else{
            if(z2 >= z){
                bot.chat("done")
                return
            }else{
                let r = image.get(i, z2, 0);
                let g = image.get(i, z2, 1);
                let b = image.get(i, z2, 2);
                await bot.chat('/setblock ' + i  + ' 5 ' +  z2 +  ' minecraft:' + findClosestColorRGB(r, g, b, ColorTable))
            }
        }
    }
})