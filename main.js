const TelegramBot = require('node-telegram-bot-api');
const puppeteer = require("puppeteer");

const config = require('./config.json');

const bot = new TelegramBot(config.bot_token, { polling: true });

(async () => {
    const browser = await puppeteer.launch({
        // headless: false,
        timeout: 10000,
    });

    const page = await browser.newPage();

    const client = await page.target().createCDPSession()
    await client.send('Network.enable')

    client.on('Network.webSocketFrameReceived', async (params) => {
        try {
            let r = params.response.payloadData.split('[');
            let data = JSON.parse(r.length != 1 ? "[" + r.slice(1).join().replace(":,]", ":-1") : "[" + r.join().replace(":,]", ":-1"));

            if (data[0] == "message:send") {
                bot.sendMessage(config.chat, `#Crisp \`${data[1].session_id}\`\n*${data[1].user.nickname}:* ${data[1].content}`, { parse_mode: 'Markdown' })

                for (let i = 0; i < config.msg.length; i++) {
                    if (config.msg[i].type == "in" && data[1].content.indexOf(config.msg[i].msg) != -1 || data[1].content == config.msg[i].msg) {
                        if (page.url() != `https://app.crisp.chat/website/${data[1].website_id}/inbox/${data[1].session_id}/`) {
                            await page.goto(`https://app.crisp.chat/website/${data[1].website_id}/inbox/${data[1].session_id}/`);
                            await page.waitForSelector('.c-conversation-box-field__field');
                        }
                        if (page.url() == `https://app.crisp.chat/website/${data[1].website_id}/inbox/${data[1].session_id}/`) {
                            await page.type('.c-conversation-box-field__field', config.msg[i].reply, { delay: 10 });
                            await page.keyboard.press('Enter');
                        } else {
                            setTimeout(async () => {
                                if (page.url() != `https://app.crisp.chat/website/${data[1].website_id}/inbox/${data[1].session_id}/`) {
                                    await page.goto(`https://app.crisp.chat/website/${data[1].website_id}/inbox/${data[1].session_id}/`);
                                    await page.waitForSelector('.c-conversation-box-field__field');
                                }
                                await page.type('.c-conversation-box-field__field', config.msg[i].reply, { delay: 10 });
                                await page.keyboard.press('Enter');
                            }, 10000);
                        }
                    }
                }
            }
        } catch (e) { }
    })

    page.setViewport({ width: 1280, height: 720 });
    await page.goto('https://app.crisp.chat/initiate/login/');
    await page.waitForSelector('.c-initiate-layout-form');
    await page.type('.c-initiate-layout-form__form:first-child input', config.username, { delay: 10 });
    await page.type('input[name=password]', config.password, { delay: 10 });
    await page.click('.c-base-button');

    bot.on('message', async (msg) => {
        if (msg.chat.id == config.chat && msg.reply_to_message != undefined) {
            let session_id = msg.reply_to_message.text.split("\n")[0].split(" ")[1];
            if (page.url() != `https://app.crisp.chat/website/${config.website_id}/inbox/${session_id}/`) {
                await page.goto(`https://app.crisp.chat/website/${config.website_id}/inbox/${session_id}/`);
                await page.waitForSelector('.c-conversation-box-field__field');
            }
            if (page.url() == `https://app.crisp.chat/website/${config.website_id}/inbox/${session_id}/`) {
                await page.type('.c-conversation-box-field__field', msg.text, { delay: 10 });
                await page.keyboard.press('Enter');
            } else {
                setTimeout(async () => {
                    if (page.url() != `https://app.crisp.chat/website/${config.website_id}/inbox/${session_id}/`) {
                        await page.goto(`https://app.crisp.chat/website/${config.website_id}/inbox/${session_id}/`);
                        await page.waitForSelector('.c-conversation-box-field__field');
                    }
                    await page.type('.c-conversation-box-field__field', msg.text, { delay: 10 });
                    await page.keyboard.press('Enter');
                }, 10000);
            }
        }
    });
})()

console.log("Start Bot...");