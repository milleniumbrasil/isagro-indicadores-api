import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { DataSourceService } from "./config/datasource.service";
import { EnvironmentService } from "./config/environment.service";
import { AppReadinessService } from "./config/app.readiness.service";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: { retryAttempts: 5, retryDelay: 3000 },
  });

  app.enableCors({
    allowedHeaders: "Authorization, X-Requested-With, Content-Type, Accept",
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    credentials: true,
  });

  const isProd = process.env.NODE_ENV === "production";
  const microserviceName = app
    .get(EnvironmentService)
    .getEnv()
    .get<string>("MICROSERVICE_NAME") || "Microservice";

  const microservicchart = app
    .get(EnvironmentService)
    .getEnv()
    .get<string>("PORT");

  const ds = app.get(DataSourceService).getDataSource();
  ds.initialize()
    .then(() => {
      console.log("Data Source has been initialized!");
    })
    .catch((error: any) => console.log(error));

  if (!isProd) {

    const config = new DocumentBuilder()
      .setTitle(microserviceName)
      .setDescription(`# ISAgro

Esta documentação oferece uma visão abrangente e detalhada de todas as APIs disponíveis neste microserviço, facilitando a integração e utilização de suas funcionalidades. O **${microserviceName}** fornece serviços especializados, abrangendo desde a manipulação de dados, geração de relatórios até cálculos estatísticos avançados, conforme o escopo da aplicação.

Cada endpoint está descrito de forma clara e precisa, incluindo as definições de parâmetros, respostas esperadas, e requisitos.

Na versão 1.0, são apresentadas operações essenciais, como consultas de dados, geração de relatórios e cálculos estatísticos distribuídos em diferentes períodos (anual, bienal, trienal, etc.). Essas operações oferecem suporte a múltiplas análises e suas respectivas categorias, atendendo a uma vasta gama de necessidades analíticas. Exemplos práticos de requisições e respostas são fornecidos, ajudando desenvolvedores a utilizar as APIs corretamente e com eficiência.

Além disso, cada endpoint está organizado por tags que refletem as funcionalidades do sistema, facilitando a navegação e localização dos serviços disponíveis.

**Funcionalidades principais:**

- **Somas Agregadas**: Esta técnica agrega os valores de uma série temporal, filtrando os dados com base em critérios como tipo de análise, rótulo e período de tempo. Os dados são agrupados por ano e rótulo, permitindo uma visão consolidada dos valores totais ao longo do tempo e possibilitando a análise da evolução dentro de intervalos de anos definidos.

- **Percentuais Relativos**: Calcula o percentual dos valores totais de um determinado ano em relação ao valor acumulado de todos os anos dentro do intervalo especificado. Essa análise permite identificar a contribuição relativa de cada período para o total geral.

- **Média Móvel Simples (SMA)**: A Média Móvel Simples (SMA) suaviza as flutuações em uma série temporal, calculando a média de dados ao longo de um conjunto fixo de períodos consecutivos. Este cálculo proporciona uma visão mais clara das tendências e padrões ao longo do tempo. No caso do ISAgro, a SMA é aplicada em intervalos de análise variados (bienal, trienal, quadrenal ou quinquenal), permitindo uma análise precisa da evolução dos dados ao longo desses períodos específicos.
`)
      .setVersion("1.0")
      .addTag("system")
      .build();
    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup("docs", app, document);
  }

  app.startAllMicroservices();
  const PORT = process.env.PORT || microservicchart;
  await app.listen(PORT);
  try {
    const appUrl = await app.getUrl();
    console.log(`Application ${microserviceName} is running on: ${appUrl}`);
    const appReadinessService = app.get(AppReadinessService);
    appReadinessService.setAppReady(true);
  } catch (error) {
    console.error("Erro ao obter a URL da aplicação:", error);
  }
} // async function bootstrap()

bootstrap().catch((error) => {
  console.error("Erro na inicialização da aplicação:", error);
});
