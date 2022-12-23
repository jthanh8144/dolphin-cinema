import Handlebars from 'handlebars'
import moment from 'moment'
import i18n from 'i18n'

const helpers = {
  times: (n: number, block: any) => {
    let accum = ''
    for (let i = 0; i < n; ++i) accum += block.fn(i)
    return accum
  },
  sub: (a: number, b: number) => a - b,
  // format_date --> YYYY/MM/DD
  formatDate: (date: string, formatString: string) =>
    moment(new Date(date)).format(formatString),
  round: (a: number) => Math.round(a),
  numberWithCommas: (n: number) => {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  },
  __: function (...args: any) {
    return i18n.__.apply(this, args)
  },
  __n: function (...args: any) {
    return i18n.__n.apply(this, args)
  },
  compare: (a: any, operation: string, b: any, options: any) => {
    if (operation === '===') {
      return a === b ? options.fn(this) : options.inverse(this)
    } else {
      return a !== b ? options.fn(this) : options.inverse(this)
    }
  },
  ifCond: (v1: any, operator: string, v2: any, block: any) => {
    switch (operator) {
      case '==':
        return v1 == v2 ? block.fn(this) : block.inverse(this)
      case '===':
        return v1 === v2 ? block.fn(this) : block.inverse(this)
      case '!=':
        return v1 != v2 ? block.fn(this) : block.inverse(this)
      case '!==':
        return v1 !== v2 ? block.fn(this) : block.inverse(this)
      case '<':
        return v1 < v2 ? block.fn(this) : block.inverse(this)
      case '<=':
        return v1 <= v2 ? block.fn(this) : block.inverse(this)
      case '>':
        return v1 > v2 ? block.fn(this) : block.inverse(this)
      case '>=':
        return v1 >= v2 ? block.fn(this) : block.inverse(this)
      case '&&':
        return v1 && v2 ? block.fn(this) : block.inverse(this)
      case '||':
        return v1 || v2 ? block.fn(this) : block.inverse(this)
      default:
        return block.inverse(this)
    }
  },
  formatTimeAge: (date: string) =>
    moment(new Date(date)).startOf('second').fromNow(),
}

for (const prop in helpers) {
  Handlebars.registerHelper(prop, helpers[prop])
}
