const express = require('express');
const request = require('supertest');
const cors = require('cors');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema');
// const connectDB = require('./db/db');
// connectDB();
const { tasks, users } = require('./sampleData');
// const Task = require('./models/Task')
const { taskResolver, userResolver } = require('./resolvers')
const { mockTaskResolver, mockUserResolver } = require('./utils/testing/resolvers')
// const User = require('./models/User')
import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';


const port = process.env.TEST_PORT || 3001;

const app = express();

app.use(cors());

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: process.env.NODE_ENV === 'development'
  })
);

const appProcess = app.listen(port, console.log(`Server running on port ${port}`));

function setupResolverMocks() {
  vi.spyOn(taskResolver, 'find').mockImplementation(params => mockTaskResolver.find(params))
  vi.spyOn(taskResolver, 'findById').mockImplementation(id => mockTaskResolver.findById(id))
  vi.spyOn(taskResolver, 'findByIdAndRemove').mockImplementation(id => mockTaskResolver.findByIdAndRemove(id))
  vi.spyOn(taskResolver, 'findByIdAndUpdate').mockImplementation(id => mockTaskResolver.findByIdAndUpdate(id))
  vi.spyOn(taskResolver, 'create').mockImplementation(
    (title, description, status, userId) => mockTaskResolver.create(title, description, status, userId)
  )

  vi.spyOn(userResolver, 'find').mockImplementation(params => mockUserResolver.find(params))
  vi.spyOn(userResolver, 'findById').mockImplementation(id => mockUserResolver.findById(id))
  vi.spyOn(userResolver, 'findByIdAndRemove').mockImplementation(id => mockUserResolver.findByIdAndRemove(id))
  vi.spyOn(userResolver, 'findByIdAndUpdate').mockImplementation(id => mockUserResolver.findByIdAndUpdate(id))
  vi.spyOn(userResolver, 'create').mockImplementation(
    (username, password) => mockUserResolver.create(username, password)
  )
}

describe('Test Server API', () => {
  beforeAll(() => {
    setupResolverMocks();
  })

  afterAll(() => {
    vi.restoreAllMocks()
    appProcess.close()
  })

  describe('check if test is correctly setup', () => {
    it('appProcess should not be null', () => {
      expect(appProcess).toBeTruthy()
    })
  
    it('should make mockTaskResolver return tasks', async () => {
      const taskos = await taskResolver.find().then(tasks => tasks)
      expect(taskResolver.find).toBeCalledTimes(1)
      expect(Array.isArray(taskos)).toBeTruthy()
    })
  
    it('shouldCreate new task with mockTaskResolver', () => {
      const initTasksLength = mockTaskResolver.mockData.length
      console.log(mockTaskResolver.mockData.length)
      taskResolver.create(
        'testMockTask', 
        'testMockTaskDescription',
        'In Progress',
        null
      )
      expect(initTasksLength).toBeLessThan(mockTaskResolver.mockData.length)
    })
  })

  it('should listen to http request', async () => {
    const query = `{
      tasks {
        id
      }
    }`;
    const response = await request(app)
      .post('/graphql')
      .send({query})
      .set('Accept', 'application/json')
      .expect(200)
      .then(res => res)
      .catch(err => {
        console.log(err)
        return err
      })
    expect(typeof response === 'object').toBeTruthy()
    expect(response).toHaveProperty('body')
    expect(response.body).toBeTruthy()
    console.log(response.body)
    expect(response.body).toHaveProperty('data')
    expect(response.body.data).toHaveProperty('tasks')
    expect(Array.isArray(response.body.data.tasks)).toBeTruthy()
  })
})