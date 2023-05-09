# Intercom chat webhook integration with FullStory

A demonstration of how [FullStory sessions](https://www.fullstory.com/platform/session-insights/) can be linked to customer support events 
via Intercom's [webhook API](https://developers.intercom.com/intercom-api-reference/reference/webhooks) and 
FullStory's [server events API](https://developer.fullstory.com/server/v2/events/create-events/).

![Intercom_flow](https://user-images.githubusercontent.com/45576380/236958638-3f5c3392-1ca5-4d44-8723-33242b34f333.png)

### Scenario

1. A customer reaches out to a support agent via the Intercom chat widget.
2. Once the customer's issue has been resolved, the support agent closes out the conversation.
3. Depending on how much back and forth there is between the customer and support agent, the customer may see a rating widget in the chat.
4. Web hook events are triggered from Intercom both when the chat is closed by the agent and when the customer rates the conversation.
5. An AWS Lambda function + API gateway endpoint is subscribed to these two web hook events in Intercom.
6. The AWS Lambda function creates custom events via the FullStory API that links the chat events to the session replay where the chat occurred.

## Demo Setup

### Prerequisites

There are a few things you'll need to do before running this example yourself:

- Create a FullStory account - get started with [FullStory Free Edition](https://help.fullstory.com/hc/en-us/articles/360020623354-FullStory-Free-Edition)
- Create an Intercom account - you can sign up for a [free 14 day trial](https://www.intercom.com/help/en/articles/891-how-do-i-sign-up-for-a-free-trial-of-intercom)
- Create an [AWS Account](https://repost.aws/knowledge-center/create-and-activate-aws-account) and a [CLI credential file](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html).
  - Your IAM credential will need permissions to create additional IAM resources to bootstrap the [AWS CDK library](https://docs.aws.amazon.com/cdk/v2/guide/getting_started.html) used to deploy the AWS Lambda function + API gateway endpoint.
  - This [Stackoverflow article](https://stackoverflow.com/questions/57118082/what-iam-permissions-are-needed-to-use-cdk-deploy) identifies the permissions needed for your IAM credential to deploy resources.
- Check out the source code from GitHub: https://github.com/patrick-fs/fullstory-intercom

### FullStory Configuration

The browser and server APIs used for this demo are pre-realease APIs, currently deployed to FullStory's staging environment. At this point in time, only FullStorians can access these APIs.

- Use the v2 snippet to get access the pre-release [v2beta browser API](https://developer.fullstory.com/browser/v2/getting-started/).
- An example of the v2 snippet, as well as a placeholder for your staging `window['_fs_org']` value can be found in the `<head>` of [the homepage](https://github.com/patrick-fs/fullstory-intercom/blob/main/homepage/index.html).

### AWS Configuration

- Once you've run the `cdk bootstrap` command to get the AWS CDK setup for use on your workstation, run `npm i` in the _middleware_ directory.
- To deploy the AWS Lambda function + API Gateway that will be used to receive Intercom webhooks, `run npm run deploy` in the _middleware_ directory.
- Take note of the "Outputs" section in the terminal once the deploy command has finished running. This will used for your web hook configruation in Intercom:

```
✨  Deployment time: 1.61s

Outputs:
IntercomLambdaMiddlewareStack.{long resource id omitted} = https://{the API URL generated for you}/prod/
```

### Intercom Configuration

#### Intercom Messenger (browser chat widget)

- Go through the motions of installing the Intercom JavaScript code per [this article](https://www.intercom.com/help/en/articles/167-install-intercom-in-your-product-for-visitors-and-leads).
- You'll see an app_id value that you can put into the placeholder found in the `<head>` of [the homepage](https://github.com/patrick-fs/fullstory-intercom/blob/main/homepage/index.html).

#### Web hook subscriptions

- Supscribe to two topics using the web hook URL created during AWS Configuration:
  - conversation.admin.closed
  - conversation.rating.added
- Make sure to add "intercom" to the URL path when configuring your web hook endpoint URL: 
```
https://{the API URL generated for you}/prod/intercom
````
- Details about configuring web hooks and subscribing to topics can be found [here](https://developers.intercom.com/building-apps/docs/setting-up-webhooks).

## Using Intercom Conversation Data in FullStory

### Capturing Intercom conversation events

Once everything is configured, the following events can be sent to FullStory using this demo app:

- Intercom Conversation Opened
- Intercom Conversation Closed
- Intercom Conversation Rated

You'll need to play the part of both the customer and the Customer Support agent. You'll receive messages from yourself in your [Intercom Inbox](https://www.intercom.com/help/en/articles/6274899-get-started-with-the-inbox). 
When you open the chat widget (playing the part of the user) a Intercom Conversation Opened event is attached to the session. When you close the conversation (playing the part of the agent) a Intercom Conversation Closed event is attached to the session. If a follow-up rating request is sent to the user via chat, a Intercom Conversation Rated event is attached to the session once the user rates the conversation. Head's up that the rating request is only triggered under certain conditions. Those conditions can be found 
[here](https://www.intercom.com/help/en/articles/941027-measure-customer-satisfaction-with-conversation-ratings#when-does-operator-send-conversation-ratings).

### Anaylizing Data in FullStory

#### Funnels
| ![fs_funnel](https://user-images.githubusercontent.com/45576380/236959291-d6bf3bfd-17ae-4d25-9c6b-be403f3489c1.png) |
|:--:|
| [Funnels](https://help.fullstory.com/hc/en-us/articles/360045159373-About-Funnels) can track drop off in customer service conversations |

#### Segements
| ![fs_segment](https://user-images.githubusercontent.com/45576380/236959472-35a0c89c-fbf8-4d2a-8512-6839de28d034.png) |
|:--:|
| You can [find sessions for users](https://help.fullstory.com/hc/en-us/articles/360020829633#Segment) who completed a chat or users who rated a chat poorly (or well!) |

#### Alerts
| ![fs_segment_alert](https://user-images.githubusercontent.com/45576380/236959438-55c5cc65-273b-4b7e-a0fb-fd39be1f9019.png) |
|:--:|
| [Alerts](https://help.fullstory.com/hc/en-us/articles/360020828653-Introduction-to-Alerts) can be configured to fire based off of the rate that users are providing negative survey feedback |
