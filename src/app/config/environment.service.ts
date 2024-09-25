// src/app/config/environment.service.ts

import "reflect-metadata";
import { ConfigService } from "@nestjs/config";
import { Injectable } from "@nestjs/common";

@Injectable()
export class EnvironmentService {
  private env: ConfigService;

  constructor(private envConfigService: ConfigService) {
    this.env = envConfigService;
  }

  getEnv(): ConfigService {
    return this.env;
  }
}
