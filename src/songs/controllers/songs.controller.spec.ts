import { randomUUID } from 'crypto';

import { Test, TestingModule } from '@nestjs/testing';

import { SongsController } from './songs.controller';
import { CreateSongDto } from '../dto/create-song.dto';
import { Song } from '../entities/song.entity';
import { SongsService } from '../services/songs.service';

describe('SongsController', () => {
  let controller: SongsController;
  let songsService: SongsService;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [SongsController],
        providers: [
          {
            provide: SongsService,
            useFactory: () => ({
              findAll: jest.fn(() =>
                Promise.resolve(Songs),
              ),
              findOne: jest.fn(),
              update: jest.fn(),
              remove: jest.fn(),
              create: jest.fn(),
            }),
          },
        ],
      }).compile();

    controller =
      module.get<SongsController>(SongsController);

    songsService = module.get<SongsService>(SongsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  /* describe('Api findAll', () => {
    it('it calling findAll method', async () => {
      //arrange
      jest
        .spyOn(songsService, 'findAll')
        .mockResolvedValue(Songs);
      //act

      const items = await controller.findAll();
      //assert
      expect(items).toBeDefined();
      expect(items.items.length).toEqual(2);
    });
  }); */

  describe('Create endpoint', () => {
    it('it should create song to api request', async () => {
      //arrange
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

      jest
        .spyOn(songsService, 'create')
        .mockResolvedValue(savedSong as Song);

      //act
      const result = await controller.create(songData);
      //assert
      expect(result).toEqual(savedSong);
      expect(songsService.create).toHaveBeenCalledWith(
        songData,
      );
      expect(songsService.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('Endpoint findOne', () => {
    it('it should return song by id from service', async () => {
      //arrange
      findOne(songsService);
      //act
      const result = await controller.findOne(
        '10ff46a2-c9a0-4eba-81b2-8b599fcad501',
      );
      //assert
      expect(result).toEqual(song);
      expect(songsService.findOne).toHaveBeenCalledWith(
        '10ff46a2-c9a0-4eba-81b2-8b599fcad501',
      );
      expect(songsService.findOne).toHaveBeenCalledTimes(1);
    });
  });
});

const findOne = async (service: SongsService) => {
  //arrange
  jest
    .spyOn(service, 'findOne')
    .mockResolvedValue(song as Song);
};

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
