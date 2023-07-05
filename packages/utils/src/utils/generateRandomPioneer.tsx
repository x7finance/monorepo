export function getRandomPioneerNumber(): string {
  const min = 1
  const max = 4480
  const number: number = Math.floor(Math.random() * (max - min + 1)) + min
  return number.toString().padStart(4, "0")
}
