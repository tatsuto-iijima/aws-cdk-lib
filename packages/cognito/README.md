# Amazon Cognito AWS CDK Library

A library for building amazon cognito

## User Pool

It is possible to build a User Pool including the User Pool Client and User Pool Group.

```ts
new cognito.UserPool(this, 'MyUserPool', {
  userPool: {
    passwordPolicy: {
      minLength: 8,
      requireDigits: true,
      requireLowercase: true,
      requireUppercase: true,
    },
  },
  userPoolClient: {
    clientA: {
      authFlows: {
        adminUserPassword: true,
      },
    },
    clientB: {
      authFlows: {
        custom: true,
        userPassword: true,
        userSrp: true,
      },
    },
  },
  userPoolGroup: {
    administrators: {
      groupName: 'Administrators',
      description: 'This is Administrators Group.',
      roleArn: 'arn:aws:iam::123456789012:role/AdminS3Access',
    },
    users: {
      groupName: 'Users',
      description: 'This is Users Group.',
      roleArn: 'arn:aws:iam::123456789012:role/UserS3Access',
    },
  },
});
```
