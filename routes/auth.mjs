import express from "express";
const router = express.Router()
import userModel from '../models/User.mjs'
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import fetchUser from "../Middleware/fetchUser.mjs";
import * as dotenv from 'dotenv' 
dotenv.config()
const jwt_key = process.env.JWT_KEY

// app.use(cors());


router.post('/createuser', [body('email', 'Enter a valid email').isEmail(),
body('firstName', 'Name length should be greater than 2').isLength({ min: 3 }),
body('password', 'Name length should be greater than 4').isLength({ min: 5 })]
    , async (req, res) => {

        let success = false;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });

        }

        var salt = bcrypt.genSaltSync(10);
        let hashedPass = bcrypt.hashSync(req.body.password, salt);


        let newUser = {
            name: req.body.firstName,
            email: req.body.email.toLowerCase(),
            password: hashedPass
        }
        try {
            let hasUser = await userModel.findOne({ email: req.body.email })
            if (hasUser) {
                return res.status(400).json({ err: "Sorry a user with this email id already exists" })
            }
        }
        catch (err) {
            console.log(err.message);
            res.status(500).send("Internal Database error!")
        }

        try {
            let user = await userModel.create(newUser);
            var token = jwt.sign({ user: { id: user._id } }, jwt_key);
            success=true;
            res.json({ success, token })
        }
        catch (err) {
            console.log(err.message);
            res.status(500).send("Internal Server error!")
        }

    })



router.post('/login', [body('email', 'Enter a valid email').isEmail(),
body('password', 'Password cannot be empty').exists()]
    , async (req, res) => {
        let success = false;
        const { email, password } = req.body;
        try {
            const user = await userModel.findOne({ email });
            if (!user) {
                success = false;
                return  res.json({ success, message: " User does not exists " })
            }
            const pass_match = bcrypt.compareSync(password, user.password);
            if (!pass_match) {
                success = false;
                return res.json({ success, message: "Enter correct credentials." })
            }
            var token = jwt.sign({ user: { id: user._id } }, jwt_key);
            success = true;
            res.json({ success, token })
        }
        catch (err) {
            console.log(err.message);
            res.status(500).send("Internal Server error!")
        }

    })




router.post('/getuser', fetchUser, async (req, res) => {
    try {
        const user = await userModel.findById(req.user.id).select("-password");
        res.send(user);
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal Server error!")
    }
})



export default router;