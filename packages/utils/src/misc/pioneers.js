export function getRandomPioneerNumber() {
    const min = 1;
    const max = 4473;
    const number = Math.floor(Math.random() * (max - min + 1)) + min;
    return number.toString().padStart(4, "0");
}
//# sourceMappingURL=pioneers.js.map