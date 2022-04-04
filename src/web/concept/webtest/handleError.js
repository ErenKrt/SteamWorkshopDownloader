
module.exports.catchErrors = (fn) => {
    return function (request, response, next) {
      return fn(request, response, next).catch((e) => {
          console.log("ERRORR");
        if (e.response) {
          e.status = e.response.status
        }
        next(e)
      })
    }
  }
  