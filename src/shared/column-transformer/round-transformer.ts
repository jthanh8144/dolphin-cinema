export class RoundTransformer {
  to(data: number): number {
    return data
  }
  from(data: number): number {
    return Math.round(data)
  }
}
