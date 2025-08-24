const fs = require('fs');
const path = './database/set_left.json';

// ✅ Simpan perubahan dengan aman ke file
function saveDB(_db) {
    fs.writeFileSync(path, JSON.stringify(_db, null, 3));
}

// ✅ Cek apakah grup sudah punya teks left
const isSetLeft = (groupID, _db) => _db.some(entry => entry.id === groupID);

// ✅ Ubah teks left grup
const changeSetLeft = (text, groupID, _db) => {
    const index = _db.findIndex(entry => entry.id === groupID);
    if (index !== -1) {
        _db[index].text = text;
        saveDB(_db);
    }
};

// ✅ Tambahkan teks left baru
const addSetLeft = (text, groupID, _db) => {
    _db.push({ id: groupID, text });
    saveDB(_db);
};

// ✅ Hapus set left dari grup
const removeSetLeft = (groupID, _db) => {
    const index = _db.findIndex(entry => entry.id === groupID);
    if (index !== -1) {
        _db.splice(index, 1);
        saveDB(_db);
    }
};

// ✅ Ambil teks left dari grup
const getTextSetLeft = (groupID, _db) => {
    const data = _db.find(entry => entry.id === groupID);
    return data ? data.text : null;
};

module.exports = {
    isSetLeft,
    addSetLeft,
    removeSetLeft,
    changeSetLeft,
    getTextSetLeft
};