import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
const express = require('express');
const request = require('supertest');
const cors = require('cors');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema');
const connectDB = require('./utils/testing/db');
// const { removeAllDocuments, checkThereAreNoDocs } = require('./utils/testing/utils')


connectDB();
const port = process.env.TEST_PORT || 3405;

const app = express();
app.use(cors());
app.use(
  '/graphql',
  graphqlHTTP({
    schema
  })
);

const appProcess = app.listen(port, console.log(`Server running on port ${port}`));

describe('Implementation Test Server API', () => {
  let savedUser;
  let savedTask;

  beforeAll(() => {
    // removeAllDocuments()
  })

  afterAll(() => {
    // removeAllDocuments()
    appProcess.close()
  })

  it('should add user', async () => {
    const query = `mutation {
      addUser(username: "nahuel", password: "12345") {
        id,
        username,
        password
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
    expect(response.body).toHaveProperty('data')
    expect(response.body.data).toHaveProperty('addUser')
    expect(response.body.data.addUser).toHaveProperty('id')
    savedUser = response.body.data.addUser
    expect(savedUser.id).toBeTruthy()
  })

  it('should find user by id', async () => {
    const query = `{
      user(id: "${savedUser.id}") {
        id,
        username,
        password
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
    expect(response.body).toHaveProperty('data')
    expect(response.body.data).toHaveProperty('user')
    expect(response.body.data.user).toEqual(savedUser)
  })

  it('should add task', async () => {
    const query = `mutation {
      addTask(title: "testTaskTitle", description: "testTaskDescription", status: progress, userId: "${savedUser.id}") {
        id,
        title,
        description,
        status,
        user {
          id,
          username,
          password
        }
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
    expect(response.body).toHaveProperty('data')
    expect(response.body.data).toHaveProperty('addTask')
    expect(response.body.data.addTask).toHaveProperty('id')
    savedTask = response.body.data.addTask
    expect(savedTask.id).toBeTruthy()
  })

  it('should add task with null userId', async () => {
    const query = `mutation {
      addTask(title: "testNoUserTask", description: "testNoUserTaskDescription", status: progress, userId: null) {
        id,
        title,
        description,
        status,
        user {
          id
        }
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
    // console.log(response)
    expect(response).toHaveProperty('body')
    expect(response.body).toBeTruthy()
    expect(response.body).toHaveProperty('data')
    expect(response.body.data).toHaveProperty('addTask')
    expect(response.body.data.addTask).toHaveProperty('id')
    const currentTask = response.body.data.addTask
    expect(currentTask.id).toBeTruthy()
    expect(currentTask.user).toBeNull()
    // console.log(currentTask)
  })

  it('should find task by id', async () => {
    const query = `{
      task(id: "${savedTask.id}") {
        id,
        title,
        description,
        status,
        user {
          id,
          username,
          password
        }
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
    expect(response.body).toHaveProperty('data')
    expect(response.body.data).toHaveProperty('task')
    expect(response.body.data.task).toEqual(savedTask)
  })

  it('should delete user', async () => {
    const query = `mutation {
      deleteUser(id: "${savedUser.id}") {
        id,
        username,
        password
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
    expect(response.body).toHaveProperty('data')
    expect(response.body.data).toHaveProperty('deleteUser')
    expect(response.body.data.deleteUser).toHaveProperty('id')
    savedUser = response.body.data.deleteUser
    expect(savedUser.id).toBeTruthy()
  })

  it('find task and checks task.user is null', async () => {
    const query = `{
      task(id: "${savedTask.id}") {
        id,
        title,
        description,
        status,
        user {
          id,
          username,
          password
        }
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
    expect(response.body).toHaveProperty('data')
    expect(response.body.data).toHaveProperty('task')
    expect(response.body.data.task.user).toBeNull()
  })
})