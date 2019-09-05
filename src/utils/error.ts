/**
 * Abstract custom error, as parent class for all known errors.
 */
class TpError extends Error {
  public origin: Error

  constructor(message) {
    if (message instanceof Error) {
      super(message.message)
      this.origin = message
    } else {
      super(message)
    }
  }
}

export const ERRORS = {
  SystemError: ['SYSTEM_ERROR'],
  NotFoundError: ['404_ERROR']
}

/**
 * @private
 * @param {String} errName subclass name of error
 * @param {String} errorCode, error code for end-user,
 */
function createError(errName: string) {
  const errorCode = ERRORS[errName][0]

  class NewError extends TpError {
    public errName: string
    public signal?: string
    public errorCode: string

    constructor(message, signal?: string) {
      super(message)
      this.signal = signal
      this.errName = errName
      this.errorCode = errorCode
    }
  }

  return NewError
}

const attributeHandler = {
  get(_: any, errName: string) {
    if (!ERRORS[errName]) {
      return Error
    }
    return createError(errName)
  }
}

function target() {}
export default new Proxy(target, attributeHandler)
