import { Scuttlebucket } from '@jacobbubu/scuttlebucket-pull'
import { Doc, Row } from '@jacobbubu/crdt-pull'
import { ScuttlebuttOptions, Scuttlebutt, link } from '@jacobbubu/scuttlebutt-pull'

export type Constructor = Record<string, typeof Scuttlebutt>
export interface ScuttleboatOptions extends ScuttlebuttOptions {
  constructors?: Constructor
}

export class Scuttleboat extends Scuttlebucket {
  private _opts: ScuttleboatOptions = {}
  private _constructors: Constructor
  private _manifest: Doc

  constructor(opts?: ScuttleboatOptions) {
    super(opts)
    this._opts = opts || {}
    this._constructors = this._opts.constructors || {}

    const manifest = (this._manifest = new Doc())

    this._add('__manifest__', manifest)
    manifest.on('create', this._create.bind(this))
  }

  private _add(name: string, butt: Scuttlebutt) {
    super.add(name, butt)
  }

  private _create(record: Row) {
    const data = record.state
    const ScuttlebuttType = this._constructors[data.type]
    if (ScuttlebuttType) {
      const subdoc = this._add(data.key, new ScuttlebuttType(data.opts))
      this.emit('create', data.key, subdoc)
    } else {
      throw new Error('UnknownTypeError - "' + data.type + '" was not a registered constructor')
    }
  }

  public addType(key: string, type: string, opts?: ScuttleboatOptions) {
    this._manifest.add({
      key: key,
      type: type,
      opts: opts
    })
    return this.get(key)
  }

  public list() {
    return this._manifest.rows
  }

  public clone() {
    const A = this
    const B = new (A.constructor as ObjectConstructor)(this._opts) as Scuttlebutt
    B.setId(A.id) // same id. think this will work...

    // forcedly access protected filed in base calss
    ;(A as any)._clones += 1

    const a = A.createStream({ wrapper: 'raw' })
    const b = B.createStream({ wrapper: 'raw' })
    link(a, b)
    a.on('synced', () => {
      a.end()
      ;(A as any)._clones -= 1
      A.emit('cloned', B, (A as any)._clones)
    })
    return B
  }
}
