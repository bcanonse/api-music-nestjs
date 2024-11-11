import { Column, Entity } from 'typeorm';

import { BaseEntity } from '../../database/base.entity';

@Entity('songs')
export class Song extends BaseEntity {
  @Column('varchar', {
    comment: 'Title of the song',
    length: 255,
  })
  title: string;

  @Column('varchar', {
    comment: 'List of artist of the song',
    array: true,
  })
  artists: string[];

  @Column('date', {
    comment: 'Release date publish of the song',
  })
  releasedDate: Date;

  @Column('time', {
    comment: 'Duration of the song',
  })
  duration: Date;

  @Column('text')
  lyrics: string;
}
