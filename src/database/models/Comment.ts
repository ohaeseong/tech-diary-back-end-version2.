import { BaseEntity, Column, Entity, Generated, ManyToOne, PrimaryColumn } from "typeorm";
import { Post } from "./Post";

@Entity()
export class Comment extends BaseEntity {
    @PrimaryColumn({ type: 'int', unique: true })
    @Generated('increment')
    idx: number;

    @Column({ type: 'varchar', length: 1000 })
    comment_txt: string;

    @Column({ type: 'varchar', length: 50 })
    member_id: string;

    @Column({ type: 'varchar' })
    post_id: string;

    @Column({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP" })
    create_date: string;


    @ManyToOne(
        (type) => Post,
        (post) => post.id,
    )
    post!: Post;
}