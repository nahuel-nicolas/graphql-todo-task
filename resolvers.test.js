import { describe, it, expect, beforeAll, afterAll } from 'vitest';

const Task = require('./models/Task')
const User = require('./models/User')
const { taskResolver, userResolver } = require('./resolvers')
const connectDB = require('./utils/testing/db')
const { tasks, users } = require('./utils/testing/sampleData')


connectDB();
const models = [User, Task]
const sampleTasks = structuredClone(tasks);
const sampleUsers = structuredClone(users);

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

describe('test models with test database', () => {
    let sampleUser;
    let savedUser;

    let sampleTask;
    let savedTask;

    beforeAll(async () => {
        await removeAllDocuments()
    })

    afterAll(async () => {
        await removeAllDocuments()
    })

    it('checks there are no saved documents', async () => {
        await checkThereAreNoDocs()
    })

    it('should store user', async () => {
        sampleUser = sampleUsers.pop()
        savedUser = await userResolver.create(sampleUser.username, sampleUser.password)
    })

    it('should find saved user', async () => {
        savedUser = await User.findById(savedUser.id)
        expect(savedUser).toBeTruthy()
        expect(savedUser.username).toEqual(sampleUser.username)
        expect(savedUser.username === sampleUser.password).toBeFalsy()

    })  

    it('should store task', async () => {
        sampleTask = sampleTasks.pop()
        sampleTask.userId = savedUser.id
        savedTask = await taskResolver.create(
            sampleTask.title,
            sampleTask.description,
            sampleTask.status,
            sampleTask.userId,
        )
    })

    it('should find saved task', async () => {
        savedTask = await Task.findById(savedTask.id)
        expect(savedTask).toBeTruthy()
        expect(savedTask.title).toEqual(sampleTask.title)
    })
    
    it('should be able to set foreing key to null', async () => {
        expect(savedTask.userId).toBeTruthy()
        savedTask.userId = null
        await savedTask.save()
        savedTask = await taskResolver.findById(savedTask.id)
        expect(savedTask.userId).toBeNull()
    })
})