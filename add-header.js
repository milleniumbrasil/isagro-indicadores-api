const fs = require("fs");
const path = require("path");
const glob = require("glob");

const addHeaderToFile = (filePath) => {
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error(`Erro ao ler o arquivo ${filePath}: `, err);
      return;
    }

    // Expressão regular para identificar linhas de comentário de caminho e linhas em branco no início
    const regex = /^(\s*\/\/.*\n)*\s*/;
    // Remove linhas de comentário de caminho existentes e linhas em branco no início do arquivo
    let newData = data.replace(regex, "");

    // Prepara o cabeçalho com o caminho normalizado
    const normalizedPath = filePath.replace(/\\/g, "/"); // Normaliza o caminho para o formato Unix
    const headerComment = `// ${normalizedPath}`;

    // Verifica se o novo cabeçalho já está presente no início do arquivo
    if (newData.startsWith(headerComment)) {
      return; // Se já estiver presente, não faz alterações
    }

    // Adiciona o novo cabeçalho ao início do arquivo
    newData = `\n${headerComment}\n\n${newData}`;

    // Verifica se o conteúdo do arquivo foi alterado
    if (data !== newData) {
      fs.writeFile(filePath, newData, "utf8", (err) => {
        if (err) {
          console.error(`Erro ao escrever no arquivo ${filePath}: `, err);
          return;
        }
      });
    }
  });
};

const processDirectory = (directoryPath) => {
  const pattern = path.join(directoryPath, "**", "*.{ts,tsx,js,jsx,json}");
  try {
    const files = glob.sync(pattern, { nodir: true });
    files.forEach((file) => {
      addHeaderToFile(file);
    });
  } catch (err) {
    console.error("Erro ao buscar arquivos: ", err);
  }
};

const args = process.argv.slice(2);
if (args.length !== 1) {
  console.log("Uso: node add-header-to-files.js <caminho_do_diretorio>");
  process.exit(1);
}

const directoryPath = args[0];
processDirectory(directoryPath);
