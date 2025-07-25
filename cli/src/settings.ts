require("dotenv").config()

export interface Settings {
    strategy: string,

    altcoinsCount: number,
    altcoinsCheckDate: number,

    trackPriceStartDate: number,
    trackPriceIntervalHours: number[],

    buyBudget: number,
    buyMargin: number,
    buyIsTrade: boolean,

    bybitApiKeyPublic: string,
    bybitApiKeyPrivate: string,
    tgBotToken: string,
    tgChatId: string,
}

function get(): Settings {
    return {
        strategy: process.env.strategy!,

        altcoinsCount: parseInt(process.env.altcoinsCount!),
        altcoinsCheckDate: Date.parse(process.env.altcoinsCheckDate!),

        trackPriceStartDate: Date.parse(process.env.trackPriceStartDate!),
        trackPriceIntervalHours: process.env.trackPriceIntervalHours!
            .split(",")
            .map(x => x.trim())
            .filter(x => !!x)
            .map(x => parseInt(x)),

        buyBudget: parseInt(process.env.buyBudget!),
        buyMargin: parseInt(process.env.buyMargin!),
        buyIsTrade: process.env.buyIsTrade!.toLowerCase() === "true",

        bybitApiKeyPublic: process.env.bybitApiKeyPublic!,
        bybitApiKeyPrivate: process.env.bybitApiKeyPrivate!,
        tgBotToken: process.env.tgBotToken!,
        tgChatId: process.env.tgChatId!,
    }
}

export const settings = {
    get,
}