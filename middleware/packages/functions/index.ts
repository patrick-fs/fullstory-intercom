import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import axios from 'axios';
import { init, CreateEventsRequest } from './fullstory';

const instance = axios.create({
  baseURL: 'https://api.intercom.io',
  headers: { common: { Authorization: `Bearer ${process.env.INTERCOM_API_KEY}` } }
});

exports.handler = async (hookReqeust: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const body = JSON.parse(hookReqeust.body ? hookReqeust.body : '{}');
  const userId = body.data.item.contacts.contacts[0].id;
  const response = await instance.get(`/contacts/${userId}`);
  const session_id = response.data.custom_attributes.fs_session_id;

  const { createEvents } = init(process.env.FULLSTORY_API_KEY);
  let events: CreateEventsRequest;

  if (body.topic === 'conversation.admin.closed') {
    events = {
      session: { id: session_id },
      events: [ { name: 'Intercom Conversation Closed' } ]
    };    
  } else if (body.topic === 'conversation.rating.added') {
    const rating = body.data.item.conversation_rating.rating;
    events = {
      session: { id: session_id },
      events: [
        {
          name: 'Intercom Conversation Rated',
          properties: { rating }
        }
      ]
    };    
  } else {
    return success('no-op');
  }

  await createEvents(events);
  return success('all good');
}

const success = (body: string, contentType = 'text/plain') => {
  return {
    statusCode: 200,
    headers: { 'Content-Type': contentType },
    body
  }
};