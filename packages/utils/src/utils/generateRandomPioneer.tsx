export function getRandomPioneerNumber(): string {
  let min: number = 1
  let max: number = 641
  let number: number = Math.floor(Math.random() * (max - min + 1)) + min
  return number.toString().padStart(4, "0")
}
