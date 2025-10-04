const PoiModel = require("../models/pois")

/**
 * Obtener lista de pois de la base de datos
 * @param {*} req 
 * @param {*} res 
 */
const getItems = async (req, res) => {
    const data = await PoiModel.find({})
    res.send(data)
}

/**
 * Obtener un elemento de la base de datos
 * @param {*} req 
 * @param {*} res 
 */
const getItem = (req, res) => {

}

/**
 * Crea un registro nuevo
 * @param {*} req 
 * @param {*} res 
 */
const createItem = async (req, res) => {
    const body = req.body
    console.log(body)
    const data = await PoiModel.create(body)
    res.send({data})
}

/**
 * Actualiza un registro
 * @param {*} req 
 * @param {*} res 
 */
const updateItem = (req, res) => {

}

/**
 * Elimina un registro
 * @param {*} req 
 * @param {*} res 
 */
const deleteItem = (req, res) => {

}

module.exports = {getItems, getItem, createItem, updateItem, deleteItem}