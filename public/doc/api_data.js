define({ "api": [
  {
    "type": "get",
    "url": "/api/user/admin/orders?status=pending+accepted&limit=30&page=1",
    "title": "Retrieve orders",
    "name": "getAdminOrders",
    "group": "Admin_-_Order",
    "version": "1.0.0",
    "description": "<p>Return orders based on status (pending|accepted|completed|rejected) passed in the status query params. To return results with more than one status, seperate the status passed in the query with a plus symbol</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "status",
            "description": "<p>order status. multiple order status should be seperated with a &quot;+&quot; symbol</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/user/admin.js",
    "groupTitle": "Admin_-_Order"
  },
  {
    "type": "get",
    "url": "/api/user/admin/orders/count?status=pending+accepted",
    "title": "Retrieve number of orders",
    "name": "getAdminOrdersCount",
    "group": "Admin_-_Order",
    "version": "1.0.0",
    "description": "<p>Return number of orders based on status (pending|accepted|completed|rejected) passed in the status query params. To return results with more than one status, seperate the status passed in the query with a plus symbol</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "status",
            "description": "<p>order status. multiple order status should be seperated with a &quot;+&quot; symbol</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/user/admin.js",
    "groupTitle": "Admin_-_Order"
  },
  {
    "type": "get",
    "url": "/api/user/admin/orders/recent?status=pending+accepted&limit=30&page=1",
    "title": "Retrieve recent (today) orders",
    "name": "getAdminOrdersRecent",
    "group": "Admin_-_Order",
    "version": "1.0.0",
    "description": "<p>Return recent (today's) orders based on status (pending|accepted|completed|rejected) passed in the status query params. To return results with more than one status, seperate the status passed in the query with a plus symbol</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "status",
            "description": "<p>order status. multiple order status should be seperated with a &quot;+&quot; symbol</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/user/admin.js",
    "groupTitle": "Admin_-_Order"
  },
  {
    "type": "get",
    "url": "/api/user/admin/orders/stats",
    "title": "Retrieve orders Stats",
    "name": "getAdminOrdersStats",
    "group": "Admin_-_Order",
    "version": "1.0.0",
    "description": "<p>Return stats for orders in the system</p>",
    "filename": "src/api/routes/user/admin.js",
    "groupTitle": "Admin_-_Order"
  },
  {
    "type": "delete",
    "url": "/api/user/admin/posts",
    "title": "Delete Posts",
    "name": "deletAdminBlogPosts",
    "group": "Admin_-_Post",
    "version": "1.0.0",
    "description": "<p>Endpoint to delete feeds for each product. The product Id is used to categorize feeds</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "ID[]",
            "optional": false,
            "field": "ids",
            "description": "<p>body param. array of feeds ids you want deleted from the database</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/user/admin.js",
    "groupTitle": "Admin_-_Post"
  },
  {
    "type": "get",
    "url": "/api/user/admin/posts",
    "title": "Get Posts",
    "name": "getAdminBlogPosts",
    "group": "Admin_-_Post",
    "version": "1.0.0",
    "description": "<p>Endpoint to get feeds for products. The product Id is used to categorize feeds</p>",
    "filename": "src/api/routes/user/admin.js",
    "groupTitle": "Admin_-_Post"
  },
  {
    "type": "post",
    "url": "/api/user/admin/post",
    "title": "Create Post",
    "name": "postAdminBlogPost",
    "group": "Admin_-_Posts",
    "version": "1.0.0",
    "description": "<p>Endpoint to create feeds for each product. The product Id is used to categorize feeds</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "title",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "body",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "File",
            "optional": false,
            "field": "blogPostImg",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "ID",
            "optional": false,
            "field": "productId",
            "description": "<p>Id of the product that the post is made for</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/user/admin.js",
    "groupTitle": "Admin_-_Posts"
  },
  {
    "type": "put",
    "url": "/api/user/admin/post",
    "title": "Update Post",
    "name": "putAdminBlogPost",
    "group": "Admin_-_Posts",
    "version": "1.0.0",
    "description": "<p>Endpoint to update feeds for each product. The product Id is used to categorize feeds</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "title",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "body",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "File",
            "optional": false,
            "field": "blogPostImg",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "ID",
            "optional": false,
            "field": "productId",
            "description": "<p>Id of the product that the post is made for</p>"
          },
          {
            "group": "Parameter",
            "type": "ID",
            "optional": false,
            "field": "postId",
            "description": "<p>the Id of the post you want to update</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/user/admin.js",
    "groupTitle": "Admin_-_Posts"
  },
  {
    "type": "get",
    "url": "/api/user/admin/products",
    "title": "Fetch added products",
    "name": "getProducts",
    "group": "Admin_-_Product_Management",
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
    "groupTitle": "Admin_-_Product_Management",
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
    "group": "Admin_-_Product_Management",
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
    "groupTitle": "Admin_-_Product_Management",
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
    "group": "Admin_-_Product_Management",
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
    "groupTitle": "Admin_-_Product_Management",
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
    "url": "/api/user/admin/users?types=admin+peddler+driver+buyer&&page=1&&limit=10",
    "title": "get users",
    "name": "getAdminUsers",
    "group": "Admin_-_Users",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "types",
            "description": "<p>types of user (ADMIN|DRIVER|BUYER|PEDDLER) to retrieve defaults to all types of user in the system</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "page",
            "description": "<p>page number</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "limit",
            "description": "<p>page limit</p>"
          }
        ]
      }
    },
    "description": "<p>Get users by types. Seperate multiple types using comma(,) or plus(+)</p>",
    "filename": "src/api/routes/user/admin.js",
    "groupTitle": "Admin_-_Users"
  },
  {
    "type": "get",
    "url": "/api/user/admin/users/count?types=admin+peddler+driver+buyer",
    "title": "Get Number of users by types",
    "name": "getAdminUsersCount",
    "group": "Admin_-_Users",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "types",
            "description": "<p>types of user (ADMIN|DRIVER|BUYER|PEDDLER) to retrieve defaults to all types of user in the system</p>"
          }
        ]
      }
    },
    "description": "<p>Get number of users by types. Seperate multiple types using comma(,) or plus(+)</p>",
    "filename": "src/api/routes/user/admin.js",
    "groupTitle": "Admin_-_Users"
  },
  {
    "type": "get",
    "url": "/api/user/admin/peddlers?vstatus=uncategorized",
    "title": "get peddlers",
    "name": "getPeddlers",
    "group": "Admin_-_Users",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "vStatus",
            "description": "<p>verification status of user you want to retrieve</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "page",
            "description": "<p>page number</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "limit",
            "description": "<p>page limit</p>"
          }
        ]
      }
    },
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
    "groupTitle": "Admin_-_Users"
  },
  {
    "type": "put",
    "url": "/api/user/admin/reject-peddler/:peddlerId",
    "title": "reject peddler",
    "name": "postPeddlerRejection",
    "group": "Admin_-_Users",
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
    "groupTitle": "Admin_-_Users"
  },
  {
    "type": "put",
    "url": "/api/user/admin/verify-peddler/:peddlerId",
    "title": "Verify peddler",
    "name": "postPeddlerVerification",
    "group": "Admin_-_Users",
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
    "groupTitle": "Admin_-_Users"
  },
  {
    "type": "post",
    "url": "/api/auth/change-password",
    "title": "Change Password",
    "name": "postAuthChangePassword",
    "group": "Authentication_(Change_Password)",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "otpToken",
            "description": "<p>otp token user receive's from call to send otp route</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "oldPassword",
            "description": "<p>old password of the user</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "newPassword",
            "description": "<p>[body param] new password of the user</p>"
          }
        ]
      }
    },
    "description": "<p>To initialize the process. Send an opt token by calling the send otp route. Then call this endpoint supplying the otp token, new password and old password. The endpoint will return the updated user object</p>",
    "filename": "src/api/routes/auth.js",
    "groupTitle": "Authentication_(Change_Password)"
  },
  {
    "type": "get",
    "url": "/api/auth/password-reset/:resetToken",
    "title": "Resend password reset code",
    "name": "getAuthPasswordReset",
    "group": "Authentication_(Password_Reset)",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "resetToken",
            "description": "<p>[url param] This value is returned from calling the password reset intialization endpoint</p>"
          }
        ]
      }
    },
    "description": "<p>Send Reset Code</p>",
    "filename": "src/api/routes/auth.js",
    "groupTitle": "Authentication_(Password_Reset)"
  },
  {
    "type": "post",
    "url": "/api/auth/password-reset/:resetToken",
    "title": "Reset Password",
    "name": "postAuthPasswordReset",
    "group": "Authentication_(Password_Reset)",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "resetToken",
            "description": "<p>[url param] used to reset the password. This value is returned from calling the password reset intialization endpoint</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "resetCode",
            "description": "<p>[body param] The password reset code sent to the user when the password-reset is initialized</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>[body param] new password of the user</p>"
          }
        ]
      }
    },
    "description": "<p>Reset Password</p>",
    "filename": "src/api/routes/auth.js",
    "groupTitle": "Authentication_(Password_Reset)"
  },
  {
    "type": "post",
    "url": "/api/auth/password-reset/init",
    "title": "Initialize Password Reset",
    "name": "postAuthPasswordResetInit",
    "group": "Authentication_(Password_Reset)",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>email of the user that wants to reset passwaord</p>"
          }
        ]
      }
    },
    "description": "<p>Initialize Password Reset</p>",
    "filename": "src/api/routes/auth.js",
    "groupTitle": "Authentication_(Password_Reset)"
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
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "cacUrl",
            "description": "<p>url of C.A.C document of corporate buyers</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "buyerType",
            "defaultValue": "regular",
            "description": "<p>type of buyer (corporate|regular)</p>"
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
            "field": "email",
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
    "type": "get",
    "url": "/api/user/buyer/nearest-drivers?lat={lat}&&lon={lon}&&radius={search-radius}",
    "title": "get Trucks which have been assigned Driver",
    "name": "getBuyerTruckDrivers",
    "group": "Buyer_-_Get_Truck_Drivers",
    "version": "1.0.0",
    "description": "<p>This endpoint will fetch all online truck drivers within the radius passed in from the coordinate specified by lat and lon params</p>",
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
            "defaultValue": "10",
            "description": ""
          }
        ]
      }
    },
    "filename": "src/api/routes/user/buyer.js",
    "groupTitle": "Buyer_-_Get_Truck_Drivers"
  },
  {
    "type": "get",
    "url": "/api/user/buyer/orders?status=pending+accepted",
    "title": "Retrieve orders",
    "name": "getBuyerOrders",
    "group": "Buyer_-_Order",
    "version": "1.0.0",
    "description": "<p>Return orders based on status (pending|accepted|completed|cancelled) passed in the status query params. To return results with more than one status, seperate the status passed in the query with a plus symbol</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "status",
            "description": "<p>order status. multiple order status should be seperated with a &quot;+&quot; symbol</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/user/buyer.js",
    "groupTitle": "Buyer_-_Order"
  },
  {
    "type": "get",
    "url": "/api/user/buyer/order/:orderId",
    "title": "Retrieve a specific order",
    "name": "getSpecificOrder",
    "group": "Buyer_-_Order",
    "version": "1.0.0",
    "description": "<p>Get a specific order</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "ID",
            "optional": false,
            "field": "orderId",
            "description": "<p>the id of the order you want to retrieve</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/user/buyer.js",
    "groupTitle": "Buyer_-_Order"
  },
  {
    "type": "post",
    "url": "/api/user/buyer/order/:orderId/cancel",
    "title": "Cancel An Order",
    "name": "postCancelBuyerOrder",
    "group": "Buyer_-_Order",
    "version": "1.0.0",
    "description": "<p>cancel an order</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "ID",
            "optional": false,
            "field": "orderId",
            "description": "<p>the id of the order you want to cancel</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "reason",
            "description": "<p>the reason for cancelling an order</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/user/buyer.js",
    "groupTitle": "Buyer_-_Order"
  },
  {
    "type": "post",
    "url": "/api/user/buyer/order/:orderId/cancel",
    "title": "Cancel An Order",
    "name": "postCancelOrder",
    "group": "Buyer_-_Order",
    "version": "1.0.0",
    "description": "<p>cancel an order</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "ID",
            "optional": false,
            "field": "orderId",
            "description": "<p>the id of the order you want to cancel</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "reason",
            "description": "<p>the reason for cancelling an order</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/user/buyer.js",
    "groupTitle": "Buyer_-_Order"
  },
  {
    "type": "post",
    "url": "/api/user/buyer/order/:orderId/delivered",
    "title": "Confirm Order delivery",
    "name": "postDeliveredOrder",
    "group": "Buyer_-_Order",
    "version": "1.0.0",
    "description": "<p>Confirm order has been delivered</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "ID",
            "optional": false,
            "field": "orderId",
            "description": "<p>the id of the order you want to confirm has been delivered</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/user/buyer.js",
    "groupTitle": "Buyer_-_Order"
  },
  {
    "type": "post",
    "url": "/api/user/buyer/order",
    "title": "Make an order for a product",
    "name": "postOrder",
    "group": "Buyer_-_Order",
    "version": "1.0.0",
    "description": "<p>Make a new order for peddlers product</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "ID",
            "optional": false,
            "field": "driverId",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "ID",
            "optional": false,
            "field": "productId",
            "description": "<p>the seller's product id</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "quantity",
            "description": "<p>the quantity in litres of product sold</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "unitAmount",
            "description": "<p>the price per litre that the product cost</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "driverLat",
            "description": "<p>the latitude if the driver</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "driverLon",
            "description": "<p>the longitude of the driver</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "buyerLat",
            "description": "<p>the latitude of the buyer</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "buyerLon",
            "description": "<p>the longitude of the buyer</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "deliveryAddress",
            "description": "<p>delivery address</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": false,
            "field": "deliveryDate",
            "description": "<p>delivery date</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": false,
            "field": "creditPaymentDate",
            "description": "<p>proposed date to pay for product</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "paymentMethod",
            "description": "<p>mode of payment</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "priceCategory",
            "description": "<p>product price category</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/user/buyer.js",
    "groupTitle": "Buyer_-_Order"
  },
  {
    "type": "post",
    "url": "/api/user/buyer/order/:orderId/rating",
    "title": "Rate a driver",
    "name": "postOrderRating",
    "group": "Buyer_-_Order",
    "version": "1.0.0",
    "description": "<p>Rate a driver. minimum rating = 1 maximum rating = 5</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "rating",
            "description": "<p>score for a transaction 1-5</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/user/buyer.js",
    "groupTitle": "Buyer_-_Order"
  },
  {
    "type": "post",
    "url": "/api/user/buyer/order/:orderId/rejected",
    "title": "Reject Order delivery",
    "name": "postRejectedOrder",
    "group": "Buyer_-_Order",
    "version": "1.0.0",
    "description": "<p>Reject order delivery</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "ID",
            "optional": false,
            "field": "orderId",
            "description": "<p>the id of the order you want to confirm has been delivered</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/user/buyer.js",
    "groupTitle": "Buyer_-_Order"
  },
  {
    "type": "post",
    "url": "/api/user/buyer/search",
    "title": "Search driver",
    "name": "getBuyersBySearch",
    "group": "Buyer_-_Search",
    "version": "1.0.0",
    "description": "<p>Search for driver</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "ID",
            "optional": false,
            "field": "productId",
            "description": "<p>id of the product</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "quantity",
            "description": "<p>quantity of the product</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "page",
            "description": "<p>page number pagination</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "limit",
            "description": "<p>limit page limit</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "lat",
            "description": "<p>latitude of the search user</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "lon",
            "description": "<p>longitude of the search user</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/user/buyer.js",
    "groupTitle": "Buyer_-_Search"
  },
  {
    "type": "get",
    "url": "/api/posts",
    "title": "Get Posts",
    "name": "getUserBlogPosts",
    "group": "Buyer_And_Seller_-_Post",
    "version": "1.0.0",
    "description": "<p>Endpoint to get feeds for products. The product Id is used to categorize feeds</p>",
    "filename": "src/api/routes/non-protected-routes.js",
    "groupTitle": "Buyer_And_Seller_-_Post"
  },
  {
    "type": "get",
    "url": "/api/user/admin/buyers/corporate?active=1&page=1&limit=30",
    "title": "Get corporate buyers",
    "name": "getAdminBuyers",
    "group": "Corporate_Buyers",
    "version": "1.0.0",
    "description": "<p>Retrieve corporate buyers. By default all inactive corporate buyers will be retreived.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "page",
            "description": "<p>page number</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "limit",
            "description": "<p>page limit</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "active",
            "defaultValue": "0",
            "description": "<p>controls whether to retreive active or inactive corporate buyers.</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/user/admin.js",
    "groupTitle": "Corporate_Buyers"
  },
  {
    "type": "put",
    "url": "/api/user/admin/buyer/:buyerId",
    "title": "Activate corporate buyer",
    "name": "putAdminBuyer",
    "group": "Corporate_Buyers",
    "version": "1.0.0",
    "description": "<p>Activate Corporate Buyer</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "ID",
            "optional": false,
            "field": "buyerId",
            "description": "<p>the id of the buyer whose account you want to activate</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/user/admin.js",
    "groupTitle": "Corporate_Buyers"
  },
  {
    "type": "get",
    "url": "/api/user/driver/orders?status=pending+accepted",
    "title": "Retrieve orders",
    "name": "getDriverOrders",
    "group": "Driver_-_Order",
    "version": "1.0.0",
    "description": "<p>Return orders based on status (pending|accepted|completed|cancelled) passed in the status query params. To return results with more than one status, seperate the status passed in the query with a plus symbol</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "status",
            "description": "<p>order status. multiple order status should be seperated with a &quot;+&quot; symbol</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/user/driver.js",
    "groupTitle": "Driver_-_Order"
  },
  {
    "type": "get",
    "url": "/api/user/driver/order/:orderId",
    "title": "Retrieve a specific order",
    "name": "getSpecificDriverOrder",
    "group": "Driver_-_Order",
    "version": "1.0.0",
    "description": "<p>Get a specific order</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "ID",
            "optional": false,
            "field": "orderId",
            "description": "<p>the id of the order you want to retrieve</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/user/driver.js",
    "groupTitle": "Driver_-_Order"
  },
  {
    "type": "post",
    "url": "/api/user/driver/order/:orderId/accept",
    "title": "Accept Order",
    "name": "postAcceptDriverOrder",
    "group": "Driver_-_Order",
    "version": "1.0.0",
    "description": "<p>This endpoint will enable drivers to Accept an order</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "ID",
            "optional": false,
            "field": "orderId",
            "description": "<p>the id of the order you want to confirm has acceptd</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/user/driver.js",
    "groupTitle": "Driver_-_Order"
  },
  {
    "type": "post",
    "url": "/api/user/driver/order/:orderId/cancel",
    "title": "Cancel An Order",
    "name": "postCancelDriverOrder",
    "group": "Driver_-_Order",
    "version": "1.0.0",
    "description": "<p>cancel an order</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "ID",
            "optional": false,
            "field": "orderId",
            "description": "<p>the id of the order you want to cancel</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "reason",
            "description": "<p>the reason for cancelling an order</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/user/driver.js",
    "groupTitle": "Driver_-_Order"
  },
  {
    "type": "post",
    "url": "/api/user/driver/order/:orderId/complete",
    "title": "Confirm Order delivery",
    "name": "postCompleteOrder",
    "group": "Driver_-_Order",
    "version": "1.0.0",
    "description": "<p>Complete an order</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "ID",
            "optional": false,
            "field": "orderId",
            "description": "<p>the id of the order you want to confirm has completed</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/user/driver.js",
    "groupTitle": "Driver_-_Order"
  },
  {
    "type": "post",
    "url": "/api/user/driver/order/:orderId/start-delivery",
    "title": "Start delivery of An Order",
    "name": "postStartDeliveryOrder",
    "group": "Driver_-_Order",
    "version": "1.0.0",
    "description": "<p>start journey for an order</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "ID",
            "optional": false,
            "field": "orderId",
            "description": "<p>the id of the order you want to cancel</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/user/driver.js",
    "groupTitle": "Driver_-_Order"
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
    "type": "get",
    "url": "/api/user/buyer/profile/:driverId",
    "title": "get driver's profile",
    "name": "getProfileUpdate",
    "group": "Driver_Profile",
    "version": "1.0.0",
    "description": "<p>get driver's profile. To get all possible return fields call this test route logged in as a buyer: /api/user/buyer/profile/5fd8b3fc7a78f300173bd7ee</p>",
    "filename": "src/api/routes/user/buyer.js",
    "groupTitle": "Driver_Profile"
  },
  {
    "type": "post",
    "url": "/api/file/single",
    "title": "Upload Single File",
    "name": "postFileSingle",
    "group": "File_Management",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "File",
            "optional": false,
            "field": "file",
            "description": "<p>File to upload, all soughts of file can be uploaded</p>"
          }
        ]
      }
    },
    "version": "1.0.0",
    "description": "<p>Endpoint to upload single file. This endpoint will return the url that can be used to retreive the file</p>",
    "filename": "src/api/routes/file-upload.js",
    "groupTitle": "File_Management"
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
    "type": "post",
    "url": "/api/user/buyer/notification",
    "title": "Send Push Notification From Buyer's App",
    "name": "postBuyersNotification",
    "group": "Notification",
    "version": "1.0.0",
    "description": "<p>Send Push Notification From Buyer's App. It is important to specify the platform as a user may have two mobile devices running a particular instance of the app</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "title",
            "description": "<p>title of the message</p>"
          },
          {
            "group": "Parameter",
            "type": "ID",
            "optional": false,
            "field": "receiverId",
            "description": "<p>the id of the receiver</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>message body</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "platform",
            "description": "<p>the platform which the message is sent from (android|ios)</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/user/buyer.js",
    "groupTitle": "Notification"
  },
  {
    "type": "post",
    "url": "/api/user/driver/notification",
    "title": "Send Push Notification From Driver's App",
    "name": "postBuyersNotification",
    "group": "Notification",
    "version": "1.0.0",
    "description": "<p>Send Push Notification From Driver's App. It is important to specify the platform as a user may have two mobile devices running a particular instance of the app</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "title",
            "description": "<p>title of the message</p>"
          },
          {
            "group": "Parameter",
            "type": "ID",
            "optional": false,
            "field": "receiverId",
            "description": "<p>The Id of the receiver</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>message body</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "platform",
            "description": "<p>the platform which the message is sent from (android|ios)</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/user/driver.js",
    "groupTitle": "Notification"
  },
  {
    "type": "post",
    "url": "/api/user/peddler/notification",
    "title": "Send Push Notification From Peddler's App",
    "name": "postBuyersNotification",
    "group": "Notification",
    "version": "1.0.0",
    "description": "<p>Send Push Notification From Peddler's App. It is important to specify the platform as a user may have two mobile devices running a particular instance of the app</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "title",
            "description": "<p>title of the message</p>"
          },
          {
            "group": "Parameter",
            "type": "ID",
            "optional": false,
            "field": "receiverId",
            "description": "<p>The id of the receiver</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>message body</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "platform",
            "description": "<p>the platform which the message is sent from (android|ios)</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/user/peddler.js",
    "groupTitle": "Notification"
  },
  {
    "type": "get",
    "url": "/api/user/admin/payments?page=1&limit=30",
    "title": "Get unverified Payments",
    "name": "getAdminPayments",
    "group": "Payment",
    "version": "1.0.0",
    "description": "<p>This enpoint will retrieve payments that have been made by transfer bu has not been verified</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "page",
            "description": "<p>page number</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "limit",
            "description": "<p>page limit</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/user/admin.js",
    "groupTitle": "Payment"
  },
  {
    "type": "get",
    "url": "/api/user/buyer/payment/verify/:paymentRef",
    "title": "Verify paystack Transaction",
    "name": "getPaymentVerified",
    "group": "Payment",
    "version": "1.0.0",
    "description": "<p>Verify paystack transaction</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "paymentRef",
            "description": "<p>payment reference received from transaction initialization</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/user/buyer.js",
    "groupTitle": "Payment"
  },
  {
    "type": "post",
    "url": "/api/user/buyer/payment/proof",
    "title": "Upload proof of payment",
    "name": "postPaymentProof",
    "group": "Payment",
    "version": "1.0.0",
    "description": "<p>Endpoint Upload proof of payment</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "ID",
            "optional": false,
            "field": "orderId",
            "description": "<p>id of the order you want to upload proof of payment for</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "imgUrl",
            "description": "<p>the url of the proof of payment image</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/user/buyer.js",
    "groupTitle": "Payment"
  },
  {
    "type": "put",
    "url": "/api/user/admin/payment/verify/:paymentId",
    "title": "Verify payment",
    "name": "putPaymentVerify",
    "group": "Payment",
    "version": "1.0.0",
    "description": "<p>This enpoint will verify transactions by transfer</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "ID",
            "optional": false,
            "field": "paymentId",
            "description": "<p>Id of the payment you want to verify</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/user/admin.js",
    "groupTitle": "Payment"
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
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "platform",
            "description": "<p>platform which the app is running on (android|ios)</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "deviceToken",
            "description": "<p>device token which will be used for push notification</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "firstName",
            "description": "<p>user's first name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>user's email</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "address",
            "description": "<p>user's address</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "phoneNumber",
            "description": "<p>user's phoneNumber</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "avatarUrl",
            "description": "<p>profile image url of the user</p>"
          }
        ]
      }
    },
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
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "platform",
            "description": "<p>platform which the app is running on (android|ios)</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "deviceToken",
            "description": "<p>device token which will be used for push notification</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "firstName",
            "description": "<p>user's first name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>user's email</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "address",
            "description": "<p>user's address</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "phoneNumber",
            "description": "<p>user's phoneNumber</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "avatarUrl",
            "description": "<p>profile image url of the user</p>"
          }
        ]
      }
    },
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
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "platform",
            "description": "<p>platform which the app is running on (android|ios)</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "deviceToken",
            "description": "<p>device token which will be used for push notification</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "firstName",
            "description": "<p>user's first name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>user's email</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "address",
            "description": "<p>user's address</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "phoneNumber",
            "description": "<p>user's phoneNumber</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "avatarUrl",
            "description": "<p>profile image url of the user</p>"
          }
        ]
      }
    },
    "version": "1.0.0",
    "description": "<p>update peddler's profile</p>",
    "filename": "src/api/routes/user/peddler.js",
    "groupTitle": "Profile_Management"
  },
  {
    "type": "get",
    "url": "/api/support/agents",
    "title": "Get support agents",
    "name": "getSupportAgents",
    "group": "Support",
    "version": "1.0.0",
    "description": "<p>Endpoint to get all support agents</p>",
    "filename": "src/api/routes/support.js",
    "groupTitle": "Support"
  },
  {
    "type": "get",
    "url": "/api/support/message/read",
    "title": "Get messages that has already been read",
    "name": "getSupportMessageRead",
    "group": "Support",
    "version": "1.0.0",
    "description": "<p>Endpoint to get all read messages</p>",
    "filename": "src/api/routes/support.js",
    "groupTitle": "Support"
  },
  {
    "type": "get",
    "url": "/api/support/messages?limit=4&page=1",
    "title": "Get messages",
    "name": "getSupportMessageUnread",
    "group": "Support",
    "version": "1.0.0",
    "description": "<p>Endpoint to get all messages</p>",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": " HTTP/1.1 200 OK\n {\"data\": [\n      {\n          \"id\": \"60058b6451662c8222130f1d\",\n          \"type\": 1,\n          \"content\": \" heyy i am supposed to be a driver\",\n          \"sender\": {\n              \"id\": \"5fd8b3fc7a78f300173bd7ee\",\n              \"firstName\": \"James\",\n              \"lastName\": \"Uso\",\n              \"avatarImg\": \"https://res.cloudinary.com/dl7ajt4jv/image/upload/v1608876964/peddler_app/160887696337137337%7D.jpg\",\n              \"presence\": \"online\",\n              \"phoneNumber\": \"+2348123451746\",\n              \"email\": null,\n              \"address\": null,\n              \"permission\": 3,\n              \"type\": \"DRIVER\",\n              \"isActive\": false,\n              \"peddler\": \"5fd391cd841bc60017b619c6\",\n              \"driverStats\": null,\n              \"userName\": \"driver1\",\n              \"truck\": null,\n              \"latlon\": {\n                  \"lon\": 8.3441639,\n                  \"lat\": 4.9814586\n              }\n          },\n          \"sentAt\": \"2021-01-18T13:21:40.883Z\",\n          \"readAt\": \"2021-01-18T13:25:42.197Z\"\n      },\n      {\n          \"id\": \"60058ae475f9417ba7c285a5\",\n          \"type\": 1,\n          \"content\": \" heyy i am supposed to be a driver\",\n          \"sender\": {\n              \"id\": \"5fd8b3fc7a78f300173bd7ee\",\n              \"firstName\": \"James\",\n              \"lastName\": \"Uso\",\n              \"avatarImg\": \"https://res.cloudinary.com/dl7ajt4jv/image/upload/v1608876964/peddler_app/160887696337137337%7D.jpg\",\n              \"presence\": \"online\",\n              \"phoneNumber\": \"+2348123451746\",\n              \"email\": null,\n              \"address\": null,\n              \"permission\": 3,\n              \"type\": \"DRIVER\",\n              \"isActive\": false,\n              \"peddler\": \"5fd391cd841bc60017b619c6\",\n              \"driverStats\": null,\n              \"userName\": \"driver1\",\n              \"truck\": null,\n              \"latlon\": {\n                  \"lon\": 8.3441639,\n                  \"lat\": 4.9814586\n              }\n          },\n          \"sentAt\": \"2021-01-18T13:19:32.127Z\",\n          \"readAt\": null\n      },\n      {\n          \"id\": \"60058abc75f9417ba7c285a4\",\n          \"type\": 1,\n          \"sender\": {\n              \"id\": \"5fd8b3fc7a78f300173bd7ee\",\n              \"firstName\": \"James\",\n              \"lastName\": \"Uso\",\n              \"avatarImg\": \"https://res.cloudinary.com/dl7ajt4jv/image/upload/v1608876964/peddler_app/160887696337137337%7D.jpg\",\n              \"presence\": \"online\",\n              \"phoneNumber\": \"+2348123451746\",\n              \"email\": null,\n              \"address\": null,\n              \"permission\": 3,\n              \"type\": \"DRIVER\",\n              \"isActive\": false,\n              \"peddler\": \"5fd391cd841bc60017b619c6\",\n              \"driverStats\": null,\n              \"userName\": \"driver1\",\n              \"truck\": null,\n              \"latlon\": {\n                  \"lon\": 8.3441639,\n                  \"lat\": 4.9814586\n              }\n          },\n          \"sentAt\": \"2021-01-18T13:18:52.297Z\",\n          \"readAt\": null\n      },\n      {\n          \"id\": \"60058a1f75f9417ba7c285a3\",\n          \"type\": 1,\n          \"sender\": {\n              \"id\": \"5fd8b3fc7a78f300173bd7ee\",\n              \"firstName\": \"James\",\n              \"lastName\": \"Uso\",\n              \"avatarImg\": \"https://res.cloudinary.com/dl7ajt4jv/image/upload/v1608876964/peddler_app/160887696337137337%7D.jpg\",\n              \"presence\": \"online\",\n              \"phoneNumber\": \"+2348123451746\",\n              \"email\": null,\n              \"address\": null,\n              \"permission\": 3,\n              \"type\": \"DRIVER\",\n              \"isActive\": false,\n              \"peddler\": \"5fd391cd841bc60017b619c6\",\n              \"driverStats\": null,\n              \"userName\": \"driver1\",\n              \"truck\": null,\n              \"latlon\": {\n                  \"lon\": 8.3441639,\n                  \"lat\": 4.9814586\n              }\n          },\n          \"sentAt\": \"2021-01-18T13:16:15.244Z\",\n          \"readAt\": null\n      }\n  ],\n  \"pagination\": {\n      \"currentPage\": 1,\n      \"totalPages\": 1,\n      \"totalDocs\": 4\n  }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/api/routes/support.js",
    "groupTitle": "Support"
  },
  {
    "type": "post",
    "url": "/api/support/message",
    "title": "Send Support Message",
    "name": "postSupportMessage",
    "group": "Support",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "content",
            "description": "<p>message body</p>"
          },
          {
            "group": "Parameter",
            "type": "ID",
            "optional": true,
            "field": "to",
            "description": "<p>id of the user you want to message. Admin alone, pass in this field</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "type",
            "defaultValue": "1",
            "description": "<p>type of message. 1 = text, 2 =  image/file.</p>"
          }
        ]
      }
    },
    "version": "1.0.0",
    "description": "<p>Endpoint to post support message. Support messages are of two types text designated by the integer 1 and image/file designated by the integer 2. The content of type = 2 is the url of the image and that of type = 1 is the message text</p>",
    "filename": "src/api/routes/support.js",
    "groupTitle": "Support"
  },
  {
    "type": "post",
    "url": "/api/support/messages/read",
    "title": "Read unread messages sent to you",
    "name": "postSupportMessageMessageId",
    "group": "Support",
    "version": "1.0.0",
    "description": "<p>Endpoint to read unread messages sent to you</p>",
    "filename": "src/api/routes/support.js",
    "groupTitle": "Support"
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
