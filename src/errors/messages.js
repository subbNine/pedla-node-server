module.exports = {
	userNotFound: "User Not Found",
	notAuthenticated: "You have to be logged in to have access",
	notAuthorized: "User not Authorized",
	phoneNotAvailable: "Phone number not available",
	emailIsRequired: "Email is required",
	incorrectPassword: "Password is incorrect",
	incorrectEmail: "Email is incorrect",
	incorrectUsername: "Username is incorrect",
	incorrectCred: "Email or password is incorrect",
	incorrectPasscode: "The passcode you entered is incorrect",
	emailConflict: "A user already exists with this email",
	phoneConflict: "A user already exists with this phone number",
	otpNotIssued: "otp not issued",
	expiredOtp: "Expired or Invalid Otp",
	nameConflict: "An entity already exist with this name",
	userNameConflict: "The username has already been taken",
	invalidCode: "You have entered a wrong code",
	unverifiedProfile: "Profile not yet verified",
	messageHelpers: {
		replacement,
	},
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
