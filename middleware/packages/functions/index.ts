import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://api.intercom.io',
  headers: { common: { Authorization: `Bearer ${process.env.INTERCOM_API_KEY}` } }
});

exports.handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log(event.body);
  const body = JSON.parse(event.body ? event.body : '{}');
  const userId = body.data.item.contacts.contacts[0].id;
  const response = await instance.get(`/contacts/${userId}`);
  console.log(JSON.stringify(response.data));
  const session_id = response.data.custom_attributes.fs_session_id;
  console.log(`session_id ${session_id}`);
  // TODO: create a custom event with session id
  
  // topic #1: conversation.admin.closed
  // topic #2: conversation.rating.added

  // WORKAROUND: create custom event with most recent session & hard-coded uid
  return success('all good');
}

const success = (body: string, contentType = 'text/plain') => {
  return {
    statusCode: 200,
    headers: { 'Content-Type': contentType },
    body
  }
};