import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { CreateSongDto } from '../dto/create-song.dto';
import { UpdateSongDto } from '../dto/update-song.dto';
import { SongsService } from '../services/songs.service';

ApiTags('Songs');
@Controller('songs')
export class SongsController {
  constructor(
    private readonly songsService: SongsService,
  ) {}

  @Post()
  async create(@Body() createSongDto: CreateSongDto) {
    return await this.songsService.create(createSongDto);
  }

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe)
    page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe)
    limit = 10,
  ) {
    return await this.songsService.paginate({
      page,
      limit,
    });
  }

  @Get(':id')
  @ApiResponse({
    status: 404,
    description: 'The song with id not found',
  })
  @ApiResponse({
    status: 200,
    description: 'The song filter with id',
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.songsService.findOne(id);
  }

  @Patch(':id')
  @ApiResponse({
    status: 404,
    description: 'The song with id not found',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateSongDto: UpdateSongDto,
  ) {
    return await this.songsService.update(
      id,
      updateSongDto,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({
    status: 404,
    description: 'The song with id not found',
  })
  @ApiResponse({
    status: 204,
    description: 'The song had been deleted',
  })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return await this.songsService.remove(id);
  }
}
