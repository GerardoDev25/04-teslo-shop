import { Product } from 'src/products/entities/product.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { unique: true, nullable: false })
  email: string;

  @Column('text', { nullable: false, select: false })
  password: string;

  @Column('text', { nullable: false })
  fullName: string;

  @Column('bool', { default: true })
  isActive: boolean;

  @Column('text', { array: true, default: ['user'] })
  roles: string[];

  @BeforeInsert()
  checkFielBeforeInsert() {
    this.email = this.email.toLowerCase().trim();
  }

  @OneToMany(() => Product, (product) => product.user)
  product: Product;

  @BeforeUpdate()
  checkFielBeforeUpdate() {
    this.checkFielBeforeInsert();
  }
}
