module.exports = {
	BadRequestError: { statusCode: 400, name: "BadRequestError" },
	UnauthorizedError: { statusCode: 401, name: "UnauthorizedError" },
	PaymentRequiredError: { statusCode: 402, name: "PaymentRequiredError" },
	ForbiddenError: { statusCode: 403, name: " ForbiddenError" },
	NotFoundError: { statusCode: 404, name: "NotFoundError" },
	MethodNotAllowedError: { statusCode: 405, name: "MethodNotAllowedError" },
	NotAcceptableError: { statusCode: 406, name: "NotAcceptableError" },
	PaymentRequiredError: {
		statusCode: 407,
		name: "ProxyAuthenticationRequiredError",
	},
	RequestTimeoutError: { statusCode: 408, name: "RequestTimeoutError" },
	ConflictError: { statusCode: 409, name: "ConflictError" },
	GoneError: { statusCode: 410, name: "GoneError" },
	InternalServerError: { statusCode: 500, name: "InternalServerError" },
	NotImplementedError: { statusCode: 501, name: "NotImplementedError" },
	BadGatewayError: { statusCode: 502, name: "BadGatewayError" },
	ResourceNotFoundError: {
		statusCode: 404,
		name: "ResourceNotFoundError",
	},
	MissingParameterError: { statusCode: 409, name: "MissingParameterError" },
	NotAuthorizedError: { statusCode: 403, name: "NotAuthorizedError" },
	InternalError: { statusCode: 500, name: "InternalError" },
	InvalidArgumentError: { statusCode: 409, name: "InvalidArgumentError" },
	ValidationError: { statusCode: 422, name: "ValidationError" },

	IncorrectEmailError: {
		statusCode: 400,
		name: "IncorrectEmailError",
	},
	IncorrectUsernameError: {
		statusCode: 400,
		name: "IncorrectUsernameError",
	},
	IncorrectPasswordError: {
		statusCode: 400,
		name: "IncorrectPasswordError",
	},
	NameConflictError: { statusCode: 409, name: "NameConflictError" },
	EmailConflictError: {
		statusCode: 409,
		name: "EmailConflictError",
	},
	WrongAssignment: {
		statusCode: 400,
		name: "WrongAssignment",
	},
	DupplicateAssignmentError: {
		statusCode: 409,
		name: "DupplicateAssignmentError",
	},
	NotAcceptableOrderError: {
		statusCode: 406,
		name: "NotAcceptableOrderError",
	},
	PhoneConflictError: {
		statusCode: 404,
		name: "PhoneConflictError",
	},
	ExpiredOtp: { statusCode: 400, name: "ExpiredOtp" },
	IncorrectOtp: { statusCode: 400, name: "IncorrectOtp" },
	OtpNotIssued: { statusCode: 400, name: "OtpNotIssued" },
	InvalidCodeError: { statusCode: 400, name: "InvalidCodeError" },
	UnverifiedProfileError: { statusCode: 400, name: "UnverifiedProfileError" },
};
