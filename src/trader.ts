import { bybit, Symbol } from "./bybit";

const minBudget = 5
const upPrice = 1.01
const downPrice = 0.99

async function buy(symbols: Symbol[], budget: number, margin: number, isTrade: boolean) {
    console.log(new Date(), "Start buy")

    if (budget < minBudget) {
        throw new Error(`Min budget is ${minBudget} USDT`)
    }

    const symbolInfos = await bybit.getSymbolInfos()

    for (let i = 0; i < symbols.length; i++) {
        const symbol = symbols[i].symbol
        const symbolInfo = symbolInfos.find(x => x.symbol === symbol)!
        const currentPrice = await bybit.getPrice(symbol)

        const price = round(currentPrice * upPrice, symbolInfo.priceStep)
        const count = round(budget / currentPrice, symbolInfo.countStep)

        await bybit.setMargin(symbol, margin)
        isTrade && await bybit.buyLimit(symbol, count, price)

        console.log("Buy", symbol, "price", price, "count", count)
    }
}

async function sell(symbols: Symbol[]) {
    console.log(new Date(), "Start sell")

    const symbolInfos = await bybit.getSymbolInfos()
    const assets = await bybit.getAssets()

    for (let i = 0; i < symbols.length; i++) {
        const symbol = symbols[i].symbol
        const symbolInfo = symbolInfos.find(x => x.symbol === symbol)!
        const asset = assets.find(x => x.symbol === symbol)!
        const currentPrice = await bybit.getPrice(symbol)

        const price = round(currentPrice * downPrice, symbolInfo.priceStep)
        const count = round(asset.size, symbolInfo.countStep)

        await bybit.sellLimit(symbol, count, price)
        console.log("Sell", symbol, "price", price, "count", count)
    }
}

async function getAssets(): Promise<Symbol[]> {
    console.log(new Date(), "Start load assets")
   
    return (await bybit.getAssets())
        .map(x => ({ symbol: x.symbol, turnover24h: 0 }))
}

function round(value: number, step: number) {
    return parseFloat(
        (value - value % step).toFixed(10)
    )
}

export const trader = {
    buy,
    sell,
    getAssets,
}