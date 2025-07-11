import { APIResponseV3WithTime, KlineIntervalV3, RestClientV5 } from "bybit-api"
import Enumerable from "linq"
import { Settings } from "./settings"

export interface Symbol {
    symbol: string,
    turnover24h: number,
}

export interface SymbolInfo {
    symbol: string,
    countStep: number,
    priceStep: number,
}

export interface Candle {
    symbol: string,
    date: number,
    close: number,
}

export interface Position {
    symbol: string,
}

const category = "spot"
const hourMs = 60 * 60 * 1000

let client: RestClientV5 | null = null

function init(settings: Settings) {
    client = new RestClientV5({
        key: settings.bybitApiKeyPublic,
        secret: settings.bybitApiKeyPrivate,
        recv_window: 100000000,
        baseUrl: "https://api.bybit.com",
    })
}

async function getSymbols(): Promise<Symbol[]> {
    const response = await client!.getTickers({
        category,
    })

    ensureResponseOk(response)

    return response
        .result
        .list
        .map(x => ({
            symbol: x.symbol,
            turnover24h: parseFloat(x.turnover24h),
        }))
        .filter(x => x.symbol.endsWith("USDT"))
        .filter(x => !x.symbol.startsWith("USDC"))
        .filter(x => !x.symbol.startsWith("DAI"))
        .filter(x => !x.symbol.startsWith("USDE"))
}

async function getSymbolInfos(): Promise<SymbolInfo[]> {
    const response = await client!.getInstrumentsInfo({
        category,
        limit: 1000,
    })

    ensureResponseOk(response)

    return response.result.list.map(x => ({
        symbol: x.symbol,
        countStep: parseFloat(x.lotSizeFilter.basePrecision),
        priceStep: parseFloat(x.priceFilter.tickSize),
    }))
}

async function setMargin(symbol: string, margin: number) {
    ensureResponseOk(
        await client!.setSpotMarginLeverage(margin.toString())
    )

    const coin = symbol.substring(0, symbol.indexOf("USDT"))
    ensureResponseOk(
        await client!.setCollateralCoin({ coin, collateralSwitch: "ON", })
    )
}

async function getPrice(symbol: string) {
    const start = new Date().getTime() - hourMs
    const end = new Date().getTime()
    return (await bybit.getCandles(symbol, "1", start, end))[0].close
}

async function getCandles(symbol: string, interval: KlineIntervalV3, start: number, end: number): Promise<Candle[]> {
    const limit = 1000
    const maxPages = 300

    const get = async (date: number): Promise<Candle[]> => {
        const response = await client!.getKline({
            category,
            symbol,
            interval,
            start: date,
            end,
            limit,
        })

        ensureResponseOk(response)

        return response.result.list.map(x => ({
            symbol,
            date: parseInt(x[0]),
            close: parseFloat(x[4]),
        }))
    }

    let candles: Candle[] = []
    let date = start

    for (let i = 0; i < maxPages; i++) {
        const newCandles = await get(date)
        if (!newCandles.length) {
            break
        }

        candles = [...candles, ...newCandles]
        date = newCandles[0].date + 1

        if (newCandles.length !== limit) {
            break
        }

        await sleep(100)
    }

    return Enumerable.from(candles)
        .distinct(x => x.date)
        .orderByDescending(x => x.date)
        .toArray()
}

async function buyLimit(symbol: string, count: number, price: number) {
    const response = await client!.submitOrder({
        category,
        symbol,
        side: "Buy",
        orderType: "Limit",
        price: price.toFixed(12),
        qty: count.toFixed(12),
        isLeverage: 1,
    })

    ensureResponseOk(response)
}

async function closeBuy(symbol: string) {
    const response = await client!.submitOrder({
        category,
        symbol,
        side: "Sell",
        orderType: "Market",
        qty: "0",
        reduceOnly: true,
        closeOnTrigger: true,
    })

    ensureResponseOk(response)
}

async function getPositions(): Promise<Position[]> {
    const response = await client!.getPositionInfo({
        category,
        settleCoin: "USDT",
        limit: 200,
    })

    ensureResponseOk(response)

    return response
        .result
        .list
        .map(x => ({ symbol: x.symbol, }))
}

function ensureResponseOk<T>(response: APIResponseV3WithTime<T>) {
    if (response.retCode !== 0) {
        console.log(response)
        throw new Error(`Bybit response error. Code ${response.retCode}. Message ${response.retMsg}`)
    }
}

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
}

export const bybit = {
    init,
    getSymbols,
    getSymbolInfos,
    setMargin,
    getPrice,
    getCandles,
    buyLimit,
    closeBuy,
    getPositions,
}