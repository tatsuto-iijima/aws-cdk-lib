import * as cdk from '@aws-cdk/core';
import * as cognito from '@tatsuto-iijima/aws-cdk-lib-cognito';

export class AwsCdkLibCognitoUserPoolTestStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new cognito.UserPool(this, id, {
      userPool: {
        removalPolicy: cdk.RemovalPolicy.DESTROY,
      },
      userPoolClient: {
        clientA: {},
      },
      userPoolGroup: {
        administrators: {
          groupName: 'Administrators',
          description: 'This is Administrators Group.',
        },
        users: {
          groupName: 'Users',
          description: 'This is Users Group.',
        },
      },
    });
  }
}
