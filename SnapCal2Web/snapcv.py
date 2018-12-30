import regex as re

class CVHelper():
    """
    Handles the event detection pipeline from image to event strings
    """
    def detect(self, image):
        """
        take an image and return an array of image descriptions
        :param image: image byte object
        :return: array with descriptions
        """
        from google.cloud import vision

        client = vision.ImageAnnotatorClient()
        image = vision.types.Image(content=image)
        response = client.text_detection(image=image)
        texts = response.text_annotations
        descriptions = [text.description for text in texts]
        return descriptions

    def matcher(self, texts):
        """
        take an array of text description words and return event strings
        :param texts: array of text descriptions (whole thing plus words)
        :return: array with event strings
        """
        RANGE_PATTERNS = r"\d+-\d+"
        TIME_PATTERNS = r"PM|AM"
        p_range = re.compile(RANGE_PATTERNS)
        p_time = re.compile(TIME_PATTERNS, re.IGNORECASE)
        event_strings = []
        event_string = ""

        if len(texts) <= 1:
            return texts

        for word in texts[1:]:
            if p_time.fullmatch(word[-2:]):
                event_string += word
                event_strings.append(event_string)
                event_string = ""
            else:
                event_string += word
                event_string += " "

        # no matches found
        if not event_strings:
            event_strings = [texts[0]]

        return event_strings
