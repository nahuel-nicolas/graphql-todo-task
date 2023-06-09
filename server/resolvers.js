const TaskModel = require('./models/Task')
const UserModel = require('./models/User')

class Resolver {
    async find(params) {
        console.log(['find', this.model.modelName, { params }])
        return await this.model.find(params)
    }

    async findById(id) {
        console.log(['findById', this.model.modelName, { id }])
        return await this.model.findById(id)
    }

    async findByIdAndRemove(id) {
        console.log(['findByIdAndRemove', this.model.modelName, { id }])
        return await this.model.findByIdAndRemove(id)
    }

    async create(params) {
        console.log(['create', this.model.modelName, { params }])
        const newElement = new this.model(params)
        return await newElement.save()
    }

    async findByIdAndUpdate(id, params) {
        console.log(['findByIdAndUpdate', this.model.modelName, {id, params}])
        return await this.model.findByIdAndUpdate(
            id,
            {
              $set: params,
            },
            { new: true }
        );
    }
}

class TaskResolverClass extends Resolver {
    model = TaskModel;

    async create(title, description, status, userId) {
        const currentISOString = (new Date()).toISOString();
        return await super.create({
            title,
            description,
            status,
            userId,
            created: currentISOString,
            updated: currentISOString
        })
    }

    async findByIdAndUpdate(id, params) {
        params.updated = (new Date()).toISOString();
        return await super.findByIdAndUpdate(id, params)
    }
}

class UserResolverClass extends Resolver {
    model = UserModel;

    async create(username, password) {
        return await super.create({ username, password })
    }

    async findByIdAndRemove(id) {
        await TaskModel.find({ userId: id }).then((tasks) => {
            tasks.forEach((task) => {
                task.userId = null;
                task.save()
            });
        });
        return await super.findByIdAndRemove(id)
    }
}

const taskResolver = new TaskResolverClass();
const userResolver = new UserResolverClass();

module.exports = ({
    userResolver,
    taskResolver
});