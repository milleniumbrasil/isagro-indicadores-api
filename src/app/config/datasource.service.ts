import "reflect-metadata";
import { DataSource } from "typeorm";
import { Injectable } from "@nestjs/common";
import { EnvironmentService } from "./environment.service";
import { ChartEntity } from "../entities/chart";

export const cacheDuration = 31536000000;

@Injectable()
export class DataSourceService {
  private dataSource: DataSource;

  constructor(private env: EnvironmentService) {
    this.dataSource = new DataSource({
      type: "postgres",
      host: env.getEnv().get<string>("DATABASE_HOST"),
      port: env.getEnv().get<number>("DATABASE_PORT"),
      database: env.getEnv().get<string>("DATABASE_NAME"),
      username: env.getEnv().get<string>("DATABASE_USER"),
      password: env.getEnv().get<string>("DATABASE_PASSWORD"),
      entities: [ChartEntity],
      synchronize: false,
      logging: true,
    //   ssl: {
    //     rejectUnauthorized: false,
    //   }
    });
  }

  getDataSource(): DataSource {
    return this.dataSource;
  }
}
