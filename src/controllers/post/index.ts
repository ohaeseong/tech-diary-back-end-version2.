import { Router } from 'express';
import Container, { Service } from 'typedi';
import { PostCtrl } from './post.ctrl';
import authMiddleWare from '../../middlewares/auth.middleware';
import { CommentRoute } from './comment';
import { TagRoute } from './tag';
import { LikeRoute } from './like';
import { TemporaryRoute } from './temporary';
import { BookmarkRoute } from './bookmark';

// dependency injection type di
@Service()
export class PostRoute {
  // 변수 router 선언
  private router: Router;

  // 의존성 주입을 위한 객체 선언
  constructor(
    public postCtrl: PostCtrl,
  ) {
    // Router 함수 값 선언
    this.router = Router();

    // setRouter 실행
    this.setRouter();
  }

  // postCtrl의 함수들을 각각 요청 경로에 따라 route 시켜주는 함수
  private setRouter() {
    this.router.get('/', this.postCtrl.getPosts);
    this.router.get('/member', this.postCtrl.getPostsByMemberId);
    this.router.get('/detail/:id', this.postCtrl.getPostById);
    this.router.get('/url', this.postCtrl.getPostByUrlSlug);
    this.router.get('/state', this.postCtrl.getPostsByState);
    this.router.get('/search/memberId', this.postCtrl.searchMemberPosts);
    this.router.get('/search', this.postCtrl.searchPosts);
    this.router.get('/tag', this.postCtrl.searchTagPosts);
    this.router.get('/url', this.postCtrl.getPostByUrlSlug);
    this.router.post('/', authMiddleWare, this.postCtrl.writePost);
    this.router.put('/', authMiddleWare, this.postCtrl.updatePost);
    this.router.put('/publish', authMiddleWare, this.postCtrl.publishPost);
    this.router.delete('/', authMiddleWare, this.postCtrl.deletePost);

    // comment api route setting
    this.router.use('/comment', Container.get(CommentRoute).getRouter());
    this.router.use('/like', Container.get(LikeRoute).getRouter());
    // this.router.use('/temporary', Container.get(TemporaryRoute).getRouter());
    this.router.use('/tag', Container.get(TagRoute).getRouter());
    this.router.use('/bookmark', Container.get(BookmarkRoute).getRouter());
  }

  // postRouter 값 리턴 함수 (외부에서 router  접근이 가능 하도록 만든 함수)
  public getRouter() {
    return this.router;
  }
}
