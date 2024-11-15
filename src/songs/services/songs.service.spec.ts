import { randomUUID } from 'crypto';

import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateSongDto } from '../dto/create-song.dto';
import { UpdateSongDto } from '../dto/update-song.dto';
import { Song } from '../entities/song.entity';
import { SongsService } from '../services/songs.service';

describe('SongsService', () => {
  let service: SongsService;
  let songsRepository: Repository<Song>;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        providers: [
          SongsService,
          {
            provide: getRepositoryToken(Song),
            useClass: Repository, // Usamos la clase Repository de TypeORM
          },
        ],
      }).compile();

    service = module.get<SongsService>(SongsService);
    songsRepository = module.get<Repository<Song>>(
      getRepositoryToken(Song),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(songsRepository).toBeDefined();
  });

  describe('Method findAll songs', () => {
    it('it should return lists songs ', async () => {
      // arrange
      jest
        .spyOn(songsRepository, 'find')
        .mockResolvedValue(Songs);

      // act
      const result = await service.findAll();

      // assert
      expect(result).toEqual(Songs);
      expect(result.length).toBeGreaterThan(0);
      expect(result.length).toEqual(2);
      expect(songsRepository.find).toHaveBeenCalled();
    });
  });

  /* describe('Method paginate', () => {
    it('it should paginate return list', async () => {
      // Arrange
      jest
        .spyOn(songsRepository, 'find')
        .mockResolvedValueOnce(
          new Pagination<Song>({
            items: Songs,
            limit: 10,
            currentPage: 1,
            totalItems: 3,
          }),
        );

      // Act
      const result = await service.paginate({
        page: 1,
        limit: 10,
      });

      // Assert
      expect(result).toEqual({
        items: Songs,
        limit: 10,
        currentPage: 1,
        totalItems: 3,
      });
    });
  }); */

  describe('Method create', () => {
    it('it should create song', async () => {
      const songData: CreateSongDto = {
        title: 'New song 1',
        artists: ['Rauw', 'Anuel'],
        duration: new Date(),
        lyrics: 'Lorem',
        releasedDate: new Date(),
      };

      const savedSong: Song = {
        id: randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date(),
        ...songData,
      };

      //arrange
      jest
        .spyOn(songsRepository, 'create')
        .mockReturnValue(savedSong as Song);

      jest
        .spyOn(songsRepository, 'save')
        .mockResolvedValue(savedSong as Song);

      //act
      const result = await service.create(songData);
      //assert
      expect(result).toEqual(savedSong);
      expect(songsRepository.create).toHaveBeenCalledWith(
        songData,
      );

      expect(songsRepository.save).toHaveBeenCalledWith(
        savedSong,
      );
    });
  });

  describe('Method findOne', () => {
    it('it should return find one song', async () => {
      //arrange
      findOne(songsRepository);
      //act
      const result = await service.findOne(
        '10ff46a2-c9a0-4eba-81b2-8b599fcad501',
      );
      //assert
      expect(result).toEqual(song);
      expect(
        songsRepository.findOneBy,
      ).toHaveBeenCalledWith({
        id: '10ff46a2-c9a0-4eba-81b2-8b599fcad501',
      });
      expect(
        songsRepository.findOneBy,
      ).toHaveBeenCalledTimes(1);
    });

    it('it should throw exception not found to filter song', async () => {
      findOneThrowNotFoundException(
        songsRepository,
        service,
      );
    });
  });

  describe('Method update', () => {
    it('it should update song and return song updated', async () => {
      //arrange
      const updatedSongDto: UpdateSongDto = {
        title: 'New song updated',
      };
      const updatedSong: Song = {
        ...song,
        ...updatedSongDto,
      };
      findOne(songsRepository);

      // Simulamos el método merge (no hace nada en realidad, ya que es síncrono)
      jest
        .spyOn(songsRepository, 'merge')
        .mockImplementation((entity, dto) => {
          Object.assign(entity, dto);
          return entity;
        });

      // Simulamos el método save para devolver el usuario actualizado
      jest
        .spyOn(songsRepository, 'save')
        .mockResolvedValue(updatedSong);

      //act
      const result = await service.update(
        '10ff46a2-c9a0-4eba-81b2-8b599fcad501',
        updatedSongDto,
      );
      //assert
      expect(result).toEqual(updatedSong);
      expect(songsRepository.merge).toHaveBeenCalledWith(
        song,
        updatedSongDto,
      );
      expect(songsRepository.merge).toHaveBeenCalledTimes(
        1,
      );
      expect(songsRepository.save).toHaveBeenCalledWith(
        updatedSong,
      );
      expect(songsRepository.save).toHaveBeenCalledTimes(1);
    });

    it('it should return undefined if to user not found', async () => {
      //arrange
      const songDto: UpdateSongDto = {
        title: 'Nonexistent song',
      };
      // Simulamos el método findOne para devolver undefined
      jest
        .spyOn(songsRepository, 'findOneBy')
        .mockImplementation(() => {
          throw new NotFoundException(
            'The song with id: adsadsf not found',
          );
        });

      //act
      try {
        //act
        // const result = await service.findOne('adsadsf');
        const result = await service.update(
          'adsadsf',
          songDto,
        );
        //assert
        expect(result).toBeUndefined();
        expect(result).toBeNull();
        expect(
          songsRepository.merge,
        ).not.toHaveBeenCalled();
        expect(songsRepository.save).not.toHaveBeenCalled();
      } catch (error) {
        //assert
        expect(error).toBeInstanceOf(NotFoundException);

        expect(error.message).toContain(
          'The song with id: adsadsf not found',
        );
      }
    });
  });

  describe('Method delete', () => {
    it('it should deleted song', async () => {
      //arrange
      findOne(songsRepository);
      jest
        .spyOn(songsRepository, 'delete')
        .mockResolvedValue({ affected: 1 } as any);
      //act
      const result = await service.remove(
        '10ff46a2-c9a0-4eba-81b2-8b599fcad501',
      );
      //assert
      expect(result).toBe(true);
      expect(songsRepository.delete).toHaveBeenCalledWith(
        '10ff46a2-c9a0-4eba-81b2-8b599fcad501',
      );
      expect(songsRepository.delete).toHaveBeenCalledTimes(
        1,
      );
    });

    it('it should throw error not found to deleted song', async () => {
      //arrange
      findOneThrowNotFoundException(
        songsRepository,
        service,
      );

      jest
        .spyOn(songsRepository, 'delete')
        .mockResolvedValue({ affected: 0 } as any);

      //act

      //assert
      expect(songsRepository.delete).toHaveBeenCalledTimes(
        0,
      );
    });
  });
});

const findOne = (songsRepository: Repository<Song>) => {
  //arrange
  jest
    .spyOn(songsRepository, 'findOneBy')
    .mockResolvedValue(song);
};

const findOneThrowNotFoundException = async (
  songsRepository: Repository<Song>,
  service: SongsService,
) => {
  //arrange
  jest
    .spyOn(songsRepository, 'findOneBy')
    .mockImplementation(() => {
      throw new NotFoundException(
        'The song with id: adsadsf not found',
      );
    });
  try {
    //act
    const result = await service.findOne('adsadsf');
    //assert
    expect(result).toBeNull();
  } catch (error) {
    //assert
    expect(error).toBeInstanceOf(NotFoundException);

    expect(error.message).toContain(
      'The song with id: adsadsf not found',
    );
  }
};

const Songs: Song[] = [
  {
    id: randomUUID(),
    title: 'Song 1',
    artists: ['Rauw', 'Anuel'],
    duration: new Date(),
    updatedAt: new Date(),
    lyrics: 'Lyrics of song',
    createdAt: new Date(),
    releasedDate: new Date(),
  },
  {
    id: randomUUID(),
    title: 'Song 2',
    artists: ['De la Rose', 'Omar Courtz'],
    duration: new Date(),
    updatedAt: new Date(),
    lyrics: 'Lyrics of song',
    createdAt: new Date(),
    releasedDate: new Date(),
  },
];

const song: Song = {
  id: '10ff46a2-c9a0-4eba-81b2-8b599fcad501',
  title: 'Song 1',
  artists: ['Rauw', 'Anuel'],
  duration: new Date(),
  updatedAt: new Date(),
  lyrics: 'Lyrics of song',
  createdAt: new Date(),
  releasedDate: new Date(),
};
