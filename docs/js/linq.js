function orderByDescending(array, get) {
    array.sort((a, b) => get(b) - get(a))
}

function average(array, get) {
    let sum = 0
    let count = 0

    for (let i = 0; i < array.length; i++) {
        sum += get(array[i])
        count++
    }

    return sum / count
}

function distinct(array, get) {
    const result = []

    for (let i = 0; i < array.length; i++) {
        if (result.find(x => get(x) === get(array[i]))) {
            continue
        }

        result.push(array[i])
    }

    return result
}

function min(array, get) {
    let result

    for (let i = 0; i < array.length; i++) {
        if (!result || get(array[i]) < result) {
            result = get(array[i])
        }
    }

    return result
}