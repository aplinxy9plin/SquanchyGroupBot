const Telegraf = require('telegraf')
var request = require("request");

const bot = new Telegraf("1000448910:AAF8SH2B7lz-vI53M-vD3dp3U6SzYp611Z4")

const PORT = process.env.PORT || 3000;
const URL = process.env.URL || 'https://squanchybot.herokuapp.com';

bot.telegram.setWebhook(`${URL}/bot1000448910:AAF8SH2B7lz-vI53M-vD3dp3U6SzYp611Z4`);
bot.startWebhook(`/bot1000448910:AAF8SH2B7lz-vI53M-vD3dp3U6SzYp611Z4`, null, PORT)

bot.start((ctx) => {
    ctx.reply("Hi! I match people according to musical tastes! Send a link to the playlist you like. Can several, but in different messages. For example, Apple Music has a 'for you' playlist-share it!")
})
bot.command('playlist', (ctx) => 
    ctx.reply(`Take your playlist, baby <3\nhttps://aplinxy9plin.github.io/SquanchyParty/?group_id=${ctx.message.chat.id}#do_sexy`)
)
bot.on("text", (ctx) => {
    var data = ctx.message.from;
    data.platform = "telegram"
    if(ctx.message.text){
        if(ctx.message.text.toLowerCase() === "да"){
            ctx.reply("пизда")
        }
        if(validURL(ctx.message.text)){
            if( ctx.message.text.indexOf("apple.com") > 0 ||
                ctx.message.text.indexOf("music.yandex.ru/") > 0 ||
                ctx.message.text.indexOf("music.youtube") > 0 ||
                ctx.message.text.indexOf("spotify.com/") > 0
            ){
                var user = ctx.message.from;
                user.user_id = ctx.message.from.id;
                user.platform = user.platform ? user.platform : "telegram"
                delete user.id;
                var data = {
                    url: ctx.message.text,
                    user: [
                        user
                    ]
                };
                console.log(data)
                var options = {
                  method: 'POST',
                  url: 'https://squanchymusic-backend.herokuapp.com/squanchy/playlists/',
                  headers: {
                    'content-type': 'application/json',
                    authorization: 'Token b45ae4cecf894c51e45a624c5cad2e8349404c2b'
                  },
                  body: data,
                  json: true
                };
                console.log(data)
                request(options, function (error, response, body) {
                  if (error) throw new Error(error);
                  console.log(body)
                  if(response.statusCode === 201){
                    ctx.reply("Thanks! We'll send you your match soon! You can drop more links if you want. Will take into account all :)")
                  }
                });
                if(ctx.message.from.id !== ctx.message.chat.id){
                    var data = {
                        platform: "telegram",
                        group_id: ctx.message.chat.id,
                        name: ctx.message.chat.title,
                        users: [
                            user
                        ]
                    };
                    console.log(data)
        
                    var options = {
                      method: 'POST',
                      url: 'https://squanchymusic-backend.herokuapp.com/squanchy/groups/',
                      headers: {
                        'content-type': 'application/json',
                        authorization: 'Token b45ae4cecf894c51e45a624c5cad2e8349404c2b'
                      },
                      body: data,
                      json: true
                    };
                    console.log(data)
                    request(options, function (error, response, body) {
                      if (error) throw new Error(error);
                      console.log(body)
                    });    
                }
            }else{
                ctx.reply("We don't work with that music provider now :(")
            }
        }
    }
})

bot.on('message', (ctx) => {
    if(ctx.message.new_chat_participant){
        if(ctx.message.new_chat_participant.username === "mts_music_bot"){
            // SEND REQUEST: create group  
            // ctx.message.chat.title
            var user = ctx.message.from;
            user.user_id = ctx.message.from.id;
            user.platform = user.platform ? user.platform : "telegram"
            delete user.id;
            var data = {
                platform: "telegram",
                group_id: ctx.message.chat.id,
                name: ctx.message.chat.title,
                users: [
                    user
                ]
            };
            console.log(data)

            var options = {
              method: 'POST',
              url: 'https://squanchymusic-backend.herokuapp.com/squanchy/groups/',
              headers: {
                'content-type': 'application/json',
                authorization: 'Token b45ae4cecf894c51e45a624c5cad2e8349404c2b'
              },
              body: data,
              json: true
            };
            console.log(data)
            request(options, function (error, response, body) {
              if (error) throw new Error(error);
              console.log(body)
              if(response.statusCode === 200){
                ctx.reply("Hi! I match people according to musical tastes! Send a link to the playlist you like. Can several, but in different messages. For example, Apple Music has a 'for you' playlist-share it!") 
              }
            });
        }
    }
})

let validURL = (str) => {
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(str);
}

// bot.launch()