import { describe, it } from 'vitest';
const EasyGraphQLTester = require('easygraphql-tester')
const schema = require('./schema')


const tester = new EasyGraphQLTester(schema)

describe('Test Schema', () => {
  it('checks if test is properly setup with invalid query', () => {
    const invalidQuery = `{
      tasks {
        ids
      } 
    }`;
    tester.test(false, invalidQuery)
  })

  describe('test RootQuery', () => {
    it('GET tasks ids', () => {
      const query = `{
        tasks {
          id
        }
      }`;
      tester.test(true, query)
    })

    it('GET task(id)', () => {
      const query = `{
        task(id: "3") {
          id,
          title
        }
      }`;
      tester.test(true, query)
    })

    it('GET users ids', () => {
      const query = `{
        users {
          id
        }
      }`;
      tester.test(true, query)
    })

    it('GET task(id)', () => {
      const query = `{
        user(id: "3") {
          id,
          username
        }
      }`;
      tester.test(true, query)
    })
  })

  describe('test mutations', () => {
    it('addUser', () => {
      const mutation = `mutation {
        addUser(username: "nahuel", password: "12345") {
          id
        }
      }`;
      tester.test(true, mutation)
    })

    it('deleteUser', () => {
      const mutation = `mutation {
        deleteUser(id: "1") {
          id
        }
      }`;
      tester.test(true, mutation)
    })

    it('addTask', () => {
      const invalidStatusMutation = `mutation {
        addTask(title: "taskTitle", description: "taskDescripton", status: "In Progress", userId: "1") {
          id
        }
      }`;
      tester.test(false, invalidStatusMutation)

      const mutation = `mutation {
        addTask(title: "taskTitle", description: "taskDescripton", status: "progress", userId: "1") {
          id
        }
      }`;
      tester.test(false, mutation)
    })

    it('deleteTask', () => {
      const mutation = `mutation {
        deleteTask(id: "1") {
          id
        }
      }`;
      tester.test(true, mutation)
    })
  })
})