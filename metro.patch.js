const os = require('os')
module.exports = {
  getMaxWorkers: () => Math.max(1, Math.ceil(os.cpus().length / 2)),
}
