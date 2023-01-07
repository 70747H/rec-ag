import { User } from "modules/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Farm {
    @PrimaryGeneratedColumn("uuid")
    public readonly id: string;

    @Column()
    public name: string;

    @Column({ nullable: true })
    public address: string;

    @Column({ type: "point", nullable: true })
    public coordinates!: string;

    @Column()
    public size: string;

    @Column({ type: "decimal", precision: 5, scale: 2, default: 0.0 })
    public yield: number;

    @ManyToOne(() => User)
    public owner: User;

    @CreateDateColumn()
    public createdAt: Date;
  
    @UpdateDateColumn()
    public updatedAt: Date;
}
