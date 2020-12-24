const { Router } = require("express");

const shield = require("../middlewares/shield");
const fileUpload = require("../middlewares/file-upload");
const { user: userController } = require("../controllers");
const { catchAsync } = require("../../errors");
const { permissions } = require("../../db/mongo/enums/user");

const router = Router();

router.use(shield(permissions.PERM002));

/**
 * @api {post} /api/file/single Upload Single File
 * @apiName postFileSingle
 * @apiGroup File Management
 *
 * @apiParam {File} file File to upload all soughts of file can be uploaded
 * @apiVersion 1.0.0
 *
 * @apiDescription Endpoint to upload single file. This endpoint will return
 * the url that can be used to retreive the file
 */
router.post(
	"/single",
	fileUpload.single("file"),
	catchAsync(userController.uploadFile)
);

module.exports = router;
