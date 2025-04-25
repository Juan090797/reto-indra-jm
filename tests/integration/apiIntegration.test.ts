import request from 'supertest';
import { handler } from '../../src/infrastructure/handlers/appointmentHandler';
import { APIGatewayEvent } from 'aws-lambda';

describe('API Integration Tests', () => {

  let mockEvent: APIGatewayEvent;

  beforeEach(() => {
    mockEvent = {
      httpMethod: 'POST',
      body: JSON.stringify({
        insuredId: 'insured123',
        scheduleId: 1,
        countryISO: 'PE'
      }),
      pathParameters: {},
      queryStringParameters: null,
      multiValueQueryStringParameters: null,
      headers: {},
      multiValueHeaders: {},
      isBase64Encoded: false,
      path: '/appointments',
      resource: '/appointments',
      stageVariables: null,
      requestContext: {
        resourceId: 'resource-id',
        resourcePath: '/appointments',
        httpMethod: 'POST',
        requestId: 'request-id',
        apiId: 'api-id',
        domainName: 'domain-name',
        requestTime: 'request-time',
        path: '/appointments',
        stage: 'dev',
        identity: {
          apiKey: 'api-key',
          sourceIp: 'source-ip',
          userAgent: 'user-agent',
          accessKey: 'access-key',
          accountId: 'account-id',
          apiKeyId: 'api-key-id',
          caller: 'caller',
          cognitoAuthenticationProvider: 'cognito-auth-provider',
          cognitoAuthenticationType: 'cognito-auth-type',
          cognitoIdentityId: 'cognito-identity-id',
          cognitoIdentityPoolId: 'cognito-identity-pool-id',
          principalOrgId: 'principal-org-id',
          user: 'user',
          userArn: 'user-arn',
          clientCert: null
        },
        accountId: 'account-id', 
        authorizer: {}, 
        protocol: 'HTTP', 
        requestTimeEpoch: 1234567890, 
      }
    };
  });

  it('should create an appointment successfully', async () => {
    const response = await request(handler)
      .post('/appointments')
      .send({
        insuredId: 'insured123',
        scheduleId: 1,
        countryISO: 'PE'
      })
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Appointment created successfully');
  });

  it('should retrieve appointments by insuredId', async () => {
    const response = await request(handler)
      .get('/appointments/insured123')
      .set('Accept', 'application/json');

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Appointments retrieved successfully');
    expect(response.body.appointments).toBeInstanceOf(Array);
  });

  it('should return 400 for invalid appointment creation', async () => {
    const response = await request(handler)
      .post('/appointments')
      .send({})
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid appointment data');
  });

});
