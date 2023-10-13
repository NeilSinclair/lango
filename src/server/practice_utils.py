import sqlite3
import numpy as np
import openai
import os
import random
import re

def chat_gpt_practice(word: str, language_level: str='B1') -> str:
    openai.organization = "org-kJkbbH5PfDmIxFSQArGMjBCM"
    openai.api_key = os.getenv("OPENAI_API_KEY")
    chat_completion = openai.ChatCompletion.create(
        model="gpt-3.5-turbo", 
        messages=[{
            "role": "user", "content": f"""
            You will recieve in word in German. I want you to create a sentence at the {language_level} level of German for a language learner using that word in the sentence. Here are some examples:
            Word: warm
            Sentence: Die Sonne scheint, deshalb ist es einen warm tag.
            Word: warscheinlich
            Sentence: Ich bin krank, warscheinlich muss ich Zuhause bleiben.
            Word: unterstütz
            Sentence: Danke, dass du mich immer unterstütz hast.
            Word: {word}
            Sentence: 
            """}],

            temperature=1.0)
    return chat_completion.choices[0].message.content

class SentenceWordPractice():
    '''
    Class for practicing words inside of sentences
    '''
    def __init__(self, 
                db_path: str='instance/mydatabase.db', 
                table_name: str='word_dict', 
                id_col: str='rowid', 
                language_level: str='B1'):
        self.db_path = db_path
        self.table_name = table_name
        self.cursor = None
        self.num_rows = None
        self.id_col = id_col
        self.n = None
        self.language_level = language_level

    def load_db(self) -> tuple:
        '''
        Method which loads a database consisting of the words saved so far along with their translations
        Returns a tuple of the cursor object along with the number of rows in the table
        '''
        conn = sqlite3.connect(self.db_path)

        self.cursor = conn.cursor()

        # Get the number of rows in the table
        self.cursor.execute(f"SELECT COUNT(*) FROM {self.table_name};")
        self.num_rows = self.cursor.fetchone()[0]

    def fetch_db_words(self) -> tuple:
        '''
        Method which extracts n words from the table
        Returns n words from the table
        '''
        assert self.n is not None, 'You must include a value for the number of words to return, n'

        # if self.cursor is None:
        self.load_db()

        indices = np.random.randint(0, self.num_rows, self.n)

        indices = ",".join(map(str, indices))

        self.cursor.execute(f"SELECT * FROM {self.table_name} WHERE {self.id_col} IN ({indices});")
        rows = self.cursor.fetchall()

        words = [r[3] for r in rows]
        translations = [r[-1] for r in rows]

        self.cursor.close()

        return words, translations
    
    def prep_sentence(self, word: str, sentence: str) -> str:
        '''
        Method the replaces the word in the sentence with [BLANK]
        '''
        new_sentence = re.sub(word, '_'*len(word), sentence)
        return new_sentence

    def generate_practice_example(self, n:int) -> dict:
        '''
        Method which generates a practice example
        Returns:
            dict of {'sentence', 'word1', 'word2'..., 'translation3'}
        '''
        self.n = n
        words, translations = self.fetch_db_words()

        word = random.choice(words)

        practice_sentence = chat_gpt_practice(word=word, language_level=self.language_level)
        practice_sentence = self.prep_sentence(word=word, sentence=practice_sentence)

        return {'sentence': practice_sentence,
                'word1': words[0],
                'word2': words[1],
                'word3': words[2],
                'translation1': translations[0],
                'translation2': translations[1],
                'translation3': translations[2],
                'correct_word': word}