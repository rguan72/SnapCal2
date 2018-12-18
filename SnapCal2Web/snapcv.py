class CVHelper():
    """
    This class handles the text detection pipeline.
    """
    def detect(self, image):
        from google.cloud import vision

        client = vision.ImageAnnotatorClient()
        image = vision.types.Image(content=image)
        response = client.text_detection(image=image)
        texts = response.text_annotations
        print('Text length: ' + str(len(texts)))
        print('Texts:')

        for text in texts:
            print(f'\n{text.description}')
