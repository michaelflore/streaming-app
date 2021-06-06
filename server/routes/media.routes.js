import express from 'express';
import { requireSignin } from "./../controllers/auth.controller";
import { create, mediaByID, video, listPopular, listByUser, incrementViews, read } from "./../controllers/media.controller";
import { userByID } from "../controllers/user.controller";

const router = express.Router();

//Add video
router.route('/api/media/new/:userId')
    .post(requireSignin, create)

//User skips to middle of video
router.route('/api/media/video/:mediaId')
    .get(video)

//List of popular media
router.route('/api/media/popular')
    .get(listPopular)

//List media by the user
router.route('/api/media/by/:userId')
    .get(listByUser)

//Read media
router.route('/api/media/:mediaId')
    .get(incrementViews, read)

router.param('userId', userByID)
router.param('mediaId', mediaByID)

export default router;