import { altcoinIndex } from "./altcoinIndex"

require("dotenv").config()

console.log(new Date(), "Start work", process.env.strategy)

async function printAltcoins() {
    const altcoins = await altcoinIndex.getAltcoins()
    altcoins.forEach(altcoin => console.log(altcoin.symbol))
}

async function checkHistory() {

}

async function buy() {

}

async function sell() {

}

async function trackPrice() {

}

async function main() {
    switch (process.env.strategy) {
        case "printAltcoins": await printAltcoins()
        case "checkHistory": await checkHistory()
        case "buy": await buy()
        case "sell": await sell()
        case "trackPrice": await trackPrice()
    }
}

main()
