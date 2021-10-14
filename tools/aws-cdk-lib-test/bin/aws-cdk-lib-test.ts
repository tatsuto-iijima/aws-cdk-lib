#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { AwsCdkLibCognitoUserPoolTestStack } from '../lib/aws-cdk-lib-cognito-test-stack';

const app = new cdk.App();
new AwsCdkLibCognitoUserPoolTestStack(app, 'AwsCdkLibCognitoUserPoolTest');
