
const Employee = require('../models/Employees');
const asyncHandler = require('express-async-handler')

const getAllemployees = asyncHandler (async (req, res) => {
    const employees = await Employee.find();
    if(!employees) res.status(204).json({message:"No employees found!"})
    res.json({employees})
}) 

const createNewEmployee = asyncHandler (async (req, res) => {
    if(!req?.body?.firstname || !req?.body?.lastname){ 
        return res.status(400).json({ message: "Please provide first name and last name." })
    } 
   
    const result = await Employee.create({
        firstname:req.body.firstname,
            
        lastname:req.body.lastname
    });
    
    res.status(201).json({result})
   
}) 

const updateEmployee = asyncHandler(async (req, res) => {
    if(!req?.body?.id) {
       res.status(400).json({message:"ID parameter required!!"})
   }
   const employee = await Employee.findOne({_id:req.body.id}).exec();
   if (!employee) {
      return res.status(204).json({ message: `No employee found with ID: ${req.body.id}. ` });
   }
   if(req.body?.firstname) employee.firstname=req.body.firstname;
   if(req.body?.lastname) employee.lastname=req.body.lastname;
   
   const result = await employee.save();

   res.status(200).json({result})
}) 

const deleteEmployee = asyncHandler ( async (req, res) => {
    if(!req?.body?.id) {
        res.status(400).json({message:"employee ID required!!"})
    }
    const employee = await Employee.findOne({_id:req.body.id}).exec();
    if (!employee) {
        return res.status(204).json({ message: `No employee found with ID: ${req.body.id}. ` });
    }

    const result = await Employee.deleteOne({_id:req.body.id})
    res.json({result})

    
}) 

const getEmployee = asyncHandler ( async (req, res) => {
    if(req?.body?.params) {
        res.status(400).json({message:"employee id parameter required!!"})
    }
    const employee = await Employee.findOne({_id:req.params.id}).exec();
    if(!employee) {res.status(400).json({message:`No employee matches ${req.params.id}`})}
    res.json({employee})
}) 

module.exports = { getAllemployees, createNewEmployee, updateEmployee, deleteEmployee, getEmployee }