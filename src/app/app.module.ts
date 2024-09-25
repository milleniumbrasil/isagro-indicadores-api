import { ReportModule } from './report/report.module';

import { join } from "path";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ServeStaticModule } from "@nestjs/serve-static";
import { HealthModule } from "./health/health.module";
import { VersionModule } from "./version/version.module";
import { JwtAuthGuardModule } from "./middleware/jwt-auth.guard.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'test' ? '.env.test' : ['.env.local', '.env'],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "..", "public"),
    }),
    VersionModule,
    JwtAuthGuardModule,
    HealthModule,
    ReportModule
  ],
})
export class AppModule {}