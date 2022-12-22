export class TimeDurationTransformer {
  to(data: string): string {
    return data
  }
  from(data: string): string {
    if (data) {
      let arr = data.split('","')
      arr = arr.map((item) => item.split(' ')[1])
      arr[1] = arr[1].split('")')[0]
      arr = arr.map((item) => item.slice(0, 5))
      return arr.join('-')
    } else {
      return ''
    }
  }
}
