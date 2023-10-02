import sounddevice as sd
import numpy as np
import openai
from Levenshtein import distance
import re
import os
from loguru import logger


recording = False
myrecording = None
stream = None
sample_rate = 22500  # in Hz
buttons_list = []
word_translation = None

def transcribe_audio():
    if os.path.exists('../../uploads/test.m4a'):
        with open('../../uploads/test.m4a', 'rb') as recording_file:
            transcript = openai.Audio.transcribe("whisper-1", recording_file, language='de')
            
            closest_words = get_closest_matches(re.sub(r'[.?!]', '', str.lower(transcript.text)))
            return closest_words
    else:
        print("No audio to transcribe. Record something first! 🎙️")
        return None

def get_closest_matches(root_word):
    '''
    Function that looks in a dictionary to return the closest words (by word distance) to the one spoken. The idea here is to find a word
    that the user may have mispronounced
    '''
    with open('../../files/german_vocab.txt', 'r') as f:
        vocab = [line.strip() for line in f]
    target_word = str.lower(re.sub(r'[.!?]', '', root_word))
    distances = [distance(target_word, word) for word in vocab]
    distances_sorted = sorted(distances)[:10]
    
    final_list = list(set([vocab[distances.index(i)] for i in distances_sorted if vocab[distances.index(i)] != target_word]))[:3]
    final_list = [target_word] + final_list
    return final_list

def button_click(word):
    global word_translation
    word = re.sub(r' ', '', word)
    ''' If a button is clicked, check if it's on the list of words and if it isn't, add it to the list. Either way, return a translation'''
    if not os.path.exists('../../files/my_vocab.txt'):
        with open('../../files/my_vocab.txt', 'f') as f:
            f.write('')

    with open('../../files/my_vocab.txt', 'r') as f:
        vocab = [line for line in f]
        if word not in vocab:
            with open('../../files/my_vocab.txt', 'a') as ff:
                ff.write(word+'\n')
    word_translation = chat_gpt_translation(word)
    print(word_translation)


def chat_gpt_translation(word):
    openai.organization = "org-kJkbbH5PfDmIxFSQArGMjBCM"
    openai.api_key = os.getenv("OPENAI_API_KEY")
    chat_completion = openai.ChatCompletion.create(
        model="gpt-3.5-turbo", 
        messages=[{
            "role": "user", "content": f"""Here is a word in German ```{word}```.  
            I want you to return a translation in the following format:
            (article) German word -> English Translation(s).
            If it is a noun, I want you to include the article. If there are multiple translations possible, return them all.
            Here are two examples output examples:
            noun: die Absendug -> sending, dispatch
            adverb: vielliecht -> maybe, perhaps, possibly """}],
            temperature=0)
    return chat_completion.choices[0].message.content

def process_reply(reply: str):
    '''
    Function that slips the chatGpt reply into type, artikel, wort, translations
    '''
    reply = reply.split(': ')
    word_type = reply[0]

    reply = reply[1].split(' -> ')
    
    translation = reply[1]
    words = reply[0]
    logger.info(f'words: {words}')
    if len(words.split(' ')) > 1:
        article = words.split(' ')[0]
        word = words.split(' ')[1]
    else:
        article = ''
        word = words

    return word_type, article, word, translation