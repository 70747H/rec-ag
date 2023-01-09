import config from "config/config";
import { Express } from "express";
import { setupServer } from "server/server";
import { disconnectAndClearDatabase } from "helpers/utils";
import http, { Server } from "http";
import ds from "orm/orm.config";
import { UsersService } from "modules/users/users.service";
import { CreateUserDto } from "modules/users/dto/create-user.dto";
import { SharedService } from "modules/shared/shared.service";
import { CreateFarmDto } from "../dto/create-farm-dto";
import { FarmsService } from "../farms.service";
import { UpdateFarmDto } from "../dto/update-farm-dto";

describe("FarmsService", () => {
  let app: Express;
  let server: Server;

  let usersService: UsersService;
  let farmsService: FarmsService;

  beforeAll(() => {
    app = setupServer();
    server = http.createServer(app).listen(config.APP_PORT);
  });

  afterAll(() => {
    server.close();
  });

  beforeEach(async () => {
    await ds.initialize();
    usersService = new UsersService();
    farmsService = new FarmsService();
  });

  afterEach(async () => {
    await disconnectAndClearDatabase(ds);
  });

  describe(".createFarm", () => {
    const createUserDto: CreateUserDto = { email: "user@test.com", password: "password", address: "kunt furbo" };
    const createFarmDto: CreateFarmDto = { name: "AAA", address: "Herning", size: "1234", yield: 250 };

    it("should create new farm", async () => {
      jest.spyOn(SharedService as any, "getGeo").mockReturnValueOnce({ data: { results: [{ geometry: { location: { lat: 234, lng: 324 }} }] }});
      const createdUser = await usersService.createUser(createUserDto);
      const { id: ownerId } = createdUser;
      const createdFarm = await farmsService.create(ownerId, createFarmDto);
      expect(createdFarm).toMatchObject({ ...CreateFarmDto });
    });
  });

  describe(".updateFarm", () => {
    const createUserDto: CreateUserDto = { email: "user@test.com", password: "password", address: "kunt furbo" };
    const createUserDto2: CreateUserDto = { email: "user2@test.com", password: "password", address: "kunt furbo" };
    const createFarmDto: CreateFarmDto = { name: "AAA", address: "Herning", size: "1234", yield: 250 };
    const updateFarmDto: UpdateFarmDto = { name: "BBB" };

    it("should update a farm", async () => {
      jest.spyOn(SharedService as any, "getGeo").mockReturnValueOnce({ data: { results: [{ geometry: { location: { lat: 234, lng: 324 }} }] }});
      const createdUser = await usersService.createUser(createUserDto);
      const { id: ownerId } = createdUser;
      const createdFarm = await farmsService.create(ownerId, createFarmDto);
      const { id } = createdFarm;
      const updateResult = await farmsService.update(id, ownerId, updateFarmDto)
      expect(updateResult.affected).toEqual(1);
    });

    it("Should not update the farm with a different user", (async () => {
      jest.spyOn(SharedService as any, "getGeo").mockReturnValueOnce({ data: { results: [{ geometry: { location: { lat: 234, lng: 324 }} }] }});
      const createdUser = await usersService.createUser(createUserDto);
      const { id: ownerId } = createdUser;
      const createdUser2 = await usersService.createUser(createUserDto2);
      const { id: ownerId2 } = createdUser2;
      const createdFarm = await farmsService.create(ownerId, createFarmDto);
      const { id } = createdFarm;
      const updateResult = await farmsService.update(id, ownerId2, updateFarmDto)
      expect(updateResult.affected).toEqual(0);
    }))
  });

  describe(".deleteFarm", () => {
    const createUserDto: CreateUserDto = { email: "user@test.com", password: "password", address: "kunt furbo" };
    const createUserDto2: CreateUserDto = { email: "user2@test.com", password: "password", address: "kunt furbo" };
    const createFarmDto: CreateFarmDto = { name: "AAA", address: "Herning", size: "1234", yield: 250 };

    it("should delete a farm", async () => {
      jest.spyOn(SharedService as any, "getGeo").mockReturnValueOnce({ data: { results: [{ geometry: { location: { lat: 234, lng: 324 }} }] }});
      const createdUser = await usersService.createUser(createUserDto);
      const { id: ownerId } = createdUser;
      const createdFarm = await farmsService.create(ownerId, createFarmDto);
      const { id } = createdFarm;
      const deleteResult = await farmsService.delete(id, ownerId);
      expect(deleteResult.affected).toEqual(1);
    });

    it("Should not delete the farm with a different user", (async () => {
      jest.spyOn(SharedService as any, "getGeo").mockReturnValueOnce({ data: { results: [{ geometry: { location: { lat: 234, lng: 324 }} }] }});
      const createdUser = await usersService.createUser(createUserDto);
      const { id: ownerId } = createdUser;
      const createdUser2 = await usersService.createUser(createUserDto2);
      const { id: ownerId2 } = createdUser2;
      const createdFarm = await farmsService.create(ownerId, createFarmDto);
      const { id } = createdFarm;
      const deleteResult = await farmsService.delete(id, ownerId2)
      expect(deleteResult.affected).toEqual(0);
    }))
  });
});
