const { tasks, users } = require('./sampleSavedData')

class MockResolver {
    find(searchParams) {
      if (!(searchParams)) {
        return Promise.all(this.mockData);
      }
      const searchParamKey = Object.keys(searchParams)[0];
      const searchParamValue = searchParams[searchParamKey];
      return Promise.all([this.mockData.find(task => task[searchParamKey] === searchParamValue)])
    }
  
    async findById(id) {
      return await Promise.all([this.mockData.find(mockObject => mockObject.id === id)])
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
  
  class MockTaskResolver extends MockResolver {
    mockData = structuredClone(tasks);
  
    create(title, description, status, userId) {
      const currentISOString = (new Date()).toISOString();
      return super.create({
          title,
          description,
          status,
          userId,
          created: currentISOString,
          updated: currentISOString
      })
    }
  
    findByIdAndUpdate(id, params) {
        params.updated = (new Date()).toISOString();
        return super.findByIdAndUpdate(id, params)
    }
  }
  
  const mockTaskResolver = new MockTaskResolver();
  class MockUserResolver extends MockResolver {
    mockData = structuredClone(users);
  
    create(user, password) {
      return super.create({
          user, password
      })
    }
  
    findByIdAndRemove(id) {
      mockTaskResolver.find({ userId: id }).then((tasks) => {
          tasks.forEach((task) => {
              task.userId = null;
          });
      });
      return super.findByIdAndRemove(id)
    }
  }
  
  const mockUserResolver = new MockUserResolver();


  module.exports = {
    mockTaskResolver, mockUserResolver
  }