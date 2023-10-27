import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

/**
 * Estabelece uma conexão com o Mongoose.
 * @param {string} url URL para estabelecer a conexão com o banco de dados MongoDB.
 * @returns {Promise<mongoose.Connection>} Solicitação de Conexão com o banco de dados.
 */
export async function startConnection(url) {
    return createConnection(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
}

/**
 * # Mongeasy
 * @description O `Mongeasy` é uma biblioteca projetada para simplificar o uso do Mongoose. Com uma interface mais amigável, foi desenvolvida para pequenos e médios serviços que buscam maneiras mais simples e práticas de interagir com o banco de dados MongoDB. O `Mongeasy` agiliza o processo de interação com o banco de dados ao oferecer uma abordagem intuitiva que resume operações complexas em apenas uma chamada de função.
 */
export class Mongeasy {
    /**
     * inicializa uma nova instância do Mongeasy, estabelecendo automaticamente uma conexão com o MongoDB.
     * @param {string} url A URL de conexão com o banco de dados MongoDB.
     */
    constructor(url, collection) {
        this.collection = collection;
        this.connection = startConnection(url);

        this.helpers = {
            /**
             * ### Converte o valor de ID para ObjectId.
             * @param {*} id - Id a ser convertido
             */
            convertToObjectId: async (id) => {
                return new mongoose.Types.ObjectId(id);
            },
            /**
             * ### Utiliza método Hash para criptografar um valor, comumente senhas.
             * @param {*} param - Valor a ser criptografado.
             */
            encryptHash: async (param) => {
                return await bcrypt.hash(param, 20);
            },
            /**
             * ### Função que gera um token de acordo com um dicionário Payload.
             * @param {*} key - Key para criptografar em JWT.
             * @param {*} payload - Dicionário/Documento que armazena informações.
             * @param {*} expire - Se o token expira ou não (true/false)
             * @param {*} expirationValue - Quantos dias/horas o token expira caso ele expire.
             */
            generateToken: async (key, payload, expire, expirationValue) => {
                return jwt.sign(payload, key, { expiresIn: expirationValue } ? expire : null);
            },
            /**
             * ### Verifica o token de acordo com a Key de criptografia.
             * @param {*} token - Token a ser verificado.
             * @param {*} key - Key para verificação.
             * @returns 
             */
            verifyToken: async (token, key) => {
                try { return jwt.verify(token, key); } catch { return null; }
            },
        }
        /**
         * ### Seção para inserir documentos/valores ao seu banco de dados.
         */
        this.insert = {
            /**
             * ### Insere um documento a uma coleção
             * @param {*} collection - Coleção que receberá um novo documento.
             * @param {*} document - Documento que será inserido.
             */
            insertOne: async (collection, document) => {
                return await (await this.connection).collection(collection ? collection : this.collection).insertOne(document);
            },
            /**
             * ### Atualiza o valor de uma chave
             * @param {*} collection - Coleção onde será feita a busca.
             * @param {*} field - Chave que receberá um novo valor.
             * @param {*} newValue - Novo valor da chave.
             */
            updateFieldValue: async (collection, field, newValue) => {
                return await (await this.connection).collection(collection ? collection : this.collection).updateOne(field, newValue);
            },
            /**
             * ### Atualiza múltiplos valores em documentos com uma chave em comum.
             * @param {*} collection - Coleção onde será feita a busca.
             * @param {*} field - Chave que receberá um novo valor.
             * @param {*} newValue - Novo valor da chave.
             */
            updateMultipleFields: async (collection, field, newValue) => {
                return await (await this.connection).collection(collection ? collection : this.collection).updateMany(field, newValue);
            },
            /**
             * ### Adiciona a uma `lista/dicionário` um novo valor.
             * @param {*} collection - Coleção onde será feita a busca.
             * @param {*} filter - Chave que receberá um novo valor.
             * @param {*} update - Novo valor a ser inserido na `lista/dicionário`.
             */
            addToField: async (collection, filter, update) => {
                return await (await this.connection).collection(collection ? collection : this.collection).updateOne(filter, { $push: update });
            },
        }
        /**
         * ### Seção para apagar/deletar documentos ou chaves do seu banco de dados.
         */
        this.delete = {
            /**
             * ### Deleta um documento pelo identificador ObjectId "_id"
             * @param {*} collection - Coleção onde será feita a busca.
             * @param {*} id - Idenficador do documento.
             */
            deleteById: async (collection, id) => {
                return await (await this.connection).collection(collection ? collection : this.collection ).findOneAndDelete({ _id: id });
            },
            /**
             * ### Deleta um documento por uma chave (email, password...) e seu valor.
             * @param {*} collection - Coleção onde será feita a busca.
             * @param {*} field - Nome da chave que armazena o valor buscado. `(Exemplo: campo "Email", "Password")`
             * @param {*} value - Valor da busca `(Exemplo: "exemplo@mail.com")` 
             * @returns 
             */
            deleteByField: async (collection, field, value) => {
                return await (await this.connection).collection(collection ? collection : this.collection).findOneAndDelete({ [field]: value });
            },
            /**
             * ### Deleta uma coleção ou a coleção que foi instanciada junto da classe Mongeasy.
             * @param {*} collection - Coleção a ser deletada.
             * @returns 
             */
            deleteCollection: async (collection) => {
                return await (await this.connection).collection(collection ? collection : this.collection).drop();
            },
            /**
             * ### Deleta uma chave de um documento de acordo com seu valor.
             * @param {*} collection - Coleção onde será feita a busca.
             * @param {*} field - Nome da chave a ser deletada caso o valor dela coincida.
             * @param {*} value - Valor da chave a ser deletada.
             * @returns 
             */
            deleteFieldByValue: async (collection, field, value) => {
                return await (await this.connection).collection(collection).updateMany({}, { $unset: { [field]: value } });
            },
        }
        /**
         * ### Seção para consultas e buscas no banco de dados MongoDB.
         */
        this.search = {
            /**
             * ### Função que retorna um documento através de seu identificador ObjectId "_id"
             * @param {string} collection - Coleção onde será feita a busca.
             * @param {string} id - Identificador do documento.
             */
            searchByDocumentId: async (collection, id) => {
                return await (await this.connection).collection(collection ? collection : this.collection).findOne({
                    _id: new mongoose.Types.ObjectId(id)
                });
            },
            /**
             * ### Função que retorna um documento através de uma chave (email, password...) e o seu valor.
             * @param {*} collection - Coleção onde será feita a busca.
             * @param {*} field - Nome da chave que armazena o valor buscado. `(Exemplo: campo "Email", "Password")`
             * @param {*} value - Valor da busca `(Exemplo: "exemplo@mail.com")`
             * @returns 
             */
            searchByValue: async (collection, field, value) => {
                return await (await this.connection).collection(collection ? collection : this.collection).findOne({ [field]: value });
            },
            /**
             * ### Função que retorna todos os documentos através de uma chave e os seus valores. 
             * @param {*} collection - Coleção onde será feita a busca.
             * @param {*} field - Nome da chave que armazena o valor buscado.
             * @param {*} value - Valor da busca.
             * @returns {Array} Array
             */
            searchByFieldValue: async (collection, field, value) => {
                return await (await this.connection).collection(collection ? collection : this.collection).find({ [field]: value }).toArray();
            },
            /**
             * ### Função que retorna todos os documentos que possuírem, ou não possuírem, uma chave específica
             * @param {*} collection - Coleção onde será feita a busca.
             * @param {*} field - Nome da chave que armazena o valor buscado.
             * @returns 
             */
            searchDocumentsByField: async (collection, field, exists) => {
                return await (await this.connection).collection(collection ? collection : this.collection).find({ [field]: { $exists: true ? exists : false } }).toArray();
            },
            /**
             * ### Função que retorna o documento que possuir, ou não possuir, uma chave específica
             * @param {*} collection - Coleção onde será feita a busca.
             * @param {*} field - Nome da chave que armazena o valor buscado.
             * @returns 
             */
            searchDocumentByField: async (collection, field, exists) => {
                return await (await this.connection).collection(collection ? collection : this.collection).findOne({ [field]: { $exists: true ? exists : false } });
            },
        }
    }
}
