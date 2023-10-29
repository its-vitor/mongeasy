<table align="center">
  <tr>
    <td>
      <a href="https://github.com/its-vitor/mongeasy">
        <img src="https://github.com/its-vitor/mongeasy/assets/146399948/fd2a722a-74cd-4b2e-b265-f5f69cd29ff4" width="600">
      </a>
    </td>
    <td>
      <a href="https://github.com/its-vitor/mongeasy">
        <img src="https://github-readme-stats.vercel.app/api/pin/?username=its-vitor&repo=mongeasy" alt="Readme Card">
      </a>
    </td>
  </tr>
</table>
<br><br>

## Sobre
O `Mongeasy` é uma biblioteca projetada para simplificar o uso do Mongoose. Com uma interface mais amigável, foi desenvolvida para pequenos e médios serviços que buscam maneiras mais simples e práticas de interagir com o banco de dados MongoDB. O `Mongeasy` agiliza o processo de interação com o banco de dados ao oferecer uma abordagem intuitiva que resume operações complexas em apenas uma chamada de função.

- **Objetivo**: Simplificar o trabalho dos desenvolvedores em ter que produzir diversas funções para otimizarem seus códigos e torna-los mais práticos, visto que `Mongeasy` trata-se de um grande template de tudo que é possível se fazer com o MongoDB.

## Dependências
- `mongoose ^7.6.3`
- `bcrypt ^5.1.1`
- `jsonwebtoken ^9.0.2`

## Utilização
Primeiro, instale o pacote mongeasy utilizando o npm.
```
npm install mongeasyjs
```
em seguida, você pode instanciar a classe Mongeasy e estabelecer uma conexão atráves do url do seu MongoDB
```js
import { Mongeasy } from 'mongeasyjs';

const url = 'urlmongodb';
const mongeasy = new Mongeasy(url);
```
Abaixo, alguns exemplos de utilização das funções do mongeasy
```js
// inserir um documento em uma coleção
const newDocument = { name: 'Exemplo', age: 30 };
await mongeasy.insert.insertOne(collection, newDocument);

// atualizar o valor de uma chave
const filter = { name: 'Exemplo' };
const update = { $set: { age: 31 } };
await mongeasy.insert.updateFieldValue(collection, filter, update);

// Pesquisar documentos com base em um campo e seu valor
const fieldName = 'name';
const value = 'Exemplo';
const result = await mongeasy.search.searchByValue(collection, fieldName, value);
console.log(result);

```

<h2>Comunicação</h1>
<p>
    <a href="https://discord.gg/TFHXUtHUzQ"><img src="https://img.shields.io/badge/Discord-5865F2?style=for-the-badge&logo=discord&logoColor=white" alt=""></a>
    <a href="https://www.tiktok.com/@eovitor.dev"><img src="https://img.shields.io/badge/TikTok-000000?style=for-the-badge&logo=tiktok&logoColor=white" alt=""></a>
</p>
<h2>Tecnologias</h1>
<p>
    <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white">
    <img src="https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E">
    <img src="https://img.shields.io/badge/json%20web%20tokens-323330?style=for-the-badge&logo=json-web-tokens&logoColor=pink">
</p>

