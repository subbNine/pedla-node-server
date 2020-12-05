/***
 * define routes global variables and attach to req object
 * @param {object} req - request object
 * @param {object} res - response object
 * @param {function} next - next callback
 */
module.exports = async function initExpressGlobalVars(req, res, next) {
	const __APP_ROOT_DIR = getBaseDir();
	req._App.rootDir = __APP_ROOT_DIR;

	next();
};

function getBaseDir() {
	const fileDir = __dirname;
	const baseDir = fileDir.split(/.?src.?/)[0];
	return baseDir;
}
