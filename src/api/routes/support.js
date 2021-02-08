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
 * @apiParam {String} content message body
 * @apiParam {ID} [to] id of the user you want to message. Admin alone, pass in this field
 * @apiParam {Number} [type=1] type of message. 1 = text, 2 =  image/file.
 * @apiVersion 1.0.0
 *
 * @apiDescription Endpoint to post support message. Support messages are of two types text designated by the integer 1 and image/file designated by the
 * integer 2. The content of type = 2 is the url of the image and that of type = 1 is the message text
 */
router.post("/message", catchAsync(messageController.send));

/**
 * @api {post} /api/support/messages/read Read unread messages sent to you
 * @apiName postSupportMessageMessageId
 * @apiGroup Support
 *
 * @apiVersion 1.0.0
 *
 * @apiDescription Endpoint to read unread messages sent to you
 */
router.post("/messages/read", catchAsync(messageController.read));

/**
 * @api {get} /api/support/messages?limit=4&page=1 Get messages
 * @apiName getSupportMessageUnread
 * @apiGroup Support
 *
 * @apiVersion 1.0.0
 *
 * @apiDescription Endpoint to get all messages
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 *  {"data": [
 *       {
 *           "id": "60058b6451662c8222130f1d",
 *           "type": 1,
 *           "content": " heyy i am supposed to be a driver",
 *           "sender": {
 *               "id": "5fd8b3fc7a78f300173bd7ee",
 *               "firstName": "James",
 *               "lastName": "Uso",
 *               "avatarImg": "https://res.cloudinary.com/dl7ajt4jv/image/upload/v1608876964/peddler_app/160887696337137337%7D.jpg",
 *               "presence": "online",
 *               "phoneNumber": "+2348123451746",
 *               "email": null,
 *               "address": null,
 *               "permission": 3,
 *               "type": "DRIVER",
 *               "isActive": false,
 *               "peddler": "5fd391cd841bc60017b619c6",
 *               "driverStats": null,
 *               "userName": "driver1",
 *               "truck": null,
 *               "latlon": {
 *                   "lon": 8.3441639,
 *                   "lat": 4.9814586
 *               }
 *           },
 *           "sentAt": "2021-01-18T13:21:40.883Z",
 *           "readAt": "2021-01-18T13:25:42.197Z"
 *       },
 *       {
 *           "id": "60058ae475f9417ba7c285a5",
 *           "type": 1,
 *           "content": " heyy i am supposed to be a driver",
 *           "sender": {
 *               "id": "5fd8b3fc7a78f300173bd7ee",
 *               "firstName": "James",
 *               "lastName": "Uso",
 *               "avatarImg": "https://res.cloudinary.com/dl7ajt4jv/image/upload/v1608876964/peddler_app/160887696337137337%7D.jpg",
 *               "presence": "online",
 *               "phoneNumber": "+2348123451746",
 *               "email": null,
 *               "address": null,
 *               "permission": 3,
 *               "type": "DRIVER",
 *               "isActive": false,
 *               "peddler": "5fd391cd841bc60017b619c6",
 *               "driverStats": null,
 *               "userName": "driver1",
 *               "truck": null,
 *               "latlon": {
 *                   "lon": 8.3441639,
 *                   "lat": 4.9814586
 *               }
 *           },
 *           "sentAt": "2021-01-18T13:19:32.127Z",
 *           "readAt": null
 *       },
 *       {
 *           "id": "60058abc75f9417ba7c285a4",
 *           "type": 1,
 *           "sender": {
 *               "id": "5fd8b3fc7a78f300173bd7ee",
 *               "firstName": "James",
 *               "lastName": "Uso",
 *               "avatarImg": "https://res.cloudinary.com/dl7ajt4jv/image/upload/v1608876964/peddler_app/160887696337137337%7D.jpg",
 *               "presence": "online",
 *               "phoneNumber": "+2348123451746",
 *               "email": null,
 *               "address": null,
 *               "permission": 3,
 *               "type": "DRIVER",
 *               "isActive": false,
 *               "peddler": "5fd391cd841bc60017b619c6",
 *               "driverStats": null,
 *               "userName": "driver1",
 *               "truck": null,
 *               "latlon": {
 *                   "lon": 8.3441639,
 *                   "lat": 4.9814586
 *               }
 *           },
 *           "sentAt": "2021-01-18T13:18:52.297Z",
 *           "readAt": null
 *       },
 *       {
 *           "id": "60058a1f75f9417ba7c285a3",
 *           "type": 1,
 *           "sender": {
 *               "id": "5fd8b3fc7a78f300173bd7ee",
 *               "firstName": "James",
 *               "lastName": "Uso",
 *               "avatarImg": "https://res.cloudinary.com/dl7ajt4jv/image/upload/v1608876964/peddler_app/160887696337137337%7D.jpg",
 *               "presence": "online",
 *               "phoneNumber": "+2348123451746",
 *               "email": null,
 *               "address": null,
 *               "permission": 3,
 *               "type": "DRIVER",
 *               "isActive": false,
 *               "peddler": "5fd391cd841bc60017b619c6",
 *               "driverStats": null,
 *               "userName": "driver1",
 *               "truck": null,
 *               "latlon": {
 *                   "lon": 8.3441639,
 *                   "lat": 4.9814586
 *               }
 *           },
 *           "sentAt": "2021-01-18T13:16:15.244Z",
 *           "readAt": null
 *       }
 *   ],
 *   "pagination": {
 *       "currentPage": 1,
 *       "totalPages": 1,
 *       "totalDocs": 4
 *   }
 * }
 */
router.get("/messages", catchAsync(messageController.getMessages));

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
 * @api {get} /api/support/last-message Get last message
 * @apiName getSupportLastMessage
 * @apiGroup Support
 *
 * @apiVersion 1.0.0
 *
 * @apiDescription Endpoint to get last message
 */
router.get("/last-message", catchAsync(messageController.getLastMessage));

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
