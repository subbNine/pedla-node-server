define({ "api": [
  {
    "type": "get",
    "url": "/api/user/admin/products",
    "title": "Fetch added products",
    "name": "getProducts",
    "group": "Admin_Product_Management",
    "version": "1.0.0",
    "description": "<p>Fetch all products added</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>product name.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>product description</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "ID",
            "optional": false,
            "field": "id",
            "description": "<p>product id</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/user/admin.js",
    "groupTitle": "Admin_Product_Management",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NameConflictError",
            "description": "<p>An entity already exists with the passed in name</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 409 Conflict Error\n{\n\t\"name\": \"NameConflictError\",\n\t\"message\": \"name already exists\",\n\t\"isOperational\": true\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/api/user/admin/product",
    "title": "Product Addition from admin dashboard",
    "name": "postProduct",
    "group": "Admin_Product_Management",
    "version": "1.0.0",
    "description": "<p>Create new Product. It is with this endpoint that the respective products (DPK, AGO, PMS, ...etc) will be added to the System by the admin.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>product name.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>product description</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "ID",
            "optional": false,
            "field": "id",
            "description": "<p>product id</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/user/admin.js",
    "groupTitle": "Admin_Product_Management",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NameConflictError",
            "description": "<p>An entity already exists with the passed in name</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 409 Conflict Error\n{\n\t\"name\": \"NameConflictError\",\n\t\"message\": \"name already exists\",\n\t\"isOperational\": true\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "put",
    "url": "/api/user/admin/product/:productId",
    "title": "Product Update from admin dashboard",
    "name": "putProduct",
    "group": "Admin_Product_Management",
    "version": "1.0.0",
    "description": "<p>Update Product</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>product name.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>product description</p>"
          },
          {
            "group": "Parameter",
            "type": "ID",
            "optional": false,
            "field": "productId",
            "description": "<p>id of the product that is about to be updated</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "ID",
            "optional": false,
            "field": "id",
            "description": "<p>product id</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/user/admin.js",
    "groupTitle": "Admin_Product_Management",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NameConflictError",
            "description": "<p>An entity already exists with the passed in name</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 409 Conflict Error\n{\n\t\"name\": \"NameConflictError\",\n\t\"message\": \"name already exists\",\n\t\"isOperational\": true\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/api/auth/admin/signin",
    "title": "Admin Sign In",
    "name": "postAdminSignin",
    "group": "Authentication",
    "version": "1.0.0",
    "description": "<p>Admin authentication</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>User's email.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>User's Password.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>Authentication token</p>"
          },
          {
            "group": "Success 200",
            "type": "ID",
            "optional": false,
            "field": "id",
            "description": "<p>user id</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/auth.js",
    "groupTitle": "Authentication",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "IncorrectEmailError",
            "description": "<p>A user with the email was not found</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "IncorrectPasswordError",
            "description": "<p>The password of the user is incorrect</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n\t\"name\": \"IncorrectEmailError\",\n\t\"message\": \"The email you entered was not found\",\n\t\"isOperational\": true\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n\t\"name\": \"IncorrectPasswordError\",\n\t\"message\": \"The password you entered is incorrect\",\n\t\"isOperational\": true\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/api/auth/buyer",
    "title": "Buyer's Signup endpoint",
    "name": "postBuyer",
    "group": "Authentication",
    "version": "1.0.0",
    "description": "<p>Endpoint to sign buyers up to the platform</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "firstName",
            "description": "<p>User's first name.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "lastName",
            "description": "<p>User's last name.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "phoneNumber",
            "description": "<p>User's Phone number</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "address",
            "description": "<p>Address of the buyer</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>Password of the buyer</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Email address of peddler</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>Authentication token</p>"
          },
          {
            "group": "Success 200",
            "type": "ID",
            "optional": false,
            "field": "id",
            "description": "<p>user id</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/auth.js",
    "groupTitle": "Authentication",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "EmailConflictError",
            "description": "<p>User already exists with the passed in email</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 409 Conflict Error\n{\n\t\"name\": \"EmailConflictError\",\n\t\"message\": \"email already exists\",\n\t\"isOperational\": true\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/api/auth/peddler",
    "title": "Create Peddler Profile",
    "name": "postPeddler",
    "group": "Authentication",
    "version": "1.0.0",
    "description": "<p>Endpoint to Create Peddler's Profile. Calling this endpoint will return a temporary token that will be used to access all routes that the peddler has to hit to complete account creation</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "firstName",
            "description": "<p>User's first name.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "lastName",
            "description": "<p>User's last name.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "phoneNumber",
            "description": "<p>User's Phone number</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "nTrucks",
            "description": "<p>Number of trucks owned by peddler</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "pooImage",
            "description": "<p>Proof of ownership of trucks owned by peddlers</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Email address of peddler</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>Authentication token</p>"
          },
          {
            "group": "Success 200",
            "type": "ID",
            "optional": false,
            "field": "id",
            "description": "<p>user id</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/auth.js",
    "groupTitle": "Authentication",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "EmailConflictError",
            "description": "<p>User already exists with the passed in email</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 409 Conflict Error\n{\n\t\"name\": \"EmailConflictError\",\n\t\"message\": \"email already exists\",\n\t\"isOperational\": true\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/api/auth/peddler-signup",
    "title": "Peddler's signup endpoint",
    "name": "postPeddler",
    "group": "Authentication",
    "version": "1.0.0",
    "description": "<p>Peddler's signup route. This route is protected as it needs to be called with the token gotten from calling the route that creates peddlers profile</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "userName",
            "description": "<p>Peddler's username.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>Peddler's Password</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "ID",
            "optional": false,
            "field": "id",
            "description": "<p>user id</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/auth.js",
    "groupTitle": "Authentication",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NameConflictError",
            "description": "<p>An entity already exists with the passed in name</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UnverifiedProfileError",
            "description": "<p>Error thrown if pedddler tries to signup before verification</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 409 Conflict Error\n{\n\t\"name\": \"NameConflictError\",\n\t\"message\": \"name already exists\",\n\t\"isOperational\": true\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n\t\"name\": \"UnverifiedProfileError\",\n\t\"message\": \"Profile not yet verified\",\n\t\"isOperational\": true\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/api/auth/peddler-code",
    "title": "Peddler's code Activation",
    "name": "postPeddlerCode",
    "group": "Authentication",
    "version": "1.0.0",
    "description": "<p>verifies registration code recieved by peddlers when admin has approved a peddler's profile. This route is protected just like the signup route</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "code",
            "description": "<p>Peddler's registration code.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "ID",
            "optional": false,
            "field": "id",
            "description": "<p>user id</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/auth.js",
    "groupTitle": "Authentication",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidCodeError",
            "description": "<p>Wrong registration code</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n\t\"name\": \"InvalidCodeError\",\n\t\"message\": \"You have entered a wrong code\",\n\t\"isOperational\": true\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/api/auth/peddler/signin",
    "title": "Peddler Sign In",
    "name": "postPeddlerSignin",
    "group": "Authentication",
    "version": "1.0.0",
    "description": "<p>Peddlers Sign In end-point. Calling this endpoint will return a a temporary restricted token and will send an otp to the peddler. the token will be used to identify the user during otp verification. on OTP verification a permenent token will be sent</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "userName",
            "description": "<p>User's unique Username.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>User's Password.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>Authentication token</p>"
          },
          {
            "group": "Success 200",
            "type": "ID",
            "optional": false,
            "field": "id",
            "description": "<p>user id</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/auth.js",
    "groupTitle": "Authentication",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "IncorrectUsernameError",
            "description": "<p>The username of the user is incorrect</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "IncorrectPasswordError",
            "description": "<p>The password of the user is incorrect</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n{\n\t\"name\": \"IncorrectUsernameError\",\n\t\"message\": \"The username you entered is incorrect\",\n\t\"isOperational\": true\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n\t\"name\": \"IncorrectPasswordError\",\n\t\"message\": \"The password you entered is incorrect\",\n\t\"isOperational\": true\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "put",
    "url": "/api/user/admin/verify-peddler/:peddlerId",
    "title": "Admin verification of peddler profile",
    "name": "postPeddlerVerification",
    "group": "Authentication",
    "version": "1.0.0",
    "description": "<p>verify peddler profile</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "ID",
            "optional": false,
            "field": "peddlerId",
            "description": "<p>Peddler's id.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "ID",
            "optional": false,
            "field": "id",
            "description": "<p>user id</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/user/admin.js",
    "groupTitle": "Authentication"
  },
  {
    "type": "put",
    "url": "/api/user/admin/reject-peddler/:peddlerId",
    "title": "Admin verification of peddler profile",
    "name": "postPeddlerVerification",
    "group": "Authentication",
    "version": "1.0.0",
    "description": "<p>reject peddler profile</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "ID",
            "optional": false,
            "field": "peddlerId",
            "description": "<p>Peddler's id.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "ID",
            "optional": false,
            "field": "id",
            "description": "<p>user id</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/user/admin.js",
    "groupTitle": "Authentication"
  },
  {
    "type": "post",
    "url": "/api/auth/signin",
    "title": "Buyer Sign In",
    "name": "postSignin",
    "group": "Authentication",
    "version": "1.0.0",
    "description": "<p>Buyers Sign In end-point</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "userName",
            "description": "<p>User's unique Username.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>User's Password.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>Authentication token</p>"
          },
          {
            "group": "Success 200",
            "type": "ID",
            "optional": false,
            "field": "id",
            "description": "<p>user id</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/auth.js",
    "groupTitle": "Authentication",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "IncorrectUsernameError",
            "description": "<p>The username of the user is incorrect</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "IncorrectPasswordError",
            "description": "<p>The password of the user is incorrect</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n{\n\t\"name\": \"IncorrectUsernameError\",\n\t\"message\": \"The username you entered is incorrect\",\n\t\"isOperational\": true\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n\t\"name\": \"IncorrectPasswordError\",\n\t\"message\": \"The password you entered is incorrect\",\n\t\"isOperational\": true\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/api/user/peddler/drivers",
    "title": "Get peddler's truck drivers",
    "name": "gettPeddlerDrivers",
    "group": "Driver_Management",
    "version": "1.0.0",
    "description": "<p>This endpoint will enable peddlers to fetch all their Drivers</p>",
    "filename": "src/api/routes/user/peddler.js",
    "groupTitle": "Driver_Management"
  },
  {
    "type": "post",
    "url": "/api/user/peddler/driver",
    "title": "Create truck Driver",
    "name": "postPeddlerDriver",
    "group": "Driver_Management",
    "version": "1.0.0",
    "description": "<p>This endpoint will enable peddlers to create their Drivers</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "firstName",
            "description": "<p>First name of the driver</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "lastName",
            "description": "<p>LastName of the driver</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>Password of the driver</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Email of the driver</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "phoneNumber",
            "description": "<p>Phone Number of the driver</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "userName",
            "description": "<p>User name of the driver</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/user/peddler.js",
    "groupTitle": "Driver_Management"
  },
  {
    "type": "post",
    "url": "/api/user/peddler/driver/:driverId",
    "title": "Update truck Driver",
    "name": "postPeddlerDriverUpdate",
    "group": "Driver_Management",
    "version": "1.0.0",
    "description": "<p>This endpoint will enable peddlers to update profiles of their Drivers</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "firstName",
            "description": "<p>First name of the driver</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "lastName",
            "description": "<p>LastName of the driver</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>Password of the driver</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Email of the driver</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "phoneNumber",
            "description": "<p>Phone Number of the driver</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "userName",
            "description": "<p>User name of the driver</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/user/peddler.js",
    "groupTitle": "Driver_Management"
  },
  {
    "type": "post",
    "url": "/api/user/peddler/geo-location",
    "title": "Geo-location Update for peddlers",
    "name": "postPeddlerGeoLocation",
    "group": "Geo-location",
    "version": "1.0.0",
    "description": "<p>This updates the peddler's Geo-location</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "lat",
            "description": "<p>latitude of the coordinate</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "lon",
            "description": "<p>longitude of the coordinate</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/user/peddler.js",
    "groupTitle": "Geo-location"
  },
  {
    "type": "get",
    "url": "/api/user/peddler/own-products",
    "title": "Retrieve products owned by peddler",
    "name": "getOwnProducts",
    "group": "Peddler_Product_Management",
    "version": "1.0.0",
    "description": "<p>This endpoint enables peddler's retreive products owned by them (i.e products added by them). The end point requires that you pass in no parameters</p>",
    "filename": "src/api/routes/user/peddler.js",
    "groupTitle": "Peddler_Product_Management"
  },
  {
    "type": "get",
    "url": "/api/user/peddler/products",
    "title": "Retrieve products addded by the admin to the system",
    "name": "getProducts",
    "group": "Peddler_Product_Management",
    "version": "1.0.0",
    "description": "<p>This endpoint enables peddler's retreive products in the system that has been added by the admin</p>",
    "filename": "src/api/routes/user/peddler.js",
    "groupTitle": "Peddler_Product_Management"
  },
  {
    "type": "post",
    "url": "/api/user/peddler/own-products",
    "title": "Peddler's Product creation",
    "name": "postPeddlerProduct",
    "group": "Peddler_Product_Management",
    "version": "1.0.0",
    "description": "<p>This endpoint enables peddler's to create products</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object[]",
            "optional": false,
            "field": "products",
            "description": "<p>list of Products</p>"
          },
          {
            "group": "Parameter",
            "type": "ID",
            "optional": false,
            "field": "productId",
            "description": "<p>id of the product.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "residentialAmt",
            "description": "<p>Residential Amount of the product</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "commercialAmt",
            "description": "<p>Commercial Amount of the the product</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "commercialOnCrAmt",
            "description": "<p>Commercial On Credit Amount of the Product</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "quantity",
            "description": "<p>Quantity in litres of the Product</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/user/peddler.js",
    "groupTitle": "Peddler_Product_Management",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NameConflictError",
            "description": "<p>An entity already exists with the passed in name</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 409 Conflict Error\n{\n\t\"name\": \"NameConflictError\",\n\t\"message\": \"name already exists\",\n\t\"isOperational\": true\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/api/user/admin/peddlers?vstatus=uncategorized",
    "title": "get peddlers",
    "name": "getPeddlers",
    "group": "Peddler_Verification",
    "version": "1.0.0",
    "description": "<p>Get peddlers by verification status</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "vStatus",
            "description": "<p>Verification status verified|unverified|uncategorized</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/user/admin.js",
    "groupTitle": "Peddler_Verification"
  },
  {
    "type": "post",
    "url": "/api/user/buyer/offline",
    "title": "Set Buyer's Presence to offline",
    "name": "postBuyerPresenceOffline",
    "group": "Presence_Management",
    "version": "1.0.0",
    "description": "<p>Set buyer's presence status to offline</p>",
    "filename": "src/api/routes/user/buyer.js",
    "groupTitle": "Presence_Management"
  },
  {
    "type": "post",
    "url": "/api/user/buyer/online",
    "title": "Set Buyer's Presence to online",
    "name": "postBuyerPresenceOnline",
    "group": "Presence_Management",
    "version": "1.0.0",
    "description": "<p>Set buyer's presence status to online</p>",
    "filename": "src/api/routes/user/buyer.js",
    "groupTitle": "Presence_Management"
  },
  {
    "type": "post",
    "url": "/api/user/driver/offline",
    "title": "Set Driver's Presence to offline",
    "name": "postDriverPresenceOffline",
    "group": "Presence_Management",
    "version": "1.0.0",
    "description": "<p>Set driver's presence status to offline</p>",
    "filename": "src/api/routes/user/driver.js",
    "groupTitle": "Presence_Management"
  },
  {
    "type": "post",
    "url": "/api/user/driver/online",
    "title": "Set Driver's Presence to online",
    "name": "postDriverPresenceOnline",
    "group": "Presence_Management",
    "version": "1.0.0",
    "description": "<p>Set driver's presence status to online</p>",
    "filename": "src/api/routes/user/driver.js",
    "groupTitle": "Presence_Management"
  },
  {
    "type": "post",
    "url": "/api/user/peddler/offline",
    "title": "Set Peddler's Presence to offline",
    "name": "postPresenceOffline",
    "group": "Presence_Management",
    "version": "1.0.0",
    "description": "<p>Set peddler's presence status to offline</p>",
    "filename": "src/api/routes/user/peddler.js",
    "groupTitle": "Presence_Management"
  },
  {
    "type": "post",
    "url": "/api/user/peddler/online",
    "title": "Set Peddler's Presence to online",
    "name": "postPresenceOnline",
    "group": "Presence_Management",
    "version": "1.0.0",
    "description": "<p>Set peddler's presence status to online</p>",
    "filename": "src/api/routes/user/peddler.js",
    "groupTitle": "Presence_Management"
  },
  {
    "type": "get",
    "url": "/api/user/peddler/profile",
    "title": "get peddler's profile",
    "name": "getProfileUpdate",
    "group": "Profile_Management",
    "version": "1.0.0",
    "description": "<p>get peddler's profile</p>",
    "filename": "src/api/routes/user/peddler.js",
    "groupTitle": "Profile_Management"
  },
  {
    "type": "post",
    "url": "/api/user/buyer/profile",
    "title": "Update buyer's profile",
    "name": "postBuyerProfileUpdate",
    "group": "Profile_Management",
    "version": "1.0.0",
    "description": "<p>update buyer's profile</p>",
    "filename": "src/api/routes/user/buyer.js",
    "groupTitle": "Profile_Management"
  },
  {
    "type": "post",
    "url": "/api/user/driver/profile",
    "title": "Update driver's profile",
    "name": "postDriverProfileUpdate",
    "group": "Profile_Management",
    "version": "1.0.0",
    "description": "<p>update driver's profile</p>",
    "filename": "src/api/routes/user/driver.js",
    "groupTitle": "Profile_Management"
  },
  {
    "type": "post",
    "url": "/api/user/peddler/profile",
    "title": "Update peddler's profile",
    "name": "postProfileUpdate",
    "group": "Profile_Management",
    "version": "1.0.0",
    "description": "<p>update peddler's profile</p>",
    "filename": "src/api/routes/user/peddler.js",
    "groupTitle": "Profile_Management"
  },
  {
    "type": "get",
    "url": "/api/user/peddler/trucks",
    "title": "Get trucks",
    "name": "getPeddlerTrucks",
    "group": "Truck_Management",
    "version": "1.0.0",
    "description": "<p>This endpoint will enable peddlers fetch all their trucks</p>",
    "filename": "src/api/routes/user/peddler.js",
    "groupTitle": "Truck_Management"
  },
  {
    "type": "post",
    "url": "/api/user/peddler/truck",
    "title": "Create truck",
    "name": "postPeddlerTruck",
    "group": "Truck_Management",
    "version": "1.0.0",
    "description": "<p>This endpoint will enable peddlers to add their truck which will later be assigned to drivers</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "model",
            "description": "<p>truck model number</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "brand",
            "description": "<p>truck Brand</p>"
          },
          {
            "group": "Parameter",
            "type": "ID",
            "optional": false,
            "field": "product",
            "description": "<p>type of product loaded on the truck</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "size",
            "description": "<p>size of truck in litres</p>"
          },
          {
            "group": "Parameter",
            "type": "File",
            "optional": false,
            "field": "license",
            "description": "<p>truck liscence</p>"
          },
          {
            "group": "Parameter",
            "type": "File",
            "optional": false,
            "field": "insurance",
            "description": "<p>the truck's insurance</p>"
          },
          {
            "group": "Parameter",
            "type": "File",
            "optional": false,
            "field": "worthiness",
            "description": "<p>the truck's road worthiness</p>"
          },
          {
            "group": "Parameter",
            "type": "File",
            "optional": false,
            "field": "ownership",
            "description": "<p>the truck's proof of ownership</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/user/peddler.js",
    "groupTitle": "Truck_Management"
  },
  {
    "type": "post",
    "url": "/api/user/peddler/truck/:truckId",
    "title": "Update truck",
    "name": "postPeddlerTruckUpdate",
    "group": "Truck_Management",
    "version": "1.0.0",
    "description": "<p>This endpoint will enable peddlers to update their Truck</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "model",
            "description": "<p>truck model number</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "brand",
            "description": "<p>truck Brand</p>"
          },
          {
            "group": "Parameter",
            "type": "ID",
            "optional": false,
            "field": "product",
            "description": "<p>type of product loaded on the truck</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "size",
            "description": "<p>size of truck in litres</p>"
          },
          {
            "group": "Parameter",
            "type": "File",
            "optional": false,
            "field": "license",
            "description": "<p>truck liscence</p>"
          },
          {
            "group": "Parameter",
            "type": "File",
            "optional": false,
            "field": "insurance",
            "description": "<p>the truck's insurance</p>"
          },
          {
            "group": "Parameter",
            "type": "File",
            "optional": false,
            "field": "worthiness",
            "description": "<p>the truck's road worthiness</p>"
          },
          {
            "group": "Parameter",
            "type": "File",
            "optional": false,
            "field": "ownership",
            "description": "<p>the truck's proof of ownership</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/user/peddler.js",
    "groupTitle": "Truck_Management"
  },
  {
    "type": "get",
    "url": "/api/user/peddler/trucks-drivers",
    "title": "get Trucks which have been assigned Driver",
    "name": "getTrucksDrivers",
    "group": "Trucks_And_Drivers_Management",
    "version": "1.0.0",
    "description": "<p>This endpoint will enable peddlers retrieve assigned trucks and drivers</p>",
    "filename": "src/api/routes/user/peddler.js",
    "groupTitle": "Trucks_And_Drivers_Management"
  },
  {
    "type": "get",
    "url": "/api/user/peddler/nearest-drivers?lat={lat}&&lon={lon}&&radius={search-radius}",
    "title": "get Trucks which have been assigned Driver",
    "name": "getTrucksDrivers",
    "group": "Trucks_And_Drivers_Management",
    "version": "1.0.0",
    "description": "<p>This endpoint will fetch all online drivers within the radius passed in from the coordinate specified by lat and lon params</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "lat",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "lon",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "radius",
            "defaultValue": "5",
            "description": ""
          }
        ]
      }
    },
    "filename": "src/api/routes/user/peddler.js",
    "groupTitle": "Trucks_And_Drivers_Management"
  },
  {
    "type": "post",
    "url": "/api/user/peddler/truck-driver",
    "title": "Assign Trucks to Driver",
    "name": "postTruckAndDriver",
    "group": "Trucks_And_Drivers_Management",
    "version": "1.0.0",
    "description": "<p>This endpoint will enable peddlers assign trucks to drivers</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "ID",
            "optional": false,
            "field": "driverId",
            "description": "<p>Id of the driver to assign to a truck</p>"
          },
          {
            "group": "Parameter",
            "type": "ID",
            "optional": false,
            "field": "truckId",
            "description": "<p>Id of the truck to assign to a driver</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/user/peddler.js",
    "groupTitle": "Trucks_And_Drivers_Management",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "DupplicateAssignmentError",
            "description": "<p>This error occurs when you have duplicate assignment to an entity</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 409 Bad Request\n{\n\t\"name\": \"DupplicateAssignmentError\",\n\t\"message\": \"The passed in Truck has already been assigned to the passed in driver\",\n\t\"isOperational\": true\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/api/user/peddler/truck-driver/:truckAndDriverId",
    "title": "update Trucks to Driver Assignment",
    "name": "postTruckAndDriverUpdate",
    "group": "Trucks_And_Drivers_Management",
    "version": "1.0.0",
    "description": "<p>This endpoint will enable peddlers update trucks to drivers assignment</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "ID",
            "optional": false,
            "field": "driverId",
            "description": "<p>Id of the driver to assign to a truck</p>"
          },
          {
            "group": "Parameter",
            "type": "ID",
            "optional": false,
            "field": "truckId",
            "description": "<p>Id of the truck to assign to a driver</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/user/peddler.js",
    "groupTitle": "Trucks_And_Drivers_Management",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "DupplicateAssignmentError",
            "description": "<p>This error occurs when you have duplicate assignment to an entity</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 409 Bad Request\n{\n\t\"name\": \"DupplicateAssignmentError\",\n\t\"message\": \"The passed in Truck has already been assigned to the passed in driver\",\n\t\"isOperational\": true\n}",
          "type": "json"
        }
      ]
    }
  }
] });
