const db = require("../config/dbMySQL.js");
const { v4: uuidv4 } = require('uuid');
// "G6A(7Hr|_ed$jr7#5k}?"
const CryptoJS = require("crypto-js");

const Joi = require("joi");
// creamos schema de validacion de user
const userSchema = Joi.object({
    username: Joi.string().min(3).max(15).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
});

exports.getAllUsers = async (req, res) => {
    let connection; // declarada fuera para que se pueda acceder desde cada bloque
    try {
        connection = await db.getConnection();
        const [result] = await connection.query("select * from users");
        // TODO: Verificar por que no sale el mensaje "No se encontraron usuarios"
        if (result.length === 0) {
            return res.status(204).json({
                message: "No se encontraron usuarios"
            });
        }
        return res.status(200).json({
            message: "Lista de usuarios encontrados",
            result
        });
    } catch (error) {
        return res.status(500).json({
            message: "No se pudo obtener los usuarios",
            error: "Error 500: " + error
        });
    } finally {
        connection.release();
    }
}

exports.createUser = async (req, res) => {
    let connection;
    try {
        // validar 
        const { error } = userSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                message: error.details[0].message,
                error: "Error de validación"
            });
        }
        // destructuring object
        const { username, email, password } = req.body;
        // TODO: Validar que el email no este registrado en MySQL
        const id = uuidv4();
        const hashPassword = CryptoJS.AES.encrypt(password, process.env.CRYPTO_SECRET).toString();
        // evitar inyección sql
        connection = await db.getConnection();
        const sql = "insert into users values (?, ?, ?, ?, default, default)";
        await connection.query(sql, [id, username, email, hashPassword]);
        return res.status(201).json({
            message: "Usuario registrado correctamente",
            user: { id, username, email, hashPassword }
        });
    } catch (error) {
        return res.status(500).json({
            message: "No se pudo registrar usuario",
            error: "Error 500: " + error
        });
    } finally {
        connection.release();
    }
}

// TODO: getUserById, updateUser, deleteUser