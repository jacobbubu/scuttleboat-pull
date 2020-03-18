import { Scuttleboat } from '../src'
import { Model, link } from '@jacobbubu/scuttlebutt-pull'
import { delay } from './utils'

const main = async () => {
  // Define sub-document constructors
  const opts = {
    constructors: {
      Model: Model
    }
  }

  // Setup Scuttleboats
  const A = new Scuttleboat(opts)
  const B = new Scuttleboat(opts)

  const as = A.createStream()
  const bs = B.createStream()

  link(as, bs)

  A.on('create', function(key) {
    console.log('A saw new sub-doc:', key)
  })
  B.on('create', function(key) {
    console.log('B saw new sub-doc:', key)
  })

  // Dynamically add sub-documents

  const aMeta = A.addType('meta', 'Model') as Model
  aMeta.set('a', 9)

  // Subdocuments are created and synced
  await delay(10)

  console.log((B.get('meta') as Model).get('a')) // => 9
}

// tslint:disable-next-line no-floating-promises
main()
