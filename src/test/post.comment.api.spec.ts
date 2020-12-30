import chai from 'chai';
import chaiHttp from 'chai-http';

import config from '../../config';
import { Comment } from '../database/models/Comment';
import { Post } from '../database/models/Post';

chai.use(chaiHttp);

const serverAddress = config.replace;
const should = chai.should();
const expect = chai.expect;
const testToken = config.testToken;
const testToken2 = config.testToken2;

const postFormData = {
    id: 'test',
    title: 'test title',
    contents: 'test contents',
    category: 'test category',
    thumbnailAddress :'',
    series: 'test series',
    writer: 'test',
  } as any;

const commentData = {
    idx: -1,
    member_id: 'test',
    post_id: 'test',
    comment_txt: 'test',
    create_date: '2020-12-01',
} as any;

describe('PostCommentService', async () => {
    before(() => {
        Post.save({
            ...postFormData,
        });
    });

    after(() => {
        Comment.delete({
            post_id: 'test',
            member_id: 'test',
        });

        Post.delete({
            writer: 'test',
        });
    });

    context('Write Post Comment', () => {

        it('should return 200 status code', (done) => {
            const body = {
                postId: 'test',
                commentTxt: 'test',
            };

            setTimeout(() => {
                chai.request(serverAddress)
                .post('/api/post/comment')
                .set('token', testToken)
                .send(body)
                .end((err, res) => {
                    expect(res, err).to.have.status(200);
                    done();
                });
            }, 1000);
        });


        it('should return 400 status code', (done) => {

            chai.request(serverAddress)
            .post('/api/post/comment')
            .set('token', testToken)
            .end((err, res) => {
                expect(res, err).to.have.status(400);
                done();
            });
        });

        it('should return 404 status code', (done) => {
            const body = {
                postId: 'test not found',
                commentTxt: 'test',
            };


            chai.request(serverAddress)
            .post('/api/post/comment')
            .set('token', testToken)
            .send(body)
            .end((err, res) => {
                expect(res, err).to.have.status(404);
                done();
            });
        });
    });

    context('Update Post Comment', () => {
        beforeEach(() => {
            Comment.save({
                ...commentData,
            });
        });

        it('should return 200 status code', (done) => {
            const body = {
                commentTxt: 'txt update',
                commentIdx: -1,
            };

            setTimeout(() => {
                chai.request(serverAddress)
                .put('/api/post/comment')
                .set('token', testToken)
                .send(body)
                .end((err, res) => {
                    expect(res, err).to.have.status(200);
                    done();
                });
            }, 1000);
        });

        it('should return 400 status code', (done) => {

            chai.request(serverAddress)
            .put('/api/post/comment')
            .set('token', testToken)
            .end((err, res) => {
                expect(res, err).to.have.status(400);
                done();
            });
        });


        it('should return 403 status code', (done) => {
            const body = {
                commentTxt: 'txt update',
                commentIdx: -2,
            };

            chai.request(serverAddress)
            .put('/api/post/comment')
            .set('token', testToken)
            .send(body)
            .end((err, res) => {
                expect(res, err).to.have.status(403);
                done();
            });
        });
    });

    context('Delete Post Comment', () => {
        beforeEach(() => {
            Comment.save({
                ...commentData,
            });
        });

        it('should return 200 status code', (done) => {
            const params = {
                commentIdx: '-1',
            };

            setTimeout(() => {
                chai.request(serverAddress)
                .delete('/api/post/comment')
                .query(params)
                .set('token', testToken)
                .end((err, res) => {
                    expect(res, err).to.have.status(200);
                    done();
                });
            }, 1000);
        });


        it('should return 400 status code', (done) => {

            chai.request(serverAddress)
            .delete('/api/post/comment')
            .set('token', testToken)
            .end((err, res) => {
                expect(res, err).to.have.status(400);
                done();
            });
        });


        it('should return 404 status code', (done) => {
            const params = {
                commentIdx: '-2',
            };

            chai.request(serverAddress)
            .delete('/api/post/comment')
            .query(params)
            .set('token', testToken)
            .end((err, res) => {
                expect(res, err).to.have.status(404);
                done();
            });
        });

        it('should return 403 status code', (done) => {
            const params = {
                commentIdx: '-1',
            };

            chai.request(serverAddress)
            .delete('/api/post/comment')
            .query(params)
            .set('token', testToken2)
            .end((err, res) => {
                expect(res, err).to.have.status(403);
                done();
            });
        });

        it('should return 404 status code', (done) => {
            const params = {
                commentIdx: '-2',
            };

            chai.request(serverAddress)
            .delete('/api/post/comment')
            .query(params)
            .set('token', testToken)
            .end((err, res) => {
                expect(res, err).to.have.status(404);
                done();
            });
        });

    });
});
