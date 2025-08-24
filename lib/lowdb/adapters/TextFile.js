const fs = require('fs');
const path = require('path');

class TextFile {
  constructor(filename) {
    this.filename = filename;
    this.queue = Promise.resolve(); // antrian tulis, satu-satu
  }

  async read() {
    try {
      const data = await fs.promises.readFile(this.filename, 'utf-8');
      return data;
    } catch (e) {
      if (e.code === 'ENOENT') {
        return null;
      }
      throw e;
    }
  }

  write(str) {
    // Tambahkan ke queue, tulis satu per satu
    this.queue = this.queue.then(() => fs.promises.writeFile(this.filename, str));
    return this.queue;
  }
}

module.exports = { TextFile };