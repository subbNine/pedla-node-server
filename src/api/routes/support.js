const { Router } = require("express");

const { messageController, user: userControler } = require("../controllers");
const { catchAsync } = require("../../errors");

const shield = require("../middlewares/shield");

const router = Router();

router.use(shield());

/**
 * @api {post} /api/support/message Send Support Message
 * @apiName postSupportMessage
 * @apiGroup Support
 *
 * @apiParam {String} message message body
 * @apiParam {ID} to id of the user you wnat to message
 * @apiVersion 1.0.0
 *
 * @apiDescription Endpoint to post support message
 */
router.post("/message", catchAsync(messageController.send));

/**
 * @api {post} /api/support/message/:messageId Read a message sent to you
 * @apiName postSupportMessageMessageId
 * @apiGroup Support
 *
 * @apiParam {ID} messageId [url param] id of the message you want to mark as read
 * @apiVersion 1.0.0
 *
 * @apiDescription Endpoint to read message sent to you
 */
router.post("/message/:messageId", catchAsync(messageController.read));

/**
 * @api {get} /api/support/message/unread Get messages that has not been read
 * @apiName getSupportMessageUnread
 * @apiGroup Support
 *
 * @apiVersion 1.0.0
 *
 * @apiDescription Endpoint to get all unread messages
 */
router.get("/messages/unread", catchAsync(messageController.getUnread));

/**
 * @api {get} /api/support/message/read Get messages that has already been read
 * @apiName getSupportMessageRead
 * @apiGroup Support
 *
 * @apiVersion 1.0.0
 *
 * @apiDescription Endpoint to get all read messages
 */
router.get("/messages/read", catchAsync(messageController.getRead));

/**
 * @api {get} /api/support/agents Get support agents
 * @apiName getSupportAgents
 * @apiGroup Support
 *
 * @apiVersion 1.0.0
 *
 * @apiDescription Endpoint to get all support agents
 */
router.get("/agents", catchAsync(userControler.getSupportAgents));

module.exports = router;
