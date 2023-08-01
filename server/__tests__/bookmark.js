const app = require('../user/app')
const request = require("supertest");
const { User } = require('../user/models');
const { SignToken } = require('../user/helpers/jwt');
const { sequelize } = require("../user/models");
const { queryInterface } = sequelize;

let validToken;
const tester = {
    username: "tester",
    email: "tester@mail.com",
    password: "test123"
}

beforeAll((done) => {
    User.create(tester)
        .then(res => {
            console.log(res)
            validToken = SignToken({ id: res.id })
            done();
        })
        .catch(e => {
            done(e)
        })
});

afterAll((done) => {
    queryInterface
        .bulkDelete("Users", null, { restartIdentity: true, truncate: true, cascade: true })
        .then(() => {
            done();
        })
        .catch((err) => {
            done(err);
        });
});

describe('POST /fetchjobskalibrr', () => {
    test.only('200 Success Fetch should return array of object', (done) => {
        request(app)
            .post('/fetchjobskalibrr')
            .send({query: "frontend"})
            .set('access_token', validToken)
            .then(res => {
                const { body, status } = res
                console.log(body)
                expect(status).toBe(200)
                expect(body).toEqual(expect.any(Array))
                done();
            })
            .catch(e => {
                done(e)
            })
    },10000)
})