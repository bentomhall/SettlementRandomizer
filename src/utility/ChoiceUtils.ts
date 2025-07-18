function weightedChoice<T>(items: T[], weights: number[]): T {
    var i;

    for (i = 1; i < weights.length; i++)
        weights[i] += weights[i - 1];
    
    var random = Math.random() * weights[weights.length - 1];
    
    for (i = 0; i < weights.length; i++)
        if (weights[i] > random)
            break;
    
    return items[i];
}

function choice<T>(items: T[]): T {
    let random = Math.floor(Math.random() * items.length);
    return items[random];
}