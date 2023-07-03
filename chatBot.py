import vertexai
from vertexai.preview.language_models import ChatModel, InputOutputTextPair
from google.cloud import aiplatform
def initChatBot():
    aiplatform.init(
        # your Google Cloud Project ID or number
        # environment default used is not set
        project="lexical-list-320222",

        # the Vertex AI region you will use
        # defaults to us-central1
        location='us-central1',

        # Google Cloud Storage bucket in same region as location
        # used to stage artifacts
        staging_bucket='gs://carenthusiast-chatbot-staging',

        # custom google.auth.credentials.Credentials
        # environment default creds used if not set
        #credentials= "AIzaSyAKWC7S-sWcEc4_Mgej0_rC47f9ZiWo27s",

        # customer managed encryption key resource name
        # will be applied to all Vertex AI resources if set
        #encryption_spec_key_name=my_encryption_key_name,

        # the name of the experiment to use to track
        # logged metrics and parameters
        #experiment='my-experiment',

        # description of the experiment above
        #experiment_description='my experiment decsription'
    )
    vertexai.init(project="lexical-list-320222", location="us-central1")
    chat_model = ChatModel.from_pretrained("chat-bison@001")
    parameters = {
        "temperature": 0.2,
        "max_output_tokens": 512,
        "top_p": 0.8,
        "top_k": 40
    }
    chat = chat_model.start_chat(
        context="""You are a highly experienced car enthusiast, able to provide highly detailed and relatively concise pieces of advice for everyone\'s car needs.""",
        examples=[
            InputOutputTextPair(
                input_text="""What would be a solid 5 seater sedan that can compete with other supercars?""",
                output_text="""The BMW M5 CS would be an excellent choice for this purpose. Powered by a 4.4 liter V8, it produces 627 horsepower and boasts a 0-60 mph time of 2.6 seconds. It has top speed of 190 mph, and has excellent driving dynamics. This is car is an excellent balance of practicality and performance."""
            )
        ]
    )
    return chat


def get_response(userInput):
    parameters = {
        "temperature": 0.2,
        "max_output_tokens": 512,
        "top_p": 0.8,
        "top_k": 40
    }
    chat = initChatBot()
    chatResponse = chat.send_message(userInput, **parameters)
    return chatResponse
