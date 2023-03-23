const TaskModel = require('./models/Task')
const UserModel = require('./models/User')

class Resolver {
    find(params) {
        return this.model.find(params)
    }

    findById(id) {
        return this.model.findById(id)
    }

    findByIdAndRemove(id) {
        return this.model.findByIdAndRemove(id)
    }

    create(params) {
        const newElement = new this.model(params)
        return newElement.save()
    }

    findByIdAndUpdate(id, params) {
        return this.model.findByIdAndUpdate(
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

class UserResolverClass extends Resolver {
    model = UserModel;

    create(username, password) {
        return super.create({ username, password })
    }

    findByIdAndRemove(id) {
        Task.find({ userId: id }).then((tasks) => {
            tasks.forEach((task) => {
                task.userId = null;
                task.save()
            });
        });
        return super.findByIdAndRemove(id)
    }
}

const taskResolver = new TaskResolverClass();
const userResolver = new UserResolverClass();

module.exports = ({
    userResolver,
    taskResolver
});