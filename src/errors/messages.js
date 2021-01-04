module.exports = {
	userNotFound: "User Not Found",
	notAuthenticated: "You have to be logged in to have access",
	notAuthorized: "User not Authorized",
	phoneNotAvailable: "Phone number not available",
	emailIsRequired: "Email is required",
	incorrectPassword: "Password is incorrect",
	incorrectEmail:
		"The email address you entered is not associated with any account. Double-check your email address and try again",

	incorrectUsername: "Username is incorrect",
	incorrectCred: "Email or password is incorrect",
	incorrectPasscode: "The passcode you entered is incorrect",
	emailConflict: "A user exists with this email",
	phoneConflict: "A user already exists with this phone number",
	otpNotIssued: "otp not issued",
	expiredOtp: "Expired or Invalid Otp",
	nameConflict: "An entity already exist with this name",
	userNameConflict: "The username has already been taken",
	truckAndDriverConflict: "This truck has already been assigned to the driver",
	wrongDriverAssignment:
		"You are attempting to assign a driver you did not create",
	wrongTruckAssignment:
		"You are attempting to assign a truck you did not create",
	invalidCode: "You have entered a wrong code",
	invalidOrderState: "You cannot have more than one order in progress",
	unverifiedProfile: "Profile not yet verified",
	messageHelpers: {
		replacement,
	},
	notAcceptableOrder:
		"The order cannot be completed as the driver has a pending order",
};

function replacement(subjectArg, subjectNameArg) {
	const subject = "%subject%";
	const subjectName = "%subjectName%";
	return (match) =>
		match === subject
			? subjectArg
			: match === subjectName
			? subjectNameArg
			: "";
}
