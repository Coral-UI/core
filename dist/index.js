import { colord as Ie } from 'colord'
import Ta from 'lodash/camelCase'
import Sa from 'lodash/upperFirst'
import { parse as Ca, HTMLElement as ja } from 'node-html-parser'

var b
;(function (r) {
  r.assertEqual = (n) => n
  function e(n) {}
  r.assertIs = e
  function t(n) {
    throw new Error()
  }
  ;(r.assertNever = t),
    (r.arrayToEnum = (n) => {
      let o = {}
      for (let i of n) o[i] = i
      return o
    }),
    (r.getValidEnumValues = (n) => {
      let o = r.objectKeys(n).filter((s) => typeof n[n[s]] != 'number'),
        i = {}
      for (let s of o) i[s] = n[s]
      return r.objectValues(i)
    }),
    (r.objectValues = (n) =>
      r.objectKeys(n).map(function (o) {
        return n[o]
      })),
    (r.objectKeys =
      typeof Object.keys == 'function'
        ? (n) => Object.keys(n)
        : (n) => {
            let o = []
            for (let i in n) Object.prototype.hasOwnProperty.call(n, i) && o.push(i)
            return o
          }),
    (r.find = (n, o) => {
      for (let i of n) if (o(i)) return i
    }),
    (r.isInteger =
      typeof Number.isInteger == 'function'
        ? (n) => Number.isInteger(n)
        : (n) => typeof n == 'number' && isFinite(n) && Math.floor(n) === n)
  function a(n, o = ' | ') {
    return n.map((i) => (typeof i == 'string' ? `'${i}'` : i)).join(o)
  }
  ;(r.joinValues = a), (r.jsonStringifyReplacer = (n, o) => (typeof o == 'bigint' ? o.toString() : o))
})(b || (b = {}))
var je
;(function (r) {
  r.mergeShapes = (e, t) => ({ ...e, ...t })
})(je || (je = {}))
var f = b.arrayToEnum([
    'string',
    'nan',
    'number',
    'integer',
    'float',
    'boolean',
    'date',
    'bigint',
    'symbol',
    'function',
    'undefined',
    'null',
    'array',
    'object',
    'unknown',
    'promise',
    'void',
    'never',
    'map',
    'set',
  ]),
  Z = (r) => {
    switch (typeof r) {
      case 'undefined':
        return f.undefined
      case 'string':
        return f.string
      case 'number':
        return isNaN(r) ? f.nan : f.number
      case 'boolean':
        return f.boolean
      case 'function':
        return f.function
      case 'bigint':
        return f.bigint
      case 'symbol':
        return f.symbol
      case 'object':
        return Array.isArray(r)
          ? f.array
          : r === null
            ? f.null
            : r.then && typeof r.then == 'function' && r.catch && typeof r.catch == 'function'
              ? f.promise
              : typeof Map < 'u' && r instanceof Map
                ? f.map
                : typeof Set < 'u' && r instanceof Set
                  ? f.set
                  : typeof Date < 'u' && r instanceof Date
                    ? f.date
                    : f.object
      default:
        return f.unknown
    }
  },
  p = b.arrayToEnum([
    'invalid_type',
    'invalid_literal',
    'custom',
    'invalid_union',
    'invalid_union_discriminator',
    'invalid_enum_value',
    'unrecognized_keys',
    'invalid_arguments',
    'invalid_return_type',
    'invalid_date',
    'invalid_string',
    'too_small',
    'too_big',
    'invalid_intersection_types',
    'not_multiple_of',
    'not_finite',
  ]),
  hr = (r) => JSON.stringify(r, null, 2).replace(/"([^"]+)":/g, '$1:'),
  T = class r extends Error {
    constructor(e) {
      super(),
        (this.issues = []),
        (this.addIssue = (a) => {
          this.issues = [...this.issues, a]
        }),
        (this.addIssues = (a = []) => {
          this.issues = [...this.issues, ...a]
        })
      let t = new.target.prototype
      Object.setPrototypeOf ? Object.setPrototypeOf(this, t) : (this.__proto__ = t),
        (this.name = 'ZodError'),
        (this.issues = e)
    }
    get errors() {
      return this.issues
    }
    format(e) {
      let t =
          e ||
          function (o) {
            return o.message
          },
        a = { _errors: [] },
        n = (o) => {
          for (let i of o.issues)
            if (i.code === 'invalid_union') i.unionErrors.map(n)
            else if (i.code === 'invalid_return_type') n(i.returnTypeError)
            else if (i.code === 'invalid_arguments') n(i.argumentsError)
            else if (i.path.length === 0) a._errors.push(t(i))
            else {
              let s = a,
                d = 0
              for (; d < i.path.length; ) {
                let c = i.path[d]
                d === i.path.length - 1
                  ? ((s[c] = s[c] || { _errors: [] }), s[c]._errors.push(t(i)))
                  : (s[c] = s[c] || { _errors: [] }),
                  (s = s[c]),
                  d++
              }
            }
        }
      return n(this), a
    }
    static assert(e) {
      if (!(e instanceof r)) throw new Error(`Not a ZodError: ${e}`)
    }
    toString() {
      return this.message
    }
    get message() {
      return JSON.stringify(this.issues, b.jsonStringifyReplacer, 2)
    }
    get isEmpty() {
      return this.issues.length === 0
    }
    flatten(e = (t) => t.message) {
      let t = {},
        a = []
      for (let n of this.issues)
        n.path.length > 0 ? ((t[n.path[0]] = t[n.path[0]] || []), t[n.path[0]].push(e(n))) : a.push(e(n))
      return { formErrors: a, fieldErrors: t }
    }
    get formErrors() {
      return this.flatten()
    }
  }
T.create = (r) => new T(r)
var ae = (r, e) => {
    let t
    switch (r.code) {
      case p.invalid_type:
        r.received === f.undefined ? (t = 'Required') : (t = `Expected ${r.expected}, received ${r.received}`)
        break
      case p.invalid_literal:
        t = `Invalid literal value, expected ${JSON.stringify(r.expected, b.jsonStringifyReplacer)}`
        break
      case p.unrecognized_keys:
        t = `Unrecognized key(s) in object: ${b.joinValues(r.keys, ', ')}`
        break
      case p.invalid_union:
        t = 'Invalid input'
        break
      case p.invalid_union_discriminator:
        t = `Invalid discriminator value. Expected ${b.joinValues(r.options)}`
        break
      case p.invalid_enum_value:
        t = `Invalid enum value. Expected ${b.joinValues(r.options)}, received '${r.received}'`
        break
      case p.invalid_arguments:
        t = 'Invalid function arguments'
        break
      case p.invalid_return_type:
        t = 'Invalid function return type'
        break
      case p.invalid_date:
        t = 'Invalid date'
        break
      case p.invalid_string:
        typeof r.validation == 'object'
          ? 'includes' in r.validation
            ? ((t = `Invalid input: must include "${r.validation.includes}"`),
              typeof r.validation.position == 'number' &&
                (t = `${t} at one or more positions greater than or equal to ${r.validation.position}`))
            : 'startsWith' in r.validation
              ? (t = `Invalid input: must start with "${r.validation.startsWith}"`)
              : 'endsWith' in r.validation
                ? (t = `Invalid input: must end with "${r.validation.endsWith}"`)
                : b.assertNever(r.validation)
          : r.validation !== 'regex'
            ? (t = `Invalid ${r.validation}`)
            : (t = 'Invalid')
        break
      case p.too_small:
        r.type === 'array'
          ? (t = `Array must contain ${r.exact ? 'exactly' : r.inclusive ? 'at least' : 'more than'} ${r.minimum} element(s)`)
          : r.type === 'string'
            ? (t = `String must contain ${r.exact ? 'exactly' : r.inclusive ? 'at least' : 'over'} ${r.minimum} character(s)`)
            : r.type === 'number'
              ? (t = `Number must be ${r.exact ? 'exactly equal to ' : r.inclusive ? 'greater than or equal to ' : 'greater than '}${r.minimum}`)
              : r.type === 'date'
                ? (t = `Date must be ${r.exact ? 'exactly equal to ' : r.inclusive ? 'greater than or equal to ' : 'greater than '}${new Date(Number(r.minimum))}`)
                : (t = 'Invalid input')
        break
      case p.too_big:
        r.type === 'array'
          ? (t = `Array must contain ${r.exact ? 'exactly' : r.inclusive ? 'at most' : 'less than'} ${r.maximum} element(s)`)
          : r.type === 'string'
            ? (t = `String must contain ${r.exact ? 'exactly' : r.inclusive ? 'at most' : 'under'} ${r.maximum} character(s)`)
            : r.type === 'number'
              ? (t = `Number must be ${r.exact ? 'exactly' : r.inclusive ? 'less than or equal to' : 'less than'} ${r.maximum}`)
              : r.type === 'bigint'
                ? (t = `BigInt must be ${r.exact ? 'exactly' : r.inclusive ? 'less than or equal to' : 'less than'} ${r.maximum}`)
                : r.type === 'date'
                  ? (t = `Date must be ${r.exact ? 'exactly' : r.inclusive ? 'smaller than or equal to' : 'smaller than'} ${new Date(Number(r.maximum))}`)
                  : (t = 'Invalid input')
        break
      case p.custom:
        t = 'Invalid input'
        break
      case p.invalid_intersection_types:
        t = 'Intersection results could not be merged'
        break
      case p.not_multiple_of:
        t = `Number must be a multiple of ${r.multipleOf}`
        break
      case p.not_finite:
        t = 'Number must be finite'
        break
      default:
        ;(t = e.defaultError), b.assertNever(r)
    }
    return { message: t }
  },
  Ve = ae
function yr(r) {
  Ve = r
}
function he() {
  return Ve
}
var ye = (r) => {
    let { data: e, path: t, errorMaps: a, issueData: n } = r,
      o = [...t, ...(n.path || [])],
      i = { ...n, path: o }
    if (n.message !== void 0) return { ...n, path: o, message: n.message }
    let s = '',
      d = a
        .filter((c) => !!c)
        .slice()
        .reverse()
    for (let c of d) s = c(i, { data: e, defaultError: s }).message
    return { ...n, path: o, message: s }
  },
  vr = []
function u(r, e) {
  let t = he(),
    a = ye({
      issueData: e,
      data: r.data,
      path: r.path,
      errorMaps: [r.common.contextualErrorMap, r.schemaErrorMap, t, t === ae ? void 0 : ae].filter((n) => !!n),
    })
  r.common.issues.push(a)
}
var w = class r {
    constructor() {
      this.value = 'valid'
    }
    dirty() {
      this.value === 'valid' && (this.value = 'dirty')
    }
    abort() {
      this.value !== 'aborted' && (this.value = 'aborted')
    }
    static mergeArray(e, t) {
      let a = []
      for (let n of t) {
        if (n.status === 'aborted') return y
        n.status === 'dirty' && e.dirty(), a.push(n.value)
      }
      return { status: e.value, value: a }
    }
    static async mergeObjectAsync(e, t) {
      let a = []
      for (let n of t) {
        let o = await n.key,
          i = await n.value
        a.push({ key: o, value: i })
      }
      return r.mergeObjectSync(e, a)
    }
    static mergeObjectSync(e, t) {
      let a = {}
      for (let n of t) {
        let { key: o, value: i } = n
        if (o.status === 'aborted' || i.status === 'aborted') return y
        o.status === 'dirty' && e.dirty(),
          i.status === 'dirty' && e.dirty(),
          o.value !== '__proto__' && (typeof i.value < 'u' || n.alwaysSet) && (a[o.value] = i.value)
      }
      return { status: e.value, value: a }
    }
  },
  y = Object.freeze({ status: 'aborted' }),
  re = (r) => ({ status: 'dirty', value: r }),
  _ = (r) => ({ status: 'valid', value: r }),
  Ce = (r) => r.status === 'aborted',
  Ee = (r) => r.status === 'dirty',
  ce = (r) => r.status === 'valid',
  ue = (r) => typeof Promise < 'u' && r instanceof Promise
function ve(r, e, t, a) {
  if (t === 'a' && !a) throw new TypeError('Private accessor was defined without a getter')
  if (typeof e == 'function' ? r !== e || !a : !e.has(r))
    throw new TypeError('Cannot read private member from an object whose class did not declare it')
  return t === 'm' ? a : t === 'a' ? a.call(r) : a ? a.value : e.get(r)
}
function Le(r, e, t, a, n) {
  if (a === 'm') throw new TypeError('Private method is not writable')
  if (a === 'a' && !n) throw new TypeError('Private accessor was defined without a setter')
  if (typeof e == 'function' ? r !== e || !n : !e.has(r))
    throw new TypeError('Cannot write private member to an object whose class did not declare it')
  return a === 'a' ? n.call(r, t) : n ? (n.value = t) : e.set(r, t), t
}
var m
;(function (r) {
  ;(r.errToObj = (e) => (typeof e == 'string' ? { message: e } : e || {})),
    (r.toString = (e) => (typeof e == 'string' ? e : e?.message))
})(m || (m = {}))
var pe,
  de,
  E = class {
    constructor(e, t, a, n) {
      ;(this._cachedPath = []), (this.parent = e), (this.data = t), (this._path = a), (this._key = n)
    }
    get path() {
      return (
        this._cachedPath.length ||
          (this._key instanceof Array
            ? this._cachedPath.push(...this._path, ...this._key)
            : this._cachedPath.push(...this._path, this._key)),
        this._cachedPath
      )
    }
  },
  $e = (r, e) => {
    if (ce(e)) return { success: !0, data: e.value }
    if (!r.common.issues.length) throw new Error('Validation failed but no issues detected.')
    return {
      success: !1,
      get error() {
        if (this._error) return this._error
        let t = new T(r.common.issues)
        return (this._error = t), this._error
      },
    }
  }
function g(r) {
  if (!r) return {}
  let { errorMap: e, invalid_type_error: t, required_error: a, description: n } = r
  if (e && (t || a))
    throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`)
  return e
    ? { errorMap: e, description: n }
    : {
        errorMap: (i, s) => {
          var d, c
          let { message: v } = r
          return i.code === 'invalid_enum_value'
            ? { message: v ?? s.defaultError }
            : typeof s.data > 'u'
              ? { message: (d = v ?? a) !== null && d !== void 0 ? d : s.defaultError }
              : i.code !== 'invalid_type'
                ? { message: s.defaultError }
                : { message: (c = v ?? t) !== null && c !== void 0 ? c : s.defaultError }
        },
        description: n,
      }
}
var x = class {
    constructor(e) {
      ;(this.spa = this.safeParseAsync),
        (this._def = e),
        (this.parse = this.parse.bind(this)),
        (this.safeParse = this.safeParse.bind(this)),
        (this.parseAsync = this.parseAsync.bind(this)),
        (this.safeParseAsync = this.safeParseAsync.bind(this)),
        (this.spa = this.spa.bind(this)),
        (this.refine = this.refine.bind(this)),
        (this.refinement = this.refinement.bind(this)),
        (this.superRefine = this.superRefine.bind(this)),
        (this.optional = this.optional.bind(this)),
        (this.nullable = this.nullable.bind(this)),
        (this.nullish = this.nullish.bind(this)),
        (this.array = this.array.bind(this)),
        (this.promise = this.promise.bind(this)),
        (this.or = this.or.bind(this)),
        (this.and = this.and.bind(this)),
        (this.transform = this.transform.bind(this)),
        (this.brand = this.brand.bind(this)),
        (this.default = this.default.bind(this)),
        (this.catch = this.catch.bind(this)),
        (this.describe = this.describe.bind(this)),
        (this.pipe = this.pipe.bind(this)),
        (this.readonly = this.readonly.bind(this)),
        (this.isNullable = this.isNullable.bind(this)),
        (this.isOptional = this.isOptional.bind(this))
    }
    get description() {
      return this._def.description
    }
    _getType(e) {
      return Z(e.data)
    }
    _getOrReturnCtx(e, t) {
      return (
        t || {
          common: e.parent.common,
          data: e.data,
          parsedType: Z(e.data),
          schemaErrorMap: this._def.errorMap,
          path: e.path,
          parent: e.parent,
        }
      )
    }
    _processInputParams(e) {
      return {
        status: new w(),
        ctx: {
          common: e.parent.common,
          data: e.data,
          parsedType: Z(e.data),
          schemaErrorMap: this._def.errorMap,
          path: e.path,
          parent: e.parent,
        },
      }
    }
    _parseSync(e) {
      let t = this._parse(e)
      if (ue(t)) throw new Error('Synchronous parse encountered promise.')
      return t
    }
    _parseAsync(e) {
      let t = this._parse(e)
      return Promise.resolve(t)
    }
    parse(e, t) {
      let a = this.safeParse(e, t)
      if (a.success) return a.data
      throw a.error
    }
    safeParse(e, t) {
      var a
      let n = {
          common: {
            issues: [],
            async: (a = t?.async) !== null && a !== void 0 ? a : !1,
            contextualErrorMap: t?.errorMap,
          },
          path: t?.path || [],
          schemaErrorMap: this._def.errorMap,
          parent: null,
          data: e,
          parsedType: Z(e),
        },
        o = this._parseSync({ data: e, path: n.path, parent: n })
      return $e(n, o)
    }
    async parseAsync(e, t) {
      let a = await this.safeParseAsync(e, t)
      if (a.success) return a.data
      throw a.error
    }
    async safeParseAsync(e, t) {
      let a = {
          common: { issues: [], contextualErrorMap: t?.errorMap, async: !0 },
          path: t?.path || [],
          schemaErrorMap: this._def.errorMap,
          parent: null,
          data: e,
          parsedType: Z(e),
        },
        n = this._parse({ data: e, path: a.path, parent: a }),
        o = await (ue(n) ? n : Promise.resolve(n))
      return $e(a, o)
    }
    refine(e, t) {
      let a = (n) => (typeof t == 'string' || typeof t > 'u' ? { message: t } : typeof t == 'function' ? t(n) : t)
      return this._refinement((n, o) => {
        let i = e(n),
          s = () => o.addIssue({ code: p.custom, ...a(n) })
        return typeof Promise < 'u' && i instanceof Promise ? i.then((d) => (d ? !0 : (s(), !1))) : i ? !0 : (s(), !1)
      })
    }
    refinement(e, t) {
      return this._refinement((a, n) => (e(a) ? !0 : (n.addIssue(typeof t == 'function' ? t(a, n) : t), !1)))
    }
    _refinement(e) {
      return new S({ schema: this, typeName: h.ZodEffects, effect: { type: 'refinement', refinement: e } })
    }
    superRefine(e) {
      return this._refinement(e)
    }
    optional() {
      return C.create(this, this._def)
    }
    nullable() {
      return R.create(this, this._def)
    }
    nullish() {
      return this.nullable().optional()
    }
    array() {
      return A.create(this, this._def)
    }
    promise() {
      return P.create(this, this._def)
    }
    or(e) {
      return H.create([this, e], this._def)
    }
    and(e) {
      return q.create(this, e, this._def)
    }
    transform(e) {
      return new S({
        ...g(this._def),
        schema: this,
        typeName: h.ZodEffects,
        effect: { type: 'transform', transform: e },
      })
    }
    default(e) {
      let t = typeof e == 'function' ? e : () => e
      return new X({ ...g(this._def), innerType: this, defaultValue: t, typeName: h.ZodDefault })
    }
    brand() {
      return new fe({ typeName: h.ZodBranded, type: this, ...g(this._def) })
    }
    catch(e) {
      let t = typeof e == 'function' ? e : () => e
      return new Q({ ...g(this._def), innerType: this, catchValue: t, typeName: h.ZodCatch })
    }
    describe(e) {
      let t = this.constructor
      return new t({ ...this._def, description: e })
    }
    pipe(e) {
      return me.create(this, e)
    }
    readonly() {
      return K.create(this)
    }
    isOptional() {
      return this.safeParse(void 0).success
    }
    isNullable() {
      return this.safeParse(null).success
    }
  },
  gr = /^c[^\s-]{8,}$/i,
  xr = /^[0-9a-z]+$/,
  br = /^[0-9A-HJKMNP-TV-Z]{26}$/,
  wr = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i,
  _r = /^[a-z0-9_-]{21}$/i,
  kr =
    /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/,
  Tr = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i,
  Sr = '^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$',
  Se,
  jr =
    /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/,
  Cr =
    /^(([a-f0-9]{1,4}:){7}|::([a-f0-9]{1,4}:){0,6}|([a-f0-9]{1,4}:){1}:([a-f0-9]{1,4}:){0,5}|([a-f0-9]{1,4}:){2}:([a-f0-9]{1,4}:){0,4}|([a-f0-9]{1,4}:){3}:([a-f0-9]{1,4}:){0,3}|([a-f0-9]{1,4}:){4}:([a-f0-9]{1,4}:){0,2}|([a-f0-9]{1,4}:){5}:([a-f0-9]{1,4}:){0,1})([a-f0-9]{1,4}|(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2})))$/,
  Er = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/,
  De =
    '((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))',
  Nr = new RegExp(`^${De}$`)
function Be(r) {
  let e = '([01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d'
  return r.precision ? (e = `${e}\\.\\d{${r.precision}}`) : r.precision == null && (e = `${e}(\\.\\d+)?`), e
}
function Or(r) {
  return new RegExp(`^${Be(r)}$`)
}
function Ue(r) {
  let e = `${De}T${Be(r)}`,
    t = []
  return (
    t.push(r.local ? 'Z?' : 'Z'),
    r.offset && t.push('([+-]\\d{2}:?\\d{2})'),
    (e = `${e}(${t.join('|')})`),
    new RegExp(`^${e}$`)
  )
}
function Rr(r, e) {
  return !!(((e === 'v4' || !e) && jr.test(r)) || ((e === 'v6' || !e) && Cr.test(r)))
}
var M = class r extends x {
  _parse(e) {
    if ((this._def.coerce && (e.data = String(e.data)), this._getType(e) !== f.string)) {
      let o = this._getOrReturnCtx(e)
      return u(o, { code: p.invalid_type, expected: f.string, received: o.parsedType }), y
    }
    let a = new w(),
      n
    for (let o of this._def.checks)
      if (o.kind === 'min')
        e.data.length < o.value &&
          ((n = this._getOrReturnCtx(e, n)),
          u(n, { code: p.too_small, minimum: o.value, type: 'string', inclusive: !0, exact: !1, message: o.message }),
          a.dirty())
      else if (o.kind === 'max')
        e.data.length > o.value &&
          ((n = this._getOrReturnCtx(e, n)),
          u(n, { code: p.too_big, maximum: o.value, type: 'string', inclusive: !0, exact: !1, message: o.message }),
          a.dirty())
      else if (o.kind === 'length') {
        let i = e.data.length > o.value,
          s = e.data.length < o.value
        ;(i || s) &&
          ((n = this._getOrReturnCtx(e, n)),
          i
            ? u(n, { code: p.too_big, maximum: o.value, type: 'string', inclusive: !0, exact: !0, message: o.message })
            : s &&
              u(n, {
                code: p.too_small,
                minimum: o.value,
                type: 'string',
                inclusive: !0,
                exact: !0,
                message: o.message,
              }),
          a.dirty())
      } else if (o.kind === 'email')
        Tr.test(e.data) ||
          ((n = this._getOrReturnCtx(e, n)),
          u(n, { validation: 'email', code: p.invalid_string, message: o.message }),
          a.dirty())
      else if (o.kind === 'emoji')
        Se || (Se = new RegExp(Sr, 'u')),
          Se.test(e.data) ||
            ((n = this._getOrReturnCtx(e, n)),
            u(n, { validation: 'emoji', code: p.invalid_string, message: o.message }),
            a.dirty())
      else if (o.kind === 'uuid')
        wr.test(e.data) ||
          ((n = this._getOrReturnCtx(e, n)),
          u(n, { validation: 'uuid', code: p.invalid_string, message: o.message }),
          a.dirty())
      else if (o.kind === 'nanoid')
        _r.test(e.data) ||
          ((n = this._getOrReturnCtx(e, n)),
          u(n, { validation: 'nanoid', code: p.invalid_string, message: o.message }),
          a.dirty())
      else if (o.kind === 'cuid')
        gr.test(e.data) ||
          ((n = this._getOrReturnCtx(e, n)),
          u(n, { validation: 'cuid', code: p.invalid_string, message: o.message }),
          a.dirty())
      else if (o.kind === 'cuid2')
        xr.test(e.data) ||
          ((n = this._getOrReturnCtx(e, n)),
          u(n, { validation: 'cuid2', code: p.invalid_string, message: o.message }),
          a.dirty())
      else if (o.kind === 'ulid')
        br.test(e.data) ||
          ((n = this._getOrReturnCtx(e, n)),
          u(n, { validation: 'ulid', code: p.invalid_string, message: o.message }),
          a.dirty())
      else if (o.kind === 'url')
        try {
          new URL(e.data)
        } catch {
          ;(n = this._getOrReturnCtx(e, n)),
            u(n, { validation: 'url', code: p.invalid_string, message: o.message }),
            a.dirty()
        }
      else
        o.kind === 'regex'
          ? ((o.regex.lastIndex = 0),
            o.regex.test(e.data) ||
              ((n = this._getOrReturnCtx(e, n)),
              u(n, { validation: 'regex', code: p.invalid_string, message: o.message }),
              a.dirty()))
          : o.kind === 'trim'
            ? (e.data = e.data.trim())
            : o.kind === 'includes'
              ? e.data.includes(o.value, o.position) ||
                ((n = this._getOrReturnCtx(e, n)),
                u(n, {
                  code: p.invalid_string,
                  validation: { includes: o.value, position: o.position },
                  message: o.message,
                }),
                a.dirty())
              : o.kind === 'toLowerCase'
                ? (e.data = e.data.toLowerCase())
                : o.kind === 'toUpperCase'
                  ? (e.data = e.data.toUpperCase())
                  : o.kind === 'startsWith'
                    ? e.data.startsWith(o.value) ||
                      ((n = this._getOrReturnCtx(e, n)),
                      u(n, { code: p.invalid_string, validation: { startsWith: o.value }, message: o.message }),
                      a.dirty())
                    : o.kind === 'endsWith'
                      ? e.data.endsWith(o.value) ||
                        ((n = this._getOrReturnCtx(e, n)),
                        u(n, { code: p.invalid_string, validation: { endsWith: o.value }, message: o.message }),
                        a.dirty())
                      : o.kind === 'datetime'
                        ? Ue(o).test(e.data) ||
                          ((n = this._getOrReturnCtx(e, n)),
                          u(n, { code: p.invalid_string, validation: 'datetime', message: o.message }),
                          a.dirty())
                        : o.kind === 'date'
                          ? Nr.test(e.data) ||
                            ((n = this._getOrReturnCtx(e, n)),
                            u(n, { code: p.invalid_string, validation: 'date', message: o.message }),
                            a.dirty())
                          : o.kind === 'time'
                            ? Or(o).test(e.data) ||
                              ((n = this._getOrReturnCtx(e, n)),
                              u(n, { code: p.invalid_string, validation: 'time', message: o.message }),
                              a.dirty())
                            : o.kind === 'duration'
                              ? kr.test(e.data) ||
                                ((n = this._getOrReturnCtx(e, n)),
                                u(n, { validation: 'duration', code: p.invalid_string, message: o.message }),
                                a.dirty())
                              : o.kind === 'ip'
                                ? Rr(e.data, o.version) ||
                                  ((n = this._getOrReturnCtx(e, n)),
                                  u(n, { validation: 'ip', code: p.invalid_string, message: o.message }),
                                  a.dirty())
                                : o.kind === 'base64'
                                  ? Er.test(e.data) ||
                                    ((n = this._getOrReturnCtx(e, n)),
                                    u(n, { validation: 'base64', code: p.invalid_string, message: o.message }),
                                    a.dirty())
                                  : b.assertNever(o)
    return { status: a.value, value: e.data }
  }
  _regex(e, t, a) {
    return this.refinement((n) => e.test(n), { validation: t, code: p.invalid_string, ...m.errToObj(a) })
  }
  _addCheck(e) {
    return new r({ ...this._def, checks: [...this._def.checks, e] })
  }
  email(e) {
    return this._addCheck({ kind: 'email', ...m.errToObj(e) })
  }
  url(e) {
    return this._addCheck({ kind: 'url', ...m.errToObj(e) })
  }
  emoji(e) {
    return this._addCheck({ kind: 'emoji', ...m.errToObj(e) })
  }
  uuid(e) {
    return this._addCheck({ kind: 'uuid', ...m.errToObj(e) })
  }
  nanoid(e) {
    return this._addCheck({ kind: 'nanoid', ...m.errToObj(e) })
  }
  cuid(e) {
    return this._addCheck({ kind: 'cuid', ...m.errToObj(e) })
  }
  cuid2(e) {
    return this._addCheck({ kind: 'cuid2', ...m.errToObj(e) })
  }
  ulid(e) {
    return this._addCheck({ kind: 'ulid', ...m.errToObj(e) })
  }
  base64(e) {
    return this._addCheck({ kind: 'base64', ...m.errToObj(e) })
  }
  ip(e) {
    return this._addCheck({ kind: 'ip', ...m.errToObj(e) })
  }
  datetime(e) {
    var t, a
    return typeof e == 'string'
      ? this._addCheck({ kind: 'datetime', precision: null, offset: !1, local: !1, message: e })
      : this._addCheck({
          kind: 'datetime',
          precision: typeof e?.precision > 'u' ? null : e?.precision,
          offset: (t = e?.offset) !== null && t !== void 0 ? t : !1,
          local: (a = e?.local) !== null && a !== void 0 ? a : !1,
          ...m.errToObj(e?.message),
        })
  }
  date(e) {
    return this._addCheck({ kind: 'date', message: e })
  }
  time(e) {
    return typeof e == 'string'
      ? this._addCheck({ kind: 'time', precision: null, message: e })
      : this._addCheck({
          kind: 'time',
          precision: typeof e?.precision > 'u' ? null : e?.precision,
          ...m.errToObj(e?.message),
        })
  }
  duration(e) {
    return this._addCheck({ kind: 'duration', ...m.errToObj(e) })
  }
  regex(e, t) {
    return this._addCheck({ kind: 'regex', regex: e, ...m.errToObj(t) })
  }
  includes(e, t) {
    return this._addCheck({ kind: 'includes', value: e, position: t?.position, ...m.errToObj(t?.message) })
  }
  startsWith(e, t) {
    return this._addCheck({ kind: 'startsWith', value: e, ...m.errToObj(t) })
  }
  endsWith(e, t) {
    return this._addCheck({ kind: 'endsWith', value: e, ...m.errToObj(t) })
  }
  min(e, t) {
    return this._addCheck({ kind: 'min', value: e, ...m.errToObj(t) })
  }
  max(e, t) {
    return this._addCheck({ kind: 'max', value: e, ...m.errToObj(t) })
  }
  length(e, t) {
    return this._addCheck({ kind: 'length', value: e, ...m.errToObj(t) })
  }
  nonempty(e) {
    return this.min(1, m.errToObj(e))
  }
  trim() {
    return new r({ ...this._def, checks: [...this._def.checks, { kind: 'trim' }] })
  }
  toLowerCase() {
    return new r({ ...this._def, checks: [...this._def.checks, { kind: 'toLowerCase' }] })
  }
  toUpperCase() {
    return new r({ ...this._def, checks: [...this._def.checks, { kind: 'toUpperCase' }] })
  }
  get isDatetime() {
    return !!this._def.checks.find((e) => e.kind === 'datetime')
  }
  get isDate() {
    return !!this._def.checks.find((e) => e.kind === 'date')
  }
  get isTime() {
    return !!this._def.checks.find((e) => e.kind === 'time')
  }
  get isDuration() {
    return !!this._def.checks.find((e) => e.kind === 'duration')
  }
  get isEmail() {
    return !!this._def.checks.find((e) => e.kind === 'email')
  }
  get isURL() {
    return !!this._def.checks.find((e) => e.kind === 'url')
  }
  get isEmoji() {
    return !!this._def.checks.find((e) => e.kind === 'emoji')
  }
  get isUUID() {
    return !!this._def.checks.find((e) => e.kind === 'uuid')
  }
  get isNANOID() {
    return !!this._def.checks.find((e) => e.kind === 'nanoid')
  }
  get isCUID() {
    return !!this._def.checks.find((e) => e.kind === 'cuid')
  }
  get isCUID2() {
    return !!this._def.checks.find((e) => e.kind === 'cuid2')
  }
  get isULID() {
    return !!this._def.checks.find((e) => e.kind === 'ulid')
  }
  get isIP() {
    return !!this._def.checks.find((e) => e.kind === 'ip')
  }
  get isBase64() {
    return !!this._def.checks.find((e) => e.kind === 'base64')
  }
  get minLength() {
    let e = null
    for (let t of this._def.checks) t.kind === 'min' && (e === null || t.value > e) && (e = t.value)
    return e
  }
  get maxLength() {
    let e = null
    for (let t of this._def.checks) t.kind === 'max' && (e === null || t.value < e) && (e = t.value)
    return e
  }
}
M.create = (r) => {
  var e
  return new M({
    checks: [],
    typeName: h.ZodString,
    coerce: (e = r?.coerce) !== null && e !== void 0 ? e : !1,
    ...g(r),
  })
}
function Ir(r, e) {
  let t = (r.toString().split('.')[1] || '').length,
    a = (e.toString().split('.')[1] || '').length,
    n = t > a ? t : a,
    o = parseInt(r.toFixed(n).replace('.', '')),
    i = parseInt(e.toFixed(n).replace('.', ''))
  return (o % i) / Math.pow(10, n)
}
var V = class r extends x {
  constructor() {
    super(...arguments), (this.min = this.gte), (this.max = this.lte), (this.step = this.multipleOf)
  }
  _parse(e) {
    if ((this._def.coerce && (e.data = Number(e.data)), this._getType(e) !== f.number)) {
      let o = this._getOrReturnCtx(e)
      return u(o, { code: p.invalid_type, expected: f.number, received: o.parsedType }), y
    }
    let a,
      n = new w()
    for (let o of this._def.checks)
      o.kind === 'int'
        ? b.isInteger(e.data) ||
          ((a = this._getOrReturnCtx(e, a)),
          u(a, { code: p.invalid_type, expected: 'integer', received: 'float', message: o.message }),
          n.dirty())
        : o.kind === 'min'
          ? (o.inclusive ? e.data < o.value : e.data <= o.value) &&
            ((a = this._getOrReturnCtx(e, a)),
            u(a, {
              code: p.too_small,
              minimum: o.value,
              type: 'number',
              inclusive: o.inclusive,
              exact: !1,
              message: o.message,
            }),
            n.dirty())
          : o.kind === 'max'
            ? (o.inclusive ? e.data > o.value : e.data >= o.value) &&
              ((a = this._getOrReturnCtx(e, a)),
              u(a, {
                code: p.too_big,
                maximum: o.value,
                type: 'number',
                inclusive: o.inclusive,
                exact: !1,
                message: o.message,
              }),
              n.dirty())
            : o.kind === 'multipleOf'
              ? Ir(e.data, o.value) !== 0 &&
                ((a = this._getOrReturnCtx(e, a)),
                u(a, { code: p.not_multiple_of, multipleOf: o.value, message: o.message }),
                n.dirty())
              : o.kind === 'finite'
                ? Number.isFinite(e.data) ||
                  ((a = this._getOrReturnCtx(e, a)), u(a, { code: p.not_finite, message: o.message }), n.dirty())
                : b.assertNever(o)
    return { status: n.value, value: e.data }
  }
  gte(e, t) {
    return this.setLimit('min', e, !0, m.toString(t))
  }
  gt(e, t) {
    return this.setLimit('min', e, !1, m.toString(t))
  }
  lte(e, t) {
    return this.setLimit('max', e, !0, m.toString(t))
  }
  lt(e, t) {
    return this.setLimit('max', e, !1, m.toString(t))
  }
  setLimit(e, t, a, n) {
    return new r({
      ...this._def,
      checks: [...this._def.checks, { kind: e, value: t, inclusive: a, message: m.toString(n) }],
    })
  }
  _addCheck(e) {
    return new r({ ...this._def, checks: [...this._def.checks, e] })
  }
  int(e) {
    return this._addCheck({ kind: 'int', message: m.toString(e) })
  }
  positive(e) {
    return this._addCheck({ kind: 'min', value: 0, inclusive: !1, message: m.toString(e) })
  }
  negative(e) {
    return this._addCheck({ kind: 'max', value: 0, inclusive: !1, message: m.toString(e) })
  }
  nonpositive(e) {
    return this._addCheck({ kind: 'max', value: 0, inclusive: !0, message: m.toString(e) })
  }
  nonnegative(e) {
    return this._addCheck({ kind: 'min', value: 0, inclusive: !0, message: m.toString(e) })
  }
  multipleOf(e, t) {
    return this._addCheck({ kind: 'multipleOf', value: e, message: m.toString(t) })
  }
  finite(e) {
    return this._addCheck({ kind: 'finite', message: m.toString(e) })
  }
  safe(e) {
    return this._addCheck({
      kind: 'min',
      inclusive: !0,
      value: Number.MIN_SAFE_INTEGER,
      message: m.toString(e),
    })._addCheck({ kind: 'max', inclusive: !0, value: Number.MAX_SAFE_INTEGER, message: m.toString(e) })
  }
  get minValue() {
    let e = null
    for (let t of this._def.checks) t.kind === 'min' && (e === null || t.value > e) && (e = t.value)
    return e
  }
  get maxValue() {
    let e = null
    for (let t of this._def.checks) t.kind === 'max' && (e === null || t.value < e) && (e = t.value)
    return e
  }
  get isInt() {
    return !!this._def.checks.find((e) => e.kind === 'int' || (e.kind === 'multipleOf' && b.isInteger(e.value)))
  }
  get isFinite() {
    let e = null,
      t = null
    for (let a of this._def.checks) {
      if (a.kind === 'finite' || a.kind === 'int' || a.kind === 'multipleOf') return !0
      a.kind === 'min'
        ? (t === null || a.value > t) && (t = a.value)
        : a.kind === 'max' && (e === null || a.value < e) && (e = a.value)
    }
    return Number.isFinite(t) && Number.isFinite(e)
  }
}
V.create = (r) => new V({ checks: [], typeName: h.ZodNumber, coerce: r?.coerce || !1, ...g(r) })
var L = class r extends x {
  constructor() {
    super(...arguments), (this.min = this.gte), (this.max = this.lte)
  }
  _parse(e) {
    if ((this._def.coerce && (e.data = BigInt(e.data)), this._getType(e) !== f.bigint)) {
      let o = this._getOrReturnCtx(e)
      return u(o, { code: p.invalid_type, expected: f.bigint, received: o.parsedType }), y
    }
    let a,
      n = new w()
    for (let o of this._def.checks)
      o.kind === 'min'
        ? (o.inclusive ? e.data < o.value : e.data <= o.value) &&
          ((a = this._getOrReturnCtx(e, a)),
          u(a, { code: p.too_small, type: 'bigint', minimum: o.value, inclusive: o.inclusive, message: o.message }),
          n.dirty())
        : o.kind === 'max'
          ? (o.inclusive ? e.data > o.value : e.data >= o.value) &&
            ((a = this._getOrReturnCtx(e, a)),
            u(a, { code: p.too_big, type: 'bigint', maximum: o.value, inclusive: o.inclusive, message: o.message }),
            n.dirty())
          : o.kind === 'multipleOf'
            ? e.data % o.value !== BigInt(0) &&
              ((a = this._getOrReturnCtx(e, a)),
              u(a, { code: p.not_multiple_of, multipleOf: o.value, message: o.message }),
              n.dirty())
            : b.assertNever(o)
    return { status: n.value, value: e.data }
  }
  gte(e, t) {
    return this.setLimit('min', e, !0, m.toString(t))
  }
  gt(e, t) {
    return this.setLimit('min', e, !1, m.toString(t))
  }
  lte(e, t) {
    return this.setLimit('max', e, !0, m.toString(t))
  }
  lt(e, t) {
    return this.setLimit('max', e, !1, m.toString(t))
  }
  setLimit(e, t, a, n) {
    return new r({
      ...this._def,
      checks: [...this._def.checks, { kind: e, value: t, inclusive: a, message: m.toString(n) }],
    })
  }
  _addCheck(e) {
    return new r({ ...this._def, checks: [...this._def.checks, e] })
  }
  positive(e) {
    return this._addCheck({ kind: 'min', value: BigInt(0), inclusive: !1, message: m.toString(e) })
  }
  negative(e) {
    return this._addCheck({ kind: 'max', value: BigInt(0), inclusive: !1, message: m.toString(e) })
  }
  nonpositive(e) {
    return this._addCheck({ kind: 'max', value: BigInt(0), inclusive: !0, message: m.toString(e) })
  }
  nonnegative(e) {
    return this._addCheck({ kind: 'min', value: BigInt(0), inclusive: !0, message: m.toString(e) })
  }
  multipleOf(e, t) {
    return this._addCheck({ kind: 'multipleOf', value: e, message: m.toString(t) })
  }
  get minValue() {
    let e = null
    for (let t of this._def.checks) t.kind === 'min' && (e === null || t.value > e) && (e = t.value)
    return e
  }
  get maxValue() {
    let e = null
    for (let t of this._def.checks) t.kind === 'max' && (e === null || t.value < e) && (e = t.value)
    return e
  }
}
L.create = (r) => {
  var e
  return new L({
    checks: [],
    typeName: h.ZodBigInt,
    coerce: (e = r?.coerce) !== null && e !== void 0 ? e : !1,
    ...g(r),
  })
}
var D = class extends x {
  _parse(e) {
    if ((this._def.coerce && (e.data = !!e.data), this._getType(e) !== f.boolean)) {
      let a = this._getOrReturnCtx(e)
      return u(a, { code: p.invalid_type, expected: f.boolean, received: a.parsedType }), y
    }
    return _(e.data)
  }
}
D.create = (r) => new D({ typeName: h.ZodBoolean, coerce: r?.coerce || !1, ...g(r) })
var B = class r extends x {
  _parse(e) {
    if ((this._def.coerce && (e.data = new Date(e.data)), this._getType(e) !== f.date)) {
      let o = this._getOrReturnCtx(e)
      return u(o, { code: p.invalid_type, expected: f.date, received: o.parsedType }), y
    }
    if (isNaN(e.data.getTime())) {
      let o = this._getOrReturnCtx(e)
      return u(o, { code: p.invalid_date }), y
    }
    let a = new w(),
      n
    for (let o of this._def.checks)
      o.kind === 'min'
        ? e.data.getTime() < o.value &&
          ((n = this._getOrReturnCtx(e, n)),
          u(n, { code: p.too_small, message: o.message, inclusive: !0, exact: !1, minimum: o.value, type: 'date' }),
          a.dirty())
        : o.kind === 'max'
          ? e.data.getTime() > o.value &&
            ((n = this._getOrReturnCtx(e, n)),
            u(n, { code: p.too_big, message: o.message, inclusive: !0, exact: !1, maximum: o.value, type: 'date' }),
            a.dirty())
          : b.assertNever(o)
    return { status: a.value, value: new Date(e.data.getTime()) }
  }
  _addCheck(e) {
    return new r({ ...this._def, checks: [...this._def.checks, e] })
  }
  min(e, t) {
    return this._addCheck({ kind: 'min', value: e.getTime(), message: m.toString(t) })
  }
  max(e, t) {
    return this._addCheck({ kind: 'max', value: e.getTime(), message: m.toString(t) })
  }
  get minDate() {
    let e = null
    for (let t of this._def.checks) t.kind === 'min' && (e === null || t.value > e) && (e = t.value)
    return e != null ? new Date(e) : null
  }
  get maxDate() {
    let e = null
    for (let t of this._def.checks) t.kind === 'max' && (e === null || t.value < e) && (e = t.value)
    return e != null ? new Date(e) : null
  }
}
B.create = (r) => new B({ checks: [], coerce: r?.coerce || !1, typeName: h.ZodDate, ...g(r) })
var ne = class extends x {
  _parse(e) {
    if (this._getType(e) !== f.symbol) {
      let a = this._getOrReturnCtx(e)
      return u(a, { code: p.invalid_type, expected: f.symbol, received: a.parsedType }), y
    }
    return _(e.data)
  }
}
ne.create = (r) => new ne({ typeName: h.ZodSymbol, ...g(r) })
var U = class extends x {
  _parse(e) {
    if (this._getType(e) !== f.undefined) {
      let a = this._getOrReturnCtx(e)
      return u(a, { code: p.invalid_type, expected: f.undefined, received: a.parsedType }), y
    }
    return _(e.data)
  }
}
U.create = (r) => new U({ typeName: h.ZodUndefined, ...g(r) })
var W = class extends x {
  _parse(e) {
    if (this._getType(e) !== f.null) {
      let a = this._getOrReturnCtx(e)
      return u(a, { code: p.invalid_type, expected: f.null, received: a.parsedType }), y
    }
    return _(e.data)
  }
}
W.create = (r) => new W({ typeName: h.ZodNull, ...g(r) })
var $ = class extends x {
  constructor() {
    super(...arguments), (this._any = !0)
  }
  _parse(e) {
    return _(e.data)
  }
}
$.create = (r) => new $({ typeName: h.ZodAny, ...g(r) })
var z = class extends x {
  constructor() {
    super(...arguments), (this._unknown = !0)
  }
  _parse(e) {
    return _(e.data)
  }
}
z.create = (r) => new z({ typeName: h.ZodUnknown, ...g(r) })
var N = class extends x {
  _parse(e) {
    let t = this._getOrReturnCtx(e)
    return u(t, { code: p.invalid_type, expected: f.never, received: t.parsedType }), y
  }
}
N.create = (r) => new N({ typeName: h.ZodNever, ...g(r) })
var oe = class extends x {
  _parse(e) {
    if (this._getType(e) !== f.undefined) {
      let a = this._getOrReturnCtx(e)
      return u(a, { code: p.invalid_type, expected: f.void, received: a.parsedType }), y
    }
    return _(e.data)
  }
}
oe.create = (r) => new oe({ typeName: h.ZodVoid, ...g(r) })
var A = class r extends x {
  _parse(e) {
    let { ctx: t, status: a } = this._processInputParams(e),
      n = this._def
    if (t.parsedType !== f.array) return u(t, { code: p.invalid_type, expected: f.array, received: t.parsedType }), y
    if (n.exactLength !== null) {
      let i = t.data.length > n.exactLength.value,
        s = t.data.length < n.exactLength.value
      ;(i || s) &&
        (u(t, {
          code: i ? p.too_big : p.too_small,
          minimum: s ? n.exactLength.value : void 0,
          maximum: i ? n.exactLength.value : void 0,
          type: 'array',
          inclusive: !0,
          exact: !0,
          message: n.exactLength.message,
        }),
        a.dirty())
    }
    if (
      (n.minLength !== null &&
        t.data.length < n.minLength.value &&
        (u(t, {
          code: p.too_small,
          minimum: n.minLength.value,
          type: 'array',
          inclusive: !0,
          exact: !1,
          message: n.minLength.message,
        }),
        a.dirty()),
      n.maxLength !== null &&
        t.data.length > n.maxLength.value &&
        (u(t, {
          code: p.too_big,
          maximum: n.maxLength.value,
          type: 'array',
          inclusive: !0,
          exact: !1,
          message: n.maxLength.message,
        }),
        a.dirty()),
      t.common.async)
    )
      return Promise.all([...t.data].map((i, s) => n.type._parseAsync(new E(t, i, t.path, s)))).then((i) =>
        w.mergeArray(a, i),
      )
    let o = [...t.data].map((i, s) => n.type._parseSync(new E(t, i, t.path, s)))
    return w.mergeArray(a, o)
  }
  get element() {
    return this._def.type
  }
  min(e, t) {
    return new r({ ...this._def, minLength: { value: e, message: m.toString(t) } })
  }
  max(e, t) {
    return new r({ ...this._def, maxLength: { value: e, message: m.toString(t) } })
  }
  length(e, t) {
    return new r({ ...this._def, exactLength: { value: e, message: m.toString(t) } })
  }
  nonempty(e) {
    return this.min(1, e)
  }
}
A.create = (r, e) =>
  new A({ type: r, minLength: null, maxLength: null, exactLength: null, typeName: h.ZodArray, ...g(e) })
function te(r) {
  if (r instanceof k) {
    let e = {}
    for (let t in r.shape) {
      let a = r.shape[t]
      e[t] = C.create(te(a))
    }
    return new k({ ...r._def, shape: () => e })
  } else
    return r instanceof A
      ? new A({ ...r._def, type: te(r.element) })
      : r instanceof C
        ? C.create(te(r.unwrap()))
        : r instanceof R
          ? R.create(te(r.unwrap()))
          : r instanceof O
            ? O.create(r.items.map((e) => te(e)))
            : r
}
var k = class r extends x {
  constructor() {
    super(...arguments), (this._cached = null), (this.nonstrict = this.passthrough), (this.augment = this.extend)
  }
  _getCached() {
    if (this._cached !== null) return this._cached
    let e = this._def.shape(),
      t = b.objectKeys(e)
    return (this._cached = { shape: e, keys: t })
  }
  _parse(e) {
    if (this._getType(e) !== f.object) {
      let c = this._getOrReturnCtx(e)
      return u(c, { code: p.invalid_type, expected: f.object, received: c.parsedType }), y
    }
    let { status: a, ctx: n } = this._processInputParams(e),
      { shape: o, keys: i } = this._getCached(),
      s = []
    if (!(this._def.catchall instanceof N && this._def.unknownKeys === 'strip'))
      for (let c in n.data) i.includes(c) || s.push(c)
    let d = []
    for (let c of i) {
      let v = o[c],
        j = n.data[c]
      d.push({ key: { status: 'valid', value: c }, value: v._parse(new E(n, j, n.path, c)), alwaysSet: c in n.data })
    }
    if (this._def.catchall instanceof N) {
      let c = this._def.unknownKeys
      if (c === 'passthrough')
        for (let v of s) d.push({ key: { status: 'valid', value: v }, value: { status: 'valid', value: n.data[v] } })
      else if (c === 'strict') s.length > 0 && (u(n, { code: p.unrecognized_keys, keys: s }), a.dirty())
      else if (c !== 'strip') throw new Error('Internal ZodObject error: invalid unknownKeys value.')
    } else {
      let c = this._def.catchall
      for (let v of s) {
        let j = n.data[v]
        d.push({ key: { status: 'valid', value: v }, value: c._parse(new E(n, j, n.path, v)), alwaysSet: v in n.data })
      }
    }
    return n.common.async
      ? Promise.resolve()
          .then(async () => {
            let c = []
            for (let v of d) {
              let j = await v.key,
                Me = await v.value
              c.push({ key: j, value: Me, alwaysSet: v.alwaysSet })
            }
            return c
          })
          .then((c) => w.mergeObjectSync(a, c))
      : w.mergeObjectSync(a, d)
  }
  get shape() {
    return this._def.shape()
  }
  strict(e) {
    return (
      m.errToObj,
      new r({
        ...this._def,
        unknownKeys: 'strict',
        ...(e !== void 0
          ? {
              errorMap: (t, a) => {
                var n, o, i, s
                let d =
                  (i = (o = (n = this._def).errorMap) === null || o === void 0 ? void 0 : o.call(n, t, a).message) !==
                    null && i !== void 0
                    ? i
                    : a.defaultError
                return t.code === 'unrecognized_keys'
                  ? { message: (s = m.errToObj(e).message) !== null && s !== void 0 ? s : d }
                  : { message: d }
              },
            }
          : {}),
      })
    )
  }
  strip() {
    return new r({ ...this._def, unknownKeys: 'strip' })
  }
  passthrough() {
    return new r({ ...this._def, unknownKeys: 'passthrough' })
  }
  extend(e) {
    return new r({ ...this._def, shape: () => ({ ...this._def.shape(), ...e }) })
  }
  merge(e) {
    return new r({
      unknownKeys: e._def.unknownKeys,
      catchall: e._def.catchall,
      shape: () => ({ ...this._def.shape(), ...e._def.shape() }),
      typeName: h.ZodObject,
    })
  }
  setKey(e, t) {
    return this.augment({ [e]: t })
  }
  catchall(e) {
    return new r({ ...this._def, catchall: e })
  }
  pick(e) {
    let t = {}
    return (
      b.objectKeys(e).forEach((a) => {
        e[a] && this.shape[a] && (t[a] = this.shape[a])
      }),
      new r({ ...this._def, shape: () => t })
    )
  }
  omit(e) {
    let t = {}
    return (
      b.objectKeys(this.shape).forEach((a) => {
        e[a] || (t[a] = this.shape[a])
      }),
      new r({ ...this._def, shape: () => t })
    )
  }
  deepPartial() {
    return te(this)
  }
  partial(e) {
    let t = {}
    return (
      b.objectKeys(this.shape).forEach((a) => {
        let n = this.shape[a]
        e && !e[a] ? (t[a] = n) : (t[a] = n.optional())
      }),
      new r({ ...this._def, shape: () => t })
    )
  }
  required(e) {
    let t = {}
    return (
      b.objectKeys(this.shape).forEach((a) => {
        if (e && !e[a]) t[a] = this.shape[a]
        else {
          let o = this.shape[a]
          for (; o instanceof C; ) o = o._def.innerType
          t[a] = o
        }
      }),
      new r({ ...this._def, shape: () => t })
    )
  }
  keyof() {
    return We(b.objectKeys(this.shape))
  }
}
k.create = (r, e) =>
  new k({ shape: () => r, unknownKeys: 'strip', catchall: N.create(), typeName: h.ZodObject, ...g(e) })
k.strictCreate = (r, e) =>
  new k({ shape: () => r, unknownKeys: 'strict', catchall: N.create(), typeName: h.ZodObject, ...g(e) })
k.lazycreate = (r, e) => new k({ shape: r, unknownKeys: 'strip', catchall: N.create(), typeName: h.ZodObject, ...g(e) })
var H = class extends x {
  _parse(e) {
    let { ctx: t } = this._processInputParams(e),
      a = this._def.options
    function n(o) {
      for (let s of o) if (s.result.status === 'valid') return s.result
      for (let s of o) if (s.result.status === 'dirty') return t.common.issues.push(...s.ctx.common.issues), s.result
      let i = o.map((s) => new T(s.ctx.common.issues))
      return u(t, { code: p.invalid_union, unionErrors: i }), y
    }
    if (t.common.async)
      return Promise.all(
        a.map(async (o) => {
          let i = { ...t, common: { ...t.common, issues: [] }, parent: null }
          return { result: await o._parseAsync({ data: t.data, path: t.path, parent: i }), ctx: i }
        }),
      ).then(n)
    {
      let o,
        i = []
      for (let d of a) {
        let c = { ...t, common: { ...t.common, issues: [] }, parent: null },
          v = d._parseSync({ data: t.data, path: t.path, parent: c })
        if (v.status === 'valid') return v
        v.status === 'dirty' && !o && (o = { result: v, ctx: c }), c.common.issues.length && i.push(c.common.issues)
      }
      if (o) return t.common.issues.push(...o.ctx.common.issues), o.result
      let s = i.map((d) => new T(d))
      return u(t, { code: p.invalid_union, unionErrors: s }), y
    }
  }
  get options() {
    return this._def.options
  }
}
H.create = (r, e) => new H({ options: r, typeName: h.ZodUnion, ...g(e) })
var I = (r) =>
    r instanceof G
      ? I(r.schema)
      : r instanceof S
        ? I(r.innerType())
        : r instanceof Y
          ? [r.value]
          : r instanceof J
            ? r.options
            : r instanceof F
              ? b.objectValues(r.enum)
              : r instanceof X
                ? I(r._def.innerType)
                : r instanceof U
                  ? [void 0]
                  : r instanceof W
                    ? [null]
                    : r instanceof C
                      ? [void 0, ...I(r.unwrap())]
                      : r instanceof R
                        ? [null, ...I(r.unwrap())]
                        : r instanceof fe || r instanceof K
                          ? I(r.unwrap())
                          : r instanceof Q
                            ? I(r._def.innerType)
                            : [],
  ge = class r extends x {
    _parse(e) {
      let { ctx: t } = this._processInputParams(e)
      if (t.parsedType !== f.object)
        return u(t, { code: p.invalid_type, expected: f.object, received: t.parsedType }), y
      let a = this.discriminator,
        n = t.data[a],
        o = this.optionsMap.get(n)
      return o
        ? t.common.async
          ? o._parseAsync({ data: t.data, path: t.path, parent: t })
          : o._parseSync({ data: t.data, path: t.path, parent: t })
        : (u(t, { code: p.invalid_union_discriminator, options: Array.from(this.optionsMap.keys()), path: [a] }), y)
    }
    get discriminator() {
      return this._def.discriminator
    }
    get options() {
      return this._def.options
    }
    get optionsMap() {
      return this._def.optionsMap
    }
    static create(e, t, a) {
      let n = new Map()
      for (let o of t) {
        let i = I(o.shape[e])
        if (!i.length)
          throw new Error(`A discriminator value for key \`${e}\` could not be extracted from all schema options`)
        for (let s of i) {
          if (n.has(s)) throw new Error(`Discriminator property ${String(e)} has duplicate value ${String(s)}`)
          n.set(s, o)
        }
      }
      return new r({ typeName: h.ZodDiscriminatedUnion, discriminator: e, options: t, optionsMap: n, ...g(a) })
    }
  }
function Ne(r, e) {
  let t = Z(r),
    a = Z(e)
  if (r === e) return { valid: !0, data: r }
  if (t === f.object && a === f.object) {
    let n = b.objectKeys(e),
      o = b.objectKeys(r).filter((s) => n.indexOf(s) !== -1),
      i = { ...r, ...e }
    for (let s of o) {
      let d = Ne(r[s], e[s])
      if (!d.valid) return { valid: !1 }
      i[s] = d.data
    }
    return { valid: !0, data: i }
  } else if (t === f.array && a === f.array) {
    if (r.length !== e.length) return { valid: !1 }
    let n = []
    for (let o = 0; o < r.length; o++) {
      let i = r[o],
        s = e[o],
        d = Ne(i, s)
      if (!d.valid) return { valid: !1 }
      n.push(d.data)
    }
    return { valid: !0, data: n }
  } else return t === f.date && a === f.date && +r == +e ? { valid: !0, data: r } : { valid: !1 }
}
var q = class extends x {
  _parse(e) {
    let { status: t, ctx: a } = this._processInputParams(e),
      n = (o, i) => {
        if (Ce(o) || Ce(i)) return y
        let s = Ne(o.value, i.value)
        return s.valid
          ? ((Ee(o) || Ee(i)) && t.dirty(), { status: t.value, value: s.data })
          : (u(a, { code: p.invalid_intersection_types }), y)
      }
    return a.common.async
      ? Promise.all([
          this._def.left._parseAsync({ data: a.data, path: a.path, parent: a }),
          this._def.right._parseAsync({ data: a.data, path: a.path, parent: a }),
        ]).then(([o, i]) => n(o, i))
      : n(
          this._def.left._parseSync({ data: a.data, path: a.path, parent: a }),
          this._def.right._parseSync({ data: a.data, path: a.path, parent: a }),
        )
  }
}
q.create = (r, e, t) => new q({ left: r, right: e, typeName: h.ZodIntersection, ...g(t) })
var O = class r extends x {
  _parse(e) {
    let { status: t, ctx: a } = this._processInputParams(e)
    if (a.parsedType !== f.array) return u(a, { code: p.invalid_type, expected: f.array, received: a.parsedType }), y
    if (a.data.length < this._def.items.length)
      return u(a, { code: p.too_small, minimum: this._def.items.length, inclusive: !0, exact: !1, type: 'array' }), y
    !this._def.rest &&
      a.data.length > this._def.items.length &&
      (u(a, { code: p.too_big, maximum: this._def.items.length, inclusive: !0, exact: !1, type: 'array' }), t.dirty())
    let o = [...a.data]
      .map((i, s) => {
        let d = this._def.items[s] || this._def.rest
        return d ? d._parse(new E(a, i, a.path, s)) : null
      })
      .filter((i) => !!i)
    return a.common.async ? Promise.all(o).then((i) => w.mergeArray(t, i)) : w.mergeArray(t, o)
  }
  get items() {
    return this._def.items
  }
  rest(e) {
    return new r({ ...this._def, rest: e })
  }
}
O.create = (r, e) => {
  if (!Array.isArray(r)) throw new Error('You must pass an array of schemas to z.tuple([ ... ])')
  return new O({ items: r, typeName: h.ZodTuple, rest: null, ...g(e) })
}
var xe = class r extends x {
    get keySchema() {
      return this._def.keyType
    }
    get valueSchema() {
      return this._def.valueType
    }
    _parse(e) {
      let { status: t, ctx: a } = this._processInputParams(e)
      if (a.parsedType !== f.object)
        return u(a, { code: p.invalid_type, expected: f.object, received: a.parsedType }), y
      let n = [],
        o = this._def.keyType,
        i = this._def.valueType
      for (let s in a.data)
        n.push({
          key: o._parse(new E(a, s, a.path, s)),
          value: i._parse(new E(a, a.data[s], a.path, s)),
          alwaysSet: s in a.data,
        })
      return a.common.async ? w.mergeObjectAsync(t, n) : w.mergeObjectSync(t, n)
    }
    get element() {
      return this._def.valueType
    }
    static create(e, t, a) {
      return t instanceof x
        ? new r({ keyType: e, valueType: t, typeName: h.ZodRecord, ...g(a) })
        : new r({ keyType: M.create(), valueType: e, typeName: h.ZodRecord, ...g(t) })
    }
  },
  ie = class extends x {
    get keySchema() {
      return this._def.keyType
    }
    get valueSchema() {
      return this._def.valueType
    }
    _parse(e) {
      let { status: t, ctx: a } = this._processInputParams(e)
      if (a.parsedType !== f.map) return u(a, { code: p.invalid_type, expected: f.map, received: a.parsedType }), y
      let n = this._def.keyType,
        o = this._def.valueType,
        i = [...a.data.entries()].map(([s, d], c) => ({
          key: n._parse(new E(a, s, a.path, [c, 'key'])),
          value: o._parse(new E(a, d, a.path, [c, 'value'])),
        }))
      if (a.common.async) {
        let s = new Map()
        return Promise.resolve().then(async () => {
          for (let d of i) {
            let c = await d.key,
              v = await d.value
            if (c.status === 'aborted' || v.status === 'aborted') return y
            ;(c.status === 'dirty' || v.status === 'dirty') && t.dirty(), s.set(c.value, v.value)
          }
          return { status: t.value, value: s }
        })
      } else {
        let s = new Map()
        for (let d of i) {
          let c = d.key,
            v = d.value
          if (c.status === 'aborted' || v.status === 'aborted') return y
          ;(c.status === 'dirty' || v.status === 'dirty') && t.dirty(), s.set(c.value, v.value)
        }
        return { status: t.value, value: s }
      }
    }
  }
ie.create = (r, e, t) => new ie({ valueType: e, keyType: r, typeName: h.ZodMap, ...g(t) })
var se = class r extends x {
  _parse(e) {
    let { status: t, ctx: a } = this._processInputParams(e)
    if (a.parsedType !== f.set) return u(a, { code: p.invalid_type, expected: f.set, received: a.parsedType }), y
    let n = this._def
    n.minSize !== null &&
      a.data.size < n.minSize.value &&
      (u(a, {
        code: p.too_small,
        minimum: n.minSize.value,
        type: 'set',
        inclusive: !0,
        exact: !1,
        message: n.minSize.message,
      }),
      t.dirty()),
      n.maxSize !== null &&
        a.data.size > n.maxSize.value &&
        (u(a, {
          code: p.too_big,
          maximum: n.maxSize.value,
          type: 'set',
          inclusive: !0,
          exact: !1,
          message: n.maxSize.message,
        }),
        t.dirty())
    let o = this._def.valueType
    function i(d) {
      let c = new Set()
      for (let v of d) {
        if (v.status === 'aborted') return y
        v.status === 'dirty' && t.dirty(), c.add(v.value)
      }
      return { status: t.value, value: c }
    }
    let s = [...a.data.values()].map((d, c) => o._parse(new E(a, d, a.path, c)))
    return a.common.async ? Promise.all(s).then((d) => i(d)) : i(s)
  }
  min(e, t) {
    return new r({ ...this._def, minSize: { value: e, message: m.toString(t) } })
  }
  max(e, t) {
    return new r({ ...this._def, maxSize: { value: e, message: m.toString(t) } })
  }
  size(e, t) {
    return this.min(e, t).max(e, t)
  }
  nonempty(e) {
    return this.min(1, e)
  }
}
se.create = (r, e) => new se({ valueType: r, minSize: null, maxSize: null, typeName: h.ZodSet, ...g(e) })
var be = class r extends x {
    constructor() {
      super(...arguments), (this.validate = this.implement)
    }
    _parse(e) {
      let { ctx: t } = this._processInputParams(e)
      if (t.parsedType !== f.function)
        return u(t, { code: p.invalid_type, expected: f.function, received: t.parsedType }), y
      function a(s, d) {
        return ye({
          data: s,
          path: t.path,
          errorMaps: [t.common.contextualErrorMap, t.schemaErrorMap, he(), ae].filter((c) => !!c),
          issueData: { code: p.invalid_arguments, argumentsError: d },
        })
      }
      function n(s, d) {
        return ye({
          data: s,
          path: t.path,
          errorMaps: [t.common.contextualErrorMap, t.schemaErrorMap, he(), ae].filter((c) => !!c),
          issueData: { code: p.invalid_return_type, returnTypeError: d },
        })
      }
      let o = { errorMap: t.common.contextualErrorMap },
        i = t.data
      if (this._def.returns instanceof P) {
        let s = this
        return _(async function (...d) {
          let c = new T([]),
            v = await s._def.args.parseAsync(d, o).catch((Te) => {
              throw (c.addIssue(a(d, Te)), c)
            }),
            j = await Reflect.apply(i, this, v)
          return await s._def.returns._def.type.parseAsync(j, o).catch((Te) => {
            throw (c.addIssue(n(j, Te)), c)
          })
        })
      } else {
        let s = this
        return _(function (...d) {
          let c = s._def.args.safeParse(d, o)
          if (!c.success) throw new T([a(d, c.error)])
          let v = Reflect.apply(i, this, c.data),
            j = s._def.returns.safeParse(v, o)
          if (!j.success) throw new T([n(v, j.error)])
          return j.data
        })
      }
    }
    parameters() {
      return this._def.args
    }
    returnType() {
      return this._def.returns
    }
    args(...e) {
      return new r({ ...this._def, args: O.create(e).rest(z.create()) })
    }
    returns(e) {
      return new r({ ...this._def, returns: e })
    }
    implement(e) {
      return this.parse(e)
    }
    strictImplement(e) {
      return this.parse(e)
    }
    static create(e, t, a) {
      return new r({
        args: e || O.create([]).rest(z.create()),
        returns: t || z.create(),
        typeName: h.ZodFunction,
        ...g(a),
      })
    }
  },
  G = class extends x {
    get schema() {
      return this._def.getter()
    }
    _parse(e) {
      let { ctx: t } = this._processInputParams(e)
      return this._def.getter()._parse({ data: t.data, path: t.path, parent: t })
    }
  }
G.create = (r, e) => new G({ getter: r, typeName: h.ZodLazy, ...g(e) })
var Y = class extends x {
  _parse(e) {
    if (e.data !== this._def.value) {
      let t = this._getOrReturnCtx(e)
      return u(t, { received: t.data, code: p.invalid_literal, expected: this._def.value }), y
    }
    return { status: 'valid', value: e.data }
  }
  get value() {
    return this._def.value
  }
}
Y.create = (r, e) => new Y({ value: r, typeName: h.ZodLiteral, ...g(e) })
function We(r, e) {
  return new J({ values: r, typeName: h.ZodEnum, ...g(e) })
}
var J = class r extends x {
  constructor() {
    super(...arguments), pe.set(this, void 0)
  }
  _parse(e) {
    if (typeof e.data != 'string') {
      let t = this._getOrReturnCtx(e),
        a = this._def.values
      return u(t, { expected: b.joinValues(a), received: t.parsedType, code: p.invalid_type }), y
    }
    if ((ve(this, pe, 'f') || Le(this, pe, new Set(this._def.values), 'f'), !ve(this, pe, 'f').has(e.data))) {
      let t = this._getOrReturnCtx(e),
        a = this._def.values
      return u(t, { received: t.data, code: p.invalid_enum_value, options: a }), y
    }
    return _(e.data)
  }
  get options() {
    return this._def.values
  }
  get enum() {
    let e = {}
    for (let t of this._def.values) e[t] = t
    return e
  }
  get Values() {
    let e = {}
    for (let t of this._def.values) e[t] = t
    return e
  }
  get Enum() {
    let e = {}
    for (let t of this._def.values) e[t] = t
    return e
  }
  extract(e, t = this._def) {
    return r.create(e, { ...this._def, ...t })
  }
  exclude(e, t = this._def) {
    return r.create(
      this.options.filter((a) => !e.includes(a)),
      { ...this._def, ...t },
    )
  }
}
pe = new WeakMap()
J.create = We
var F = class extends x {
  constructor() {
    super(...arguments), de.set(this, void 0)
  }
  _parse(e) {
    let t = b.getValidEnumValues(this._def.values),
      a = this._getOrReturnCtx(e)
    if (a.parsedType !== f.string && a.parsedType !== f.number) {
      let n = b.objectValues(t)
      return u(a, { expected: b.joinValues(n), received: a.parsedType, code: p.invalid_type }), y
    }
    if (
      (ve(this, de, 'f') || Le(this, de, new Set(b.getValidEnumValues(this._def.values)), 'f'),
      !ve(this, de, 'f').has(e.data))
    ) {
      let n = b.objectValues(t)
      return u(a, { received: a.data, code: p.invalid_enum_value, options: n }), y
    }
    return _(e.data)
  }
  get enum() {
    return this._def.values
  }
}
de = new WeakMap()
F.create = (r, e) => new F({ values: r, typeName: h.ZodNativeEnum, ...g(e) })
var P = class extends x {
  unwrap() {
    return this._def.type
  }
  _parse(e) {
    let { ctx: t } = this._processInputParams(e)
    if (t.parsedType !== f.promise && t.common.async === !1)
      return u(t, { code: p.invalid_type, expected: f.promise, received: t.parsedType }), y
    let a = t.parsedType === f.promise ? t.data : Promise.resolve(t.data)
    return _(a.then((n) => this._def.type.parseAsync(n, { path: t.path, errorMap: t.common.contextualErrorMap })))
  }
}
P.create = (r, e) => new P({ type: r, typeName: h.ZodPromise, ...g(e) })
var S = class extends x {
  innerType() {
    return this._def.schema
  }
  sourceType() {
    return this._def.schema._def.typeName === h.ZodEffects ? this._def.schema.sourceType() : this._def.schema
  }
  _parse(e) {
    let { status: t, ctx: a } = this._processInputParams(e),
      n = this._def.effect || null,
      o = {
        addIssue: (i) => {
          u(a, i), i.fatal ? t.abort() : t.dirty()
        },
        get path() {
          return a.path
        },
      }
    if (((o.addIssue = o.addIssue.bind(o)), n.type === 'preprocess')) {
      let i = n.transform(a.data, o)
      if (a.common.async)
        return Promise.resolve(i).then(async (s) => {
          if (t.value === 'aborted') return y
          let d = await this._def.schema._parseAsync({ data: s, path: a.path, parent: a })
          return d.status === 'aborted' ? y : d.status === 'dirty' || t.value === 'dirty' ? re(d.value) : d
        })
      {
        if (t.value === 'aborted') return y
        let s = this._def.schema._parseSync({ data: i, path: a.path, parent: a })
        return s.status === 'aborted' ? y : s.status === 'dirty' || t.value === 'dirty' ? re(s.value) : s
      }
    }
    if (n.type === 'refinement') {
      let i = (s) => {
        let d = n.refinement(s, o)
        if (a.common.async) return Promise.resolve(d)
        if (d instanceof Promise)
          throw new Error('Async refinement encountered during synchronous parse operation. Use .parseAsync instead.')
        return s
      }
      if (a.common.async === !1) {
        let s = this._def.schema._parseSync({ data: a.data, path: a.path, parent: a })
        return s.status === 'aborted'
          ? y
          : (s.status === 'dirty' && t.dirty(), i(s.value), { status: t.value, value: s.value })
      } else
        return this._def.schema
          ._parseAsync({ data: a.data, path: a.path, parent: a })
          .then((s) =>
            s.status === 'aborted'
              ? y
              : (s.status === 'dirty' && t.dirty(), i(s.value).then(() => ({ status: t.value, value: s.value }))),
          )
    }
    if (n.type === 'transform')
      if (a.common.async === !1) {
        let i = this._def.schema._parseSync({ data: a.data, path: a.path, parent: a })
        if (!ce(i)) return i
        let s = n.transform(i.value, o)
        if (s instanceof Promise)
          throw new Error(
            'Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.',
          )
        return { status: t.value, value: s }
      } else
        return this._def.schema
          ._parseAsync({ data: a.data, path: a.path, parent: a })
          .then((i) =>
            ce(i) ? Promise.resolve(n.transform(i.value, o)).then((s) => ({ status: t.value, value: s })) : i,
          )
    b.assertNever(n)
  }
}
S.create = (r, e, t) => new S({ schema: r, typeName: h.ZodEffects, effect: e, ...g(t) })
S.createWithPreprocess = (r, e, t) =>
  new S({ schema: e, effect: { type: 'preprocess', transform: r }, typeName: h.ZodEffects, ...g(t) })
var C = class extends x {
  _parse(e) {
    return this._getType(e) === f.undefined ? _(void 0) : this._def.innerType._parse(e)
  }
  unwrap() {
    return this._def.innerType
  }
}
C.create = (r, e) => new C({ innerType: r, typeName: h.ZodOptional, ...g(e) })
var R = class extends x {
  _parse(e) {
    return this._getType(e) === f.null ? _(null) : this._def.innerType._parse(e)
  }
  unwrap() {
    return this._def.innerType
  }
}
R.create = (r, e) => new R({ innerType: r, typeName: h.ZodNullable, ...g(e) })
var X = class extends x {
  _parse(e) {
    let { ctx: t } = this._processInputParams(e),
      a = t.data
    return (
      t.parsedType === f.undefined && (a = this._def.defaultValue()),
      this._def.innerType._parse({ data: a, path: t.path, parent: t })
    )
  }
  removeDefault() {
    return this._def.innerType
  }
}
X.create = (r, e) =>
  new X({
    innerType: r,
    typeName: h.ZodDefault,
    defaultValue: typeof e.default == 'function' ? e.default : () => e.default,
    ...g(e),
  })
var Q = class extends x {
  _parse(e) {
    let { ctx: t } = this._processInputParams(e),
      a = { ...t, common: { ...t.common, issues: [] } },
      n = this._def.innerType._parse({ data: a.data, path: a.path, parent: { ...a } })
    return ue(n)
      ? n.then((o) => ({
          status: 'valid',
          value:
            o.status === 'valid'
              ? o.value
              : this._def.catchValue({
                  get error() {
                    return new T(a.common.issues)
                  },
                  input: a.data,
                }),
        }))
      : {
          status: 'valid',
          value:
            n.status === 'valid'
              ? n.value
              : this._def.catchValue({
                  get error() {
                    return new T(a.common.issues)
                  },
                  input: a.data,
                }),
        }
  }
  removeCatch() {
    return this._def.innerType
  }
}
Q.create = (r, e) =>
  new Q({
    innerType: r,
    typeName: h.ZodCatch,
    catchValue: typeof e.catch == 'function' ? e.catch : () => e.catch,
    ...g(e),
  })
var le = class extends x {
  _parse(e) {
    if (this._getType(e) !== f.nan) {
      let a = this._getOrReturnCtx(e)
      return u(a, { code: p.invalid_type, expected: f.nan, received: a.parsedType }), y
    }
    return { status: 'valid', value: e.data }
  }
}
le.create = (r) => new le({ typeName: h.ZodNaN, ...g(r) })
var zr = Symbol('zod_brand'),
  fe = class extends x {
    _parse(e) {
      let { ctx: t } = this._processInputParams(e),
        a = t.data
      return this._def.type._parse({ data: a, path: t.path, parent: t })
    }
    unwrap() {
      return this._def.type
    }
  },
  me = class r extends x {
    _parse(e) {
      let { status: t, ctx: a } = this._processInputParams(e)
      if (a.common.async)
        return (async () => {
          let o = await this._def.in._parseAsync({ data: a.data, path: a.path, parent: a })
          return o.status === 'aborted'
            ? y
            : o.status === 'dirty'
              ? (t.dirty(), re(o.value))
              : this._def.out._parseAsync({ data: o.value, path: a.path, parent: a })
        })()
      {
        let n = this._def.in._parseSync({ data: a.data, path: a.path, parent: a })
        return n.status === 'aborted'
          ? y
          : n.status === 'dirty'
            ? (t.dirty(), { status: 'dirty', value: n.value })
            : this._def.out._parseSync({ data: n.value, path: a.path, parent: a })
      }
    }
    static create(e, t) {
      return new r({ in: e, out: t, typeName: h.ZodPipeline })
    }
  },
  K = class extends x {
    _parse(e) {
      let t = this._def.innerType._parse(e),
        a = (n) => (ce(n) && (n.value = Object.freeze(n.value)), n)
      return ue(t) ? t.then((n) => a(n)) : a(t)
    }
    unwrap() {
      return this._def.innerType
    }
  }
K.create = (r, e) => new K({ innerType: r, typeName: h.ZodReadonly, ...g(e) })
function He(r, e = {}, t) {
  return r
    ? $.create().superRefine((a, n) => {
        var o, i
        if (!r(a)) {
          let s = typeof e == 'function' ? e(a) : typeof e == 'string' ? { message: e } : e,
            d = (i = (o = s.fatal) !== null && o !== void 0 ? o : t) !== null && i !== void 0 ? i : !0,
            c = typeof s == 'string' ? { message: s } : s
          n.addIssue({ code: 'custom', ...c, fatal: d })
        }
      })
    : $.create()
}
var Ar = { object: k.lazycreate },
  h
;(function (r) {
  ;(r.ZodString = 'ZodString'),
    (r.ZodNumber = 'ZodNumber'),
    (r.ZodNaN = 'ZodNaN'),
    (r.ZodBigInt = 'ZodBigInt'),
    (r.ZodBoolean = 'ZodBoolean'),
    (r.ZodDate = 'ZodDate'),
    (r.ZodSymbol = 'ZodSymbol'),
    (r.ZodUndefined = 'ZodUndefined'),
    (r.ZodNull = 'ZodNull'),
    (r.ZodAny = 'ZodAny'),
    (r.ZodUnknown = 'ZodUnknown'),
    (r.ZodNever = 'ZodNever'),
    (r.ZodVoid = 'ZodVoid'),
    (r.ZodArray = 'ZodArray'),
    (r.ZodObject = 'ZodObject'),
    (r.ZodUnion = 'ZodUnion'),
    (r.ZodDiscriminatedUnion = 'ZodDiscriminatedUnion'),
    (r.ZodIntersection = 'ZodIntersection'),
    (r.ZodTuple = 'ZodTuple'),
    (r.ZodRecord = 'ZodRecord'),
    (r.ZodMap = 'ZodMap'),
    (r.ZodSet = 'ZodSet'),
    (r.ZodFunction = 'ZodFunction'),
    (r.ZodLazy = 'ZodLazy'),
    (r.ZodLiteral = 'ZodLiteral'),
    (r.ZodEnum = 'ZodEnum'),
    (r.ZodEffects = 'ZodEffects'),
    (r.ZodNativeEnum = 'ZodNativeEnum'),
    (r.ZodOptional = 'ZodOptional'),
    (r.ZodNullable = 'ZodNullable'),
    (r.ZodDefault = 'ZodDefault'),
    (r.ZodCatch = 'ZodCatch'),
    (r.ZodPromise = 'ZodPromise'),
    (r.ZodBranded = 'ZodBranded'),
    (r.ZodPipeline = 'ZodPipeline'),
    (r.ZodReadonly = 'ZodReadonly')
})(h || (h = {}))
var Zr = (r, e = { message: `Input not instance of ${r.name}` }) => He((t) => t instanceof r, e),
  qe = M.create,
  Ge = V.create,
  Mr = le.create,
  $r = L.create,
  Ye = D.create,
  Pr = B.create,
  Vr = ne.create,
  Lr = U.create,
  Dr = W.create,
  Br = $.create,
  Ur = z.create,
  Wr = N.create,
  Hr = oe.create,
  qr = A.create,
  Gr = k.create,
  Yr = k.strictCreate,
  Jr = H.create,
  Fr = ge.create,
  Xr = q.create,
  Qr = O.create,
  Kr = xe.create,
  ea = ie.create,
  ta = se.create,
  ra = be.create,
  aa = G.create,
  na = Y.create,
  oa = J.create,
  ia = F.create,
  sa = P.create,
  Pe = S.create,
  la = C.create,
  pa = R.create,
  da = S.createWithPreprocess,
  ca = me.create,
  ua = () => qe().optional(),
  fa = () => Ge().optional(),
  ma = () => Ye().optional(),
  ha = {
    string: (r) => M.create({ ...r, coerce: !0 }),
    number: (r) => V.create({ ...r, coerce: !0 }),
    boolean: (r) => D.create({ ...r, coerce: !0 }),
    bigint: (r) => L.create({ ...r, coerce: !0 }),
    date: (r) => B.create({ ...r, coerce: !0 }),
  },
  ya = y,
  l = Object.freeze({
    __proto__: null,
    defaultErrorMap: ae,
    setErrorMap: yr,
    getErrorMap: he,
    makeIssue: ye,
    EMPTY_PATH: vr,
    addIssueToContext: u,
    ParseStatus: w,
    INVALID: y,
    DIRTY: re,
    OK: _,
    isAborted: Ce,
    isDirty: Ee,
    isValid: ce,
    isAsync: ue,
    get util() {
      return b
    },
    get objectUtil() {
      return je
    },
    ZodParsedType: f,
    getParsedType: Z,
    ZodType: x,
    datetimeRegex: Ue,
    ZodString: M,
    ZodNumber: V,
    ZodBigInt: L,
    ZodBoolean: D,
    ZodDate: B,
    ZodSymbol: ne,
    ZodUndefined: U,
    ZodNull: W,
    ZodAny: $,
    ZodUnknown: z,
    ZodNever: N,
    ZodVoid: oe,
    ZodArray: A,
    ZodObject: k,
    ZodUnion: H,
    ZodDiscriminatedUnion: ge,
    ZodIntersection: q,
    ZodTuple: O,
    ZodRecord: xe,
    ZodMap: ie,
    ZodSet: se,
    ZodFunction: be,
    ZodLazy: G,
    ZodLiteral: Y,
    ZodEnum: J,
    ZodNativeEnum: F,
    ZodPromise: P,
    ZodEffects: S,
    ZodTransformer: S,
    ZodOptional: C,
    ZodNullable: R,
    ZodDefault: X,
    ZodCatch: Q,
    ZodNaN: le,
    BRAND: zr,
    ZodBranded: fe,
    ZodPipeline: me,
    ZodReadonly: K,
    custom: He,
    Schema: x,
    ZodSchema: x,
    late: Ar,
    get ZodFirstPartyTypeKind() {
      return h
    },
    coerce: ha,
    any: Br,
    array: qr,
    bigint: $r,
    boolean: Ye,
    date: Pr,
    discriminatedUnion: Fr,
    effect: Pe,
    enum: oa,
    function: ra,
    instanceof: Zr,
    intersection: Xr,
    lazy: aa,
    literal: na,
    map: ea,
    nan: Mr,
    nativeEnum: ia,
    never: Wr,
    null: Dr,
    nullable: pa,
    number: Ge,
    object: Gr,
    oboolean: ma,
    onumber: fa,
    optional: la,
    ostring: ua,
    pipeline: ca,
    preprocess: da,
    promise: sa,
    record: Kr,
    set: ta,
    strictObject: Yr,
    string: qe,
    symbol: Vr,
    transformer: Pe,
    tuple: Qr,
    undefined: Lr,
    union: Jr,
    unknown: Ur,
    void: Hr,
    NEVER: ya,
    ZodIssueCode: p,
    quotelessJson: hr,
    ZodError: T,
  })
var we = l.union([
  l.literal('h1'),
  l.literal('h2'),
  l.literal('h3'),
  l.literal('h4'),
  l.literal('h5'),
  l.literal('h6'),
  l.literal('p'),
  l.literal('span'),
  l.literal('a'),
  l.literal('img'),
  l.literal('ul'),
  l.literal('li'),
  l.literal('ol'),
  l.literal('nav'),
  l.literal('div'),
  l.literal('section'),
  l.literal('footer'),
  l.literal('header'),
  l.literal('button'),
  l.literal('input'),
  l.literal('form'),
  l.literal('textarea'),
  l.literal('select'),
  l.literal('option'),
  l.literal('table'),
  l.literal('tr'),
  l.literal('td'),
  l.literal('th'),
  l.literal('article'),
  l.literal('aside'),
  l.literal('main'),
  l.literal('figure'),
  l.literal('figcaption'),
  l.literal('strong'),
  l.literal('em'),
  l.literal('code'),
  l.literal('pre'),
  l.literal('blockquote'),
  l.literal('hr'),
  l.literal('br'),
  l.literal('label'),
  l.literal('fieldset'),
  l.literal('legend'),
  l.literal('audio'),
  l.literal('video'),
  l.literal('source'),
  l.literal('canvas'),
])
var _e = l
  .record(
    l.string().transform((r) => r.replace(/-./g, (e) => e.charAt(1).toUpperCase())),
    l.union([
      l.string(),
      l.number(),
      l
        .record(
          l.string().transform((r) => r.replace(/-./g, (e) => e.charAt(1).toUpperCase())),
          l.union([l.string(), l.number()]),
        )
        .nullish(),
    ]),
  )
  .nullish()
var va = l.object({
    propertyName: l.string().nullish(),
    type: l
      .union([l.string(), l.number(), l.boolean(), l.array(l.any()), l.record(l.string(), l.any()), l.function()])
      .nullish(),
    value: l.record(l.string(), l.any()).nullish(),
  }),
  Je = l.object({
    elementType: we,
    figmaNodeRef: l.string().nullish(),
    boundProperties: va,
    styles: _e,
    options: l.record(l.string(), l.any()).nullish(),
  })
var ga = l.union([l.string(), l.number(), l.boolean(), l.array(l.string())]),
  Fe = l.record(l.string(), ga),
  xa = Fe.nullish(),
  ba = l.object({
    elementAttributes: Fe.nullish(),
    elementType: we,
    description: l.string().nullish(),
    hasBackgroundImage: l.boolean().nullish(),
    isComponent: l.boolean().nullish(),
    name: l
      .string()
      .transform((r) => r.replace(/\s/g, ''))
      .refine((r) => /^[a-zA-Z]/.test(r), { message: 'Text content must start with a letter' })
      .transform((r) => r.charAt(0).toUpperCase() + r.slice(1))
      .nullish(),
    styles: _e,
    variants: l.array(Je).nullish(),
    tsType: l.string().nullish(),
    textContent: l.string().nullish(),
  }),
  Oe = ba.extend({ config: xa, children: l.lazy(() => Oe.array()) })
async function wa(r) {
  let e = await Oe.safeParseAsync(r)
  if (e.success) return e.data
  throw new Error(e.error.message)
}
var Re = {
  black: '#000',
  white: '#fff',
  rose: {
    50: '#fff1f2',
    100: '#ffe4e6',
    200: '#fecdd3',
    300: '#fda4af',
    400: '#fb7185',
    500: '#f43f5e',
    600: '#e11d48',
    700: '#be123c',
    800: '#9f1239',
    900: '#881337',
  },
  pink: {
    50: '#fdf2f8',
    100: '#fce7f3',
    200: '#fbcfe8',
    300: '#f9a8d4',
    400: '#f472b6',
    500: '#ec4899',
    600: '#db2777',
    700: '#be185d',
    800: '#9d174d',
    900: '#831843',
  },
  fuchsia: {
    50: '#fdf4ff',
    100: '#fae8ff',
    200: '#f5d0fe',
    300: '#f0abfc',
    400: '#e879f9',
    500: '#d946ef',
    600: '#c026d3',
    700: '#a21caf',
    800: '#86198f',
    900: '#701a75',
  },
  purple: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7',
    600: '#9333ea',
    700: '#7e22ce',
    800: '#6b21a8',
    900: '#581c87',
  },
  violet: {
    50: '#f5f3ff',
    100: '#ede9fe',
    200: '#ddd6fe',
    300: '#c4b5fd',
    400: '#a78bfa',
    500: '#8b5cf6',
    600: '#7c3aed',
    700: '#6d28d9',
    800: '#5b21b6',
    900: '#4c1d95',
  },
  indigo: {
    50: '#eef2ff',
    100: '#e0e7ff',
    200: '#c7d2fe',
    300: '#a5b4fc',
    400: '#818cf8',
    500: '#6366f1',
    600: '#4f46e5',
    700: '#4338ca',
    800: '#3730a3',
    900: '#312e81',
  },
  blue: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  lightBlue: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },
  cyan: {
    50: '#ecfeff',
    100: '#cffafe',
    200: '#a5f3fc',
    300: '#67e8f9',
    400: '#22d3ee',
    500: '#06b6d4',
    600: '#0891b2',
    700: '#0e7490',
    800: '#155e75',
    900: '#164e63',
  },
  teal: {
    50: '#f0fdfa',
    100: '#ccfbf1',
    200: '#99f6e4',
    300: '#5eead4',
    400: '#2dd4bf',
    500: '#14b8a6',
    600: '#0d9488',
    700: '#0f766e',
    800: '#115e59',
    900: '#134e4a',
  },
  emerald: {
    50: '#ecfdf5',
    100: '#d1fae5',
    200: '#a7f3d0',
    300: '#6ee7b7',
    400: '#34d399',
    500: '#10b981',
    600: '#059669',
    700: '#047857',
    800: '#065f46',
    900: '#064e3b',
  },
  green: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },
  lime: {
    50: '#f7fee7',
    100: '#ecfccb',
    200: '#d9f99d',
    300: '#bef264',
    400: '#a3e635',
    500: '#84cc16',
    600: '#65a30d',
    700: '#4d7c0f',
    800: '#3f6212',
    900: '#365314',
  },
  yellow: {
    50: '#fefce8',
    100: '#fef9c3',
    200: '#fef08a',
    300: '#fde047',
    400: '#facc15',
    500: '#eab308',
    600: '#ca8a04',
    700: '#a16207',
    800: '#854d0e',
    900: '#713f12',
  },
  amber: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  orange: {
    50: '#fff7ed',
    100: '#ffedd5',
    200: '#fed7aa',
    300: '#fdba74',
    400: '#fb923c',
    500: '#f97316',
    600: '#ea580c',
    700: '#c2410c',
    800: '#9a3412',
    900: '#7c2d12',
  },
  red: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },
  warmGray: {
    50: '#fafaf9',
    100: '#f5f5f4',
    200: '#e7e5e4',
    300: '#d6d3d1',
    400: '#a8a29e',
    500: '#78716c',
    600: '#57534e',
    700: '#44403c',
    800: '#292524',
    900: '#1c1917',
  },
  trueGray: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },
  gray: {
    50: '#fafafa',
    100: '#f4f4f5',
    200: '#e4e4e7',
    300: '#d4d4d8',
    400: '#a1a1aa',
    500: '#71717a',
    600: '#52525b',
    700: '#3f3f46',
    800: '#27272a',
    900: '#18181b',
  },
  coolGray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
  blueGray: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },
}
var Xe = (r) => {
  if (!r) return
  if (r === 'auto') return 'auto'
  if (r === 'full') return '100%'
  if (r === 'min') return 'min-content'
  if (r.startsWith('[')) return r.replace('[', '').replace(']', '').split('_').join(' ')
  if (r.endsWith('%')) return r
  if (r === 'px') return '1px'
  let e = r.split('-'),
    t = e[0] || '',
    a = e.slice(1)
  if (Re[t]) {
    let n = a.join('-'),
      o = Re[t]
    return typeof o == 'object' && n && o[n]
      ? { hex: Ie(o[n]).toHex(), rgb: Ie(o[n]).toRgb(), hsl: Ie(o[n]).toHsl() }
      : typeof o == 'string'
        ? o
        : void 0
  }
  if (!isNaN(Number(r))) return Number(r) * 4
}
var Qe = {
  'content-normal': { property: 'align-content', value: 'normal' },
  'content-center': { property: 'align-content', value: 'center' },
  'content-between': { property: 'align-content', value: 'space-between' },
  'content-around': { property: 'align-content', value: 'space-around' },
  'content-start': { property: 'align-content', value: 'flex-start' },
  'content-end': { property: 'align-content', value: 'flex-end' },
  'content-stretch': { property: 'align-content', value: 'stretch' },
  'content-baseline': { property: 'align-content', value: 'baseline' },
  'content-evenly': { property: 'align-content', value: 'space-evenly' },
}
var Ke = {
  'items-start': { property: 'align-items', value: 'flex-start' },
  'items-end': { property: 'align-items', value: 'flex-end' },
  'items-center': { property: 'align-items', value: 'center' },
  'items-baseline': { property: 'align-items', value: 'baseline' },
  'items-stretch': { property: 'align-items', value: 'stretch' },
}
var et = {
  'self-auto': { property: 'align-self', value: 'auto' },
  'self-start': { property: 'align-self', value: 'flex-start' },
  'self-end': { property: 'align-self', value: 'flex-end' },
  'self-center': { property: 'align-self', value: 'center' },
  'self-baseline': { property: 'align-self', value: 'baseline' },
  'self-stretch': { property: 'align-self', value: 'stretch' },
}
var tt = {
  'bg-fixed': { property: 'background-attachment', value: 'fixed' },
  'bg-local': { property: 'background-attachment', value: 'local' },
  'bg-scroll': { property: 'background-attachment', value: 'scroll' },
  'bg-clip-border': { property: 'background-clip', value: 'border-box' },
  'bg-clip-padding': { property: 'background-clip', value: 'padding-box' },
  'bg-clip-content': { property: 'background-clip', value: 'content-box' },
  'bg-clip-text': { property: 'background-clip', value: 'text' },
  'bg-origin-border': { property: 'background-origin', value: 'border-box' },
  'bg-origin-padding': { property: 'background-origin', value: 'padding-box' },
  'bg-origin-content': { property: 'background-origin', value: 'content-box' },
  'bg-bottom': { property: 'background-position', value: 'bottom' },
  'bg-center': { property: 'background-position', value: 'center' },
  'bg-left': { property: 'background-position', value: 'left' },
  'bg-left-bottom': { property: 'background-position', value: 'left bottom' },
  'bg-left-top': { property: 'background-position', value: 'left top' },
  'bg-right': { property: 'background-position', value: 'right' },
  'bg-right-bottom': { property: 'background-position', value: 'right bottom' },
  'bg-right-top': { property: 'background-position', value: 'right top' },
  'bg-top': { property: 'background-position', value: 'top' },
  'bg-repeat': { property: 'background-repeat', value: 'repeat' },
  'bg-repeat-x': { property: 'background-repeat', value: 'repeat-x' },
  'bg-repeat-y': { property: 'background-repeat', value: 'repeat-y' },
  'bg-repeat-round': { property: 'background-repeat', value: 'round' },
  'bg-repeat-space': { property: 'background-repeat', value: 'space' },
  'bg-no-repeat': { property: 'background-repeat', value: 'no-repeat' },
  'bg-auto': { property: 'background-size', value: 'auto' },
  'bg-cover': { property: 'background-size', value: 'cover' },
  'bg-contain': { property: 'background-size', value: 'contain' },
  'bg-': ['background-color'],
}
var rt = {
  'rounded-none': { property: 'border-radius', value: 0 },
  'rounded-sm': { property: 'border-radius', value: 2 },
  rounded: { property: 'border-radius', value: 4 },
  'rounded-md': { property: 'border-radius', value: 6 },
  'rounded-lg': { property: 'border-radius', value: 8 },
  'rounded-xl': { property: 'border-radius', value: 12 },
  'rounded-2xl': { property: 'border-radius', value: 16 },
  'rounded-3xl': { property: 'border-radius', value: 24 },
  'rounded-full': { property: 'border-radius', value: 9999 },
  'rounded-t-none': { property: 'border-top-left-radius', value: 0 },
  'rounded-': ['border-radius'],
}
var at = {
  'border-solid': { property: 'border-style', value: 'solid' },
  'border-dashed': { property: 'border-style', value: 'dashed' },
  'border-dotted': { property: 'border-style', value: 'dotted' },
  'border-double': { property: 'border-style', value: 'double' },
  'border-hidden': { property: 'border-style', value: 'hidden' },
  'border-none': { property: 'border-style', value: 'none' },
}
var _a = [0, 1, 2, 4, 8],
  ka = ['border-s', 'border-e', 'border-t', 'border-b', 'border-x', 'border-y', 'border'],
  ze = {}
ka.forEach((r) => {
  ;(ze[r] = { property: 'border-width', value: 1 }),
    _a.forEach((e) => {
      e !== 1 && (ze[`${r}-${e}`] = { property: 'border-width', value: e })
    })
})
var nt = ze
var ot = { 'content-none': { property: 'content', value: 'none' }, content: ['content'] }
var it = {
  block: { property: 'display', value: 'block' },
  inline: { property: 'display', value: 'inline' },
  'inline-block': { property: 'display', value: 'inline-block' },
  flex: { property: 'display', value: 'flex' },
  'inline-flex': { property: 'display', value: 'inline-flex' },
  grid: { property: 'display', value: 'grid' },
  'inline-grid': { property: 'display', value: 'inline-grid' },
  contents: { property: 'display', value: 'contents' },
  table: { property: 'display', value: 'table' },
  'table-caption': { property: 'display', value: 'table-caption' },
  'table-row': { property: 'display', value: 'table-row' },
  'table-cell': { property: 'display', value: 'table-cell' },
  'table-header-group': { property: 'display', value: 'table-header-group' },
  'table-footer-group': { property: 'display', value: 'table-footer-group' },
  'table-row-group': { property: 'display', value: 'table-row-group' },
  'table-column-group': { property: 'display', value: 'table-column-group' },
  'list-item': { property: 'display', value: 'list-item' },
  'flow-root': { property: 'display', value: 'flow-root' },
  'inline-table': { property: 'display', value: 'inline-table' },
  hidden: { property: 'display', value: 'none' },
}
var st = {
  'flex-1': { property: 'flex', value: '1 1 0%' },
  'flex-auto': { property: 'flex', value: '1 1 auto' },
  'flex-initial': { property: 'flex', value: '0 1 auto' },
  'flex-none': { property: 'flex', value: 'none' },
}
var lt = { basis: ['flex-basis'] }
var pt = {
  'flex-row': { property: 'flex-direction', value: 'row' },
  'flex-row-reverse': { property: 'flex-direction', value: 'row-reverse' },
  'flex-column': { property: 'flex-direction', value: 'column' },
  'flex-column-reverse': { property: 'flex-direction', value: 'column-reverse' },
}
var dt = { grow: { property: 'flex-grow', value: '1' }, 'grow-0': { property: 'flex-grow', value: '0' } }
var ct = { shrink: { property: 'flex-shrink', value: '1' }, 'shrink-0': { property: 'flex-shrink', value: '0' } }
var ut = {
  'flex-wrap': { property: 'flex-wrap', value: 'wrap' },
  'flex-nowrap': { property: 'flex-wrap', value: 'nowrap' },
  'flex-wrap-reverse': { property: 'flex-wrap', value: 'wrap-reverse' },
}
var ft = {
  'font-sans': {
    property: 'font-family',
    value:
      'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
  },
  'font-serif': { property: 'font-family', value: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;' },
  'font-mono': {
    property: 'font-family',
    value: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  },
}
var mt = {
  'text-xs': [
    { property: 'font-size', value: 12 },
    { property: 'line-height', value: 16 },
  ],
  'text-sm': [
    { property: 'font-size', value: 14 },
    { property: 'line-height', value: 20 },
  ],
  'text-base': [
    { property: 'font-size', value: 16 },
    { property: 'line-height', value: 24 },
  ],
  'text-lg': [
    { property: 'font-size', value: 18 },
    { property: 'line-height', value: 28 },
  ],
  'text-xl': [
    { property: 'font-size', value: 20 },
    { property: 'line-height', value: 28 },
  ],
  'text-2xl': [
    { property: 'font-size', value: 24 },
    { property: 'line-height', value: 32 },
  ],
  'text-3xl': [
    { property: 'font-size', value: 30 },
    { property: 'line-height', value: 36 },
  ],
  'text-4xl': [
    { property: 'font-size', value: 36 },
    { property: 'line-height', value: 40 },
  ],
  'text-5xl': [
    { property: 'font-size', value: 48 },
    { property: 'line-height', value: 48 },
  ],
  'text-6xl': [
    { property: 'font-size', value: 60 },
    { property: 'line-height', value: 60 },
  ],
  'text-7xl': [
    { property: 'font-size', value: 72 },
    { property: 'line-height', value: 72 },
  ],
  'text-8xl': [
    { property: 'font-size', value: 96 },
    { property: 'line-height', value: 96 },
  ],
  'text-9xl': [
    { property: 'font-size', value: 128 },
    { property: 'line-height', value: 128 },
  ],
}
var ht = {
  antialiased: [
    { property: '-webkit-font-smoothing', value: 'antialiased' },
    { property: '-moz-osx-font-smoothing', value: 'grayscale' },
  ],
  'subpixel-antialiased': [
    { property: '-webkit-font-smoothing', value: 'auto' },
    { property: '-moz-osx-font-smoothing', value: 'auto' },
  ],
}
var yt = {
  italic: { property: 'font-style', value: 'italic' },
  'not-italic': { property: 'font-style', value: 'normal' },
}
var vt = {
  'normal-nums': { property: 'font-variant-numeric', value: 'normal' },
  ordinal: { property: 'font-variant-numeric', value: 'ordinal' },
  'slashed-zero': { property: 'font-variant-numeric', value: 'slashed-zero' },
  'lining-nums': { property: 'font-variant-numeric', value: 'lining-nums' },
  'oldstyle-nums': { property: 'font-variant-numeric', value: 'oldstyle-nums' },
  'proportional-nums': { property: 'font-variant-numeric', value: 'proportional-nums' },
  'tabular-nums': { property: 'font-variant-numeric', value: 'tabular-nums' },
  'diagonal-fractions': { property: 'font-variant-numeric', value: 'diagonal-fractions' },
  'stacked-fractions': { property: 'font-variant-numeric', value: 'stacked-fractions' },
}
var gt = {
  'font-thin': { property: 'font-weight', value: 100 },
  'font-extralight': { property: 'font-weight', value: 200 },
  'font-light': { property: 'font-weight', value: 300 },
  'font-normal': { property: 'font-weight', value: 400 },
  'font-medium': { property: 'font-weight', value: 500 },
  'font-semibold': { property: 'font-weight', value: 600 },
  'font-bold': { property: 'font-weight', value: 700 },
  'font-extrabold': { property: 'font-weight', value: 800 },
  'font-black': { property: 'font-weight', value: 900 },
}
var xt = { 'gap-': ['gap'], 'gap-x-': ['column-gap'], 'gap-y-': ['row-gap'] }
var bt = {
  'auto-cols-auto': { property: 'grid-auto-columns', value: 'auto' },
  'auto-cols-min': { property: 'grid-auto-columns', value: 'min-content' },
  'auto-cols-max': { property: 'grid-auto-columns', value: 'max-content' },
  'auto-cols-fr': { property: 'grid-auto-columns', value: 'minmax(0, 1fr)' },
}
var wt = {
  'grid-flow-row': { property: 'grid-auto-flow', value: 'row' },
  'grid-flow-col': { property: 'grid-auto-flow', value: 'column' },
  'grid-flow-dense': { property: 'grid-auto-flow', value: 'dense' },
  'grid-flow-row-dense': { property: 'grid-auto-flow', value: 'row dense' },
  'grid-flow-col-dense': { property: 'grid-auto-flow', value: 'column dense' },
}
var _t = {
  'auto-rows-auto': { property: 'grid-auto-rows', value: 'auto' },
  'auto-rows-min': { property: 'grid-auto-rows', value: 'min-content' },
  'auto-rows-max': { property: 'grid-auto-rows', value: 'max-content' },
  'auto-rows-fr': { property: 'grid-auto-rows', value: 'minmax(0, 1fr)' },
}
var kt = {
  'col-auto': { property: 'grid-column', value: 'auto' },
  'col-span-1': { property: 'grid-column', value: 'span 1 / span 1' },
  'col-span-2': { property: 'grid-column', value: 'span 2 / span 2' },
  'col-span-3': { property: 'grid-column', value: 'span 3 / span 3' },
  'col-span-4': { property: 'grid-column', value: 'span 4 / span 4' },
  'col-span-5': { property: 'grid-column', value: 'span 5 / span 5' },
  'col-span-6': { property: 'grid-column', value: 'span 6 / span 6' },
  'col-span-7': { property: 'grid-column', value: 'span 7 / span 7' },
  'col-span-8': { property: 'grid-column', value: 'span 8 / span 8' },
  'col-span-9': { property: 'grid-column', value: 'span 9 / span 9' },
  'col-span-10': { property: 'grid-column', value: 'span 10 / span 10' },
  'col-span-11': { property: 'grid-column', value: 'span 11 / span 11' },
  'col-span-12': { property: 'grid-column', value: 'span 12 / span 12' },
  'col-span-full': { property: 'grid-column', value: '1 / -1' },
  'col-start-1': { property: 'grid-column-start', value: '1' },
  'col-start-2': { property: 'grid-column-start', value: '2' },
  'col-start-3': { property: 'grid-column-start', value: '3' },
  'col-start-4': { property: 'grid-column-start', value: '4' },
  'col-start-5': { property: 'grid-column-start', value: '5' },
  'col-start-6': { property: 'grid-column-start', value: '6' },
  'col-start-7': { property: 'grid-column-start', value: '7' },
  'col-start-8': { property: 'grid-column-start', value: '8' },
  'col-start-9': { property: 'grid-column-start', value: '9' },
  'col-start-10': { property: 'grid-column-start', value: '10' },
  'col-start-11': { property: 'grid-column-start', value: '11' },
  'col-start-12': { property: 'grid-column-start', value: '12' },
  'col-start-13': { property: 'grid-column-start', value: '13' },
  'col-start-auto': { property: 'grid-column-start', value: 'auto' },
  'col-end-1': { property: 'grid-column-end', value: '1' },
  'col-end-2': { property: 'grid-column-end', value: '2' },
  'col-end-3': { property: 'grid-column-end', value: '3' },
  'col-end-4': { property: 'grid-column-end', value: '4' },
  'col-end-5': { property: 'grid-column-end', value: '5' },
  'col-end-6': { property: 'grid-column-end', value: '6' },
  'col-end-7': { property: 'grid-column-end', value: '7' },
  'col-end-8': { property: 'grid-column-end', value: '8' },
  'col-end-9': { property: 'grid-column-end', value: '9' },
  'col-end-10': { property: 'grid-column-end', value: '10' },
  'col-end-11': { property: 'grid-column-end', value: '11' },
  'col-end-12': { property: 'grid-column-end', value: '12' },
  'col-end-13': { property: 'grid-column-end', value: '13' },
  'col-end-auto': { property: 'grid-column-end', value: 'auto' },
}
var Tt = {
  'row-auto': { property: 'grid-row', value: 'auto' },
  'row-span-1': { property: 'grid-row', value: 'span 1 / span 1' },
  'row-span-2': { property: 'grid-row', value: 'span 2 / span 2' },
  'row-span-3': { property: 'grid-row', value: 'span 3 / span 3' },
  'row-span-4': { property: 'grid-row', value: 'span 4 / span 4' },
  'row-span-5': { property: 'grid-row', value: 'span 5 / span 5' },
  'row-span-6': { property: 'grid-row', value: 'span 6 / span 6' },
  'row-span-7': { property: 'grid-row', value: 'span 7 / span 7' },
  'row-span-8': { property: 'grid-row', value: 'span 8 / span 8' },
  'row-span-9': { property: 'grid-row', value: 'span 9 / span 9' },
  'row-span-10': { property: 'grid-row', value: 'span 10 / span 10' },
  'row-span-11': { property: 'grid-row', value: 'span 11 / span 11' },
  'row-span-12': { property: 'grid-row', value: 'span 12 / span 12' },
  'row-span-full': { property: 'grid-row', value: '1 / -1' },
  'row-start-1': { property: 'grid-row-start', value: '1' },
  'row-start-2': { property: 'grid-row-start', value: '2' },
  'row-start-3': { property: 'grid-row-start', value: '3' },
  'row-start-4': { property: 'grid-row-start', value: '4' },
  'row-start-5': { property: 'grid-row-start', value: '5' },
  'row-start-6': { property: 'grid-row-start', value: '6' },
  'row-start-7': { property: 'grid-row-start', value: '7' },
  'row-start-8': { property: 'grid-row-start', value: '8' },
  'row-start-9': { property: 'grid-row-start', value: '9' },
  'row-start-10': { property: 'grid-row-start', value: '10' },
  'row-start-11': { property: 'grid-row-start', value: '11' },
  'row-start-12': { property: 'grid-row-start', value: '12' },
  'row-start-13': { property: 'grid-row-start', value: '13' },
  'row-start-auto': { property: 'grid-row-start', value: 'auto' },
  'row-end-1': { property: 'grid-row-end', value: '1' },
  'row-end-2': { property: 'grid-row-end', value: '2' },
  'row-end-3': { property: 'grid-row-end', value: '3' },
  'row-end-4': { property: 'grid-row-end', value: '4' },
  'row-end-5': { property: 'grid-row-end', value: '5' },
  'row-end-6': { property: 'grid-row-end', value: '6' },
  'row-end-7': { property: 'grid-row-end', value: '7' },
  'row-end-8': { property: 'grid-row-end', value: '8' },
  'row-end-9': { property: 'grid-row-end', value: '9' },
  'row-end-10': { property: 'grid-row-end', value: '10' },
  'row-end-11': { property: 'grid-row-end', value: '11' },
  'row-end-12': { property: 'grid-row-end', value: '12' },
  'row-end-13': { property: 'grid-row-end', value: '13' },
  'row-end-auto': { property: 'grid-row-end', value: 'auto' },
}
var St = {
  'grid-cols-1': { property: 'grid-template-columns', value: 'repeat(1, minmax(0, 1fr))' },
  'grid-cols-2': { property: 'grid-template-columns', value: 'repeat(2, minmax(0, 1fr))' },
  'grid-cols-3': { property: 'grid-template-columns', value: 'repeat(3, minmax(0, 1fr))' },
  'grid-cols-4': { property: 'grid-template-columns', value: 'repeat(4, minmax(0, 1fr))' },
  'grid-cols-5': { property: 'grid-template-columns', value: 'repeat(5, minmax(0, 1fr))' },
  'grid-cols-6': { property: 'grid-template-columns', value: 'repeat(6, minmax(0, 1fr))' },
  'grid-cols-7': { property: 'grid-template-columns', value: 'repeat(7, minmax(0, 1fr))' },
  'grid-cols-8': { property: 'grid-template-columns', value: 'repeat(8, minmax(0, 1fr))' },
  'grid-cols-9': { property: 'grid-template-columns', value: 'repeat(9, minmax(0, 1fr))' },
  'grid-cols-10': { property: 'grid-template-columns', value: 'repeat(10, minmax(0, 1fr))' },
  'grid-cols-11': { property: 'grid-template-columns', value: 'repeat(11, minmax(0, 1fr))' },
  'grid-cols-12': { property: 'grid-template-columns', value: 'repeat(12, minmax(0, 1fr))' },
  'grid-cols-none': { property: 'grid-template-columns', value: 'none' },
  'grid-cols-subgrid': { property: 'grid-template-columns', value: 'subgrid' },
}
var jt = {
  'grid-rows-1': { property: 'grid-template-rows', value: 'repeat(1, minmax(0, 1fr))' },
  'grid-rows-2': { property: 'grid-template-rows', value: 'repeat(2, minmax(0, 1fr))' },
  'grid-rows-3': { property: 'grid-template-rows', value: 'repeat(3, minmax(0, 1fr))' },
  'grid-rows-4': { property: 'grid-template-rows', value: 'repeat(4, minmax(0, 1fr))' },
  'grid-rows-5': { property: 'grid-template-rows', value: 'repeat(5, minmax(0, 1fr))' },
  'grid-rows-6': { property: 'grid-template-rows', value: 'repeat(6, minmax(0, 1fr))' },
  'grid-rows-7': { property: 'grid-template-rows', value: 'repeat(7, minmax(0, 1fr))' },
  'grid-rows-8': { property: 'grid-template-rows', value: 'repeat(8, minmax(0, 1fr))' },
  'grid-rows-9': { property: 'grid-template-rows', value: 'repeat(9, minmax(0, 1fr))' },
  'grid-rows-10': { property: 'grid-template-rows', value: 'repeat(10, minmax(0, 1fr))' },
  'grid-rows-11': { property: 'grid-template-rows', value: 'repeat(11, minmax(0, 1fr))' },
  'grid-rows-12': { property: 'grid-template-rows', value: 'repeat(12, minmax(0, 1fr))' },
  'grid-rows-none': { property: 'grid-template-rows', value: 'none' },
  'grid-rows-subgrid': { property: 'grid-template-rows', value: 'subgrid' },
}
var Ct = {
  'hyphens-none': { property: 'hyphens', value: 'none' },
  'hyphens-manual': { property: 'hyphens', value: 'manual' },
  'hyphens-auto': { property: 'hyphens', value: 'auto' },
}
var Et = {
  'justify-normal': { property: 'justify-content', value: 'normal' },
  'justify-start': { property: 'justify-content', value: 'flex-start' },
  'justify-end': { property: 'justify-content', value: 'flex-end' },
  'justify-center': { property: 'justify-content', value: 'center' },
  'justify-between': { property: 'justify-content', value: 'space-between' },
  'justify-around': { property: 'justify-content', value: 'space-around' },
  'justify-evenly': { property: 'justify-content', value: 'space-evenly' },
  'justify-stretch': { property: 'justify-content', value: 'stretch' },
}
var Nt = {
  'justify-items-start': { property: 'justify-items', value: 'flex-start' },
  'justify-items-end': { property: 'justify-items', value: 'flex-end' },
  'justify-items-center': { property: 'justify-items', value: 'center' },
  'justify-items-stretch': { property: 'justify-items', value: 'stretch' },
}
var Ot = {
  'justify-self-auto': { property: 'justify-self', value: 'auto' },
  'justify-self-start': { property: 'justify-self', value: 'flex-start' },
  'justify-self-end': { property: 'justify-self', value: 'flex-end' },
  'justify-self-center': { property: 'justify-self', value: 'center' },
  'justify-self-stretch': { property: 'justify-self', value: 'stretch' },
}
var Rt = {
  'tracking-tighter': { property: 'letter-spacing', value: '-0.05em' },
  'tracking-tight': { property: 'letter-spacing', value: '-0.025em' },
  'tracking-normal': { property: 'letter-spacing', value: '0' },
  'tracking-wide': { property: 'letter-spacing', value: '0.025em' },
  'tracking-wider': { property: 'letter-spacing', value: '0.05em' },
  'tracking-widest': { property: 'letter-spacing', value: '0.1em' },
}
var It = {
  'line-clamp-1': [
    { property: 'display', value: '-webkit-box' },
    { property: '-webkit-line-clamp', value: '1' },
    { property: '-webkit-box-orient', value: 'vertical' },
    { property: 'overflow', value: 'hidden' },
  ],
  'line-clamp-2': [
    { property: 'display', value: '-webkit-box' },
    { property: '-webkit-line-clamp', value: '2' },
    { property: '-webkit-box-orient', value: 'vertical' },
    { property: 'overflow', value: 'hidden' },
  ],
  'line-clamp-3': [
    { property: 'display', value: '-webkit-box' },
    { property: '-webkit-line-clamp', value: '3' },
    { property: '-webkit-box-orient', value: 'vertical' },
    { property: 'overflow', value: 'hidden' },
  ],
  'line-clamp-4': [
    { property: 'display', value: '-webkit-box' },
    { property: '-webkit-line-clamp', value: '4' },
    { property: '-webkit-box-orient', value: 'vertical' },
    { property: 'overflow', value: 'hidden' },
  ],
  'line-clamp-5': [
    { property: 'display', value: '-webkit-box' },
    { property: '-webkit-line-clamp', value: '5' },
    { property: '-webkit-box-orient', value: 'vertical' },
    { property: 'overflow', value: 'hidden' },
  ],
  'line-clamp-6': [
    { property: 'display', value: '-webkit-box' },
    { property: '-webkit-line-clamp', value: '6' },
    { property: '-webkit-box-orient', value: 'vertical' },
    { property: 'overflow', value: 'hidden' },
  ],
  'line-clamp-none': [
    { property: 'display', value: 'block' },
    { property: 'overflow', value: 'visible' },
    { property: '-webkit-line-clamp', value: 'none' },
    { property: '-webkit-box-orient', value: 'horizontal' },
  ],
}
var zt = {
  'leading-none': { property: 'line-height', value: 1 },
  'leading-3': { property: 'line-height', value: 12 },
  'leading-4': { property: 'line-height', value: 16 },
  'leading-5': { property: 'line-height', value: 20 },
  'leading-6': { property: 'line-height', value: 24 },
  'leading-7': { property: 'line-height', value: 28 },
  'leading-8': { property: 'line-height', value: 32 },
  'leading-9': { property: 'line-height', value: 36 },
  'leading-10': { property: 'line-height', value: 40 },
  'leading-tight': { property: 'line-height', value: 1.25 },
  'leading-snug': { property: 'line-height', value: 1.375 },
  'leading-normal': { property: 'line-height', value: 1.5 },
  'leading-relaxed': { property: 'line-height', value: 1.625 },
  'leading-loose': { property: 'line-height', value: 2 },
  leading: ['line-height'],
}
var At = { none: { property: 'list-style-image', value: 'none' } }
var Zt = {
  inside: { property: 'list-style-position', value: 'inside' },
  outside: { property: 'list-style-position', value: 'outside' },
}
var Mt = {
  'list-none': { property: 'list-style-type', value: 'none' },
  'list-disc': { property: 'list-style-type', value: 'disc' },
  'list-decimal': { property: 'list-style-type', value: 'decimal' },
}
var $t = {
  'mx-auto': [
    { property: 'margin-inline-start', value: 'auto' },
    { property: 'margin-inline-end', value: 'auto' },
  ],
  'm-': ['margin-inline-start', 'margin-inline-end', 'margin-block-start', 'margin-block-end'],
  'my-': ['margin-block-start', 'margin-block-end'],
  'mx-': ['margin-inline-start', 'margin-inline-end'],
  'ml-': ['margin-inline-start'],
  'mr-': ['margin-inline-end'],
  'mt-': ['margin-block-start'],
  'mb-': ['margin-block-end'],
}
var Pt = {
  'object-contain': { property: 'object-fit', value: 'contain' },
  'object-cover': { property: 'object-fit', value: 'cover' },
  'object-fill': { property: 'object-fit', value: 'fill' },
  'object-none': { property: 'object-fit', value: 'none' },
  'object-scale-down': { property: 'object-fit', value: 'scale-down' },
}
var Vt = {
  'order-1': { property: 'order', value: '1' },
  'order-2': { property: 'order', value: '2' },
  'order-3': { property: 'order', value: '3' },
  'order-4': { property: 'order', value: '4' },
  'order-5': { property: 'order', value: '5' },
  'order-6': { property: 'order', value: '6' },
  'order-7': { property: 'order', value: '7' },
  'order-8': { property: 'order', value: '8' },
  'order-9': { property: 'order', value: '9' },
  'order-10': { property: 'order', value: '10' },
  'order-11': { property: 'order', value: '11' },
  'order-12': { property: 'order', value: '12' },
  'order-first': { property: 'order', value: '-9999' },
  'order-last': { property: 'order', value: '9999' },
  'order-none': { property: 'order', value: '0' },
}
var Lt = {
  'overflow-auto': { property: 'overflow', value: 'auto' },
  'overflow-hidden': { property: 'overflow', value: 'hidden' },
  'overflow-visible': { property: 'overflow', value: 'visible' },
  'overflow-clip': { property: 'overflow', value: 'clip' },
  'overflow-scroll': { property: 'overflow', value: 'scroll' },
  'overflow-x-auto': { property: 'overflow-x', value: 'auto' },
  'overflow-y-auto': { property: 'overflow-y', value: 'auto' },
  'overflow-x-hidden': { property: 'overflow-x', value: 'hidden' },
  'overflow-y-hidden': { property: 'overflow-y', value: 'hidden' },
  'overflow-x-clip': { property: 'overflow-x', value: 'clip' },
  'overflow-y-clip': { property: 'overflow-y', value: 'clip' },
  'overflow-x-scroll': { property: 'overflow-x', value: 'scroll' },
  'overflow-y-scroll': { property: 'overflow-y', value: 'scroll' },
  'overflow-x-visible': { property: 'overflow-x', value: 'visible' },
  'overflow-y-visible': { property: 'overflow-y', value: 'visible' },
}
var Dt = {
  'p-': ['padding-inline-start', 'padding-inline-end', 'padding-block-start', 'padding-block-end'],
  'py-': ['padding-block-start', 'padding-block-end'],
  'px-': ['padding-inline-start', 'padding-inline-end'],
  'pl-': ['padding-inline-start'],
  'pr-': ['padding-inline-end'],
  'pt-': ['padding-block-start'],
  'pb-': ['padding-block-end'],
}
var Bt = {
  'place-content-center': { property: 'place-content', value: 'center' },
  'place-content-start': { property: 'place-content', value: 'flex-start' },
  'place-content-end': { property: 'place-content', value: 'flex-end' },
  'place-content-between': { property: 'place-content', value: 'space-between' },
  'place-content-around': { property: 'place-content', value: 'space-around' },
  'place-content-evenly': { property: 'place-content', value: 'space-evenly' },
  'place-content-baseline': { property: 'place-content', value: 'baseline' },
  'place-content-stretch': { property: 'place-content', value: 'stretch' },
}
var Ut = {
  'place-items-start': { property: 'place-items', value: 'start' },
  'place-items-end': { property: 'place-items', value: 'end' },
  'place-items-center': { property: 'place-items', value: 'center' },
  'place-items-baseline': { property: 'place-items', value: 'baseline' },
  'place-items-stretch': { property: 'place-items', value: 'stretch' },
}
var Wt = {
  'place-self-auto': { property: 'place-self', value: 'auto' },
  'place-self-start': { property: 'place-self', value: 'start' },
  'place-self-end': { property: 'place-self', value: 'end' },
  'place-self-center': { property: 'place-self', value: 'center' },
  'place-self-stretch': { property: 'place-self', value: 'stretch' },
}
var Ht = {
  relative: { property: 'position', value: 'relative' },
  absolute: { property: 'position', value: 'absolute' },
  fixed: { property: 'position', value: 'fixed' },
  sticky: { property: 'position', value: 'sticky' },
}
var qt = {
    'w-svw': { property: 'width', value: '100svw' },
    'w-lvw': { property: 'width', value: '100lvw' },
    'w-dvw': { property: 'width', value: '100dvw' },
    'w-min': { property: 'width', value: 'min-content' },
    'w-max': { property: 'width', value: 'max-content' },
    'w-': ['width'],
  },
  Gt = {
    'max-w-none': { property: 'max-width', value: 'none' },
    'max-w-xs': { property: 'max-width', value: '20rem' },
    'max-w-sm': { property: 'max-width', value: '24rem' },
    'max-w-md': { property: 'max-width', value: '28rem' },
    'max-w-lg': { property: 'max-width', value: '32rem' },
    'max-w-xl': { property: 'max-width', value: '36rem' },
    'max-w-2xl': { property: 'max-width', value: '42rem' },
    'max-w-3xl': { property: 'max-width', value: '48rem' },
    'max-w-4xl': { property: 'max-width', value: '56rem' },
    'max-w-5xl': { property: 'max-width', value: '64rem' },
    'max-w-6xl': { property: 'max-width', value: '72rem' },
    'max-w-7xl': { property: 'max-width', value: '80rem' },
    'max-w-full': { property: 'max-width', value: '100%' },
    'max-w-screen-sm': { property: 'max-width', value: '640px' },
    'max-w-screen-md': { property: 'max-width', value: '768px' },
    'max-w-screen-lg': { property: 'max-width', value: '1024px' },
    'max-w-screen-xl': { property: 'max-width', value: '1280px' },
    'max-w-screen-2xl': { property: 'max-width', value: '1536px' },
    'max-w-prose': { property: 'max-width', value: '65ch' },
    'max-w-fit': { property: 'max-width', value: 'fit-content' },
    'max-w-max': { property: 'max-width', value: 'max-content' },
    'max-w-min': { property: 'max-width', value: 'min-content' },
    'max-w': ['max-width'],
  },
  Yt = {
    'min-w-min': { property: 'min-width', value: 'min-content' },
    'min-w-max': { property: 'min-width', value: 'max-content' },
    'min-w-full': { property: 'min-width', value: '100%' },
    'min-w': ['min-width'],
  }
var Jt = {
    'min-h-svh': { property: 'min-height', value: '100svh' },
    'min-h-lvh': { property: 'min-height', value: '100lvh' },
    'min-h-dvh': { property: 'min-height', value: '100dvh' },
    'min-h-min': { property: 'min-height', value: 'min-content' },
    'min-h-max': { property: 'min-height', value: 'max-content' },
    'min-h-fit': { property: 'min-height', value: 'fit-content' },
    'min-h-full': { property: 'min-height', value: '100%' },
    'min-h': ['min-height'],
  },
  Ft = {
    'max-h-svh': { property: 'max-height', value: '100svh' },
    'max-h-lvh': { property: 'max-height', value: '100lvh' },
    'max-h-dvh': { property: 'max-height', value: '100dvh' },
    'max-h-min': { property: 'max-height', value: 'min-content' },
    'max-h-max': { property: 'max-height', value: 'max-content' },
    'max-h-fit': { property: 'max-height', value: 'fit-content' },
    'max-h': ['max-height'],
  },
  Xt = {
    'size-min': [
      { property: 'width', value: 'min-content' },
      { property: 'height', value: 'min-content' },
    ],
    'size-max': [
      { property: 'width', value: 'max-content' },
      { property: 'height', value: 'max-content' },
    ],
    'size-fit': [
      { property: 'width', value: 'fit-content' },
      { property: 'height', value: 'fit-content' },
    ],
    'size-': ['width', 'height'],
  }
var Qt = { 'space-x-': ['margin-inline-start'], 'space-y-': ['margin-block-start'] }
var Kt = {
  'text-left': { property: 'text-align', value: 'left' },
  'text-right': { property: 'text-align', value: 'right' },
  'text-center': { property: 'text-align', value: 'center' },
  'text-justify': { property: 'text-align', value: 'justify' },
  'text-start': { property: 'text-align', value: 'start' },
  'text-end': { property: 'text-align', value: 'end' },
}
var er = {
  underline: { property: 'text-decoration-line', value: 'underline' },
  'line-through': { property: 'text-decoration-line', value: 'line-through' },
  'no-underline': { property: 'text-decoration-line', value: 'none' },
  overline: { property: 'text-decoration-line', value: 'overline' },
}
var tr = {
  'decoration-solid': { property: 'text-decoration-style', value: 'solid' },
  'decoration-double': { property: 'text-decoration-style', value: 'line-through' },
  'decoration-dotted': { property: 'text-decoration-style', value: 'dotted' },
  'decoration-dashed': { property: 'text-decoration-style', value: 'dashed' },
  'decoration-wavy': { property: 'text-decoration-style', value: 'wavy' },
}
var rr = {
  'decoration-auto': { property: 'text-decoration-thickness', value: 'auto' },
  'decoration-from-font': { property: 'text-decoration-thickness', value: 'from-font' },
  'decoration-0': { property: 'text-decoration-thickness', value: 0 },
  'decoration-1': { property: 'text-decoration-thickness', value: 1 },
  'decoration-2': { property: 'text-decoration-thickness', value: 2 },
  'decoration-4': { property: 'text-decoration-thickness', value: 4 },
  'decoration-8': { property: 'text-decoration-thickness', value: 8 },
}
var ar = { indent: ['text-indent'] }
var nr = {
  truncate: [
    { property: 'text-overflow', value: 'ellipsis' },
    { property: 'white-space', value: 'nowrap' },
    { property: 'overflow', value: 'hidden' },
  ],
  'text-clip': { property: 'text-overflow', value: 'clip' },
  'text-ellipsis': { property: 'text-overflow', value: 'ellipsis' },
}
var or = {
  uppercase: { property: 'text-transform', value: 'uppercase' },
  lowercase: { property: 'text-transform', value: 'lowercase' },
  capitalize: { property: 'text-transform', value: 'capitalize' },
  'normal-case': { property: 'text-transform', value: 'none' },
}
var ir = {
  'underline-offset-auto': { property: 'text-underline-offset', value: 'auto' },
  'underline-offset-0': { property: 'text-underline-offset', value: 0 },
  'underline-offset-1': { property: 'text-underline-offset', value: 1 },
  'underline-offset-2': { property: 'text-underline-offset', value: 2 },
  'underline-offset-4': { property: 'text-underline-offset', value: 4 },
  'underline-offset-8': { property: 'text-underline-offset', value: 8 },
}
var sr = {
  'text-wrap': { property: 'text-wrap', value: 'wrap' },
  'text-balance': { property: 'text-wrap', value: 'balance' },
  'text-nowrap': { property: 'text-wrap', value: 'nowrap' },
  'text-pretty': { property: 'text-wrap', value: 'pretty' },
}
var lr = {
  'align-baseline': { property: 'vertical-align', value: 'baseline' },
  'align-top': { property: 'vertical-align', value: 'top' },
  'align-middle': { property: 'vertical-align', value: 'middle' },
  'align-bottom': { property: 'vertical-align', value: 'bottom' },
  'align-text-top': { property: 'vertical-align', value: 'text-top' },
  'align-text-bottom': { property: 'vertical-align', value: 'text-bottom' },
  'align-sub': { property: 'vertical-align', value: 'sub' },
  'align-super': { property: 'vertical-align', value: 'super' },
}
var pr = {
  'whitespace-normal': { property: 'white-space', value: 'normal' },
  'whitespace-nowrap': { property: 'white-space', value: 'nowrap' },
  'whitespace-pre': { property: 'white-space', value: 'pre' },
  'whitespace-pre-line': { property: 'white-space', value: 'pre-line' },
  'whitespace-pre-wrap': { property: 'white-space', value: 'pre-wrap' },
  'whitespace-break-spaces': { property: 'white-space', value: 'break-spaces' },
}
var dr = {
  'break-normal': [
    { property: 'word-break', value: 'normal' },
    { property: 'overflow-wrap', value: 'normal' },
  ],
  'break-words': { property: 'overflow-wrap', value: 'break-word' },
  'break-all': { property: 'word-break', value: 'break-all' },
  'break-keep': { property: 'word-break', value: 'keep-all' },
}
var cr = {
  'z-0': { property: 'z-index', value: 0 },
  'z-10': { property: 'z-index', value: 10 },
  'z-20': { property: 'z-index', value: 20 },
  'z-30': { property: 'z-index', value: 30 },
  'z-40': { property: 'z-index', value: 40 },
  'z-50': { property: 'z-index', value: 50 },
  'z-auto': { property: 'z-index', value: 'auto' },
}
var ee = {
  ...Qe,
  ...Ke,
  ...et,
  ...tt,
  ...rt,
  ...at,
  ...nt,
  ...ot,
  ...it,
  ...st,
  ...lt,
  ...pt,
  ...dt,
  ...ct,
  ...ut,
  ...ft,
  ...mt,
  ...ht,
  ...yt,
  ...vt,
  ...gt,
  ...xt,
  ...bt,
  ...wt,
  ..._t,
  ...kt,
  ...Tt,
  ...St,
  ...jt,
  ...Ct,
  ...Et,
  ...Nt,
  ...Ot,
  ...Rt,
  ...It,
  ...zt,
  ...At,
  ...Zt,
  ...Mt,
  ...$t,
  ...Pt,
  ...Vt,
  ...Lt,
  ...Dt,
  ...Bt,
  ...Ut,
  ...Wt,
  ...Ht,
  ...Qt,
  ...Kt,
  ...er,
  ...tr,
  ...rr,
  ...ar,
  ...nr,
  ...or,
  ...ir,
  ...sr,
  ...lr,
  ...pr,
  ...dr,
  ...cr,
  ...qt,
  ...Gt,
  ...Yt,
  ...Jt,
  ...Ft,
  ...Xt,
}
var ke = (r, e) => {
    if (Object.prototype.hasOwnProperty.call(ee, e)) {
      if (Array.isArray(ee[e]))
        return {
          ...r,
          ...Object.fromEntries(
            ee[e].map((t) => (typeof t == 'object' && 'property' in t && 'value' in t ? [t.property, t.value] : [])),
          ),
        }
      {
        let t = ee[e]
        return t && typeof t == 'object' && 'property' in t && 'value' in t ? { ...r, [t.property]: t.value } : r
      }
    } else {
      let t = e.split('-'),
        a = t[0],
        n = t.slice(1).join('-')
      if (Array.isArray(ee[`${a}-`])) {
        let o = { ...ee[`${a}-`]?.reduce((s, d) => ({ ...s, [d]: Xe(n) }), {}) }
        return { ...r, ...o }
      }
      return r
    }
  },
  Ae = (r) => {
    let e = r.split(' '),
      t = {}
    return (
      e.forEach((a) => {
        let n = a.split(':')
        if (n.length > 1) {
          let o = n.pop() || '',
            i = n[0] ?? '',
            s = n.slice(1)
          s.length > 0
            ? s.forEach((d) => {
                t[i] = { ...t[i], [`${d}`]: ke(t, d) }
              })
            : Object.prototype.hasOwnProperty.call(t, i)
              ? (t[i] = { ...ke(t, o || '') })
              : (t = { ...t, [`${i}`]: { ...ke(t[i] || {}, o || '') } })
        } else t = { ...ke(t, a) }
      }),
      t
    )
  }
var ur = (r) => {
  if (r.class) {
    let { class: e, ...t } = r
    return t
  } else return r
}
var fr = (r) => Sa(Ta(r))
var mr = (r) =>
  r?.split(';').reduce((e, t) => {
    let [a, n] = t.split(':')
    return a && n && (e[a.trim()] = n.trim()), e
  }, {}) || {}
var Ze = (r) => {
  let e = r.childNodes.some((a) => a.nodeType === 3 && !a.isWhitespace),
    t = {
      name: fr(r.rawTagName),
      elementType: r.rawTagName.toLowerCase(),
      styles: { ...mr(r.getAttribute('style')), ...Ae(r.getAttribute('class') || '') },
    }
  if (Object.keys(r.attributes).length) {
    let { class: a, style: n, ...o } = r.attributes
    Object.keys(o).length && (t.elementAttributes = ur(o))
  }
  return (
    e &&
      (t.textContent = r.childNodes
        .filter((a) => a.nodeType === 3)
        .map((a) => a.innerText.trim())
        .join(' ')),
    r.childNodes.length > 0 && !e && (t.children = []),
    r.childNodes.forEach((a) => {
      a instanceof ja && t.children?.push(Ze(a))
    }),
    t
  )
}
var Ea = (r) => {
  let e = Ca(r)
  if (e) {
    if (e.childNodes.length === 0) throw new Error('Empty HTML')
  } else throw new Error('Invalid HTML')
  if (!e.firstChild?.rawTagName) throw new Error('Invalid HTML')
  return Ze(e.firstChild)
}
export { wa as parseUISpec, Ae as tailwindToCSS, Ea as transformHTMLToSpec }
//# sourceMappingURL=index.js.map
