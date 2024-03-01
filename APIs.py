from flask import Flask,request
from flask_cors import CORS
import requests
import mammoth
import json
import en_core_web_sm
import nltk
nltk.download('punkt')
import spacy_universal_sentence_encoder
from bs4 import BeautifulSoup as BS
import numpy
from scipy import spatial
from urllib.parse import unquote
from nltk.tokenize import word_tokenize

nlp = en_core_web_sm.load()
nlp2 = spacy_universal_sentence_encoder.load_model('en_use_lg')

def getTokenSubtree(token):
    phrase = ''
    for item in token.lefts:
        phrase += getTokenSubtree(item)
    phrase += token.text + ' '
    for item in token.rights:
        phrase += getTokenSubtree(item)
    return phrase   

def index_containing_substring(the_list, substring):
    for i, s in enumerate(the_list):
        if substring in s:
              return i
    return -1

def getMajorKeywords(text_major):
    keywords = []
    doc_major = nlp(text_major)
    for token in doc_major:
        if token.pos_ == 'PROPN' or token.dep_ == 'compound':
            term = token.text + ' ' + token.head.text
            if term.lower() not in keywords:
                keywords.append(term.lower())
    return keywords
    
def convertToString(tokenList):
    phrase = ''
    for item in tokenList:
        phrase += item.text + ' '
    return phrase

def getFeaturePhrases(text_features):
    feature_phrases = []
    doc_features = nlp(text_features)
    for token in doc_features:
        if token.dep_ in ['nsubj', 'ROOT' , 'dobj']:
            phrase = ''
            if token.head.text != token.text:
                phrase = token.head.text + " "
            phrase += getTokenSubtree(token)
            if len(word_tokenize(phrase)) > 3:
                feature_phrases.append(phrase)           
    for phrase in feature_phrases:
        listWithoutPhrase = [x for x in feature_phrases if x != phrase]
        idx = index_containing_substring(listWithoutPhrase, phrase)
        if idx != -1:
            feature_phrases.pop(idx)    
    return feature_phrases

def getImplementationPhrases(text_implementation):
    implementation_phrases = []
    if len(word_tokenize(text_implementation)) > 900:
        text_implementation = " ".join(word_tokenize(text_implementation)[:900])
    doc_implementation = nlp(text_implementation)
    for token in doc_implementation:  
        if (token.pos_ == 'NOUN' or (token.dep_ == 'pobj' and token.head.pos_ == 'ADP')) and (token.n_lefts > 0 or token.n_rights > 0): 
            if len([item for item in token.ancestors]) > 0:
                phrase = [item for item in [item for item in token.ancestors][-1].subtree]
                phrase = convertToString(phrase)
            else:
                phrase = [item for item in token.subtree]
                phrase = convertToString(phrase)
            if phrase not in implementation_phrases :
                implementation_phrases.append(phrase)
    phrases = []
    for phrase in implementation_phrases:
        text_tokens = word_tokenize(phrase)
        if len(text_tokens) < 25:
            phrase = (" ").join(text_tokens)
            phrases.append(phrase)
    return phrases

def getalgoToolsKeywords(text_algoTools):
    algoTools_keywords = []
    doc_algoTools = nlp(text_algoTools)
    for token in doc_algoTools:
        if token.pos_ == 'PROPN'  :
            if token.text.lower() != token.head.text.lower():
                term = token.text + ' ' + token.head.text
                if term not in algoTools_keywords:
                    algoTools_keywords.append(term)
    return algoTools_keywords

def getEmbeddingVector(majorKeywords):
    sent = (" ").join(majorKeywords)
    doc = nlp2(sent)
    return doc.vector

def getTextMajor(html):
    soup = BS(html, 'html.parser')
    text_major = ""

    h1s = soup.find_all('h1')
    h2s = soup.find_all('h2')
    h3s = soup.find_all('h3')
    Ps = soup.find_all('p')
    bool_abstract = True
    for tag in h1s + h2s:
        if 'abstract' in tag.text.lower() :
            bool_abstract = False
            for sibling in tag.next_siblings:
                if sibling.name == "h1":
                    break
                if sibling.name == "h2":
                    break
                if sibling.string:
                    text_major += sibling.string
    if (bool_abstract):
        for tag in Ps:
            if tag.text.lower() == 'abstract':
                for child in tag.descendants:
                    if child.name == 'strong':
                        for sibling in tag.next_siblings:
                            if sibling.name == "h1":
                                break
                            if sibling.name == "h2":
                                break
                            if sibling.name == "p" and sibling.contents[0].name == 'strong':
                                break
                            if sibling.string:
                                text_major += sibling.string

    for tag in h2s + h3s:
        if 'problem definition' in tag.text.lower():
            for sibling in tag.next_siblings:
                if sibling.name == "h2" and tag.name == "h2":
                    break
                if sibling.name == "h3" and tag.name == "h3":
                    break
                if sibling.text:
                    text_major += sibling.text
    return text_major

def getTextFeatures(html):
    soup = BS(html, 'html.parser')
    h2s = soup.find_all('h2')
    h3s = soup.find_all('h3')
    h4s = soup.find_all('h4')
    text_features = ""
    for tag in h2s + h3s + h4s:
        if 'features of' in tag.text.lower() :
            for sibling in tag.next_siblings:
                if sibling.name == "h4" and tag.name == "h4":
                    break
                if sibling.name == "h3" and tag.name == "h3":
                    break
                if sibling.name == "h2" and tag.name == "h2":
                    break
                if sibling.name == "h1":
                    break
                if sibling.name == "table":
                    continue
                if sibling.name in ["ul","ol"]:
                    text_features += sibling.text + "-"
                elif sibling.text:
                    text_features += sibling.text + "."
    return text_features

def getTextImplementation(html):
    soup = BS(html, 'html.parser')
    h1s = soup.find_all('h1')
    h2s = soup.find_all('h2')
    h3s = soup.find_all('h3')
    text_implementation = ""
    for tag in h2s+h3s:
        if "working of " in tag.text.lower():
            for sibling in tag.next_siblings:
                if sibling.name == "h3" and tag.name == "h3":
                    break
                if sibling.name == "h2" and tag.name == "h2":
                    break
                if sibling.name == "h1" and tag.name == "h1":
                    break
                if sibling.name == "table":
                    continue
                if sibling.text:
                    text_implementation += sibling.text
    return text_implementation

def getTextalgoTools(html):
    soup = BS(html, 'html.parser')
    h2s = soup.find_all('h2')
    h3s = soup.find_all('h3')
    text_algoTools = ""
    for tag in h2s+h3s:
        if "algorithms" in tag.text.lower() or "algorithms/" in tag.text.lower():
            if "literature" in tag.text.lower():
                continue
            for sibling in tag.next_siblings:
                if sibling.name == "h3" and tag.name == "h3":
                     break
                if sibling.name == "h2" and tag.name == "h2":
                    break
                if sibling.name == "table":
                    continue
                for child in sibling.descendants:
                    if (child.name == "ul" or child.name == "li") :
                        try:
                             if len(child.contents[0]) < 70:
                                text_algoTools += child.contents[0] + ","
                        except TypeError:
                            continue
                    if child.name == "strong" :
                        if len(child.text) < 70:
                            text_algoTools += child.text + ","
                if sibling.name == "h4" or sibling.name == "h5":
                    if len(sibling.text) < 70:
                        text_algoTools += sibling.text + ","
        if "tools and" in tag.text.lower():
            for sibling in tag.next_siblings:
                if sibling.name == "h3" and tag.name == "h3":
                     break
                if sibling.name == "h2" and tag.name == "h2":
                    break
                if sibling.name == "table":
                    continue
                for child in sibling.descendants:
                    if (child.name == "ul" or child.name == "li"):
                        try:
                             if len(child.contents[0]) < 70:
                                text_algoTools += child.contents[0] + ","
                        except TypeError:
                            continue
                    if child.name == "strong" :
                        if len(child.text) < 70:
                            text_algoTools += child.text + ","
                if sibling.name == "h4" or sibling.name == "h5":
                    if len(sibling.text) < 70:
                        text_algoTools += sibling.text + ","
    return text_algoTools



app = Flask(__name__)
CORS(app)

@app.route('/extractsections', methods=['GET']) 
def extractsections():
    url = request.args.get('url')
    title = request.args.get('title')
    data_stream = requests.get(url)
    with open("./DownloadedBooks/sample.docx", "wb") as f:
        for chunk in data_stream.iter_content(chunk_size=2048):
            if chunk:
                f.write(chunk)
    with open("./DownloadedBooks/sample.docx", "rb") as docx_file:
        result = mammoth.convert_to_html(docx_file)

    text_major = getTextMajor(result.value)
    text_features = getTextFeatures(result.value)
    text_implementation = getTextImplementation(result.value)
    text_algoTools = getTextalgoTools(result.value)
    text_algoTools = text_algoTools.replace(":","")
    if text_algoTools[-1] == ",":
        text_algoTools = text_algoTools[:-1]

    major_keywords = getMajorKeywords(text_major)
    featurePhrases = getFeaturePhrases(text_features)
    implementationPhrases = getImplementationPhrases(text_implementation)
    algoTools = getalgoToolsKeywords(text_algoTools)
    embeddingVector = getEmbeddingVector(major_keywords)
    embeddingVector = embeddingVector.tolist()

    returnData = {
        'title': title,
        'text_major': text_major,
        'major_keywords': major_keywords,
        'featurePhrases': featurePhrases,
        'implementationPhrases': implementationPhrases,
        'algoTools': algoTools,
        'embeddingVector': embeddingVector
    }

    return returnData

@app.route('/comparenew', methods=['POST'])
def comparenew():
    datareceived = json.loads(request.data)
    newAbstract = datareceived['abstract']
    newAbstract = unquote(newAbstract)
    newKeywords = getMajorKeywords(newAbstract)
    newAbstractEmbedding = getEmbeddingVector(newKeywords)
    results = {}
    for key, value in datareceived.items():
        if key == 'abstract':
            continue
        existingVector = numpy.array(value)
        result = 1 - spatial.distance.cosine(newAbstractEmbedding, existingVector)
        results[key] = result

    returnData = {
        'results': results,
        'newKeywords': newKeywords
    }

    return returnData

@app.route('/detailcomparision', methods=['POST'])
def detailcomparision():
    datareceived = json.loads(request.data)
    newAbstract = unquote(datareceived['newAbstract'])
    oldAbstract = unquote(datareceived['oldAbstract'])

    newKeywords = getMajorKeywords(newAbstract)
    keywordswithIndexes = {}
    doc_major = nlp(oldAbstract)
    similarKeywords = []
    for token in doc_major:
        if token.pos_ == 'PROPN' or token.dep_ == 'compound':
            term = token.text + ' ' + token.head.text
            if (token.idx > token.head.idx):
                start_index = token.head.idx
                end_index = token.idx + len(token.text)
            else:
                start_index = token.idx
                end_index = token.head.idx + len(token.head.text)
            if term.lower() not in keywordswithIndexes:
                keywordswithIndexes[term.lower()] = [start_index, end_index]
    similar_phrases = []
    for idx, newkeyword in enumerate(newKeywords):
        embedding_1 = nlp2(newkeyword)
        for idx2, (key,value) in enumerate(keywordswithIndexes.items()):
            embedding_2 = nlp2(key)
            score = embedding_1.similarity(embedding_2)
            if score > 0.60:
                similarKeywords.append((newkeyword, key))
    
    returnData= {
        'results': similarKeywords
    }

    return returnData

if __name__ == '__main__':
    app.run(port=5000, debug=True)
