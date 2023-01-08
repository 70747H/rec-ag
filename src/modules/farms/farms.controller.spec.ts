import config from "config/config";
import { Express } from "express";
import { setupServer } from "server/server";
import { disconnectAndClearDatabase } from "helpers/utils";
import http, { Server } from "http";
import ds from "orm/orm.config";
import supertest, { SuperAgentTest } from "supertest";
import { CreateFarmDto } from "./dto/create-farm-dto";
import { CreateUserDto } from "modules/users/dto/create-user.dto";
import { UsersService } from "modules/users/users.service";
import { LoginUserDto } from "modules/auth/dto/login-user.dto";
import { SharedService } from "modules/shared/shared.service";
import { AccessToken } from "modules/auth/entities/access-token.entity";
import { FarmsService } from "./farms.service";

describe("UsersController", () => {
  let app: Express;
  let agent: SuperAgentTest;
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
    agent = supertest.agent(app);

    usersService = new UsersService();
    farmsService = new FarmsService();
  });

  afterEach(async () => {
    await disconnectAndClearDatabase(ds);
  });

  describe("POST /farms", () => {
    const createUser = async (userDto: CreateUserDto) => usersService.createUser(userDto);
    const loginDto: LoginUserDto = { email: "user@test.com", password: "password" };
    jest.spyOn(SharedService as any, "getGeo").mockReturnValueOnce({ data: { results: [{ geometry: { location: { lat: 234, lng: 324 }} }] }});
    const createFarmDto: CreateFarmDto = { name: "AAA", address: "BBB", size: "1234", yield: 250 };

    it("should create new farm", async () => {
      await createUser({ ...loginDto, address: "kunt furbo" });
      const loginRes = await agent.post("/api/v1/auth/login").send(loginDto);
      const { token } = loginRes.body as AccessToken;
      const res = await agent.post("/api/v1/farms").set("Authorization", `Bearer ${token}`).send(createFarmDto);

      expect(res.statusCode).toBe(201);
      expect(res.body).toMatchObject({
        id: expect.any(String),
        name: expect.stringContaining(createFarmDto.name) as string,
        address: expect.stringContaining(createFarmDto.address) as string,
        size: expect.stringContaining(createFarmDto.size) as string,
        yield: "250.00",
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });
  });

  describe("PATCH /farms/:id", () => {
    const createUser = async (userDto: CreateUserDto) => usersService.createUser(userDto);
    const loginDto: LoginUserDto = { email: "user@test.com", password: "password" };
    jest.spyOn(SharedService as any, "getGeo").mockReturnValueOnce({ data: { results: [{ geometry: { location: { lat: 234, lng: 324 }} }] }});
    const createFarmDto: CreateFarmDto = { name: "AAA", address: "BBB", size: "1234", yield: 250 };
    const createFarm = async (id: string, createFarmDto: CreateFarmDto) => farmsService.create(id, createFarmDto)

    it("should update a farm", async () => {
      const createdUser = await createUser({ ...loginDto, address: "kunt furbo" });
      const { id } = createdUser;
      const createdFarm = await createFarm(id, createFarmDto);
      const { id: farmId } = createdFarm;
      const loginRes = await agent.post("/api/v1/auth/login").send(loginDto);
      const { token } = loginRes.body as AccessToken;
      const res = await agent.patch(`/api/v1/farms/${farmId}`).set("Authorization", `Bearer ${token}`).send({ address: "CCC" });
      
      expect(res.statusCode).toBe(204);
    })
  })

  describe("DELETE /farms/:id", () => {
    const createUser = async (userDto: CreateUserDto) => usersService.createUser(userDto);
    const loginDto: LoginUserDto = { email: "user@test.com", password: "password" };
    jest.spyOn(SharedService as any, "getGeo").mockReturnValueOnce({ data: { results: [{ geometry: { location: { lat: 234, lng: 324 }} }] }});
    const createFarmDto: CreateFarmDto = { name: "AAA", address: "BBB", size: "1234", yield: 250 };
    const createFarm = async (id: string, createFarmDto: CreateFarmDto) => farmsService.create(id, createFarmDto)

    it("should update a farm", async () => {
      const createdUser = await createUser({ ...loginDto, address: "kunt furbo" });
      const { id } = createdUser;
      const createdFarm = await createFarm(id, createFarmDto);
      const { id: farmId } = createdFarm;
      const loginRes = await agent.post("/api/v1/auth/login").send(loginDto);
      const { token } = loginRes.body as AccessToken;
      const res = await agent.delete(`/api/v1/farms/${farmId}`).set("Authorization", `Bearer ${token}`).send();
      
      expect(res.statusCode).toBe(200);
    })
  })
});
