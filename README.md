# Crisp Chat Bot

![](https://img.shields.io/badge/license-MIT-blue)
![](https://img.shields.io/badge/NodeJS-v16-green)
![](https://img.shields.io/badge/PRs-welcome-green)

基於無頭瀏覽器的自動化回覆和 Telegram Bot 快速回覆

## 注意！！！
- 本專案基於無頭瀏覽器模擬操作實現，無法承載高並發操作，請儘量放慢操作
- 請勿多次反覆重啓專案，可能會觸發 Crisp 登入速度限制

## Start

```bash
git clone https://github.com/ArsFy/crisp-chat-bot.git
cd crisp-chat-bot
```

重新命名 `config.example.json` 爲 `config.json` 並按照下面的步驟設定配置

```json
{
    "bot_token": "12345678:fsoihgiueghbsohgb",
    "chat": -1,
    "username": "",
    "password": "",
    "website_id": "00000000-000000-000000-000000",
    "msg": [
        {
            "type": "in",
            "msg": "包含測試",
            "reply": "[自動回覆] 這是包含條件，只要使用者傳送的文本訊息包含 msg 中的內容"
        },
        {
            "type": "equals",
            "msg": "測試文本",
            "reply": "[自動回覆] 這是全等條件，需要使用者傳送的文本訊息和 msg 完全一致"
        }
    ]
}
```

- `bot_token`： Telegram Bot Token [@BotFather](https://t.me/BotFather)
- `chat`: Telegram 管理員 Group Id, e.g. `-12345678`
- `username`: Crisp 使用者名稱
- `password`: Crisp 密碼
- `website_id`: Crisp 網站 ID
![image](https://user-images.githubusercontent.com/93700457/206893912-5bcb9d7c-a4f2-4024-a792-57aa813e5804.png)
- `msg`: 自動回覆規則，如果不需要自動回覆請寫 `[]`
```js
{
    "type": "in",     // in: 包含  equals: 全等
    "msg": "包含測試", // 關鍵字
    "reply": "[自動回覆] 這是包含條件，只要使用者傳送的文本訊息包含 msg 中的內容"
    // 自動回覆文本
}
```

## Run

```bash
npm i
node main.js
```

## Q&A

- **Q**: 為什麼要基於無頭瀏覽器？
- **A**: 因爲 Crisp 的登入邏輯使用 JavaScript 計算加密的 device id，無法在不解密的情況下使用模擬請求登入

<br>

- **Q**: 為什麼不在登入後停用無頭瀏覽器？
- **A**: 因爲內部操作邏輯同樣複雜，無頭瀏覽器是最方便且BUG最少的實現方式