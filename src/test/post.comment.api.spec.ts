import chai from 'chai';
import chaiHttp from 'chai-http';

import config from '../../config';
import { Comment } from '../database/models/Comment';
import { ReplyComment } from '../database/models/ReplyComment';
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
    kinds: 'front-end',
    memberId: 'test',
  } as any;

const commentData = {
    idx: -1,
    memberId: 'test',
    postId: 'test',
    commentTxt: 'test',
} as any;

const replyCommentData = {
    idx: -1,
    memberId: 'test',
    postId: 'test',
    commentTxt: 'test',
    replyCommentIdx: -1,
} as any;

describe('PostCommentService', async () => {
    before(() => {
        Post.save({
            ...postFormData,
        });
    });

    after(async () => {
        await Post.delete({
            memberId: 'test',
        });
    });

    context('Write Post Comment', () => {

        it('should return 200 status code', (done) => {
            const body = {
                postId: 'test',
                commentTxt: 'testadfasd',
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

    context('Read Post Comment', () => {

        it('should return 200 status code', (done) => {
            const params = {
                postId: 'test',
            };

            chai.request(serverAddress)
            .get('/api/post/comment')
            .query(params)
            .end((err, res) => {
                expect(res, err).to.have.status(200);
                done();
            });
        });


        it('should return 400 status code', (done) => {

            chai.request(serverAddress)
            .get('/api/post/comment')
            .set('token', testToken)
            .end((err, res) => {
                expect(res, err).to.have.status(400);
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
    });

    // reply comment test code
    context('Write Reply Comment of post', () => {
        beforeEach(() => {
            Comment.save({
                ...commentData,
            });
        });

        afterEach(() => {
            Comment.delete({
                idx: -1,
            });
        });
        it('should return 200 status code', (done) => {
            const body = {
                replyCommentIdx: -1,
                postId: 'test',
                commentTxt: 'testadfasd',
            };

            setTimeout(() => {
                chai.request(serverAddress)
                .post('/api/post/comment/reply')
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
            .post('/api/post/comment/reply')
            .set('token', testToken)
            .end((err, res) => {
                expect(res, err).to.have.status(400);
                done();
            });
        });
    });

    context('Get Reply Comment of post', () => {

        it('should return 200 status code', (done) => {
            const params = {
                replyCommentIdx: -1,
            };

            chai.request(serverAddress)
            .get('/api/post/comment/reply')
            .query(params)
            .end((err, res) => {
                expect(res, err).to.have.status(200);
                done();
            });
        });


        it('should return 400 status code', (done) => {

            chai.request(serverAddress)
            .get('/api/post/comment/reply')
            .set('token', testToken)
            .end((err, res) => {
                expect(res, err).to.have.status(400);
                done();
            });
        });
    });

    context('delete Reply Comment of post', () => {
        beforeEach(() => {
            ReplyComment.save({
                ...replyCommentData,
            });
        });
        it('should return 200 status code', (done) => {
            const params = {
                commentIdx: -1,
            };

            chai.request(serverAddress)
            .delete('/api/post/comment/reply')
            .query(params)
            .set('token', testToken)
            .end((err, res) => {
                expect(res, err).to.have.status(200);
                done();
            });
        });


        it('should return 400 status code', (done) => {

            chai.request(serverAddress)
            .delete('/api/post/comment/reply')
            .set('token', testToken)
            .end((err, res) => {
                expect(res, err).to.have.status(400);
                done();
            });
        });
    });

    context('update Reply Comment of post', () => {
        beforeEach(() => {
            ReplyComment.save({
                ...replyCommentData,
            });
        });
        it('should return 200 status code', (done) => {
            const body = {
                commentIdx: -1,
                commentTxt: 'testest입니다'
            };

            chai.request(serverAddress)
            .put('/api/post/comment/reply')
            .send(body)
            .set('token', testToken)
            .end((err, res) => {
                expect(res, err).to.have.status(200);
                done();
            });
        });


        it('should return 400 status code', (done) => {

            chai.request(serverAddress)
            .delete('/api/post/comment/reply')
            .set('token', testToken)
            .end((err, res) => {
                expect(res, err).to.have.status(400);
                done();
            });
        });
    });
});
