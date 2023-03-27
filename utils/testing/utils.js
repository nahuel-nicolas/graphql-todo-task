import { expect } from 'vitest';

import { Task, User } from '../../models'


const models = [User, Task]

async function removeAllDocuments() {
    for (const model of models) {
        await model.deleteMany({})
    }
}

async function checkThereAreNoDocs() {
    for (const model of models) {
        await model.find().then(docs => {
            expect(Array.isArray(docs)).toBeTruthy()
            expect(docs.length).toEqual(0)
        })
    }
}

module.exports = {
    removeAllDocuments,
    checkThereAreNoDocs
}