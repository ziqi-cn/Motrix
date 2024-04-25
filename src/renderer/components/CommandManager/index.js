import { EventEmitter } from 'node:events'

export default class CommandManager extends EventEmitter {
  constructor () {
    super()

    this.commands = {}
  }

  register (id, fn) {
    if (this.commands[id]) {
      console.log('[imFile] Attempting to register an already-registered command: ' + id)
      return null
    }
    if (!id || !fn) {
      console.error('[imFile] Attempting to register a command with a missing id, or command function.')
      return null
    }
    this.commands[id] = fn

    this.emit('commandRegistered', id)
  }

  unregister (id) {
    if (this.commands[id]) {
      delete this.commands[id]

      this.emit('commandUnregistered', id)
    }
  }

  execute (id, ...args) {
    const fn = this.commands[id]
    if (fn) {
      try {
        this.emit('beforeExecuteCommand', id)
      } catch (err) {
        console.error(err)
      }
      const result = fn(...args)
      return result
    } else {
      return false
    }
  }
}
