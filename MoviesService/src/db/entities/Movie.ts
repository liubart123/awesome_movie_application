import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('movies')
class Movie {
  @PrimaryGeneratedColumn()
  id: number | undefined;

  @Column({ type: 'int' })
  userId: number | undefined;

  @Column({ type: 'varchar' })
  title!: string;

  @Column({ type: 'varchar' })
  genre!: string;

  @Column({ type: 'date' })
  released!: Date;

  @Column({ type: 'varchar' })
  director!: string;

  @CreateDateColumn()
  created: Date | undefined;
}

export default Movie;
