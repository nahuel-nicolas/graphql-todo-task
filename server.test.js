const express = require('express');
const request = require('supertest');
// const colors = require('colors');
const cors = require('cors');
// require('dotenv').config();
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema/schema');
// const connectDB = require('./db/db');
const { tasks, users } = require('./sampleData');
const Task = require('./models/Task')
// const User = require('./models/User')
import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';


const port = process.env.TEST_PORT || 3001;

const app = express();

// Connect to database
// connectDB();

app.use(cors());

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: process.env.NODE_ENV === 'development'
  })
);

const appProcess = app.listen(port, console.log(`Server running on port ${port}`));

class MockMongooseModel {
  constructor(mockData) {
    // mockData is array[object]
    this.mockData = structuredClone(mockData);
  }

  find(searchParams) {
    console.log('nba1')
    if (!(searchParams)) {
      return Promise.all(this.mockData);
    }
    const searchParamKey = Object.keys(searchParams)[0];
    const searchParamValue = searchParams[searchParamKey];
    return Promise.all([this.mockData.find(task => task[searchParamKey] === searchParamValue)])
  }

  findById(id) {
    return Promise.all(this.mockData.find(mockObject => mockObject.id === id))
  }

  findByIdAndRemove(id) {
    return Promise.all(this.mockData.filter(mockObject => mockObject.id !== id))
  }

  findByIdAndUpdate(id, setRawData, options) {
    const setData = setRawData.$set;
    for (let idx=0; idx<this.mockData.lenght; idx++) {
      const mockObject = this.mockData[idx];
      if (mockObject.id === id) {
        for (const currentKey in setData) {
          mockObject[currentKey] = setData[currentKey];
          mockObject.updated = (new Date()).toISOString();
        }
        return Promise.all(mockObject) 
      }
    }
  }

  create(object) {
    this.mockData.push(object)
  }
}

const mockTask = new MockMongooseModel(tasks);
const mockUser = new MockMongooseModel(users);

function createTask(title, description, status, userId) {
  const newTask = {
    title,
    description,
    status,
    userId,
    created: (new Date()).toISOString(),
    updated: (new Date()).toISOString(),
  }
  mockTask.create(newTask)
}

// vi.mock("./models/Task", async (importOriginal) => {
//   const reactRouterDom = await importOriginal()
//   const find = vi.fn(searchParam => {return mockTask.find(searchParam)})
//   const findById = vi.fn(id => {return mockTask.findById(id)})
//   const findByIdAndRemove = vi.fn(id => {return mockTask.findByIdAndRemove(id)})
//   const findByIdAndUpdate = vi.fn(
//     (id, setRawData, options) => {return mockTask.findByIdAndUpdate(id, setRawData, options)}
//   )
//   return {
//       ...reactRouterDom,
//       find,
//       findById,
//       findByIdAndRemove,
//       findByIdAndUpdate
//   }
// })

// vi.mock("./models/Task", () => {
//   const find = vi.fn(searchParam => {return mockTask.find(searchParam)})
//   const findById = vi.fn(id => {return mockTask.findById(id)})
//   const findByIdAndRemove = vi.fn(id => {return mockTask.findByIdAndRemove(id)})
//   const findByIdAndUpdate = vi.fn(
//     (id, setRawData, options) => {return mockTask.findByIdAndUpdate(id, setRawData, options)}
//   )
//   return {
//     find,
//     findById,
//     findByIdAndRemove,
//     findByIdAndUpdate
//   } 
// })

// const a = mockTask.find(null);

vi.spyOn(Task, 'find').mockReturnValue(mockTask.find(null))
// vi.spyOn(Task, 'constructor').mockReturnValue(createTask)

// vi.mock("./models/Task", () => ({default: vi.fn(() => new MockMongooseModel(tasks))}))

vi.mock("./models/User", () => ({default: new MockMongooseModel(users)}))

describe('Test Server API', () => {
  afterAll(() => {
    vi.restoreAllMocks()
    appProcess.close()
  })

  it('appProcess should not be null', () => {
    expect(appProcess).toBeTruthy()
  })

  it('should return tasks', async () => {
    // const Task = require('./models/Task')
    const taskos = await Task.find().then(tasks => tasks)
    expect(Task.find).toBeCalledTimes(1)
    console.log(taskos)
    expect(Array.isArray(taskos)).toBeTruthy()
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

