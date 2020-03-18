import { Model, link } from '@jacobbubu/scuttlebutt-pull'
import { Row } from '@jacobbubu/crdt-pull'
import { Scuttleboat } from '../src/'
import { delay } from './utils'

describe('Scuttleboat', () => {
  const getOpts = () => {
    return {
      constructors: {
        Model: Model
      }
    }
  }

  it('basic', async () => {
    const opts = getOpts()
    const A = new Scuttleboat(opts)
    const B = new Scuttleboat(opts)

    const as = A.createStream()
    const bs = B.createStream()

    link(as, bs)

    const aMeta = A.addType('meta', 'Model') as Model
    aMeta.set('a', 9)

    // Subdocuments are created and synced
    await delay(10)

    const bMeta = B.get('meta') as Model
    expect(bMeta.get('a')).toBe(9)
  })

  it('unknown constructor', async () => {
    const A = new Scuttleboat()

    expect(() => {
      const aMeta = A.addType('meta', 'Wrong') as Model
    }).toThrow(/UnknownTypeError*/)
  })

  it('list', async () => {
    const opts = getOpts()

    const A = new Scuttleboat(opts)
    const aMeta = A.addType('meta', 'Model') as Model
    const aConfig = A.addType('config', 'Model') as Model

    const list = A.list()
    expect(Object.values(list).length).toBe(2)
    expect(Object.values(list)[0]).toBeInstanceOf(Row)
    expect(Object.values(list)[1]).toBeInstanceOf(Row)
  })

  it('clone', done => {
    const opts = getOpts()
    const A = new Scuttleboat(opts)
    const aMeta = A.addType('meta', 'Model') as Model
    aMeta.set('a', 9)

    A.on('unclone', async (B, clones) => {
      expect(clones).toBe(0)
      const bMeta = B.get('meta') as Model
      expect(bMeta.get('a')).toBe(9)
      bMeta.set('a', 10)
      expect(aMeta.get('a')).toBe(9)
      done()
    })
    A.clone()
  })
})
