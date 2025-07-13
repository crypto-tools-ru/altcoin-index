require("dotenv").config()

export interface Settings {
    strategy: string,

    altcoinsCount: number,
    altcoinsCheckDate: number,

    checkHistoryStartDate: number,
    checkHistoryEndDate: number,

    trackPriceStartDate: number,
    trackPriceIntervalHours: number,
    trackPriceType: "assets" | "index",

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

        checkHistoryStartDate: Date.parse(process.env.checkHistoryStartDate!),
        checkHistoryEndDate: Date.parse(process.env.checkHistoryEndDate!),

        trackPriceStartDate: Date.parse(process.env.trackPriceStartDate!),
        trackPriceIntervalHours: parseInt(process.env.trackPriceIntervalHours!),
        trackPriceType: process.env.trackPriceType!.toLowerCase() === "assets" ? "assets" : "index",

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