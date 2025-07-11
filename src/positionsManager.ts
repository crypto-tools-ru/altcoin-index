import { bybit, Position, Symbol } from "./bybit";

const minBudget = 5
const upPrice = 1.01

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

    for (let i = 0; i < symbols.length; i++) {
        const symbol = symbols[i].symbol

        await bybit.closeBuy(symbol)
        console.log("Sell", symbol)
    }
}

async function getPositions(): Promise<Symbol[]> {
    return (await bybit.getPositions())
        .map(x => ({ symbol: x.symbol, turnover24h: 0 }))
}

function round(value: number, step: number) {
    return parseFloat(
        (value - value % step).toFixed(10)
    )
}

export const positionsManager = {
    buy,
    sell,
    getPositions,
}