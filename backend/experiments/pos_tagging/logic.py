# experiments/pos_tagging/logic.py

from collections import defaultdict
from .data import CORPORA


def get_corpus_by_id(corpus_id: int):
    try:
        return CORPORA[corpus_id]
    except IndexError:
        return CORPORA[0]


def calculate_hmm_matrices(corpus):
    tagged_sentence = corpus["tagged_sentence"]
    
    # Extract unique words (vocab) and unique tags in order of appearance
    words = []
    tags = []
    for w, t in tagged_sentence:
        if w not in words:
            words.append(w)
        if t not in tags:
            tags.append(t)
            
    # Calculate counts
    tag_counts = defaultdict(int)
    emission_counts = defaultdict(lambda: defaultdict(int))
    transition_counts = defaultdict(lambda: defaultdict(int))
    
    for i, (w, t) in enumerate(tagged_sentence):
        tag_counts[t] += 1
        emission_counts[t][w] += 1
        if i > 0:
            prev_t = tagged_sentence[i-1][1]
            transition_counts[prev_t][t] += 1
            
    # Denominator for transition is the number of times a tag was followed by another tag
    transition_denominators = defaultdict(int)
    for i in range(len(tagged_sentence) - 1):
        transition_denominators[tagged_sentence[i][1]] += 1
        
    # Build emission matrix
    emission_matrix = {}
    for t in tags:
        emission_matrix[t] = {}
        for w in words:
            if tag_counts[t] > 0:
                emission_matrix[t][w] = round(emission_counts[t][w] / tag_counts[t], 3)
            else:
                emission_matrix[t][w] = 0.0
                
    # Build transition matrix
    transition_matrix = {}
    for t1 in tags:
        transition_matrix[t1] = {}
        for t2 in tags:
            if transition_denominators[t1] > 0:
                transition_matrix[t1][t2] = round(transition_counts[t1][t2] / transition_denominators[t1], 3)
            else:
                transition_matrix[t1][t2] = 0.0
                
    return {
        "words": words,
        "tags": tags,
        "emission_matrix": emission_matrix,
        "transition_matrix": transition_matrix,
        "sentence": corpus["sentence"],
        "tagged_sentence": tagged_sentence
    }
