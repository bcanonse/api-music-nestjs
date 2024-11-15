import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { DeleteResult, Repository } from 'typeorm';

import { CreateSongDto } from '../dto/create-song.dto';
import { UpdateSongDto } from '../dto/update-song.dto';
import { Song } from '../entities/song.entity';

@Injectable()
export class SongsService {
  constructor(
    @InjectRepository(Song)
    private readonly repository: Repository<Song>,
  ) {}

  async create(createSongDto: CreateSongDto) {
    const newSong = this.repository.create(createSongDto);

    return await this.repository.save(newSong);
  }

  async findAll() {
    return await this.repository.find();
  }

  async findOne(id: string) {
    const song = await this.repository.findOneBy({ id });
    if (!song)
      throw new NotFoundException(
        `The song with id: ${id} not found`,
      );
    return song;
  }

  async update(id: string, updateSongDto: UpdateSongDto) {
    const song = await this.findOne(id);

    this.repository.merge(song, updateSongDto);

    return await this.repository.save(song);
  }

  async remove(id: string) {
    const song = await this.findOne(id);
    const deleted: DeleteResult =
      await this.repository.delete(song.id);

    return deleted.affected > 0;
  }

  async paginate(
    options: IPaginationOptions,
  ): Promise<Pagination<Song>> {
    const queryBuilder =
      this.repository.createQueryBuilder('c');
    queryBuilder.orderBy('c.releasedDate', 'ASC');

    return await paginate<Song>(queryBuilder, options);
  }
}
