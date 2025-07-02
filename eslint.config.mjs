import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";
// Se você não estiver usando explicitamente o plugin typescript-eslint em outro lugar,
// a configuração do Next.js ("next/typescript") já deve incluí-lo.

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Suas configurações existentes estendidas do Next.js
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // Adicione um novo objeto de configuração para suas regras customizadas
  {
    // É uma boa prática especificar a quais arquivos esta configuração de regra se aplica.
    // O Next.js já configura isso para arquivos TS/TSX, mas ser explícito não prejudica.
    files: ["**/*.ts", "**/*.tsx", "**/*.mts", "**/*.cts"], // Ajuste conforme os tipos de arquivo TypeScript que você usa

    // 'plugins': { // Geralmente, o 'next/typescript' já configura o plugin @typescript-eslint
    //   '@typescript-eslint': ...
    // },
    // 'languageOptions': { // E o parser também
    //   parser: ...
    // },

    rules: {
      // Configuração específica para @typescript-eslint/no-unused-vars
      "@typescript-eslint/no-unused-vars": [
        "warn", // Ou "error" se preferir que seja um erro de build
        {
          "args": "after-used", // Opção padrão: não reclama de argumentos não usados antes do último argumento usado.
          "ignoreRestSiblings": true, // Não reclama de "rest siblings" não usados (ex: const { a, ...rest } = obj;)
          "argsIgnorePattern": "^_",  // ESSENCIAL: Ignora argumentos que começam com underscore (ex: _maskRef)
          "varsIgnorePattern": "^_",  // Opcional: Para ignorar variáveis locais que começam com underscore
          "caughtErrorsIgnorePattern": "^_" // Opcional: Para ignorar erros capturados em catch(e) que começam com underscore
        }
      ],
      // Você pode adicionar outras regras customizadas aqui se precisar
      // Exemplo:
      // "semi": ["error", "always"]
    }
  }
];

export default eslintConfig;
