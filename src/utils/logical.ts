export function notInRange(value: number, min: number, max: number): boolean {
    return value < min || value > max;
}

export function notEmptyString(input: string): boolean {
    if (input === undefined) {
        return false;
    }
    return input.length > 0;
}
