import { expect as expectCDK, countResources, haveResource, arrayWith, objectLike, ABSENT, SynthUtils, anything, stringLike, countResourcesLike } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as Cognito from '../lib/index';

describe('Template when "UserPoolProps" is', () => {
  test.each([
    [
      undefined,
    ],
    [
      {
        userPool: { removalPolicy: cdk.RemovalPolicy.DESTROY },
      },
    ],
    [
      {
        userPool: {},
        userPoolClient: {},
      },
    ],
    [
      {
        userPool: {},
        userPoolClient: {
          clientA: {},
        },
      },
    ],
    [
      {
        userPool: {},
        userPoolGroup: {},
      },
    ],
    [
      {
        userPool: {},
        userPoolGroup: {
          groupA: {},
        },
      },
    ],
  ])('%o', (props) => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'TestStack');
    new Cognito.UserPool(stack, 'MyTestConstruct', props);
  
    expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
  });
    
});

describe('Property "userPool.accountRecovery" is', () => {
  test.each([
    [
      'EMAIL_AND_PHONE_WITHOUT_MFA',
      {
        AccountRecoverySetting: {
          RecoveryMechanisms: [
            { Name: 'verified_email', Priority: 1},
            { Name: 'verified_phone_number', Priority: 2},
          ]
        }
      }
    ],
    [
      'PHONE_WITHOUT_MFA_AND_EMAIL',
      {
        AccountRecoverySetting: {
          RecoveryMechanisms: [
            { Name: 'verified_phone_number', Priority: 1},
            { Name: 'verified_email', Priority: 2},
          ]
        }
      }
    ],
    [
      'EMAIL_ONLY',
      {
        AccountRecoverySetting: {
          RecoveryMechanisms: [
            { Name: 'verified_email', Priority: 1},
          ]
        }
      }
    ],
    [
      'PHONE_ONLY_WITHOUT_MFA',
      {
        AccountRecoverySetting: {
          RecoveryMechanisms: [
            { Name: 'verified_phone_number', Priority: 1},
          ]
        }
      }
    ],
    [
      'PHONE_AND_EMAIL',
      {
        AccountRecoverySetting: ABSENT
      }
    ],
    [
      'NONE',
      {
        AccountRecoverySetting: {
          RecoveryMechanisms: [
            { Name: 'admin_only', Priority: 1},
          ]
        }
      }
    ],
    [
      '',
      {
        AccountRecoverySetting: {
          RecoveryMechanisms: [
            { Name: 'verified_phone_number', Priority: 1},
            { Name: 'verified_email', Priority: 2},
          ]
        }
      }
    ],
    [
      undefined,
      {
        AccountRecoverySetting: {
          RecoveryMechanisms: [
            { Name: 'verified_phone_number', Priority: 1},
            { Name: 'verified_email', Priority: 2},
          ]
        }
      }
    ],
    [
      'INVALID',
      /Invalid value for property "userPool.accountRecovery"./
    ],
  ])('%s', (accountRecovery, expected) => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'TestStack');
    if ('AccountRecoverySetting' in expected) {
      const construct = new Cognito.UserPool(stack, 'MyTestConstruct', {
        userPool: {
          accountRecovery: accountRecovery,
        },
      });

      expectCDK(stack).to(countResources('AWS::Cognito::UserPool', 1));
      expectCDK(stack).to(haveResource('AWS::Cognito::UserPool',{
        AccountRecoverySetting: expected.AccountRecoverySetting,
        AdminCreateUserConfig: {AllowAdminCreateUserOnly: true},
        AliasAttributes: ABSENT,
        AutoVerifiedAttributes: ABSENT,
        DeviceConfiguration: ABSENT,
        EmailConfiguration: ABSENT,
        EmailVerificationMessage: 'The verification code to your new account is {####}',
        EmailVerificationSubject: 'Verify your new account',
        EnabledMfas: ABSENT,
        LambdaConfig: ABSENT,
        MfaConfiguration: ABSENT,
        Policies: ABSENT,
        Schema: ABSENT,
        SmsAuthenticationMessage: ABSENT,
        SmsConfiguration: ABSENT,
        SmsVerificationMessage: 'The verification code to your new account is {####}',
        UsernameAttributes: ABSENT,
        UsernameConfiguration: ABSENT,
        UserPoolAddOns: ABSENT,
        UserPoolName: ABSENT,
        UserPoolTags: ABSENT,
        VerificationMessageTemplate: {
          DefaultEmailOption: 'CONFIRM_WITH_CODE',
          EmailMessage: 'The verification code to your new account is {####}',
          EmailSubject: 'Verify your new account',
          SmsMessage: 'The verification code to your new account is {####}',
        },
      }));
      expectCDK(stack).to(countResources('AWS::Cognito::UserPoolClient', 0));
      expectCDK(stack).to(countResources('AWS::Cognito::UserPoolGroup', 0));

      expect(construct.userPool).not.toBeUndefined();
      expect(construct.userPoolClient).toBeUndefined();
      expect(construct.userPoolGroup).toBeUndefined();
      
    } else if (accountRecovery === 'INVALID') {
      expect(() => {
        new Cognito.UserPool(stack, 'MyTestConstruct', {
          userPool: {
            accountRecovery: accountRecovery,
          },
        });
      }).toThrow(expected);
      
    } else {
      throw new Error('Invalid');

    }
  
  });

});

describe('Property "userPool.mfa" is', () => {
  test.each([
    [
      'OFF',
      {
        EnabledMfas: ABSENT,
        MfaConfiguration: 'OFF',
        SmsConfiguration: ABSENT,
      },
    ],
    [
      'OPTIONAL',
      {
        EnabledMfas: ['SMS_MFA'],
        MfaConfiguration: 'OPTIONAL',
        SmsConfiguration: {
          ExternalId: anything(),
          SnsCallerArn: anything(),
        },
      },
    ],
    [
      'REQUIRED',
      {
        EnabledMfas: ['SMS_MFA'],
        MfaConfiguration: 'ON',
        SmsConfiguration: {
          ExternalId: anything(),
          SnsCallerArn: anything(),
        },
      },
    ],
    [
      '',
      {
        EnabledMfas: ABSENT,
        MfaConfiguration: ABSENT,
        SmsConfiguration: ABSENT,
      },
    ],
    [
      undefined,
      {
        EnabledMfas: ABSENT,
        MfaConfiguration: ABSENT,
        SmsConfiguration: ABSENT,
      },
    ],
    [
      'INVALID',
      /Invalid value for property "userPool.mfa"./
    ],
  ])('%s', (mfa, expected) => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'TestStack');
    if ('EnabledMfas' in expected && 'MfaConfiguration' in expected && 'SmsConfiguration' in expected) {
      const construct = new Cognito.UserPool(stack, 'MyTestConstruct', {
        userPool: {
          mfa: mfa,
        },
      });

      expectCDK(stack).to(countResources('AWS::Cognito::UserPool', 1));
      expectCDK(stack).to(haveResource('AWS::Cognito::UserPool',{
        AccountRecoverySetting: {
          RecoveryMechanisms: [
            {Name: 'verified_phone_number', Priority: 1},
            {Name: 'verified_email', Priority: 2},
          ],
        },
        AdminCreateUserConfig: {AllowAdminCreateUserOnly: true},
        AliasAttributes: ABSENT,
        AutoVerifiedAttributes: ABSENT,
        DeviceConfiguration: ABSENT,
        EmailConfiguration: ABSENT,
        EmailVerificationMessage: 'The verification code to your new account is {####}',
        EmailVerificationSubject: 'Verify your new account',
        EnabledMfas: expected.EnabledMfas,
        LambdaConfig: ABSENT,
        MfaConfiguration: expected.MfaConfiguration,
        Policies: ABSENT,
        Schema: ABSENT,
        SmsAuthenticationMessage: ABSENT,
        SmsConfiguration: expected.SmsConfiguration,
        SmsVerificationMessage: 'The verification code to your new account is {####}',
        UsernameAttributes: ABSENT,
        UsernameConfiguration: ABSENT,
        UserPoolAddOns: ABSENT,
        UserPoolName: ABSENT,
        UserPoolTags: ABSENT,
        VerificationMessageTemplate: {
          DefaultEmailOption: 'CONFIRM_WITH_CODE',
          EmailMessage: 'The verification code to your new account is {####}',
          EmailSubject: 'Verify your new account',
          SmsMessage: 'The verification code to your new account is {####}',
        },
      }));
      expectCDK(stack).to(countResources('AWS::Cognito::UserPoolClient', 0));
      expectCDK(stack).to(countResources('AWS::Cognito::UserPoolGroup', 0));

      expect(construct.userPool).not.toBeUndefined();
      expect(construct.userPoolClient).toBeUndefined();
      expect(construct.userPoolGroup).toBeUndefined();
      
    } else if (mfa === 'INVALID') {
      expect(() => {
        new Cognito.UserPool(stack, 'MyTestConstruct', {
          userPool: {
            mfa: mfa,
          },
        });
      }).toThrow(expected);
      
    } else {
      throw new Error('Invalid');

    }
  
  });

});

describe('Property "userPool.mfaSecondFactor" is', () => {
  test.each([
    [
      {otp: false, sms: false},
      {
        EnabledMfas: [],
        SmsConfiguration: ABSENT,
      },
    ],
    [
      {otp: true, sms: false},
      {
        EnabledMfas: ['SOFTWARE_TOKEN_MFA'],
        SmsConfiguration: ABSENT,
      },
    ],
    [
      {otp: false, sms: true},
      {
        EnabledMfas: ['SMS_MFA'],
        SmsConfiguration: {
          ExternalId: anything(),
          SnsCallerArn: anything(),
        },
      },
    ],
    [
      {otp: true, sms: true},
      {
        EnabledMfas: arrayWith('SOFTWARE_TOKEN_MFA', 'SMS_MFA'),
        SmsConfiguration: {
          ExternalId: anything(),
          SnsCallerArn: anything(),
        },
      },
    ],
    [
      undefined,
      {
        EnabledMfas: ['SMS_MFA'],
        SmsConfiguration: {
          ExternalId: anything(),
          SnsCallerArn: anything(),
        },
      },
    ],
  ])('%s', (mfaSecondFactor, expected) => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'TestStack');
    if ('EnabledMfas' in expected && 'SmsConfiguration' in expected) {
      const construct = new Cognito.UserPool(stack, 'MyTestConstruct', {
        userPool: {
          mfa: 'REQUIRED',
          mfaSecondFactor: mfaSecondFactor,
        },
      });

      expectCDK(stack).to(countResources('AWS::Cognito::UserPool', 1));
      expectCDK(stack).to(haveResource('AWS::Cognito::UserPool',{
        AccountRecoverySetting: {
          RecoveryMechanisms: [
            {Name: 'verified_phone_number', Priority: 1},
            {Name: 'verified_email', Priority: 2},
          ],
        },
        AdminCreateUserConfig: {AllowAdminCreateUserOnly: true},
        AliasAttributes: ABSENT,
        AutoVerifiedAttributes: ABSENT,
        DeviceConfiguration: ABSENT,
        EmailConfiguration: ABSENT,
        EmailVerificationMessage: 'The verification code to your new account is {####}',
        EmailVerificationSubject: 'Verify your new account',
        EnabledMfas: expected.EnabledMfas,
        LambdaConfig: ABSENT,
        MfaConfiguration: 'ON',
        Policies: ABSENT,
        Schema: ABSENT,
        SmsAuthenticationMessage: ABSENT,
        SmsConfiguration: expected.SmsConfiguration,
        SmsVerificationMessage: 'The verification code to your new account is {####}',
        UsernameAttributes: ABSENT,
        UsernameConfiguration: ABSENT,
        UserPoolAddOns: ABSENT,
        UserPoolName: ABSENT,
        UserPoolTags: ABSENT,
        VerificationMessageTemplate: {
          DefaultEmailOption: 'CONFIRM_WITH_CODE',
          EmailMessage: 'The verification code to your new account is {####}',
          EmailSubject: 'Verify your new account',
          SmsMessage: 'The verification code to your new account is {####}',
        },
      }));
      expectCDK(stack).to(countResources('AWS::Cognito::UserPoolClient', 0));
      expectCDK(stack).to(countResources('AWS::Cognito::UserPoolGroup', 0));

      expect(construct.userPool).not.toBeUndefined();
      expect(construct.userPoolClient).toBeUndefined();
      expect(construct.userPoolGroup).toBeUndefined();
      
    } else {
      throw new Error('Invalid');

    }
  
  });

});

describe('Property "userPool.passwordPolicy" is', () => {
  test.each([
    [
      {},
      {
        Policies: {
          PasswordPolicy: {
            MinimumLength: 8,
          },
        },
      },
    ],
    [
      {
        minLength: 8,
        requireDigits: true,
        requireLowercase: true,
        requireUppercase: true,
      },
      {
        Policies: {
          PasswordPolicy: {
            MinimumLength: 8,
            RequireLowercase: true,
            RequireNumbers: true,
            RequireUppercase: true,
          },
        },
      },
    ],
    [
      undefined,
      {
        Policies: ABSENT,
      },
    ],
  ])('%s', (passwordPolicy, expected) => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'TestStack');
    if ('Policies' in expected) {
      const construct = new Cognito.UserPool(stack, 'MyTestConstruct', {
        userPool: {
          passwordPolicy: passwordPolicy,
        },
      });

      expectCDK(stack).to(countResources('AWS::Cognito::UserPool', 1));
      expectCDK(stack).to(haveResource('AWS::Cognito::UserPool',{
        AccountRecoverySetting: {
          RecoveryMechanisms: [
            {Name: 'verified_phone_number', Priority: 1},
            {Name: 'verified_email', Priority: 2},
          ],
        },
        AdminCreateUserConfig: {AllowAdminCreateUserOnly: true},
        AliasAttributes: ABSENT,
        AutoVerifiedAttributes: ABSENT,
        DeviceConfiguration: ABSENT,
        EmailConfiguration: ABSENT,
        EmailVerificationMessage: 'The verification code to your new account is {####}',
        EmailVerificationSubject: 'Verify your new account',
        EnabledMfas: ABSENT,
        LambdaConfig: ABSENT,
        MfaConfiguration: ABSENT,
        Policies: expected.Policies,
        Schema: ABSENT,
        SmsAuthenticationMessage: ABSENT,
        SmsConfiguration: ABSENT,
        SmsVerificationMessage: 'The verification code to your new account is {####}',
        UsernameAttributes: ABSENT,
        UsernameConfiguration: ABSENT,
        UserPoolAddOns: ABSENT,
        UserPoolName: ABSENT,
        UserPoolTags: ABSENT,
        VerificationMessageTemplate: {
          DefaultEmailOption: 'CONFIRM_WITH_CODE',
          EmailMessage: 'The verification code to your new account is {####}',
          EmailSubject: 'Verify your new account',
          SmsMessage: 'The verification code to your new account is {####}',
        },
      }));
      expectCDK(stack).to(countResources('AWS::Cognito::UserPoolClient', 0));
      expectCDK(stack).to(countResources('AWS::Cognito::UserPoolGroup', 0));

      expect(construct.userPool).not.toBeUndefined();
      expect(construct.userPoolClient).toBeUndefined();
      expect(construct.userPoolGroup).toBeUndefined();
      
    } else {
      throw new Error('Invalid');

    }
  
  });

});

describe('Property "userPool.standardAttributes" is', () => {
  test.each([
    [
      {},
      {
        Schema: ABSENT,
      },
    ],
    [
      {
        email: {mutable: true, required: true},
        fullname: {mutable: true, required: true},
      },
      {
        Schema: arrayWith(
          {
            Mutable: true,
            Name: 'email',
            Required: true,
          },
          {
            Mutable: true,
            Name: 'name',
            Required: true,
          },
        ),
      },
    ],
    [
      undefined,
      {
        Schema: ABSENT,
      },
    ],
  ])('%s', (standardAttributes, expected) => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'TestStack');
    if ('Schema' in expected) {
      const construct = new Cognito.UserPool(stack, 'MyTestConstruct', {
        userPool: {
          standardAttributes: standardAttributes,
        },
      });

      expectCDK(stack).to(countResources('AWS::Cognito::UserPool', 1));
      expectCDK(stack).to(haveResource('AWS::Cognito::UserPool',{
        AccountRecoverySetting: {
          RecoveryMechanisms: [
            {Name: 'verified_phone_number', Priority: 1},
            {Name: 'verified_email', Priority: 2},
          ],
        },
        AdminCreateUserConfig: {AllowAdminCreateUserOnly: true},
        AliasAttributes: ABSENT,
        AutoVerifiedAttributes: ABSENT,
        DeviceConfiguration: ABSENT,
        EmailConfiguration: ABSENT,
        EmailVerificationMessage: 'The verification code to your new account is {####}',
        EmailVerificationSubject: 'Verify your new account',
        EnabledMfas: ABSENT,
        LambdaConfig: ABSENT,
        MfaConfiguration: ABSENT,
        Policies: ABSENT,
        Schema: expected.Schema,
        SmsAuthenticationMessage: ABSENT,
        SmsConfiguration: ABSENT,
        SmsVerificationMessage: 'The verification code to your new account is {####}',
        UsernameAttributes: ABSENT,
        UsernameConfiguration: ABSENT,
        UserPoolAddOns: ABSENT,
        UserPoolName: ABSENT,
        UserPoolTags: ABSENT,
        VerificationMessageTemplate: {
          DefaultEmailOption: 'CONFIRM_WITH_CODE',
          EmailMessage: 'The verification code to your new account is {####}',
          EmailSubject: 'Verify your new account',
          SmsMessage: 'The verification code to your new account is {####}',
        },
      }));
      expectCDK(stack).to(countResources('AWS::Cognito::UserPoolClient', 0));
      expectCDK(stack).to(countResources('AWS::Cognito::UserPoolGroup', 0));

      expect(construct.userPool).not.toBeUndefined();
      expect(construct.userPoolClient).toBeUndefined();
      expect(construct.userPoolGroup).toBeUndefined();
      
    } else {
      throw new Error('Invalid');

    }
  
  });

});

describe.each([
  [ undefined ],
  [ {} ],
  [ { clientA: {} } ],
  [ { clientA: {}, clientB: {} } ],
])('Property "userPoolClient" is %o', (userPoolClient) => {
  const userPoolClientCount = userPoolClient ? Object.keys(userPoolClient).length : 0;

  test('Default', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'TestStack');
    const construct = new Cognito.UserPool(stack, 'MyTestConstruct', {
      userPool: {},
      userPoolClient: userPoolClient,
    });
    expectCDK(stack).to(countResources('AWS::Cognito::UserPool', 1));
    expectCDK(stack).to(countResources('AWS::Cognito::UserPoolClient', userPoolClientCount));
    expectCDK(stack).to(countResourcesLike('AWS::Cognito::UserPoolClient', userPoolClientCount, {
      AccessTokenValidity: ABSENT,
      AllowedOAuthFlows: arrayWith(
        'implicit',
        'code',
      ),
      AllowedOAuthFlowsUserPoolClient: true,
      AllowedOAuthScopes: arrayWith(
        'profile',
        'phone',
        'email',
        'openid',
        'aws.cognito.signin.user.admin',
      ),
      AnalyticsConfiguration: ABSENT,
      CallbackURLs: arrayWith(
        'https://example.com',
      ),
      ClientName: ABSENT,
      DefaultRedirectURI: ABSENT,
      EnableTokenRevocation: ABSENT,
      ExplicitAuthFlows: ABSENT,
      GenerateSecret: ABSENT,
      IdTokenValidity: ABSENT,
      LogoutURLs: ABSENT,
      PreventUserExistenceErrors: ABSENT,
      ReadAttributes: ABSENT,
      RefreshTokenValidity: ABSENT,
      SupportedIdentityProviders: arrayWith(
        'COGNITO',
      ),
      TokenValidityUnits: ABSENT,
      UserPoolId: {
        Ref: stringLike('MyTestConstructUserPool*'),
      },
      WriteAttributes: ABSENT,
    }));
    expectCDK(stack).to(countResources('AWS::Cognito::UserPoolGroup', 0));

    expect(construct.userPool).not.toBeUndefined();
    if (userPoolClientCount > 0) {
      expect(construct.userPoolClient).not.toBeUndefined();
    } else {
      expect(construct.userPoolClient).toBeUndefined();
    }
    expect(construct.userPoolGroup).toBeUndefined();

  });

  if (userPoolClient && userPoolClientCount > 0) {
    for (const key of Object.keys(userPoolClient)) {
      describe('Property "userPoolClient.' + key + '.authFlows" is', () => {
        test.each([
          [
            {
              adminUserPassword: true,
              custom: true,
              userPassword: true,
              userSrp: true,
            },
            {
              ExplicitAuthFlows: arrayWith(
                'ALLOW_USER_PASSWORD_AUTH',
                'ALLOW_ADMIN_USER_PASSWORD_AUTH',
                'ALLOW_CUSTOM_AUTH',
                'ALLOW_USER_SRP_AUTH',
                'ALLOW_REFRESH_TOKEN_AUTH',
              ),
            },
          ],
          [
            {},
            {
              ExplicitAuthFlows: ABSENT,
            },
          ],
          [
            undefined,
            {
              ExplicitAuthFlows: ABSENT,
            },
          ],
        ])('%s', (authFlows, expected) => {
          const app = new cdk.App();
          const stack = new cdk.Stack(app, 'TestStack');
          if ('ExplicitAuthFlows' in expected) {
            const temp:any = Object.assign({}, userPoolClient);
            temp[key] = { authFlows: authFlows };
            const construct = new Cognito.UserPool(stack, 'MyTestConstruct', {
              userPool: {},
              userPoolClient: temp,
            });
    
            expectCDK(stack).to(countResources('AWS::Cognito::UserPool', 1));
            expectCDK(stack).to(countResources('AWS::Cognito::UserPoolClient', userPoolClientCount));
            expectCDK(stack).to(haveResource('AWS::Cognito::UserPoolClient', {
              AccessTokenValidity: ABSENT,
              AllowedOAuthFlows: arrayWith(
                'implicit',
                'code',
              ),
              AllowedOAuthFlowsUserPoolClient: true,
              AllowedOAuthScopes: arrayWith(
                'profile',
                'phone',
                'email',
                'openid',
                'aws.cognito.signin.user.admin',
              ),
              AnalyticsConfiguration: ABSENT,
              CallbackURLs: arrayWith(
                'https://example.com',
              ),
              ClientName: ABSENT,
              DefaultRedirectURI: ABSENT,
              EnableTokenRevocation: ABSENT,
              ExplicitAuthFlows: expected.ExplicitAuthFlows,
              GenerateSecret: ABSENT,
              IdTokenValidity: ABSENT,
              LogoutURLs: ABSENT,
              PreventUserExistenceErrors: ABSENT,
              ReadAttributes: ABSENT,
              RefreshTokenValidity: ABSENT,
              SupportedIdentityProviders: arrayWith(
                'COGNITO',
              ),
              TokenValidityUnits: ABSENT,
              UserPoolId: {
                Ref: stringLike('MyTestConstructUserPool*'),
              },
              WriteAttributes: ABSENT,
            }));
            expectCDK(stack).to(countResources('AWS::Cognito::UserPoolGroup', 0));

            expect(construct.userPool).not.toBeUndefined();
            expect(construct.userPoolClient).not.toBeUndefined();
            expect(construct.userPoolGroup).toBeUndefined();
                  
          } else {
            throw new Error('Invalid');
    
          }
        
        });
    
      });
      
    }
    
  }

});

describe.each([
  [ undefined ],
  [ {} ],
  [ { groupA: {} } ],
  [ { groupA: {}, groupB: {} } ],
])('Property "userPoolGroup" is %o', (userPoolGroup) => {
  const userPoolGroupCount = userPoolGroup ? Object.keys(userPoolGroup).length : 0;

  test('Default', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'TestStack');
    const construct = new Cognito.UserPool(stack, 'MyTestConstruct', {
      userPool: {},
      userPoolGroup: userPoolGroup,
    });
    expectCDK(stack).to(countResources('AWS::Cognito::UserPool', 1));
    expectCDK(stack).to(countResources('AWS::Cognito::UserPoolClient', 0));
    expectCDK(stack).to(countResources('AWS::Cognito::UserPoolGroup', userPoolGroupCount));
    expectCDK(stack).to(countResourcesLike('AWS::Cognito::UserPoolGroup', userPoolGroupCount, {
      UserPoolId: {
        Ref: stringLike('MyTestConstructUserPool*'),
      },
    }));

    expect(construct.userPool).not.toBeUndefined();
    expect(construct.userPoolClient).toBeUndefined();
    if (userPoolGroupCount > 0) {
      expect(construct.userPoolGroup).not.toBeUndefined();
    } else {
      expect(construct.userPoolGroup).toBeUndefined();
    }

  });

  if (userPoolGroup && userPoolGroupCount > 0) {
    for (const key of Object.keys(userPoolGroup)) {
      describe('Property "userPoolGroup.' + key + '.description" is', () => {
        test.each([
          [
            undefined,
            { Description: ABSENT },
          ],
          [
            '',
            { Description: ABSENT },
          ],
          [
            'This is Test UserPoolGroup.',
            { Description: 'This is Test UserPoolGroup.' },
          ],
        ])('%s', (description, expected) => {
          const temp : any = Object.assign({}, userPoolGroup);
          temp[key] = { description: description };

          const app = new cdk.App();
          const stack = new cdk.Stack(app, 'TestStack');
          const construct = new Cognito.UserPool(stack, 'MyTestConstruct', {
            userPool: {},
            userPoolGroup: temp,
          });

          expectCDK(stack).to(countResources('AWS::Cognito::UserPool', 1));
          expectCDK(stack).to(countResources('AWS::Cognito::UserPoolClient', 0));
          expectCDK(stack).to(countResources('AWS::Cognito::UserPoolGroup', userPoolGroupCount));
          expectCDK(stack).to(haveResource('AWS::Cognito::UserPoolGroup', {
            UserPoolId: {
              Ref: stringLike('MyTestConstructUserPool*'),
            },
            Description: expected.Description,
          }));
      
          expect(construct.userPool).not.toBeUndefined();
          expect(construct.userPoolClient).toBeUndefined();
          if (userPoolGroupCount > 0) {
            expect(construct.userPoolGroup).not.toBeUndefined();
          } else {
            expect(construct.userPoolGroup).toBeUndefined();
          }
          
        });
        
      });
      
      describe('Property "userPoolGroup.' + key + '.groupName" is', () => {
        test.each([
          [
            undefined,
            { GroupName: ABSENT },
          ],
          [
            '',
            { GroupName: ABSENT },
          ],
          [
            'TestGroup',
            { GroupName: 'TestGroup' },
          ],
        ])('%s', (groupName, expected) => {
          const temp : any = Object.assign({}, userPoolGroup);
          temp[key] = { groupName: groupName };

          const app = new cdk.App();
          const stack = new cdk.Stack(app, 'TestStack');
          const construct = new Cognito.UserPool(stack, 'MyTestConstruct', {
            userPool: {},
            userPoolGroup: temp,
          });

          expectCDK(stack).to(countResources('AWS::Cognito::UserPool', 1));
          expectCDK(stack).to(countResources('AWS::Cognito::UserPoolClient', 0));
          expectCDK(stack).to(countResources('AWS::Cognito::UserPoolGroup', userPoolGroupCount));
          expectCDK(stack).to(haveResource('AWS::Cognito::UserPoolGroup', {
            UserPoolId: {
              Ref: stringLike('MyTestConstructUserPool*'),
            },
            GroupName: expected.GroupName,
          }));
      
          expect(construct.userPool).not.toBeUndefined();
          expect(construct.userPoolClient).toBeUndefined();
          if (userPoolGroupCount > 0) {
            expect(construct.userPoolGroup).not.toBeUndefined();
          } else {
            expect(construct.userPoolGroup).toBeUndefined();
          }
          
        });
        
      });
      
      describe('Property "userPoolGroup.' + key + '.precedence" is', () => {
        test.each([
          [
            undefined,
            { Precedence: ABSENT },
          ],
          [
            '',
            { Precedence: ABSENT },
          ],
          [
            1000,
            { Precedence: 1000 },
          ],
        ])('%s', (precedence, expected) => {
          const temp : any = Object.assign({}, userPoolGroup);
          temp[key] = { precedence: precedence };

          const app = new cdk.App();
          const stack = new cdk.Stack(app, 'TestStack');
          const construct = new Cognito.UserPool(stack, 'MyTestConstruct', {
            userPool: {},
            userPoolGroup: temp,
          });

          expectCDK(stack).to(countResources('AWS::Cognito::UserPool', 1));
          expectCDK(stack).to(countResources('AWS::Cognito::UserPoolClient', 0));
          expectCDK(stack).to(countResources('AWS::Cognito::UserPoolGroup', userPoolGroupCount));
          expectCDK(stack).to(haveResource('AWS::Cognito::UserPoolGroup', {
            UserPoolId: {
              Ref: stringLike('MyTestConstructUserPool*'),
            },
            Precedence: expected.Precedence,
          }));
      
          expect(construct.userPool).not.toBeUndefined();
          expect(construct.userPoolClient).toBeUndefined();
          if (userPoolGroupCount > 0) {
            expect(construct.userPoolGroup).not.toBeUndefined();
          } else {
            expect(construct.userPoolGroup).toBeUndefined();
          }
          
        });
        
      });
      
      describe('Property "userPoolGroup.' + key + '.roleArn" is', () => {
        test.each([
          [
            undefined,
            { RoleArn: ABSENT },
          ],
          [
            '',
            { RoleArn: ABSENT },
          ],
          [
            'arn:aws:iam::123456789012:role/S3Access',
            { RoleArn: 'arn:aws:iam::123456789012:role/S3Access' },
          ],
        ])('%s', (roleArn, expected) => {
          const temp : any = Object.assign({}, userPoolGroup);
          temp[key] = { roleArn: roleArn };

          const app = new cdk.App();
          const stack = new cdk.Stack(app, 'TestStack');
          const construct = new Cognito.UserPool(stack, 'MyTestConstruct', {
            userPool: {},
            userPoolGroup: temp,
          });

          expectCDK(stack).to(countResources('AWS::Cognito::UserPool', 1));
          expectCDK(stack).to(countResources('AWS::Cognito::UserPoolClient', 0));
          expectCDK(stack).to(countResources('AWS::Cognito::UserPoolGroup', userPoolGroupCount));
          expectCDK(stack).to(haveResource('AWS::Cognito::UserPoolGroup', {
            UserPoolId: {
              Ref: stringLike('MyTestConstructUserPool*'),
            },
            RoleArn: expected.RoleArn,
          }));
      
          expect(construct.userPool).not.toBeUndefined();
          expect(construct.userPoolClient).toBeUndefined();
          if (userPoolGroupCount > 0) {
            expect(construct.userPoolGroup).not.toBeUndefined();
          } else {
            expect(construct.userPoolGroup).toBeUndefined();
          }
          
        });
        
      });
      
    }

  }

});
