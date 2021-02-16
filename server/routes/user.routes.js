import express from 'express';

import {hasAuthorization, requireSignin} from './../controllers/auth.controller';
import { userByID, read, update, remove, adminBoard } from './../controllers/user.controller';

import { isAdmin } from './../middleware/verifySignup';

const router = express.Router()

router.route('/api/users/:userId')
    //Specific User
    .get(requireSignin, read)
    .put(requireSignin, hasAuthorization, update)
    .delete(requireSignin, hasAuthorization, remove)

router.route('/api/admin/:adminId')
    .get(requireSignin, adminBoard)

router.param('adminId', isAdmin)
router.param('userId', userByID)

export default router;