// src/app/version/version.controller.ts

import { Controller, Get, Logger } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { execSync } from "child_process";

@Controller("version")
@ApiTags("Version Check")
export class VersionController {
  private readonly logger = new Logger(VersionController.name);

  @Get()
  async commit() {
    try {
      // Executando o comando e convertendo o Buffer de saída para string
      const commitHash =
        process.env.COMMIT_HASH ||
        execSync("git rev-parse HEAD").toString().trim();
      this.logger.log(`Commit Hash: ${commitHash}`);
      return { commitHash }; // Retornando o hash do commit como um objeto
    } catch (error) {
      this.logger.error("Erro ao obter o hash do commit", error);
      // Tratamento de erro ou retorno de uma mensagem de erro
      return "Erro ao obter o hash do commit";
    }
  }
}
