const cloudinary = require("cloudinary").v2;

function getFilename(_req, _file, cb) {
	cb(null);
}

function getDestination(_req, _file, cb) {
	cb(null);
}

function CloudinaryStorage(opts) {
	if (typeof opts.filename === "string") {
		this.getFilename = function (_req, _file, cb) {
			cb(null, opts.filename);
		};
	} else {
		this.getFilename = opts.filename || getFilename;
	}

	if (typeof opts.destination === "string") {
		this.getDestination = function (_req, _file, cb) {
			cb(null, { folder: opts.destination });
		};
	} else {
		this.getDestination = opts.destination || getDestination;
	}

	if (opts.config) {
		this.config(opts.config);
	}
}

CloudinaryStorage.prototype.config = function config({
	api_key,
	api_secret,
	cloud_name,
}) {
	this._cloudinary.config({ api_key, api_secret, cloud_name });
};

CloudinaryStorage.prototype._cloudinary = cloudinary;

CloudinaryStorage.prototype._handleFile = function _handleFile(req, file, cb) {
	const _cloudinary = this._cloudinary;

	this.getDestination(req, file, (err, destination) => {
		if (err) return cb(err);

		const uploadOptions = { resource_type: "auto" };

		if (destination) {
			Object.assign(uploadOptions, destination);
		}

		this.getFilename(req, file, (err, filename) => {
			if (err) return cb(err);

			if (filename) {
				Object.assign(uploadOptions, { public_id: filename });
			}

			const uploadStream = _cloudinary.uploader.upload_stream(
				uploadOptions,
				(err, result) => {
					if (err) return cb(err);

					cb(null, result);
				}
			);

			file.stream.pipe(uploadStream);
			uploadStream.on("error", cb);
		});
	});
};

CloudinaryStorage.prototype._removeFile = function _removeFile(req, file, cb) {
	const _cloudinary = this._cloudinary;
	const public_id = file.public_id;

	_cloudinary.uploader.destroy(public_id, cb);
};

module.exports = function (opts) {
	return new CloudinaryStorage(opts);
};
