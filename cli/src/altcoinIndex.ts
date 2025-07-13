import Enumerable from "linq"
import { bybit, Symbol } from "./bybit"
import fs from "node:fs"
import os from "node:os"

const weekMs = 7 * 24 * 60 * 60 * 1000

async function build(start: number, altcoinsCount: number): Promise<Symbol[]> {
    console.log(new Date(), "Start load altcoins")

    const altcoins: Symbol[] = []

    const symbols = Enumerable.from(await bybit.getSymbols())
        .where(x => x.symbol !== "BTCUSDT")
        .orderByDescending(x => x.turnover24h)
        .toArray()

    for (let i = 0; i < symbols.length; i++) {
        const symbol = symbols[i]

        const candles = await bybit.getCandles(symbol.symbol, "D", start, start + weekMs)
        if (!candles.length) {
            continue
        }

        altcoins.push(symbol)
        if (altcoins.length >= altcoinsCount) {
            break
        }
    }

    return altcoins
}

const fileName = "altcoinIndex.txt"

function save(altcoins: Symbol[]) {
    fs.writeFileSync(fileName, altcoins.map(x => x.symbol).join(os.EOL))
}

function tryRead(): Symbol[] | null {
    if (!fs.existsSync(fileName)) {
        return null
    }

    return fs
        .readFileSync(fileName, { encoding: "utf-8" })
        .split(os.EOL)
        .map(x => ({ symbol: x.trim(), turnover24h: 0 })).filter(x => !!x)
}

export const altcoinIndex = {
    build,
    save,
    tryRead,
}