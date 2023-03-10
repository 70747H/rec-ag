import config from "config/config";
import { Express } from "express";
import { setupServer } from "server/server";
import { disconnectAndClearDatabase } from "helpers/utils";
import http, { Server } from "http";
import ds from "orm/orm.config";
import supertest, { SuperAgentTest } from "supertest";
import { CreateUserDto } from "../dto/create-user.dto";
import { UsersService } from "../users.service";
import { SharedService } from "modules/shared/shared.service";

describe("UsersController", () => {
  let app: Express;
  let agent: SuperAgentTest;
  let server: Server;

  let usersService: UsersService;

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
  });

  afterEach(async () => {
    await disconnectAndClearDatabase(ds);
  });

  describe("POST /users", () => {
    const createUserDto: CreateUserDto = { email: "user@test.com", password: "password", address: "kunt furbo" };

    it("should create new user", async () => {
      jest.spyOn(SharedService as any, "getGeo").mockReturnValueOnce({ data: { results: [{ geometry: { location: { lat: 234, lng: 324 }} }] }});
      const res = await agent.post("/api/v1/users").send(createUserDto);

      expect(res.statusCode).toBe(201);
      expect(res.body).toMatchObject({
        id: expect.any(String),
        email: expect.stringContaining(createUserDto.email) as string,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });

    it("should throw UnprocessableEntityError if user already exists", async () => {
      jest.spyOn(SharedService as any, "getGeo").mockReturnValueOnce({ data: { results: [{ geometry: { location: { lat: 234, lng: 324 }} }] }});
      await usersService.createUser(createUserDto);

      const res = await agent.post("/api/v1/users").send(createUserDto);

      expect(res.statusCode).toBe(422);
      expect(res.body).toMatchObject({
        name: "UnprocessableEntityError",
        message: "A user for the email already exists",
      });
    });
  });
});
