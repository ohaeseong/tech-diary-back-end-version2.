import { BaseEntity, Column, Entity, Generated, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { Member } from "./Member";
import { Post } from "./Post";
import { ReplyComment } from "./ReplyComment";

@Entity()
export class Comment extends BaseEntity {
    @PrimaryColumn({ type: 'int', unique: true })
    @Generated('increment')
    idx: number;

    @Column({ type: 'varchar', length: 1000 })
    commentTxt: string;


    @Column({ type: 'varchar', length: 50 })
    memberId: string;

    @Column({ type: 'varchar', length: 100 })
    postId: string;

    @Column({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP" })
    createDate: string;


    @ManyToOne(
        (type) => Post,
        (post) => post.id, { nullable: false, onDelete: 'CASCADE' },
    )
    post: Post;

    @OneToMany(
        (type) => ReplyComment,
        (comment) => comment.commentIdx, { nullable: false, onDelete: 'CASCADE' },
      )
    replyComments: ReplyComment[];

    @ManyToOne(
        (type) => Member,
        (member) => member.memberId, { nullable: false , onDelete: 'CASCADE'},
      )
      @JoinColumn({
        name: 'memberId'
      })
    member: Member;
}