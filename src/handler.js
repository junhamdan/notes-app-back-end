const { nanoid } = require('nanoid');
const notes = require('./notes');

const addNoteHandler = (request, h) => {
    const { title, tags, body } = JSON.parse(request.payload);

    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const newNote = {
        id,
        title,
        createdAt,
        updatedAt,
        tags,
        body,
    };
    notes.push(newNote);

    const isSuccess = notes.filter((note) => note.id === id).length > 0;
    if (isSuccess) {
        const resp = h.response({
            status: 'success',
            message: 'Catatan berhasil ditambahkan',
            data: {
                noteId: id,
            },
        });
        resp.code(201);
        return resp;
    }

    const resp = h.response({
        status: 'fail',
        message: 'Catatan gagal ditambahkan',
    });
    resp.code(500);
    return resp;
};

const getAllNotesHandler = () => ({
    status: 'success',
    data: {
        notes,
    },
});

const getNoteByIdHandler = (request, h) => {
    const { id } = request.params;

    const note = notes.filter((n) => n.id === id)[0];

    if (note !== undefined) {
        return {
            status: 'success',
            data: {
                note,
            },
        };
    }
    const resp = h.response({
        status: 'fail',
        message: 'Catatan tidak ditemukan',
    });
    resp.code(404);
    return resp;
};

const editNoteByIdHandler = (request, h) => {
    const { id } = request.params;
    const { title, tags, body } = JSON.parse(request.payload);
    const updatedAt = new Date().toISOString();

    const index = notes.findIndex((note) => note.id === id);
    if (index !== -1) {
        notes[index] = {
            ...notes[index],
            title,
            tags,
            body,
            updatedAt,
        };
        const resp = h.response({
            status: 'success',
            message: 'Catatan berhasil diperbarui',
        });
        resp.code(200);
        return resp;
    }
    const resp = h.response({
        status: 'fail',
        message: 'Gagal memperbarui catatan. Id tidak ditemukan',
    });
    resp.code(404);
    return resp;
};

const deleteNoteByIdHandler = (request, h) => {
    const { id } = request.params;
    const index = notes.findIndex((note) => note.id === id);

    if (index !== -1) {
        notes.splice(index, 1);
        const resp = h.response({
            status: 'success',
            message: 'Catatan berhasil dihapus',
        });
        resp.code(200);
        return resp;
    }
    const resp = h.response({
        status: 'fail',
        message: 'Catatan gagal dihapus. Id tidak ditemukan.',
    });
    resp.code(404);
    return resp;
};

module.exports = {
    addNoteHandler,
    getAllNotesHandler,
    getNoteByIdHandler,
    editNoteByIdHandler,
    deleteNoteByIdHandler,
};
