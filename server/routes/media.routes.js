import express from 'express';
import { requireSignin } from "./../controllers/auth.controller";
import { create } from "./../controllers/media.controller";
import { userByID } from "../controllers/user.controller";

const router = express.Router();

router.route('/api/media/new/:userId')
    .post(requireSignin, create)

router.param('userId', userByID)

export default router;