import express from 'express'
import { signin, signup, signout } from './../controllers/auth.controller';
import { checkDuplicateEmail, checkRolesExisted } from './../middleware/verifySignup';

const router = express.Router()

router.route('/auth/signup').post(checkDuplicateEmail, checkRolesExisted, signup)

router.route('/auth/signin').post(signin)
router.route('/auth/signout').get(signout)

export default router;