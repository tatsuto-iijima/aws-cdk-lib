import * as cdk from '@aws-cdk/core';
import * as cognito from '@aws-cdk/aws-cognito';

export interface UserPoolProps {
  userPool: IUserPool;
  userPoolClient?: { [key: string]: IUserPoolClient };
  userPoolGroup?: { [key: string]: IUserPoolGroup };
}

export interface IUserPool {
  accountRecovery?: string;
  mfa?: string;
  mfaSecondFactor?: cognito.MfaSecondFactor;
  passwordPolicy?: cognito.PasswordPolicy;
  removalPolicy?: cdk.RemovalPolicy;
  standardAttributes?: cognito.StandardAttributes;
}

export interface IUserPoolClient {
  authFlows?: cognito.AuthFlow;
}

export interface IUserPoolGroup {
  description?: string;
  groupName?: string;
  precedence?: number;
  roleArn?: string;
}

export class UserPool extends cdk.Construct {
  public readonly userPool: cognito.UserPool;

  public readonly userPoolClient: { [key: string]: cognito.UserPoolClient };

  public readonly userPoolGroup: { [key: string]: cognito.CfnUserPoolGroup };

  constructor(scope: cdk.Construct, id: string, props: UserPoolProps = { userPool: {} }) {
    super(scope, id);

    // Cognito UserPool
    const userPoolProps: cognito.UserPoolProps = {};

    // AccountRecovery
    if (
      props.userPool.accountRecovery === 'EMAIL_AND_PHONE_WITHOUT_MFA'
      || props.userPool.accountRecovery === 'PHONE_WITHOUT_MFA_AND_EMAIL'
      || props.userPool.accountRecovery === 'EMAIL_ONLY'
      || props.userPool.accountRecovery === 'PHONE_ONLY_WITHOUT_MFA'
      || props.userPool.accountRecovery === 'PHONE_AND_EMAIL'
      || props.userPool.accountRecovery === 'NONE'
    ) {
      Object.assign(userPoolProps, {
        accountRecovery: cognito.AccountRecovery[props.userPool.accountRecovery],
      });

    } else if (props.userPool.accountRecovery) {
      throw new Error('Invalid value for property "userPool.accountRecovery".')

    }

    // Mfa
    if (
      props.userPool.mfa === 'OFF'
      || props.userPool.mfa === 'OPTIONAL'
      || props.userPool.mfa === 'REQUIRED'
    ) {
      Object.assign(userPoolProps, {
        mfa: cognito.Mfa[props.userPool.mfa],
      });

    } else if (props.userPool.mfa) {
      throw new Error('Invalid value for property "userPool.mfa".')

    }

    // Other
    if (props.userPool.mfaSecondFactor) {
      Object.assign(userPoolProps, { mfaSecondFactor: props.userPool.mfaSecondFactor });
    }
    if (props.userPool.passwordPolicy) {
      Object.assign(userPoolProps, { passwordPolicy: props.userPool.passwordPolicy });
    }
    if (props.userPool.removalPolicy) {
      Object.assign(userPoolProps, { removalPolicy: props.userPool.removalPolicy });
    }
    if (props.userPool.standardAttributes) {
      Object.assign(userPoolProps, { standardAttributes: props.userPool.standardAttributes });
    }

    this.userPool = new cognito.UserPool(this, 'UserPool', userPoolProps);
  
    // Cognito UserPoolClient
    if (props.userPoolClient && Object.keys(props.userPoolClient).length > 0) {
      this.userPoolClient = {};

      for (const key of Object.keys(props.userPoolClient)) {
        const userPoolClientProps: cognito.UserPoolClientProps = {
          userPool: this.userPool,
        };
    
        // Other
        if (props.userPoolClient[key].authFlows) {
          Object.assign(userPoolClientProps, { authFlows: props.userPoolClient[key].authFlows });
        }
  
        Object.assign(this.userPoolClient, {
          [key]: new cognito.UserPoolClient(this, 'UserPoolAppClient-' + key, userPoolClientProps),
        });
        
      }
    
    }

    // Cognito UserPoolGroup
    if (props.userPoolGroup && Object.keys(props.userPoolGroup).length > 0) {
      this.userPoolGroup = {};
      
      for (const key of Object.keys(props.userPoolGroup)) {
        const userPoolGroupProps: cognito.CfnUserPoolGroupProps = {
          userPoolId: this.userPool.userPoolId,
        };
  
        // Other
        if (props.userPoolGroup[key].description) {
          Object.assign(userPoolGroupProps, { description: props.userPoolGroup[key].description });
        }
        if (props.userPoolGroup[key].groupName) {
          Object.assign(userPoolGroupProps, { groupName: props.userPoolGroup[key].groupName });
        }
        if (props.userPoolGroup[key].precedence) {
          Object.assign(userPoolGroupProps, { precedence: props.userPoolGroup[key].precedence });
        }
        if (props.userPoolGroup[key].roleArn) {
          Object.assign(userPoolGroupProps, { roleArn: props.userPoolGroup[key].roleArn });
        }
  
        this.userPoolGroup[key] = new cognito.CfnUserPoolGroup(this, 'UserPoolGroup-' + key, userPoolGroupProps);

      }
      
    }

  }

}
