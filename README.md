# Intercom chat webhook integration with FullStory

A demonstration of how <a href="https://www.fullstory.com/platform/session-insights/">FullStory sessions</a> can be linked to customer support events 
via Intercom's <a href="https://developers.intercom.com/intercom-api-reference/reference/webhooks">webhook API</a> and 
FullStory's <a href="https://developer.fullstory.com/server/v2/events/create-events/">server events API</a>.

### Scenario

1. A customer reaches out to a support agent via the Intercom chat widget.
2. Once the customer's issue has been resolved, the support agent closes out the conversation.
3. Depending on how much back and forth there is between the customer and support agent, the customer may see a rating widget in the chat.
4. Web hook events are triggered from Intercom both when the chat is closed by the agent and when the customer rates the conversation.
5. An AWS Lambda function + API gateway endpoint is subscribed to these two web hook events in Intercom.
6. The AWS Lambda function creates custom events via the FullStory API that links the chat events with the session replay where the chat occurred.

### Prerequisites

There are a few things you'll need to do before running this example yourself:

- Create a FullStory account - get started with FullStory Free Edition
- Create an Intercom account - you can sign up for a free 14 day trial
- Create an AWS Account and a CLI credential file.
  - Your IAM credential will need permissions to create additional IAM resources to bootstrap the AWS CDK library used to deploy the AWS Lambda function + API gateway endpoint.
  - This Stackoverflow article identifies the permissions needed for your IAM credential to deploy resources.
- Check out the source code from GitHub: https://github.com/patrick-fs/fullstory-intercom